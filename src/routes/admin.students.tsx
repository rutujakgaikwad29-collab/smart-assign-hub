import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Trash2, Plus, X, Building } from "lucide-react";
import { onStudentsChange, deleteUserRecords, adminAddStudentRecord } from "@/firebase/firestoreService";
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

export const Route = createFileRoute("/admin/students")({
  head: () => ({ meta: [{ title: "Manage Students — SmartAssign Pro" }] }),
  component: AdminStudents,
});

function AdminStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // Add Student Form State
  const [newStudent, setNewStudent] = useState({
    fullName: "",
    email: "",
    rollNumber: "",
    department: "",
    year: "",
    semester: "",
    division: ""
  });
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onStudentsChange((data) => {
      setStudents(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove student: ${name}?`)) {
      try {
        await deleteUserRecords(id, "student");
      } catch (error) {
        console.error("Failed to delete student", error);
        alert("Failed to delete student. See console for details.");
      }
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.fullName || !newStudent.email || !newStudent.department) {
      alert("Name, email, and department are required.");
      return;
    }
    setAddLoading(true);
    try {
      await adminAddStudentRecord(newStudent);
      setIsAdding(false);
      setNewStudent({ fullName: "", email: "", rollNumber: "", department: "", year: "", semester: "", division: "" });
      alert("Student record created. The student must sign up using this email to set their password.");
    } catch (error) {
      console.error("Failed to add student", error);
      alert("Failed to add student.");
    } finally {
      setAddLoading(false);
    }
  };

  const filtered = students.filter((s) => {
    const matchesSearch = 
      (s.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.rollNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.department || "").toLowerCase().includes(search.toLowerCase());
    
    const matchesDept = departmentFilter === "All Departments" || (s.department && s.department.toLowerCase() === departmentFilter.toLowerCase());
    
    return matchesSearch && matchesDept;
  });

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-[var(--font-heading)]">Manage Students</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {students.length} student{students.length !== 1 ? "s" : ""} registered • Live updates enabled
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Live
            </div>
            <Button onClick={() => setIsAdding(true)} variant="hero" size="sm" className="h-9">
              <Plus className="w-4 h-4 mr-1" /> Add Student
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students..." className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
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
            Loading students...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            {search || departmentFilter !== "All Departments" ? "No students match your criteria." : "No students registered yet."}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Name</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Email</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Roll No</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Department</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-5 py-3">Year</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-5 py-3">Sem</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-5 py-3">Div</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                        {(s.fullName || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span>{s.fullName || "N/A"}</span>
                        {s.isPendingSignUp && <span className="text-[10px] text-amber-500 font-normal">Pending Sign Up</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.email || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.rollNumber || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.department || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-center">{s.year || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-center">{s.semester || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-center">{s.division || "-"}</td>
                    <td className="px-5 py-3.5 text-sm text-right">
                      <button onClick={() => handleDelete(s.id, s.fullName)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10" title="Remove Student">
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
                <h2 className="text-xl font-bold font-[var(--font-heading)]">Add Student Manually</h2>
                <button onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Full Name</label>
                  <input required value={newStudent.fullName} onChange={e => setNewStudent({...newStudent, fullName: e.target.value})} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm" placeholder="Student Name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <input type="email" required value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm" placeholder="student@college.edu.in" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Department</label>
                  <select required value={newStudent.department} onChange={e => setNewStudent({...newStudent, department: e.target.value})} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm appearance-none">
                    <option value="">Select Department</option>
                    {DEPARTMENTS.slice(1).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Roll Number</label>
                    <input value={newStudent.rollNumber} onChange={e => setNewStudent({...newStudent, rollNumber: e.target.value})} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm" placeholder="e.g. CS-101" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Year</label>
                    <select value={newStudent.year} onChange={e => setNewStudent({...newStudent, year: e.target.value})} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
                      <option value="">Select Year</option>
                      <option value="FE">FE</option>
                      <option value="SE">SE</option>
                      <option value="TE">TE</option>
                      <option value="BE">BE</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAdding(false)}>Cancel</Button>
                  <Button type="submit" variant="hero" className="flex-1" disabled={addLoading}>
                    {addLoading ? "Adding..." : "Add Student"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  The student will need to sign up using this email to finalize their account.
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

