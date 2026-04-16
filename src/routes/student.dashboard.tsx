import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Clock, AlertTriangle, Calendar } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard, StatusBadge, ProgressBar } from "@/components/DashboardWidgets";
import { useAuth } from "@/context/AuthContext";
import { getAssignments, getSubmissionsByStudent, type Assignment, type Submission } from "@/firebase/firestoreService";

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
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

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

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-[var(--font-heading)]">
            Welcome back, {profile?.fullName || "Student"}!
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Here's your assignment overview</p>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden"
        >
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold font-[var(--font-heading)]">Recent Assignments</h2>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </div>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading assignments...</div>
          ) : assignments.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No assignments yet. Check back soon!</div>
          ) : (
            <div className="divide-y divide-border">
              {assignments.slice(0, 5).map((a) => {
                const status = getStatus(a);
                const daysLeft = getDaysLeft(a);
                const sub = submissions.find((s) => s.assignmentId === a.id);
                return (
                  <div key={a.id} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">{a.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.subject} · Due: {a.dueDate?.toDate?.()?.toLocaleDateString() || "N/A"}
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
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
