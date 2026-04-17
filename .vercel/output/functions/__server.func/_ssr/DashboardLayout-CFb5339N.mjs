import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useLocation, d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-DpWtc24d.mjs";
import { B as BookOpen, S as Shield, G as GraduationCap, J as LayoutDashboard, d as Users, w as Settings, F as FileText, K as FolderOpen, f as Clock, l as ChartColumn, t as Upload, s as MessageSquare, N as ChevronRight, U as User, O as LogOut, X, Q as Menu, v as Bell } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
const navItems = {
  student: [
    { label: "Dashboard", to: "/student/dashboard", icon: LayoutDashboard },
    { label: "Assignments", to: "/student/assignments", icon: FileText },
    { label: "Submissions", to: "/student/submissions", icon: Upload },
    { label: "Late Requests", to: "/student/late-requests", icon: Clock },
    { label: "Feedback", to: "/student/feedback", icon: MessageSquare }
  ],
  teacher: [
    { label: "Dashboard", to: "/teacher/dashboard", icon: LayoutDashboard },
    { label: "Assignments", to: "/teacher/assignments", icon: FileText },
    { label: "Submissions", to: "/teacher/submissions", icon: FolderOpen },
    { label: "Late Requests", to: "/teacher/late-requests", icon: Clock },
    { label: "AI Advisory", to: "/teacher/ai-advisory", icon: ChartColumn }
  ],
  admin: [
    { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Students", to: "/admin/students", icon: GraduationCap },
    { label: "Teachers", to: "/admin/teachers", icon: Users },
    { label: "Subjects", to: "/admin/subjects", icon: BookOpen },
    { label: "Settings", to: "/admin/settings", icon: Settings }
  ]
};
const roleLabels = {
  student: { label: "Student", icon: GraduationCap },
  teacher: { label: "Teacher", icon: BookOpen },
  admin: { label: "Admin", icon: Shield }
};
function DashboardLayout({
  role,
  children
}) {
  const [sidebarOpen, setSidebarOpen] = reactExports.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, role: userRole, loading: authLoading, logout } = useAuth();
  const items = navItems[role];
  const roleInfo = roleLabels[role];
  reactExports.useEffect(() => {
    if (!authLoading && userRole && userRole !== role) {
      console.warn(`Access Denied: User is ${userRole}, but tried to access ${role} portal.`);
      navigate({ to: `/${userRole}/dashboard` });
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 border-b border-sidebar-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl gradient-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold text-sm font-[var(--font-heading)]", children: "SmartAssign Pro" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-sidebar-foreground/60", children: [
            roleInfo.label,
            " Portal"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 py-4 px-3 space-y-1 overflow-y-auto", children: items.map((item) => {
        const active = location.pathname === item.to;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: item.to,
            className: `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${active ? "bg-sidebar-accent text-sidebar-primary font-medium" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "w-4.5 h-4.5" }),
              item.label,
              active && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5 ml-auto" })
            ]
          },
          item.to
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-t border-sidebar-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full gradient-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-primary-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: displayName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-sidebar-foreground/50 truncate", children: displayEmail })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleLogout,
            className: "flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" }),
              "Sign Out"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: sidebarOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: () => setSidebarOpen(false),
          className: "fixed inset-0 bg-foreground/40 z-40 md:hidden"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.aside,
        {
          initial: { x: -280 },
          animate: { x: 0 },
          exit: { x: -280 },
          transition: { type: "spring", damping: 25 },
          className: "fixed inset-y-0 left-0 w-72 bg-sidebar text-sidebar-foreground z-50 md:hidden flex flex-col",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex items-center justify-between border-b border-sidebar-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl gradient-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5 text-primary-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm font-[var(--font-heading)]", children: "SmartAssign Pro" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSidebarOpen(false), className: "text-sidebar-foreground/60 hover:text-sidebar-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 py-4 px-3 space-y-1", children: items.map((item) => {
              const active = location.pathname === item.to;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: item.to,
                  onClick: () => setSidebarOpen(false),
                  className: `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${active ? "bg-sidebar-accent text-sidebar-primary font-medium" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "w-4.5 h-4.5" }),
                    item.label
                  ]
                },
                item.to
              );
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-t border-sidebar-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              setSidebarOpen(false);
              handleLogout();
            }, className: "flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/50 w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" }),
              "Sign Out"
            ] }) })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 md:ml-64 flex flex-col min-h-screen", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border h-14 flex items-center px-4 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setSidebarOpen(true),
            className: "md:hidden p-1.5 rounded-lg hover:bg-muted transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-5 h-5 text-foreground" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center", children: role === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3.5 h-3.5 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-accent uppercase tracking-wider", children: profile?.designation || "Admin" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => navigate({ to: notificationPath }),
            className: "relative p-2 rounded-lg hover:bg-muted transition-colors",
            "aria-label": "Notifications",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-5 h-5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => navigate({ to: profilePath }),
            className: "w-8 h-8 rounded-full gradient-accent flex items-center justify-center hover:opacity-90 transition-opacity",
            "aria-label": "Profile",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-primary-foreground" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-4 md:p-6 lg:p-8", children })
    ] })
  ] });
}
export {
  DashboardLayout as D
};
