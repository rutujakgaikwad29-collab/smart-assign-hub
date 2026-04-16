import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Settings, Shield, Database, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — SmartAssign Pro" }] }),
  component: AdminSettings,
});

function AdminSettings() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-[var(--font-heading)]">System Settings</h1>
        <div className="grid gap-4 max-w-2xl">
          {[
            { icon: Shield, title: "Security", desc: "Manage roles, permissions, and access control" },
            { icon: Database, title: "Database", desc: "Backup, restore, and manage system data" },
            { icon: Bell, title: "Notifications", desc: "Configure email and push notification settings" },
            { icon: Settings, title: "General", desc: "App name, timezone, and system preferences" },
          ].map((item, i) => (
            <div key={i} className="bg-card rounded-2xl p-5 shadow-sm border border-border flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold font-[var(--font-heading)] text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
