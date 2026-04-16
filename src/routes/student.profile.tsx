import { createFileRoute } from "@tanstack/react-router";
import { Mail, BookOpen, User } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/student/profile")({
  head: () => ({
    meta: [{ title: "Student Profile — SmartAssign Pro" }],
  }),
  component: StudentProfilePage,
});

function StudentProfilePage() {
  const { profile } = useAuth();

  return (
    <DashboardLayout role="student">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)]">Student Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">Your account summary and enrollment details.</p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl gradient-accent flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold font-[var(--font-heading)]">{profile?.fullName || "Student"}</h2>
              <p className="text-sm text-muted-foreground">Profile Overview</p>
            </div>
          </div>

          <div className="grid gap-3 text-sm md:grid-cols-2">
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" />{profile?.email || "No email available"}</p>
            <p className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-muted-foreground" />Department: {profile?.department || "Not set"}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
