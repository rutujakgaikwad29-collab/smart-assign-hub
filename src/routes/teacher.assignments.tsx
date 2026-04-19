import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/DashboardWidgets";
import { motion } from "framer-motion";
import { FileText, Plus, Calendar, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getAssignmentsByTeacher, createAssignment, getSubmissionsByAssignment, type Assignment } from "@/firebase/firestoreService";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";


export const Route = createFileRoute("/teacher/assignments")({
  head: () => ({ meta: [{ title: "Manage Assignments — SmartAssign Pro" }] }),
  component: TeacherAssignments,
});

function TeacherAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<(Assignment & { submissionCount?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", subject: "", description: "", maxMarks: "20", dueDays: "5" });

  const fetchAssignments = async () => {
    if (!user) return;
    try {
      const myAssignments = await getAssignmentsByTeacher(user.uid);
      const withCounts = await Promise.all(
        myAssignments.map(async (a) => {
          const subs = a.id ? await getSubmissionsByAssignment(a.id) : [];
          return { ...a, submissionCount: subs.length };
        })
      );
      setAssignments(withCounts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssignments(); }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setCreating(true);
    try {
      if (!user?.uid) throw new Error("User session expired. Please log in again.");
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (parseInt(form.dueDays) || 5));
      
      console.log("Creating assignment for:", user.uid);
      
      await createAssignment({
        teacherUid: user.uid,
        title: form.title || "Untitled Assignment",
        subject: form.subject || "General",
        description: form.description || "",
        maxMarks: parseInt(form.maxMarks) || 20,
        dueDate: Timestamp.fromDate(dueDate),
        allowLateRequest: true,
      });
      
      setShowCreate(false);
      setForm({ title: "", subject: "", description: "", maxMarks: "20", dueDays: "5" });
      setLoading(true);
      
      // Force immediate re-fetch
      await fetchAssignments();
      toast.success("Assignment created and synchronized!");
    } catch (err: any) {
      console.error("Assignment creation error:", err);
      toast.error(`Creation failed: ${err.message || "Unknown error"}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-[var(--font-heading)]">Manage Assignments</h1>
          <Button variant="hero" onClick={() => setShowCreate(true)}><Plus className="w-4 h-4" />Create Assignment</Button>
        </div>

        {/* Create form */}
        {showCreate && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold font-[var(--font-heading)]">New Assignment</h2>
              <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Assignment title" className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Subject</label>
                  <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required placeholder="e.g. DSA" className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Max Marks</label>
                  <input type="number" value={form.maxMarks} onChange={(e) => setForm({ ...form, maxMarks: e.target.value })} required className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Assignment details..." className="w-full h-20 p-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Deadline (days from now)</label>
                <input type="number" min="1" max="30" value={form.dueDays} onChange={(e) => setForm({ ...form, dueDays: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <Button type="submit" variant="hero" className="w-full" disabled={creating}>
                {creating ? <div className="w-5 h-5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" /> : "Create Assignment"}
              </Button>
            </form>
          </motion.div>
        )}

        {loading ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">Loading...</div>
        ) : assignments.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">No assignments created yet. Click "Create Assignment" to get started!</div>
        ) : (
          <div className="grid gap-4">
            {assignments.map((a, i) => {
              const due = a.dueDate?.toDate?.() || new Date();
              const isActive = due > new Date();
              return (
                <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0"><FileText className="w-6 h-6 text-primary-foreground" /></div>
                    <div className="flex-1">
                      <h3 className="font-semibold font-[var(--font-heading)]">{a.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{due.toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{a.submissionCount || 0} submissions</span>
                      </div>
                    </div>
                    <StatusBadge status={isActive ? "Pending" : "Locked"} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
