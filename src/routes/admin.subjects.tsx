import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/subjects")({
  head: () => ({ meta: [{ title: "Manage Subjects — SmartAssign Pro" }] }),
  component: AdminSubjects,
});

const subjects = [
  { id: 1, name: "Data Structures & Algorithms", code: "CS301", department: "Computer Science", teacher: "Prof. Mehta" },
  { id: 2, name: "Database Management Systems", code: "CS302", department: "Computer Science", teacher: "Prof. Singh" },
  { id: 3, name: "Operating Systems", code: "CS303", department: "Computer Science", teacher: "Prof. Kumar" },
  { id: 4, name: "Web Development", code: "CS304", department: "Computer Science", teacher: "Prof. Joshi" },
  { id: 5, name: "Computer Networks", code: "CS305", department: "Computer Science", teacher: "Prof. Mehta" },
];

function AdminSubjects() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-[var(--font-heading)]">Manage Subjects</h1>
          <Button variant="hero"><Plus className="w-4 h-4" />Add Subject</Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold font-[var(--font-heading)] text-sm">{s.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">Code: {s.code}</p>
              <p className="text-xs text-muted-foreground">{s.department}</p>
              <p className="text-xs text-muted-foreground">Assigned: {s.teacher}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
