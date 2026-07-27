import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Clock, AlertTriangle, Calendar } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard, StatusBadge, ProgressBar } from "@/components/DashboardWidgets";
import { useAuth } from "@/context/AuthContext";
import { getSubmissionsByStudent, createSubmission, onStudentAssignmentsChange, onStudentSubmissionsChange, type Assignment, type Submission } from "@/firebase/firestoreService";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Link as LinkIcon, Paperclip } from "lucide-react";
import { uploadAssignmentFile } from "@/firebase/storageService";

export const Route = createFileRoute("/student/dashboard")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — SmartAssign Pro" },
      { name: "description", content: "View your assignments, submissions, and progress." },
    ],
  }),
  component: StudentDashboard,
});

function StudentDashboard() {
  const { user, profile } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !profile) return;
    setLoading(true);
    
    const classIdWithBatch = profile.classId || "";
    const classIdWithoutBatch = profile.classId ? profile.classId.replace(/-B\d$/, "") : "";

    const unsubAssignments = onStudentAssignmentsChange(classIdWithBatch, classIdWithoutBatch, (allAssignments) => {
      setAssignments(allAssignments);
      setLoading(false);
    });

    const unsubSubmissions = onStudentSubmissionsChange(user.uid, (mySubmissions) => {
      setSubmissions(mySubmissions);
    });

    return () => {
      unsubAssignments();
      unsubSubmissions();
    };
  }, [user, profile]);

  const submittedCount = submissions.filter((s) => s.status === "submitted" || s.status === "graded").length;
  const pendingCount = assignments.length - submittedCount;
  const overdueCount = assignments.filter((a) => {
    const due = a.dueDate?.toDate?.() || new Date(0);
    const hasSubmission = submissions.some((s) => s.assignmentId === a.id);
    return due < new Date() && !hasSubmission;
  }).length;
  const completionPct = assignments.length > 0 ? Math.round((submittedCount / assignments.length) * 100) : 0;

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

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        reject(new Error("Only image files (JPG, PNG) are supported. Please convert documents to images."));
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.6));
        };
        img.onerror = () => reject(new Error("Failed to load image for compression."));
      };
      reader.onerror = () => reject(new Error("Failed to read file."));
    });
  };

  const handleSubmit = async (a: Assignment) => {
    if (!user) return;
    if (!submissionFile && !submissionText.trim()) {
      toast.error("Please upload a file or enter a link.");
      return;
    }
    setSubmittingId(a.id || null);
    try {
      let fileUrl = submissionText;
      if (submissionFile) {
        // Compress the image and bypass Firebase Storage completely to avoid billing/CORS issues
        fileUrl = await compressImage(submissionFile);
      }

      await createSubmission({
        assignmentId: a.id!,
        studentUid: user.uid,
        fileUrl: fileUrl,
        status: "submitted",
        marks: null,
        feedback: "",
      });
      toast.success("Assignment submitted successfully!");
      setSubmissionText("");
      setSubmissionFile(null);
      setExpandedId(null);
    } catch (err: any) {
      toast.error(`Submission failed: ${err.message}`);
    } finally {
      setSubmittingId(null);
    }
  };

  // Group by subject
  const subjects = Array.from(new Set(assignments.map(a => a.subject)));

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-[var(--font-heading)]">
            Welcome back, {profile?.fullName || "Student"}!
          </h1>
          <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
            <span>Class: {profile?.year || "Unknown"} {profile?.division || ""}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <span>Batch: {profile?.batch || "N/A"}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Assignments" value={assignments.length} icon={FileText} color="primary" />
          <StatCard title="Submitted" value={submittedCount} icon={Upload} color="success" />
          <StatCard title="Pending" value={pendingCount} icon={Clock} color="warning" />
          <StatCard title="Overdue" value={overdueCount} icon={AlertTriangle} color="destructive" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-5 shadow-sm border border-border"
        >
          <h2 className="text-lg font-semibold font-[var(--font-heading)] mb-4">Submission Progress</h2>
          <ProgressBar value={completionPct} label="Overall Completion" />
        </motion.div>

        <div className="space-y-6">
          {subjects.map(subject => {
            const subjectAssignments = assignments.filter(a => a.subject === subject);
            const pendingInSubject = subjectAssignments.filter(a => getStatus(a) === "Pending").length;
            
            return (
              <motion.div
                key={subject}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden"
              >
                <div className="p-5 border-b border-border flex items-center justify-between bg-muted/10">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold font-[var(--font-heading)]">{subject}</h2>
                    {pendingInSubject > 0 && (
                      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" title={`${pendingInSubject} new/pending tasks`} />
                    )}
                  </div>
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="divide-y divide-border">
                  {subjectAssignments.map((a) => {
                    const status = getStatus(a);
                    const daysLeft = getDaysLeft(a);
                    const sub = submissions.find((s) => s.assignmentId === a.id);
                    const isExpanded = expandedId === a.id;
                    return (
                      <div key={a.id} className="flex flex-col">
                        <div className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : a.id || null)}>
                          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 relative">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            {status === "Pending" && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary border-2 border-card" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-card-foreground truncate">{a.title}</p>
                            <p className="text-xs text-muted-foreground">
                              Due: {a.dueDate?.toDate?.()?.toLocaleDateString() || "N/A"}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            {sub?.marks !== null && sub?.marks !== undefined && (
                              <span className="text-xs font-medium text-success">{sub.marks}/{a.maxMarks}</span>
                            )}
                            {daysLeft > 0 && status === "Pending" && (
                              <span className={`text-xs font-medium ${daysLeft <= 2 ? "text-destructive" : "text-warning-foreground"}`}>{daysLeft}d left</span>
                            )}
                            <StatusBadge status={status} />
                            <button className="text-muted-foreground hover:text-foreground">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="p-5 bg-muted/10 border-t border-border">
                            <h4 className="text-sm font-medium mb-2">Description</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4">{a.description || "No description provided."}</p>
                            {a.attachmentUrl && (
                              <a href={a.attachmentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium mb-4">
                                <LinkIcon className="w-4 h-4" /> View Teacher's Attachment
                              </a>
                            )}
                            
                            {status === "Pending" && (
                              <div className="mt-4 space-y-3">
                                <label className="text-sm font-medium block">Your Submission (Upload a file or paste a link)</label>
                                <textarea
                                  value={submissionText}
                                  onChange={(e) => setSubmissionText(e.target.value)}
                                  placeholder="Write your answer or paste a Google Drive/Doc link here..."
                                  className="w-full h-20 p-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none mb-2"
                                />
                                <div className="flex items-center gap-2 mb-4">
                                  <label className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-xl border border-border cursor-pointer hover:bg-muted/80 transition-colors">
                                    <Paperclip className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm font-medium text-muted-foreground">{submissionFile ? submissionFile.name : "Attach File (PDF, DOCX, JPG)"}</span>
                                    <input
                                      type="file"
                                      className="hidden"
                                      accept=".pdf,.doc,.docx,.jpg,.jpeg"
                                      onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                                    />
                                  </label>
                                  {submissionFile && (
                                    <button
                                      type="button"
                                      onClick={() => setSubmissionFile(null)}
                                      className="text-xs text-destructive hover:underline"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleSubmit(a); }}
                                  disabled={submittingId === a.id}
                                  className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50"
                                >
                                  {submittingId === a.id ? "Submitting..." : "Submit Assignment"}
                                </button>
                              </div>
                            )}
                            
                            {sub && (
                              <div className="mt-4 p-4 bg-background rounded-xl border border-border">
                                <h4 className="text-sm font-medium text-success mb-1">Already Submitted</h4>
                                <p className="text-sm text-muted-foreground">Status: {sub.status}</p>
                                {sub.feedback && <p className="text-sm text-muted-foreground mt-2">Feedback: {sub.feedback}</p>}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
          {assignments.length === 0 && !loading && (
            <div className="p-8 text-center text-muted-foreground text-sm bg-card rounded-2xl border border-border">No assignments yet. Check back soon!</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
