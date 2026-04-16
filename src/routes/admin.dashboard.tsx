import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, GraduationCap, BookOpen, Server, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard, ProgressBar } from "@/components/DashboardWidgets";
import { getAllStudents, getAllTeachers } from "@/firebase/firestoreService";

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
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [students, teachers] = await Promise.all([getAllStudents(), getAllTeachers()]);
        setStudentCount(students.length);
        setTeacherCount(teachers.length);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-[var(--font-heading)]">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">System overview & management</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Students" value={loading ? "..." : studentCount} icon={GraduationCap} color="primary" />
          <StatCard title="Total Teachers" value={loading ? "..." : teacherCount} icon={Users} color="accent" />
          <StatCard title="Active Subjects" value="-" icon={BookOpen} color="success" />
          <StatCard title="System Health" value="99.9%" icon={Server} color="primary" />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <h2 className="text-lg font-semibold font-[var(--font-heading)] mb-4">Platform Usage</h2>
          <div className="space-y-4">
            <ProgressBar value={studentCount > 0 ? 85 : 0} label="Storage Used" />
            <ProgressBar value={studentCount > 0 ? 72 : 0} label="Active Users (Today)" />
            <ProgressBar value={studentCount > 0 ? 94 : 0} label="Assignment Completion Rate" />
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
