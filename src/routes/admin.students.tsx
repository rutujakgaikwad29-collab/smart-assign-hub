import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { getAllStudents } from "@/firebase/firestoreService";

export const Route = createFileRoute("/admin/students")({
  head: () => ({ meta: [{ title: "Manage Students — SmartAssign Pro" }] }),
  component: AdminStudents,
});

function AdminStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllStudents();
        setStudents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = students.filter((s) =>
    (s.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.rollNumber || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-[var(--font-heading)]">Manage Students</h1>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or roll number..." className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        {loading ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">{search ? "No students match your search." : "No students registered yet."}</div>
        ) : (
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Name</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Roll No</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Department</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-5 py-3">Year</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-5 py-3">Sem</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-5 py-3">Div</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                        {(s.fullName || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                      {s.fullName || "N/A"}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.rollNumber || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.department || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-center">{s.year || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-center">{s.semester || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-center">{s.division || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
