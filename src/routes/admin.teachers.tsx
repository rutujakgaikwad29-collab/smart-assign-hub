import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Trash2, Plus, X, Building } from "lucide-react";
import { onTeachersChange, deleteUserRecords, adminAddTeacherRecord } from "@/firebase/firestoreService";
import { Button } from "@/components/ui/button";

const DEPARTMENTS = [
  "All Departments",
  "Artificial Intelligence And Data science (AI & DS)",
  "Civil Engineering",
  "Electronics & Telecommunications Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Electronics and Computer Engineering",
  "Information Technology",
  "Computer Engineering",
  "Automation & Robotics"
];

export const Route = createFileRoute("/admin/teachers")({
  head: () => ({ meta: [{ title: "Manage Teachers — SmartAssign Pro" }] }),
  component: AdminTeachers,
});

function AdminTeachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Add Teacher Form State
  const [newTeacher, setNewTeacher] = useState({
    fullName: "",
    email: "",
    facultyId: "",
    department: "",
  });
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onTeachersChange((data) => {
      setTeachers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove teacher: ${name}?`)) {
      try {
        await deleteUserRecords(id, "teacher");
      } catch (error) {
        console.error("Failed to delete teacher", error);
        alert("Failed to delete teacher. See console for details.");
      }
    }
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.fullName || !newTeacher.email || !newTeacher.department) {
      alert("Name, email, and department are required.");
      return;
    }
    setAddLoading(true);
    try {
      await adminAddTeacherRecord(newTeacher);
      setIsAdding(false);
      setNewTeacher({ fullName: "", email: "", facultyId: "", department: "" });
      alert("Teacher record created. The teacher must sign up using this email to set their password.");
    } catch (error) {
      console.error("Failed to add teacher", error);
      alert("Failed to add teacher.");
    } finally {
      setAddLoading(false);
    }
  };

  const filtered = teachers.filter((t) => {
    const matchesSearch =
      (t.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.facultyId || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.department || "").toLowerCase().includes(search.toLowerCase());
      
    const matchesDept = departmentFilter === "All Departments" || (t.department && t.department.toLowerCase() === departmentFilter.toLowerCase());
    
    return matchesSearch && matchesDept;
  });

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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Live
            </div>
            <Button onClick={() => setIsAdding(true)} variant="hero" size="sm" className="h-9">
              <Plus className="w-4 h-4 mr-1" /> Add Teacher
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search teachers..." className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="relative max-w-xs w-full">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select 
              value={departmentFilter} 
              onChange={(e) => setDepartmentFilter(e.target.value)} 
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            >
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">
            <div className="w-6 h-6 border-2 border-primary/40 border-t-primary rounded-full animate-spin mx-auto mb-3" />
            Loading teachers...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            {search || departmentFilter !== "All Departments" ? "No teachers match your criteria." : "No teachers registered yet."}
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
                  <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full gradient-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
                        {(t.fullName || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span>{t.fullName || "N/A"}</span>
                        {t.isPendingSignUp && <span className="text-[10px] text-amber-500 font-normal">Pending Sign Up</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.email || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.facultyId || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.department || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{(t.subjects || []).join(", ") || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-right">
                      <button onClick={() => handleDelete(t.id, t.fullName)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10" title="Remove Teacher">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold font-[var(--font-heading)]">Add Teacher Manually</h2>
                <button onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddTeacher} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Full Name</label>
                  <input required value={newTeacher.fullName} onChange={e => setNewTeacher({...newTeacher, fullName: e.target.value})} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm" placeholder="Prof. Name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <input type="email" required value={newTeacher.email} onChange={e => setNewTeacher({...newTeacher, email: e.target.value})} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm" placeholder="teacher@college.edu.in" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Department</label>
                  <select required value={newTeacher.department} onChange={e => setNewTeacher({...newTeacher, department: e.target.value})} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm appearance-none">
                    <option value="">Select Department</option>
                    {DEPARTMENTS.slice(1).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Faculty ID</label>
                  <input value={newTeacher.facultyId} onChange={e => setNewTeacher({...newTeacher, facultyId: e.target.value})} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm" placeholder="e.g. FAC-001" />
                </div>
                
                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAdding(false)}>Cancel</Button>
                  <Button type="submit" variant="hero" className="flex-1" disabled={addLoading}>
                    {addLoading ? "Adding..." : "Add Teacher"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  The teacher will need to sign up using this email to finalize their account.
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
