import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Settings, Shield, Database, Bell, Save, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — SmartAssign Pro" }] }),
  component: AdminSettings,
});

function AdminSettings() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText("SMARTASSIGN-ADMIN-2026");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const settingItems = [
    { id: "security", icon: Shield, title: "Security", desc: "Manage roles, permissions, and access control" },
    { id: "database", icon: Database, title: "Database", desc: "Backup, restore, and manage system data" },
    { id: "notifications", icon: Bell, title: "Notifications", desc: "Configure email and push notification settings" },
    { id: "general", icon: Settings, title: "General", desc: "App name, timezone, and system preferences" },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)]">System Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure your institution's portal preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of Settings */}
          <div className="lg:col-span-1 space-y-3">
            {settingItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center gap-3 ${
                  activeTab === item.id 
                    ? "bg-accent/10 border-accent shadow-sm" 
                    : "bg-card border-border hover:border-accent/40 hover:bg-muted/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  activeTab === item.id ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold font-[var(--font-heading)] text-sm">{item.title}</h3>
                  <p className="text-[10px] text-muted-foreground truncate">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab ? (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="bg-card rounded-[2rem] border border-border shadow-sm p-6 md:p-8 min-h-[400px] flex flex-col"
                >
                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-6 h-6 text-accent" />
                        <h2 className="text-xl font-bold font-[var(--font-heading)]">Security Settings</h2>
                      </div>
                      
                      <div className="p-4 rounded-2xl bg-muted/50 border border-border space-y-4">
                        <h4 className="text-sm font-semibold">Admin Authorization Code</h4>
                        <p className="text-xs text-muted-foreground">This code is required during Admin registration. Keep it secret and only share with authorized HODs or Principals.</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-background border border-border px-3 py-2 rounded-lg text-sm font-mono tracking-wider">
                            SMARTASSIGN-ADMIN-2026
                          </code>
                          <Button size="sm" variant="outline" onClick={copyCode} className="gap-2">
                            {copied ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Copied" : "Copy"}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4">
                        <h4 className="text-sm font-semibold">Role Permissions</h4>
                        <div className="space-y-2">
                          {["Allow Students to edit profile", "Allow Teachers to delete submissions", "Require email verification"].map((perm, i) => (
                            <label key={i} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:bg-muted/30 cursor-pointer transition-colors">
                              <span className="text-sm">{perm}</span>
                              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-accent focus:ring-accent" />
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "general" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Settings className="w-6 h-6 text-accent" />
                        <h2 className="text-xl font-bold font-[var(--font-heading)]">General Settings</h2>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Institution Name</label>
                          <input type="text" defaultValue="SmartAssign Pro University" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent outline-none text-sm transition-all" />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Contact Support Email</label>
                          <input type="email" defaultValue="support@smartassign.pro" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent outline-none text-sm transition-all" />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Timezone</label>
                          <select className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent outline-none text-sm transition-all">
                            <option>Indian Standard Time (IST)</option>
                            <option>UTC (GMT)</option>
                            <option>Eastern Time (ET)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "notifications" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Bell className="w-6 h-6 text-accent" />
                        <h2 className="text-xl font-bold font-[var(--font-heading)]">Notifications</h2>
                      </div>
                      <div className="space-y-3">
                         {["Email alerts for new assignments", "Push notifications for submissions", "Weekly summary reports", "System maintenance alerts"].map((n, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-background shadow-sm hover:shadow-md transition-all">
                               <div>
                                 <p className="text-sm font-medium">{n}</p>
                                 <p className="text-[10px] text-muted-foreground mt-0.5">Automated alerts sent to all users</p>
                               </div>
                               <div className="w-12 h-6 rounded-full bg-accent/20 relative cursor-pointer p-1">
                                  <div className="w-4 h-4 rounded-full bg-accent ml-auto" />
                               </div>
                            </div>
                         ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "database" && (
                    <div className="space-y-6 text-center py-12">
                      <div className="w-16 h-16 rounded-3xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                        <Database className="w-8 h-8 text-accent" />
                      </div>
                      <h2 className="text-xl font-bold font-[var(--font-heading)]">Maintenance & Backups</h2>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Your data is automatically backed up every 24 hours. Manual maintenance tools are currently locked for your region.
                      </p>
                      <Button variant="outline" disabled className="mt-4">Run Manual Optimization</Button>
                    </div>
                  )}

                  <div className="mt-auto pt-8 flex items-center justify-between border-t border-border/50">
                    <p className="text-[10px] text-muted-foreground italic">Last update: April 2026</p>
                    <Button onClick={handleSave} className="gap-2 min-w-[120px]">
                      {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                      {saved ? "Saved!" : "Save Changes"}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[400px] border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-center p-8 bg-muted/5 group hover:bg-muted/10 transition-all">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Settings className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold text-lg">System Configuration</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mt-2">
                    Select a category from the left to start configuring your portal's global settings.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
