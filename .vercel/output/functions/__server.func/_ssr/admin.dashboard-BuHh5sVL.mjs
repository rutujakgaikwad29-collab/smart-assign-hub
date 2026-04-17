import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { D as DashboardLayout } from "./DashboardLayout-CFb5339N.mjs";
import { a as StatCard, P as ProgressBar } from "./DashboardWidgets-Bhuz2KXT.mjs";
import { o as onStudentsChange, l as onTeachersChange } from "./firestoreService-B1PFKYMM.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import { G as GraduationCap, d as Users, B as BookOpen, z as Server, I as UserPlus } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "./router-DpWtc24d.mjs";
import "../_libs/firebase__util.mjs";
import "../_libs/firebase__component.mjs";
import "../_libs/idb.mjs";
import "../_libs/firebase__webchannel-wrapper.mjs";
import "../_libs/@grpc/grpc-js.mjs";
import "process";
import "tls";
import "fs";
import "os";
import "net";
import "events";
import "http2";
import "http";
import "url";
import "dns";
import "zlib";
import "../_libs/@grpc/proto-loader.mjs";
import "path";
import "../_libs/lodash.camelcase.mjs";
import "../_libs/protobufjs.mjs";
import "../_libs/protobufjs__aspromise.mjs";
import "../_libs/protobufjs__base64.mjs";
import "../_libs/protobufjs__eventemitter.mjs";
import "../_libs/protobufjs__float.mjs";
import "../_libs/protobufjs__inquire.mjs";
import "../_libs/protobufjs__utf8.mjs";
import "../_libs/protobufjs__pool.mjs";
import "../_libs/protobufjs__codegen.mjs";
import "../_libs/protobufjs__fetch.mjs";
import "../_libs/protobufjs__path.mjs";
import "../_libs/long.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function AdminDashboard() {
  const [students, setStudents] = reactExports.useState([]);
  const [teachers, setTeachers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    let gotStudents = false;
    let gotTeachers = false;
    const checkDone = () => {
      if (gotStudents && gotTeachers) setLoading(false);
    };
    const unsubStudents = onStudentsChange((data) => {
      setStudents(data);
      gotStudents = true;
      checkDone();
    });
    const unsubTeachers = onTeachersChange((data) => {
      setTeachers(data);
      gotTeachers = true;
      checkDone();
    });
    return () => {
      unsubStudents();
      unsubTeachers();
    };
  }, []);
  const recentRegistrations = [...students.map((s) => ({
    ...s,
    type: "Student"
  })), ...teachers.map((t) => ({
    ...t,
    type: "Teacher"
  }))].sort((a, b) => {
    const aTime = a.createdAt?.seconds || 0;
    const bTime = b.createdAt?.seconds || 0;
    return bTime - aTime;
  }).slice(0, 8);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "admin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground font-[var(--font-heading)]", children: "Admin Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "System overview & management" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-xs font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-success animate-pulse" }),
        "Live Data"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Total Students", value: loading ? "..." : students.length, icon: GraduationCap, color: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Total Teachers", value: loading ? "..." : teachers.length, icon: Users, color: "accent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Active Subjects", value: "-", icon: BookOpen, color: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "System Health", value: "99.9%", icon: Server, color: "primary" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      delay: 0.15
    }, className: "bg-card rounded-2xl p-5 shadow-sm border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold font-[var(--font-heading)]", children: "Recent Registrations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Newly enrolled students & teachers" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-5 h-5 text-muted-foreground" })
      ] }),
      recentRegistrations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm text-muted-foreground py-6", children: "No registrations yet. New users will appear here in real-time." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: recentRegistrations.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-2xl border border-border bg-background p-3 hover:bg-muted/30 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground ${user.type === "Student" ? "gradient-primary" : "gradient-accent"}`, children: (user.fullName || "?").split(" ").map((n) => n[0]).join("").slice(0, 2) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: user.fullName || "N/A" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              user.email || "-",
              " • ",
              user.department || "No dept"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full border px-2.5 py-0.5 text-xs font-medium ${user.type === "Student" ? "bg-primary/10 text-primary border-primary/20" : "bg-accent/10 text-accent border-accent/20"}`, children: user.type })
      ] }, user.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      delay: 0.2
    }, className: "bg-card rounded-2xl p-5 shadow-sm border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold font-[var(--font-heading)] mb-4", children: "Platform Usage" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { value: students.length > 0 ? 85 : 0, label: "Storage Used" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { value: students.length > 0 ? 72 : 0, label: "Active Users (Today)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { value: students.length > 0 ? 94 : 0, label: "Assignment Completion Rate" })
      ] })
    ] })
  ] }) });
}
export {
  AdminDashboard as component
};
