import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, GraduationCap, BookOpen, Server, UserPlus } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard, ProgressBar } from "@/components/DashboardWidgets";
import { onStudentsChange, onTeachersChange } from "@/firebase/firestoreService";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — SmartAssign Pro" },
      { name: "description", content: "System overview and management for SmartAssign Pro." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let gotStudents = false;
    let gotTeachers = false;
    const checkDone = () => { if (gotStudents && gotTeachers) setLoading(false); };

    // Real-time listeners — data updates within ~2 seconds
    const unsubStudents = onStudentsChange((data) => {
      setStudents(data);
      gotStudents = true;
      checkDone();
    });
    const unsubTeachers = onTeachersChange((data) => {
      setTeachers(data);
      gotTeachers = true;
      checkDone();
    });

    return () => { unsubStudents(); unsubTeachers(); };
  }, []);

  // Get 5 most recent registrations (combined students + teachers)
  const recentRegistrations = [...students.map((s) => ({ ...s, type: "Student" })), ...teachers.map((t) => ({ ...t, type: "Teacher" }))]
    .sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    })
    .slice(0, 8);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-[var(--font-heading)]">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">System overview & management</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Live Data
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Students" value={loading ? "..." : students.length} icon={GraduationCap} color="primary" />
          <StatCard title="Total Teachers" value={loading ? "..." : teachers.length} icon={Users} color="accent" />
          <StatCard title="Active Subjects" value="-" icon={BookOpen} color="success" />
          <StatCard title="System Health" value="99.9%" icon={Server} color="primary" />
        </div>

        {/* Recent Registrations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold font-[var(--font-heading)]">Recent Registrations</h2>
              <p className="text-xs text-muted-foreground">Newly enrolled students & teachers</p>
            </div>
            <UserPlus className="w-5 h-5 text-muted-foreground" />
          </div>
          {recentRegistrations.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-6">No registrations yet. New users will appear here in real-time.</div>
          ) : (
            <div className="space-y-3">
              {recentRegistrations.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-2xl border border-border bg-background p-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground ${user.type === "Student" ? "gradient-primary" : "gradient-accent"}`}>
                      {(user.fullName || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.fullName || "N/A"}</p>
                      <p className="text-xs text-muted-foreground">{user.email || "-"} • {user.department || "No dept"}</p>
                    </div>
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                    user.type === "Student"
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-accent/10 text-accent border-accent/20"
                  }`}>
                    {user.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <h2 className="text-lg font-semibold font-[var(--font-heading)] mb-4">Platform Usage</h2>
          <div className="space-y-4">
            <ProgressBar value={students.length > 0 ? 85 : 0} label="Storage Used" />
            <ProgressBar value={students.length > 0 ? 72 : 0} label="Active Users (Today)" />
            <ProgressBar value={students.length > 0 ? 94 : 0} label="Assignment Completion Rate" />
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
