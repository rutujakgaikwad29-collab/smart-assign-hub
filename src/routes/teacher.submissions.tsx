import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/DashboardWidgets";
import { motion } from "framer-motion";
import { Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  getAssignmentsByTeacher,
  getSubmissionsByAssignment,
  updateSubmission,
  type Assignment,
  type Submission,
} from "@/firebase/firestoreService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export const Route = createFileRoute("/teacher/submissions")({
  head: () => ({ meta: [{ title: "Review Submissions — SmartAssign Pro" }] }),
  component: TeacherSubmissions,
});

interface SubmissionRow extends Submission {
  studentName: string;
  assignmentTitle: string;
  maxMarks: number;
}

function TeacherSubmissions() {
  const { user } = useAuth();
  const [rows, setRows] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState<string | null>(null);
  const [gradeForm, setGradeForm] = useState({ marks: "", feedback: "" });

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const myAssignments = await getAssignmentsByTeacher(user.uid);
        const allRows: SubmissionRow[] = [];
        for (const a of myAssignments) {
          if (!a.id) continue;
          const subs = await getSubmissionsByAssignment(a.id);
          for (const s of subs) {
            const userDoc = await getDoc(doc(db, "users", s.studentUid));
            const studentName = userDoc.exists() ? userDoc.data().fullName : "Unknown";
            allRows.push({ ...s, studentName, assignmentTitle: a.title, maxMarks: a.maxMarks });
          }
        }
        setRows(allRows);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const handleGrade = async (submissionId: string) => {
    try {
      await updateSubmission(submissionId, {
        marks: parseInt(gradeForm.marks) || 0,
        feedback: gradeForm.feedback,
        status: "graded",
      });
      setRows((prev) =>
        prev.map((r) => r.id === submissionId ? { ...r, marks: parseInt(gradeForm.marks), feedback: gradeForm.feedback, status: "graded" } : r)
      );
      setGrading(null);
      setGradeForm({ marks: "", feedback: "" });
    } catch (err: any) {
      alert(err.message || "Failed to grade.");
    }
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-[var(--font-heading)]">Review Submissions</h1>
        {loading ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">No submissions to review.</div>
        ) : (
          <div className="grid gap-4">
            {rows.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-card rounded-[2rem] p-6 shadow-sm border border-border hover:shadow-md transition-all">
                <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
                  <div className="flex items-start gap-4">
                    <div className="relative pt-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary text-sm font-semibold text-primary-foreground shadow-sm">
                        {s.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className={`absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-card ${s.status === "graded" ? "bg-success" : "bg-warning"}`} />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-lg font-bold font-[var(--font-heading)]">{s.studentName}</h3>
                        <StatusBadge status={s.status} />
                        {s.marks !== null && (
                          <span className="rounded-full border border-success/20 bg-success/10 px-2.5 py-0.5 text-[10px] font-bold text-success uppercase tracking-wider">
                            {s.marks}/{s.maxMarks} Marks
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground font-medium">
                        <span className="text-primary font-semibold">{s.assignmentTitle}</span>
                        <span>•</span>
                        <span>Submitted {s.submittedAt?.toDate?.()?.toLocaleDateString() || "N/A"}</span>
                      </div>
                      
                      {s.feedback && (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2 italic border-l-2 border-primary/20 pl-3">
                          "{s.feedback}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
                    {/* Status Pill (Mirroring AI Pill for consistency) */}
                    <div className="flex w-full sm:w-20 flex-col items-center justify-between gap-3 rounded-[2.5rem] border border-border bg-muted/20 py-5 px-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                      <div className="text-center">
                        <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground leading-tight">STATUS<br/>REVIEW</p>
                        <div className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-border mx-auto">
                          {s.status === "graded" ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Clock3 className="h-4 w-4 text-warning" />}
                        </div>
                      </div>
                      
                      <div className="relative h-16 w-1.5 rounded-full bg-muted/50 overflow-hidden">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: s.status === "graded" ? "100%" : "50%" }}
                          className={`absolute bottom-0 w-full rounded-full ${s.status === "graded" ? "bg-success" : "bg-warning"}`}
                        />
                      </div>
                      
                      <p className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground text-center">{s.status}</p>
                    </div>

                    {/* Actions Card */}
                    <div className="flex flex-col justify-between gap-4 rounded-[2rem] border border-border bg-background/50 p-5 shadow-xl backdrop-blur-sm min-w-[280px]">
                      <div className="grid grid-cols-2 gap-2">
                        {s.fileUrl && (
                          <a href={s.fileUrl} target="_blank" rel="noopener noreferrer" className="contents">
                            <Button variant="outline" size="sm" className="h-10 rounded-xl gap-2 font-bold text-xs">
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </Button>
                          </a>
                        )}
                        <Button variant="outline" size="sm" className="h-10 rounded-xl gap-2 font-bold text-xs" onClick={() => window.alert(`Opening detailed view`)}>
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {s.status !== "graded" ? (
                          <Button variant="hero" size="sm" className="w-full h-11 rounded-xl gap-2 font-bold shadow-lg" onClick={() => { setGrading(s.id!); setGradeForm({ marks: "", feedback: "" }); }}>
                            <GraduationCap className="h-4 w-4" />
                            Grade Submission
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="w-full h-11 rounded-xl gap-2 font-bold text-muted-foreground" onClick={() => { setGrading(s.id!); setGradeForm({ marks: s.marks?.toString() || "", feedback: s.feedback || "" }); }}>
                            Edit Grade
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {grading === s.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 pt-6 border-t border-border space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Marks (Max: {s.maxMarks})</label>
                        <input type="number" min="0" max={s.maxMarks} value={gradeForm.marks} onChange={(e) => setGradeForm({ ...gradeForm, marks: e.target.value })} className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm font-bold focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
                      </div>
                      <div>
                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Final Status</label>
                        <div className="h-11 flex items-center px-4 rounded-xl border border-border bg-muted/30 text-sm font-medium">
                          Grading in progress...
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Faculty Feedback</label>
                      <textarea value={gradeForm.feedback} onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })} placeholder="Provide constructive feedback..." className="w-full h-24 p-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all font-medium" />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button variant="hero" size="lg" className="px-8 shadow-lg" onClick={() => handleGrade(s.id!)}>Submit Grade</Button>
                      <Button variant="outline" size="lg" className="px-8" onClick={() => setGrading(null)}>Cancel</Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
