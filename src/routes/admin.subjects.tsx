import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { BookOpen, Plus, Users, Building, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { onStudentsChange } from "@/firebase/firestoreService";

export const Route = createFileRoute("/admin/subjects")({
  head: () => ({ meta: [{ title: "Manage Subjects — SmartAssign Pro" }] }),
  component: AdminSubjects,
});

const DEPARTMENTS = [
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

const YEARS = ["FE", "SE", "TE", "BE"];

const INITIAL_SUBJECTS = [
  { id: 1, name: "Engineering Mathematics I", code: "EM101", department: "Computer Engineering", year: "FE", teacher: "Prof. Sharma" },
  { id: 2, name: "Basic Electrical Engineering", code: "EE102", department: "Computer Engineering", year: "FE", teacher: "Prof. Verma" },
  { id: 3, name: "Data Structures & Algorithms", code: "CS301", department: "Computer Engineering", year: "SE", teacher: "Prof. Mehta" },
  { id: 4, name: "Database Management Systems", code: "CS302", department: "Computer Engineering", year: "SE", teacher: "Prof. Singh" },
  { id: 5, name: "Operating Systems", code: "CS303", department: "Computer Engineering", year: "TE", teacher: "Prof. Kumar" },
  { id: 6, name: "Computer Networks", code: "CS305", department: "Computer Engineering", year: "TE", teacher: "Prof. Mehta" },
  { id: 7, name: "Machine Learning", code: "CS401", department: "Computer Engineering", year: "BE", teacher: "Prof. Joshi" },
  { id: 8, name: "Web Development", code: "IT304", department: "Information Technology", year: "TE", teacher: "Prof. Joshi" },
  { id: 9, name: "Software Engineering", code: "IT301", department: "Information Technology", year: "TE", teacher: "Prof. Patil" },
];

function AdminSubjects() {
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);
  const [selectedYear, setSelectedYear] = useState("SE");
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onStudentsChange((data) => {
      setStudents(data);
    });
    return () => unsubscribe();
  }, []);

  const enrolledStudents = students.filter(
    (s) => 
      s.department && s.department.toLowerCase() === selectedDept.toLowerCase() &&
      s.year === selectedYear
  );

  const filteredSubjects = INITIAL_SUBJECTS.filter(
    (s) => s.department === selectedDept && s.year === selectedYear
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-[var(--font-heading)]">Manage Subjects</h1>
          <Button variant="hero"><Plus className="w-4 h-4 mr-1" />Add Subject</Button>
        </div>

        {/* Filters Section */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Department</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select 
                value={selectedDept} 
                onChange={(e) => setSelectedDept(e.target.value)} 
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-full sm:w-48">
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Year</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)} 
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
              >
                {YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{enrolledStudents.length} Students Enrolled</h3>
            <p className="text-sm text-muted-foreground">
              in {selectedDept} • {selectedYear}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-2xl border border-border">
              <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-20" />
              No subjects allocated for {selectedYear} in {selectedDept} yet.
            </div>
          ) : (
            filteredSubjects.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold font-[var(--font-heading)] text-sm">{s.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">Code: {s.code}</p>
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground flex justify-between">
                    <span>Allocated Faculty:</span>
                    <span className="font-medium text-foreground">{s.teacher}</span>
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
