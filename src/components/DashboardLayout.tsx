import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  BookOpen, LayoutDashboard, FileText, Upload, Clock, MessageSquare,
  Users, Settings, LogOut, Menu, X, ChevronRight, Bell, User,
  GraduationCap, Shield, BarChart3, FolderOpen
} from "lucide-react";

type UserRole = "student" | "teacher" | "admin";

interface NavItem {
  label: string;
  to: string;
  icon: any;
}

const navItems: Record<UserRole, NavItem[]> = {
  student: [
    { label: "Dashboard", to: "/student/dashboard", icon: LayoutDashboard },
    { label: "Assignments", to: "/student/assignments", icon: FileText },
    { label: "Submissions", to: "/student/submissions", icon: Upload },
    { label: "Late Requests", to: "/student/late-requests", icon: Clock },
    { label: "Feedback", to: "/student/feedback", icon: MessageSquare },
  ],
  teacher: [
    { label: "Dashboard", to: "/teacher/dashboard", icon: LayoutDashboard },
    { label: "Assignments", to: "/teacher/assignments", icon: FileText },
    { label: "Submissions", to: "/teacher/submissions", icon: FolderOpen },
    { label: "Late Requests", to: "/teacher/late-requests", icon: Clock },
    { label: "AI Advisory", to: "/teacher/ai-advisory", icon: BarChart3 },
  ],
  admin: [
    { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Students", to: "/admin/students", icon: GraduationCap },
    { label: "Teachers", to: "/admin/teachers", icon: Users },
    { label: "Subjects", to: "/admin/subjects", icon: BookOpen },
    { label: "Settings", to: "/admin/settings", icon: Settings },
  ],
};

const roleLabels: Record<UserRole, { label: string; icon: any }> = {
  student: { label: "Student", icon: GraduationCap },
  teacher: { label: "Teacher", icon: BookOpen },
  admin: { label: "Admin", icon: Shield },
};

export function DashboardLayout({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, role: userRole, loading: authLoading, logout } = useAuth();
  const items = navItems[role];
  const roleInfo = roleLabels[role];

  // REAL-TIME ROLE PROTECTION: 
  // If user tries to access a dashboard that doesn't match their role, kick them out.
  useEffect(() => {
    if (!authLoading && userRole && userRole !== role) {
      console.warn(`Access Denied: User is ${userRole}, but tried to access ${role} portal.`);
      navigate({ to: `/${userRole}/dashboard` as any });
    }
  }, [userRole, authLoading, role]);

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/" });
  };

  const displayName = profile?.fullName || "User";
  const displayEmail = profile?.email || "user@smartassign.pro";
  const profilePath = role === "teacher" ? "/teacher/profile" : role === "student" ? "/student/profile" : "/admin/settings";
  const notificationPath = role === "teacher" ? "/teacher/notifications" : role === "student" ? "/student/notifications" : "/admin/settings";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-30">
        {/* Brand */}
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-sm font-[var(--font-heading)]">SmartAssign Pro</h1>
              <span className="text-xs text-sidebar-foreground/60">{roleInfo.label} Portal</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to as any}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  active
                    ? "bg-sidebar-accent text-sidebar-primary font-medium"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="w-4.5 h-4.5" />
                {item.label}
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-sidebar-foreground/50 truncate">{displayEmail}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-foreground/40 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 left-0 w-72 bg-sidebar text-sidebar-foreground z-50 md:hidden flex flex-col"
            >
              <div className="p-5 flex items-center justify-between border-b border-sidebar-border">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-sm font-[var(--font-heading)]">SmartAssign Pro</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 py-4 px-3 space-y-1">
                {items.map((item) => {
                  const active = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to as any}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                        active
                          ? "bg-sidebar-accent text-sidebar-primary font-medium"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <item.icon className="w-4.5 h-4.5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-sidebar-border">
                <button onClick={() => { setSidebarOpen(false); handleLogout(); }} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/50 w-full">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border h-14 flex items-center px-4 gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 flex items-center">
            {role === "admin" && (
               <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                 <Shield className="w-3.5 h-3.5 text-accent" />
                 <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{(profile as any)?.designation || "Admin"}</span>
               </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: notificationPath as any })}
            className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: profilePath as any })}
            className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center hover:opacity-90 transition-opacity"
            aria-label="Profile"
          >
            <User className="w-4 h-4 text-primary-foreground" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
