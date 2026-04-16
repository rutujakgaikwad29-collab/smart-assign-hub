import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/DashboardWidgets";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getSubmissionsByStudent, getAssignment, type Submission, type Assignment } from "@/firebase/firestoreService";

export const Route = createFileRoute("/student/submissions")({
  head: () => ({ meta: [{ title: "My Submissions — SmartAssign Pro" }] }),
  component: StudentSubmissions,
});

interface SubmissionWithAssignment extends Submission {
  assignment?: Assignment | null;
}

function StudentSubmissions() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<SubmissionWithAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const subs = await getSubmissionsByStudent(user.uid);
        const withAssignments = await Promise.all(
          subs.map(async (s) => {
            const assignment = await getAssignment(s.assignmentId);
            return { ...s, assignment };
          })
        );
        setSubmissions(withAssignments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-[var(--font-heading)]">My Submissions</h1>
        {loading ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">Loading...</div>
        ) : submissions.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">No submissions yet.</div>
        ) : (
          <div className="grid gap-4">
            {submissions.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-5 shadow-sm border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-success" /></div>
                  <div className="flex-1">
                    <p className="font-semibold font-[var(--font-heading)]">{s.assignment?.title || "Assignment"}</p>
                    <p className="text-xs text-muted-foreground">Submitted: {s.submittedAt?.toDate?.()?.toLocaleDateString() || "N/A"}</p>
                  </div>
                  <div className="text-right">
                    {s.marks !== null && s.marks !== undefined && (
                      <p className="text-sm font-semibold text-success">{s.marks}/{s.assignment?.maxMarks || "?"}</p>
                    )}
                    <StatusBadge status={s.status} />
                  </div>
                </div>
                {s.feedback && <p className="mt-3 text-sm text-muted-foreground bg-muted/50 rounded-xl p-3">💬 {s.feedback}</p>}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
