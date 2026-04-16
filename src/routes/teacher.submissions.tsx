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
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-card rounded-2xl p-5 shadow-sm border border-border">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shrink-0 text-xs font-bold text-primary-foreground">
                    {s.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.studentName}</p>
                    <p className="text-xs text-muted-foreground">{s.assignmentTitle} · {s.submittedAt?.toDate?.()?.toLocaleDateString() || "N/A"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.status === "graded" && s.marks !== null && (
                      <span className="text-sm font-semibold text-success">{s.marks}/{s.maxMarks}</span>
                    )}
                    <StatusBadge status={s.status} />
                    {s.fileUrl && (
                      <a href={s.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm"><Download className="w-3 h-3" /></Button>
                      </a>
                    )}
                    {s.status !== "graded" && (
                      <Button variant="outline" size="sm" onClick={() => { setGrading(s.id!); setGradeForm({ marks: "", feedback: "" }); }}>
                        <Eye className="w-3 h-3" />Grade
                      </Button>
                    )}
                  </div>
                </div>

                {grading === s.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 pt-4 border-t border-border space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium block mb-1">Marks (/{s.maxMarks})</label>
                        <input type="number" min="0" max={s.maxMarks} value={gradeForm.marks} onChange={(e) => setGradeForm({ ...gradeForm, marks: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Feedback</label>
                      <textarea value={gradeForm.feedback} onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })} placeholder="Write feedback..." className="w-full h-20 p-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="hero" size="sm" onClick={() => handleGrade(s.id!)}>Submit Grade</Button>
                      <Button variant="outline" size="sm" onClick={() => setGrading(null)}>Cancel</Button>
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
