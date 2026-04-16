import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { D as DashboardLayout } from "./DashboardLayout-CdNrvs_m.mjs";
import { a as StatCard, P as ProgressBar } from "./DashboardWidgets-Bhuz2KXT.mjs";
import { m as getAllStudents, l as getAllTeachers } from "./firestoreService-ZkHiLvKN.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import { G as GraduationCap, c as Users, B as BookOpen, w as Server } from "../_libs/lucide-react.mjs";
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
import "./router-sh8vhz73.mjs";
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
  const [studentCount, setStudentCount] = reactExports.useState(0);
  const [teacherCount, setTeacherCount] = reactExports.useState(0);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    async function fetchData() {
      try {
        const [students, teachers] = await Promise.all([getAllStudents(), getAllTeachers()]);
        setStudentCount(students.length);
        setTeacherCount(teachers.length);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "admin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground font-[var(--font-heading)]", children: "Admin Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "System overview & management" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Total Students", value: loading ? "..." : studentCount, icon: GraduationCap, color: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Total Teachers", value: loading ? "..." : teacherCount, icon: Users, color: "accent" }),
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
      delay: 0.2
    }, className: "bg-card rounded-2xl p-5 shadow-sm border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold font-[var(--font-heading)] mb-4", children: "Platform Usage" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { value: studentCount > 0 ? 85 : 0, label: "Storage Used" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { value: studentCount > 0 ? 72 : 0, label: "Active Users (Today)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { value: studentCount > 0 ? 94 : 0, label: "Assignment Completion Rate" })
      ] })
    ] })
  ] }) });
}
export {
  AdminDashboard as component
};
