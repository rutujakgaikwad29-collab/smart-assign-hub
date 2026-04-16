import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/DashboardWidgets";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getLateRequestsByStudent, getAssignment, type LateRequest } from "@/firebase/firestoreService";

export const Route = createFileRoute("/student/late-requests")({
  head: () => ({ meta: [{ title: "Late Requests — SmartAssign Pro" }] }),
  component: StudentLateRequests,
});

function StudentLateRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<(LateRequest & { assignmentTitle?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const reqs = await getLateRequestsByStudent(user.uid);
        const withTitles = await Promise.all(
          reqs.map(async (r) => {
            const a = await getAssignment(r.assignmentId);
            return { ...r, assignmentTitle: a?.title || "Assignment" };
          })
        );
        setRequests(withTitles);
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
        <h1 className="text-2xl font-bold font-[var(--font-heading)]">Late Submission Requests</h1>
        {loading ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">No late requests submitted.</div>
        ) : (
          <div className="grid gap-4">
            {requests.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-5 shadow-sm border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center"><Clock className="w-5 h-5 text-warning-foreground" /></div>
                  <div className="flex-1">
                    <p className="font-semibold font-[var(--font-heading)]">{r.assignmentTitle}</p>
                    <p className="text-xs text-muted-foreground">Reason: {r.reason}</p>
                    <p className="text-xs text-muted-foreground">Requested: {r.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
