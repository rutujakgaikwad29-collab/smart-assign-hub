import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { D as DashboardLayout } from "./DashboardLayout-CdNrvs_m.mjs";
import { a as StatCard, P as ProgressBar, S as StatusBadge } from "./DashboardWidgets-Bhuz2KXT.mjs";
import { u as useAuth } from "./router-sh8vhz73.mjs";
import { i as getAssignments, f as getSubmissionsByStudent } from "./firestoreService-ZkHiLvKN.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import { F as FileText, s as Upload, e as Clock, T as TriangleAlert, p as Calendar } from "../_libs/lucide-react.mjs";
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
function StudentDashboard() {
  const {
    user,
    profile
  } = useAuth();
  const [assignments, setAssignments] = reactExports.useState([]);
  const [submissions, setSubmissions] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const [allAssignments, mySubmissions] = await Promise.all([getAssignments(), getSubmissionsByStudent(user.uid)]);
        setAssignments(allAssignments);
        setSubmissions(mySubmissions);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);
  const submittedCount = submissions.filter((s) => s.status === "submitted" || s.status === "graded").length;
  const pendingCount = assignments.length - submittedCount;
  const overdueCount = assignments.filter((a) => {
    const due = a.dueDate?.toDate?.() || /* @__PURE__ */ new Date(0);
    const hasSubmission = submissions.some((s) => s.assignmentId === a.id);
    return due < /* @__PURE__ */ new Date() && !hasSubmission;
  }).length;
  const completionPct = assignments.length > 0 ? Math.round(submittedCount / assignments.length * 100) : 0;
  const getStatus = (a) => {
    const sub = submissions.find((s) => s.assignmentId === a.id);
    if (sub) return sub.status === "graded" ? "Graded" : "Submitted";
    const due = a.dueDate?.toDate?.() || /* @__PURE__ */ new Date(0);
    return due < /* @__PURE__ */ new Date() ? "Locked" : "Pending";
  };
  const getDaysLeft = (a) => {
    const due = a.dueDate?.toDate?.() || /* @__PURE__ */ new Date(0);
    return Math.ceil((due.getTime() - Date.now()) / (1e3 * 60 * 60 * 24));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "student", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-foreground font-[var(--font-heading)]", children: [
        "Welcome back, ",
        profile?.fullName || "Student",
        "!"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Here's your assignment overview" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Total Assignments", value: assignments.length, icon: FileText, color: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Submitted", value: submittedCount, icon: Upload, color: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Pending", value: pendingCount, icon: Clock, color: "warning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Overdue", value: overdueCount, icon: TriangleAlert, color: "destructive" })
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold font-[var(--font-heading)] mb-4", children: "Submission Progress" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { value: completionPct, label: "Overall Completion" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      delay: 0.3
    }, className: "bg-card rounded-2xl shadow-sm border border-border overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-b border-border flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold font-[var(--font-heading)]", children: "Recent Assignments" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-muted-foreground" })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-muted-foreground text-sm", children: "Loading assignments..." }) : assignments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-muted-foreground text-sm", children: "No assignments yet. Check back soon!" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: assignments.slice(0, 5).map((a) => {
        const status = getStatus(a);
        const daysLeft = getDaysLeft(a);
        const sub = submissions.find((s) => s.assignmentId === a.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-card-foreground truncate", children: a.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              a.subject,
              " · Due: ",
              a.dueDate?.toDate?.()?.toLocaleDateString() || "N/A"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
            sub?.marks !== null && sub?.marks !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-success", children: [
              sub.marks,
              "/",
              a.maxMarks
            ] }),
            daysLeft > 0 && status === "Pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-medium ${daysLeft <= 2 ? "text-destructive" : "text-warning-foreground"}`, children: [
              daysLeft,
              "d left"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status })
          ] })
        ] }, a.id);
      }) })
    ] })
  ] }) });
}
export {
  StudentDashboard as component
};
