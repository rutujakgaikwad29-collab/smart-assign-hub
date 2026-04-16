import { createFileRoute } from "@tanstack/react-router";
import { User, Mail, BookOpen, Shield } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/teacher/profile")({
  head: () => ({
    meta: [{ title: "Teacher Profile — SmartAssign Pro" }],
  }),
  component: TeacherProfilePage,
});

function TeacherProfilePage() {
  const { profile } = useAuth();

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)]">Teacher Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">View your account details and teaching information.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl gradient-accent flex items-center justify-center">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold font-[var(--font-heading)]">{profile?.fullName || "Teacher"}</h2>
                <p className="text-sm text-muted-foreground">Profile Overview</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" />{profile?.email || "No email available"}</p>
              <p className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-muted-foreground" />Department: {profile?.department || "Not set"}</p>
              <p className="flex items-center gap-2"><Shield className="w-4 h-4 text-muted-foreground" />Role: Teacher</p>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
            <h2 className="text-lg font-semibold font-[var(--font-heading)] mb-4">Account Notes</h2>
            <p className="text-sm text-muted-foreground leading-6">
              This page is a simple profile view for now. You can expand it later with editing, avatar upload, and teaching preferences.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
