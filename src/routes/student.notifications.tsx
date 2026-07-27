import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Bell, CheckCircle2, FileText, MessageSquare, RotateCcw, AlertCircle, Inbox } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { onNotificationsChange, markNotificationAsRead, type Notification } from "@/firebase/firestoreService";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/student/notifications")({
  head: () => ({
    meta: [{ title: "Student Notifications — SmartAssign Pro" }],
  }),
  component: StudentNotificationsPage,
});

export function StudentNotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onNotificationsChange(user.uid, (data) => {
      setNotifications(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const getIcon = (type: string) => {
    switch (type) {
      case "grade": return CheckCircle2;
      case "resubmit": return RotateCcw;
      case "feedback": return MessageSquare;
      default: return FileText;
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-[var(--font-heading)]">Notifications</h1>
            <p className="text-muted-foreground text-sm mt-1">Your latest alerts and updates.</p>
          </div>
          {notifications.length > 0 && (
             <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
               {notifications.filter(n => !n.read).length} New
             </span>
          )}
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground animate-pulse">Loading alerts...</div>
          ) : notifications.length === 0 ? (
            <div className="bg-card rounded-2xl p-10 border border-dashed border-border text-center space-y-3">
               <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto opacity-50">
                 <Bell className="w-8 h-8 text-muted-foreground" />
               </div>
               <p className="text-muted-foreground font-medium">All caught up! No new notifications.</p>
            </div>
          ) : (
            <AnimatePresence>
              {notifications.map((n, i) => {
                const Icon = getIcon(n.type);
                return (
                  <motion.div 
                    key={n.id} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.05 }}
                    className={`bg-card rounded-2xl p-5 shadow-sm border transition-all hover:shadow-md cursor-pointer relative overflow-hidden group ${n.read ? "border-border opacity-70" : "border-primary/30 ring-1 ring-primary/10 shadow-lg shadow-primary/5"}`}
                    onClick={() => markNotificationAsRead(n.id!)}
                  >
                    {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.read ? "bg-muted" : "bg-primary/10 text-primary"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h2 className={`font-semibold font-[var(--font-heading)] ${!n.read ? "text-primary" : "text-foreground"}`}>
                            {n.title}
                            {!n.read && <span className="ml-2 w-2 h-2 bg-primary rounded-full inline-block" />}
                          </h2>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                            {n.createdAt?.toDate?.()?.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }) || "Just now"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
