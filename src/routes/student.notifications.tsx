import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCircle2, FileText, MessageSquare } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

export const Route = createFileRoute("/student/notifications")({
  head: () => ({
    meta: [{ title: "Student Notifications — SmartAssign Pro" }],
  }),
  component: StudentNotificationsPage,
});

const notifications = [
  { icon: FileText, title: "Assignment published", desc: "A new assignment is available in your dashboard.", time: "Today" },
  { icon: CheckCircle2, title: "Submission marked", desc: "One of your submissions was reviewed.", time: "Yesterday" },
  { icon: MessageSquare, title: "Feedback received", desc: "A teacher left feedback on your work.", time: "2 days ago" },
];

function StudentNotificationsPage() {
  return (
    <DashboardLayout role="student">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)]">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">Your latest alerts and updates.</p>
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
