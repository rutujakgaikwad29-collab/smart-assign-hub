import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-B-O6dpt1.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
import { B as BookOpen, G as GraduationCap, S as Shield, c as Users } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "async_hooks";
import "stream";
import "util";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const heroPattern = "/assets/hero-pattern-BjZsn6F4.jpg";
const roles = [
  {
    id: "student",
    title: "Student",
    description: "View assignments, upload submissions & track progress",
    icon: GraduationCap
  },
  {
    id: "teacher",
    title: "Teacher",
    description: "Create assignments, review submissions & grade work",
    icon: BookOpen
  },
  {
    id: "admin",
    title: "Admin",
    description: "Manage users, subjects & monitor system activity",
    icon: Shield
  }
];
function SplashScreen({ onComplete }) {
  const [showSplash, setShowSplash] = reactExports.useState(true);
  const [selectedRole, setSelectedRole] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 bg-cover bg-center",
        style: { backgroundImage: `url(${heroPattern})` }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 gradient-hero opacity-90" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: showSplash ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: false,
        animate: { opacity: 1 },
        exit: { opacity: 0, y: -30 },
        transition: { duration: 0.6 },
        className: "relative z-10 flex flex-col items-center justify-center min-h-screen text-primary-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: false,
              animate: { scale: 1, opacity: 1 },
              transition: { delay: 0.2, type: "spring", stiffness: 200 },
              className: "flex items-center gap-3 mb-4",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center shadow-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-8 h-8 text-primary-foreground" }) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.h1,
            {
              initial: false,
              animate: { y: 0, opacity: 1 },
              transition: { delay: 0.5 },
              className: "text-4xl md:text-5xl font-bold font-[var(--font-heading)] tracking-tight",
              children: "SmartAssign Pro"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              initial: false,
              animate: { y: 0, opacity: 1 },
              transition: { delay: 0.7 },
              className: "text-lg opacity-80 mt-3",
              children: "Smart Assignment Management"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: false,
              animate: { opacity: 1 },
              transition: { delay: 1.2 },
              className: "mt-8",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" })
            }
          )
        ]
      },
      "splash"
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: false,
        animate: { opacity: 1 },
        transition: { duration: 0.5 },
        className: "relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: false,
              animate: { y: 0, opacity: 1 },
              className: "text-center mb-10",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl gradient-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5 text-primary-foreground" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-bold text-primary-foreground font-[var(--font-heading)]", children: "SmartAssign Pro" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-bold text-primary-foreground font-[var(--font-heading)]", children: "Choose Your Role" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary-foreground/70 mt-2", children: "Select how you want to use the platform" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-3xl", children: roles.map((role, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.button,
            {
              initial: false,
              animate: { y: 0, opacity: 1 },
              transition: { delay: 0.15 * i, type: "spring", stiffness: 200 },
              whileHover: { scale: 1.03, y: -4 },
              whileTap: { scale: 0.98 },
              onClick: () => setSelectedRole(role.id),
              className: `glass-card rounded-2xl p-6 text-left transition-all duration-200 cursor-pointer ${selectedRole === role.id ? "ring-2 ring-accent shadow-xl" : "hover:shadow-lg"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(role.icon, { className: "w-6 h-6 text-primary-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-foreground font-[var(--font-heading)]", children: role.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: role.description })
              ]
            },
            role.id
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: false,
              animate: { opacity: selectedRole ? 1 : 0.3 },
              className: "mt-8",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "hero",
                  size: "lg",
                  disabled: !selectedRole,
                  onClick: () => selectedRole && onComplete(selectedRole),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5" }),
                    "Continue as ",
                    selectedRole ? roles.find((r) => r.id === selectedRole)?.title : "..."
                  ]
                }
              )
            }
          )
        ]
      },
      "role-select"
    ) })
  ] });
}
function Index() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SplashScreen, { onComplete: (role) => {
    navigate({
      to: "/login",
      search: {
        role
      }
    });
  } });
}
export {
  Index as component
};
