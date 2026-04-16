import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/DashboardWidgets";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getLateRequestsByTeacher, updateLateRequest, getAssignment, type LateRequest } from "@/firebase/firestoreService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export const Route = createFileRoute("/teacher/late-requests")({
  head: () => ({ meta: [{ title: "Late Requests — SmartAssign Pro" }] }),
  component: TeacherLateRequests,
});

interface RequestRow extends LateRequest {
  studentName: string;
  assignmentTitle: string;
}

function TeacherLateRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const reqs = await getLateRequestsByTeacher(user.uid);
        const rows = await Promise.all(
          reqs.map(async (r) => {
            const userDoc = await getDoc(doc(db, "users", r.studentUid));
            const studentName = userDoc.exists() ? userDoc.data().fullName : "Unknown";
            const assignment = await getAssignment(r.assignmentId);
            return { ...r, studentName, assignmentTitle: assignment?.title || "Assignment" };
          })
        );
        setRequests(rows);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    try {
      await updateLateRequest(id, { status });
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    } catch (err: any) {
      alert(err.message || "Failed to update.");
    }
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-[var(--font-heading)]">Late Submission Requests</h1>
        {loading ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">No late requests.</div>
        ) : (
          <div className="grid gap-4">
            {requests.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-5 shadow-sm border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0"><Clock className="w-5 h-5 text-warning-foreground" /></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold font-[var(--font-heading)]">{r.studentName}</h3>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{r.assignmentTitle}</p>
                    <p className="text-xs text-muted-foreground mt-1">Reason: "{r.reason}"</p>
                    {r.status === "pending" && (
                      <div className="flex gap-2 mt-3">
                        <Button variant="success" size="sm" onClick={() => handleAction(r.id!, "approved")}>Approve</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleAction(r.id!, "rejected")}>Reject</Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
