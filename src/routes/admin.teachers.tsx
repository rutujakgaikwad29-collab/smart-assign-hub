import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Search } from "lucide-react";
import { getAllTeachers } from "@/firebase/firestoreService";

export const Route = createFileRoute("/admin/teachers")({
  head: () => ({ meta: [{ title: "Manage Teachers — SmartAssign Pro" }] }),
  component: AdminTeachers,
});

function AdminTeachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllTeachers();
        setTeachers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = teachers.filter((t) =>
    (t.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.facultyId || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-[var(--font-heading)]">Manage Teachers</h1>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or faculty ID..." className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        {loading ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">{search ? "No teachers match your search." : "No teachers registered yet."}</div>
        ) : (
          <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Name</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Faculty ID</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Department</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Subjects</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium">{t.fullName || "N/A"}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.facultyId || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.department || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{(t.subjects || []).join(", ") || "-"}</td>
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
