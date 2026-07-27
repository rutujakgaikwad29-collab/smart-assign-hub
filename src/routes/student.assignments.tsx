import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, Clock, Upload, AlertTriangle, Award, MessageSquare, BookOpen } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/DashboardWidgets";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { SubmissionWizard, type WizardState, type QuestionAnswer } from "@/components/SubmissionWizard";
import {
  submitAssignment, createLateRequest,
  onStudentAssignmentsChange, onStudentSubmissionsChange,
  type Assignment, type Submission,
} from "@/firebase/firestoreService";
import { uploadAssignmentFile } from "@/firebase/storageService";

export const Route = createFileRoute("/student/assignments")({
  head: () => ({ meta: [{ title: "Assignments — SmartAssign Pro" }] }),
  component: StudentAssignments,
});

function StudentAssignments() {
  const { user, profile } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [flow, setFlow] = useState<WizardState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestingLate, setRequestingLate] = useState<string | null>(null);
  const [lateReason, setLateReason] = useState("");

  useEffect(() => {
    if (!user || !profile) return;
    const dept = (profile as any).department || "";
    const year = (profile as any).year || "";
    const div = (profile as any).division || (profile as any).section || "";
    const batch = (profile as any).batch || "";
    const classIdWithoutBatch = `${dept}-${year}-${div}`.toUpperCase();
    const classIdWithBatch = batch ? `${dept}-${year}-${div}-${batch}`.toUpperCase() : classIdWithoutBatch;

    const unsubA = onStudentAssignmentsChange(classIdWithBatch, classIdWithoutBatch, data => {
      setAssignments(data); setLoading(false);
    });
    const unsubS = onStudentSubmissionsChange(user.uid, data => setSubmissions(data));
    return () => { unsubA(); unsubS(); };
  }, [user, profile]);

  const getStatus = (a: Assignment) => {
    const sub = submissions.find(s => s.assignmentId === a.id);
    if (sub) return sub.status === "graded" ? "Graded" : "Submitted";
    const due = a.dueDate?.toDate?.() || new Date(0);
    return due < new Date() ? "Locked" : "Pending";
  };

  const getDaysLeft = (a: Assignment) => {
    const due = a.dueDate?.toDate?.() || new Date(0);
    return Math.ceil((due.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const startSubmission = (assignment: Assignment) => {
    const qs = assignment.questions || [];
    const initialAnswers: Record<number, QuestionAnswer> = {};
    if (qs.length === 0) initialAnswers[-1] = { text: "", images: [] };
    else qs.forEach((_, i) => { initialAnswers[i] = { text: "", images: [] }; });
    setFlow({ assignment, answers: initialAnswers, currentIdx: qs.length === 0 ? -1 : 0, phase: "answer", isGroup: false, groupMembers: "" });
  };

  const closeFlow = () => {
    if (flow) Object.values(flow.answers).forEach(a => a.images.forEach(img => URL.revokeObjectURL(img.preview)));
    setFlow(null);
  };

  const handleSubmit = async () => {
    if (!flow || !user) return;
    setIsSubmitting(true);
    const { assignment, answers, isGroup, groupMembers } = flow;
    const formattedAnswers: any[] = [];
    const allFiles: any[] = [];

    for (const [idxStr, ans] of Object.entries(answers)) {
      const idx = parseInt(idxStr);
      const imageUrls: string[] = [];
      for (const img of ans.images) {
        try {
          const url = await uploadAssignmentFile(img.file, user.uid, assignment.id!, profile?.fullName || "student", assignment.title);
          imageUrls.push(url);
          allFiles.push({ name: img.name, url, size: img.file.size, type: img.file.type });
        } catch { imageUrls.push(""); }
      }
      formattedAnswers.push({ questionIndex: idx, text: ans.text, imageUrls });
    }

    try {
      const submissionId = await submitAssignment({
        assignmentId: assignment.id!, studentUid: user.uid,
        studentName: (profile as any)?.fullName || "Student",
        files: allFiles, answers: formattedAnswers,
        status: getDaysLeft(assignment) < 0 ? "late" : "submitted",
        marks: null, feedback: "", isGroup,
        members: isGroup ? groupMembers.split(",").map(m => m.trim()) : [],
        activityLog: [],
      });
      setFlow(prev => prev ? {
        ...prev, phase: "receipt",
        receiptData: {
          id: submissionId, timestamp: new Date().toLocaleString(),
          totalAnswers: Object.keys(answers).length,
          totalImages: Object.values(answers).reduce((acc, a) => acc + a.images.length, 0),
        }
      } : null);
    } catch (err: any) {
      alert(err.message || "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLateRequest = async (assignmentId: string) => {
    if (!user || !lateReason.trim()) return;
    try {
      await createLateRequest({ assignmentId, studentUid: user.uid, reason: lateReason.trim(), status: "pending" });
      alert("Late request submitted!"); setRequestingLate(null); setLateReason("");
    } catch (err: any) { alert(err.message || "Request failed."); }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total", value: assignments.length, sub: "Assignments", color: "primary" },
            { label: "Completed", value: submissions.length, sub: "Submissions", color: "success" },
            {
              label: "Average", sub: "Marks Score", color: "warning",
              value: submissions.filter(s => s.status === "graded").length > 0
                ? Math.round(submissions.filter(s => s.status === "graded").reduce((acc, s) => acc + (s.marks || 0), 0) / submissions.filter(s => s.status === "graded").length)
                : "--"
            },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-${color}/10 flex items-center justify-center text-${color} font-bold text-xl`}>{value}</div>
              <div><p className="text-xs text-muted-foreground font-medium uppercase">{label}</p><h3 className="text-lg font-bold">{sub}</h3></div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-bold">Assignment List</h2>

        {loading ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm">No assignments available yet.</div>
        ) : (
          <div className="grid gap-4">
            {assignments.map((a, i) => {
              const status = getStatus(a);
              const daysLeft = getDaysLeft(a);
              const submission = submissions.find(s => s.assignmentId === a.id);
              const canRequestLate = status === "Locked" && daysLeft >= -2;

              return (
                <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow">

                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold truncate">{a.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{a.subject}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />Due: {a.dueDate?.toDate?.()?.toLocaleDateString() || "N/A"}</span>
                        <span>Max: {a.maxMarks} marks</span>
                        {(a.questions?.length || 0) > 0 && (
                          <span className="inline-flex items-center gap-1"><BookOpen className="w-3 h-3" />{a.questions!.length} Questions</span>
                        )}
                      </div>
                      {a.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.description}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {daysLeft > 0 && status === "Pending" && (
                        <span className={`text-xs font-bold ${daysLeft <= 2 ? "text-destructive" : "text-amber-600"}`}>{daysLeft}d left</span>
                      )}
                      {canRequestLate && (
                        <Button variant="outline" size="sm" onClick={() => setRequestingLate(a.id!)}>
                          <AlertTriangle className="w-3 h-3" />Request Late
                        </Button>
                      )}
                      {status === "Pending" && (
                        <Button variant="hero" size="sm" onClick={() => startSubmission(a)}>
                          <Upload className="w-3 h-3 mr-1" />{submission ? "Resubmit" : "Start Submission"}
                        </Button>
                      )}
                      <StatusBadge status={status} />
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  {submission && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      <div className="flex items-center">
                        {["Submitted", "Under Review", "Graded"].map((step, si) => {
                          const active = si === 0 || (si === 1 && ["graded", "returned", "submitted"].includes(submission.status)) || (si === 2 && submission.status === "graded");
                          return (
                            <div key={si} className="flex items-center flex-1 min-w-0">
                              <div className="flex flex-col items-center shrink-0">
                                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${active ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30" : "bg-muted text-muted-foreground"}`}>
                                  {si === 2 && submission.status === "graded" ? "✓" : si + 1}
                                </div>
                                <span className="text-[9px] text-muted-foreground mt-1 text-center leading-tight">{step}</span>
                              </div>
                              {si < 2 && <div className={`flex-1 h-0.5 mx-1.5 rounded ${si === 0 || (si === 1 && submission.status === "graded") ? "bg-primary" : "bg-muted"}`} />}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[10px] text-muted-foreground">v{submission.version} • Submitted {submission.submittedAt?.toDate?.()?.toLocaleString()}</span>
                        {submission.marks !== null && submission.marks !== undefined && (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-success/10 border border-success/20 rounded-xl">
                            <Award className="w-3 h-3 text-success" />
                            <span className="text-xs font-black text-success">{submission.marks}/{a.maxMarks}</span>
                            {submission.grade && <span className="ml-1 text-[10px] px-1.5 py-0.5 bg-success/20 rounded font-bold">{submission.grade}</span>}
                          </div>
                        )}
                      </div>

                      {submission.feedback && (
                        <div className="px-3 py-2 bg-muted/40 rounded-xl flex items-start gap-2 text-xs">
                          <MessageSquare className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
                          <span><strong className="text-foreground">Feedback: </strong>{submission.feedback}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Late Request Form */}
                  {requestingLate === a.id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 pt-4 border-t border-border">
                      <label className="text-sm font-medium block mb-2">Reason for late submission:</label>
                      <textarea value={lateReason} onChange={e => setLateReason(e.target.value)}
                        placeholder="Explain your reason..." className="w-full h-20 rounded-xl border border-input bg-background text-sm p-3 focus:ring-2 focus:ring-ring outline-none resize-none" />
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

      {/* Submission Wizard */}
      {flow && (
        <SubmissionWizard
          flow={flow}
          isSubmitting={isSubmitting}
          onUpdate={setFlow}
          onClose={closeFlow}
          onSubmit={handleSubmit}
        />
      )}
    </DashboardLayout>
  );
}
