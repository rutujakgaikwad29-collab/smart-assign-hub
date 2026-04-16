import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, Clock, Upload, AlertTriangle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/DashboardWidgets";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  getAssignments,
  getSubmissionsByStudent,
  createSubmission,
  createLateRequest,
  type Assignment,
  type Submission,
} from "@/firebase/firestoreService";
import { uploadAssignmentFile, validateFile } from "@/firebase/storageService";

export const Route = createFileRoute("/student/assignments")({
  head: () => ({ meta: [{ title: "Assignments — SmartAssign Pro" }] }),
  component: StudentAssignments,
});

function StudentAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [requestingLate, setRequestingLate] = useState<string | null>(null);
  const [lateReason, setLateReason] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const [allAssignments, mySubmissions] = await Promise.all([
          getAssignments(),
          getSubmissionsByStudent(user.uid),
        ]);
        setAssignments(allAssignments);
        setSubmissions(mySubmissions);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const getStatus = (a: Assignment) => {
    const sub = submissions.find((s) => s.assignmentId === a.id);
    if (sub) return sub.status === "graded" ? "Graded" : "Submitted";
    const due = a.dueDate?.toDate?.() || new Date(0);
    return due < new Date() ? "Locked" : "Pending";
  };

  const getDaysLeft = (a: Assignment) => {
    const due = a.dueDate?.toDate?.() || new Date(0);
    return Math.ceil((due.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const handleFileSelect = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    fileInputRef.current?.click();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAssignmentId || !user) return;

    const validationError = validateFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    setUploading(selectedAssignmentId);
    try {
      const fileUrl = await uploadAssignmentFile(file, user.uid, selectedAssignmentId);
      await createSubmission({
        assignmentId: selectedAssignmentId,
        studentUid: user.uid,
        fileUrl,
        status: "submitted",
        marks: null,
        feedback: "",
      });
      const mySubmissions = await getSubmissionsByStudent(user.uid);
      setSubmissions(mySubmissions);
      alert("Submission uploaded successfully!");
    } catch (err: any) {
      alert(err.message || "Upload failed.");
    } finally {
      setUploading(null);
      setSelectedAssignmentId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleLateRequest = async (assignmentId: string) => {
    if (!user || !lateReason.trim()) return;
    try {
      await createLateRequest({
        assignmentId,
        studentUid: user.uid,
        reason: lateReason.trim(),
        status: "pending",
      });
      alert("Late request submitted!");
      setRequestingLate(null);
      setLateReason("");
    } catch (err: any) {
      alert(err.message || "Request failed.");
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)]">Assignments</h1>
          <p className="text-muted-foreground text-sm mt-1">View and submit your assignments</p>
        </div>

        <input ref={fileInputRef} type="file" accept=".pdf,.docx,.jpg,.jpeg" className="hidden" onChange={handleUpload} />

        {loading ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">No assignments available yet.</div>
        ) : (
          <div className="grid gap-4">
            {assignments.map((a, i) => {
              const status = getStatus(a);
              const daysLeft = getDaysLeft(a);
              const isLocked = status === "Locked";
              const canRequestLate = isLocked && daysLeft >= -2;

              return (
                <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0"><FileText className="w-6 h-6 text-muted-foreground" /></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold font-[var(--font-heading)] truncate">{a.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{a.subject}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />Due: {a.dueDate?.toDate?.()?.toLocaleDateString() || "N/A"}</span>
                        <span>Max: {a.maxMarks} marks</span>
                      </div>
                      {a.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.description}</p>}
                    </div>
                    <div className="flex items-center gap-3 shrink-0 flex-wrap">
                      {daysLeft > 0 && status === "Pending" && (
                        <span className={`text-xs font-medium ${daysLeft <= 2 ? "text-destructive" : "text-warning-foreground"}`}>{daysLeft}d left</span>
                      )}
                      {canRequestLate && (
                        <Button variant="outline" size="sm" onClick={() => setRequestingLate(a.id!)}>
                          <AlertTriangle className="w-3 h-3" />Request Late
                        </Button>
                      )}
                      {status === "Pending" && (
                        <Button variant="hero" size="sm" disabled={uploading === a.id} onClick={() => handleFileSelect(a.id!)}>
                          {uploading === a.id ? (
                            <div className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                          ) : (
                            <><Upload className="w-3 h-3" />Submit</>
                          )}
                        </Button>
                      )}
                      <StatusBadge status={status} />
                    </div>
                  </div>

                  {/* Late request form */}
                  {requestingLate === a.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 pt-4 border-t border-border">
                      <label className="text-sm font-medium block mb-2">Reason for late submission:</label>
                      <textarea value={lateReason} onChange={(e) => setLateReason(e.target.value)} placeholder="Explain your reason..." className="w-full h-20 rounded-xl border border-input bg-background text-sm p-3 focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                      <div className="flex gap-2 mt-2">
                        <Button variant="hero" size="sm" onClick={() => handleLateRequest(a.id!)} disabled={!lateReason.trim()}>Submit Request</Button>
                        <Button variant="outline" size="sm" onClick={() => { setRequestingLate(null); setLateReason(""); }}>Cancel</Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
