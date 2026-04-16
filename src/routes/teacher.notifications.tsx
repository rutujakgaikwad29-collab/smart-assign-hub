import { createFileRoute } from "@tanstack/react-router";
import { Bell, AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

export const Route = createFileRoute("/teacher/notifications")({
  head: () => ({
    meta: [{ title: "Teacher Notifications — SmartAssign Pro" }],
  }),
  component: TeacherNotificationsPage,
});

const notifications = [
  { icon: FileText, title: "New submission received", desc: "A student submitted an assignment 2 minutes ago.", time: "2m ago" },
  { icon: AlertCircle, title: "Late request pending", desc: "One late request needs review.", time: "15m ago" },
  { icon: CheckCircle2, title: "Assignment published", desc: "Your assignment is now visible to students.", time: "1h ago" },
];

function TeacherNotificationsPage() {
  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)]">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">Updates and alerts for your teaching workspace.</p>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.title} className="bg-card rounded-2xl p-5 shadow-sm border border-border flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <n.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-semibold font-[var(--font-heading)]">{n.title}</h2>
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
