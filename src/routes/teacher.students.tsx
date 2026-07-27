import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { onStudentsChange } from "@/firebase/firestoreService";
import { Users, GraduationCap, Building } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/teacher/students")({
  head: () => ({
    meta: [{ title: "Students & Batches - SmartAssign Pro" }],
  }),
  component: TeacherStudents,
});

function TeacherStudents() {
  const { profile } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [activeYear, setActiveYear] = useState("FE");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onStudentsChange((allStudents) => {
      // Filter by teacher's department
      const myDeptStudents = allStudents.filter(
        (s) => s.department === profile?.department
      );
      setStudents(myDeptStudents);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [profile]);

  const years = ["FE", "SE", "TE", "BE"];

  // Group students by year -> section -> batch
  const studentsByYear = students.filter((s) => s.year === activeYear);
  const groupedByDivision: Record<string, Record<string, any[]>> = {};

  studentsByYear.forEach((s) => {
    const div = s.division || "Unknown";
    const batch = s.batch || "No Batch";
    if (!groupedByDivision[div]) groupedByDivision[div] = {};
    if (!groupedByDivision[div][batch]) groupedByDivision[div][batch] = [];
    groupedByDivision[div][batch].push(s);
  });

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-[var(--font-heading)]">
              Students & Batches
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <Building className="w-4 h-4" />
              Department of {profile?.department || "Unknown"}
            </p>
          </div>
        </div>

        {/* Year Tabs */}
        <div className="flex gap-2 border-b border-border overflow-x-auto pb-px">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeYear === year
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {year} Students
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading students...</div>
        ) : studentsByYear.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <Users className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No students found in {activeYear}.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.keys(groupedByDivision).sort().map((div) => (
              <div key={div} className="space-y-4">
                <h2 className="text-xl font-bold font-[var(--font-heading)] flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center text-primary-foreground">
                    {div}
                  </div>
                  Division {div}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.keys(groupedByDivision[div]).sort().map((batch) => (
                    <motion.div
                      key={`${div}-${batch}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card rounded-2xl border border-border overflow-hidden"
                    >
                      <div className="bg-muted/30 px-4 py-3 border-b border-border flex items-center justify-between">
                        <span className="font-semibold text-sm">Batch {batch}</span>
                        <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {groupedByDivision[div][batch].length} Students
                        </span>
                      </div>
                      <div className="p-2 max-h-[300px] overflow-y-auto space-y-1">
                        {groupedByDivision[div][batch].map((student) => (
                          <div
                            key={student.id}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-border shrink-0">
                              {student.profilePhotoUrl ? (
                                <img src={student.profilePhotoUrl} alt={student.fullName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full gradient-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                                  {(student.fullName || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {student.fullName}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                Roll: {student.rollNumber || "N/A"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
