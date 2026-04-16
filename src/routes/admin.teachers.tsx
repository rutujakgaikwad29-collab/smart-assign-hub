import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Search, Users } from "lucide-react";
import { onTeachersChange } from "@/firebase/firestoreService";

export const Route = createFileRoute("/admin/teachers")({
  head: () => ({ meta: [{ title: "Manage Teachers — SmartAssign Pro" }] }),
  component: AdminTeachers,
});

function AdminTeachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener — auto-refreshes within ~2 seconds of any change
    const unsubscribe = onTeachersChange((data) => {
      setTeachers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filtered = teachers.filter((t) =>
    (t.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.facultyId || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.department || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-[var(--font-heading)]">Manage Teachers</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {teachers.length} teacher{teachers.length !== 1 ? "s" : ""} registered • Live updates enabled
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Live
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, faculty ID, email, or department..." className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        {loading ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">
            <div className="w-6 h-6 border-2 border-primary/40 border-t-primary rounded-full animate-spin mx-auto mb-3" />
            Loading teachers...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            {search ? "No teachers match your search." : "No teachers registered yet."}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Name</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Email</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Faculty ID</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Department</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Subjects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full gradient-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
                        {(t.fullName || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                      {t.fullName || "N/A"}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.email || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.facultyId || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.department || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{(t.subjects || []).join(", ") || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
