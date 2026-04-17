import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { D as DashboardLayout } from "./DashboardLayout-CFb5339N.mjs";
import { S as StatusBadge } from "./DashboardWidgets-Bhuz2KXT.mjs";
import { B as Button } from "./button-B-O6dpt1.mjs";
import { u as useAuth } from "./router-DpWtc24d.mjs";
import { g as getAssignmentsByTeacher, a as getSubmissionsByAssignment, e as createAssignment } from "./firestoreService-B1PFKYMM.mjs";
import { T as Timestamp } from "../_libs/firebase__firestore.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import { P as Plus, X, F as FileText, q as Calendar, d as Users } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
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
function TeacherAssignments() {
  const {
    user
  } = useAuth();
  const [assignments, setAssignments] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [creating, setCreating] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    title: "",
    subject: "",
    description: "",
    maxMarks: "20",
    dueDays: "5"
  });
  const fetchAssignments = async () => {
    if (!user) return;
    try {
      const myAssignments = await getAssignmentsByTeacher(user.uid);
      const withCounts = await Promise.all(myAssignments.map(async (a) => {
        const subs = a.id ? await getSubmissionsByAssignment(a.id) : [];
        return {
          ...a,
          submissionCount: subs.length
        };
      }));
      setAssignments(withCounts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchAssignments();
  }, [user]);
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) return;
    setCreating(true);
    try {
      const dueDate = /* @__PURE__ */ new Date();
      dueDate.setDate(dueDate.getDate() + parseInt(form.dueDays || "5"));
      await createAssignment({
        teacherUid: user.uid,
        title: form.title,
        subject: form.subject,
        description: form.description,
        maxMarks: parseInt(form.maxMarks) || 20,
        dueDate: Timestamp.fromDate(dueDate),
        allowLateRequest: true
      });
      setShowCreate(false);
      setForm({
        title: "",
        subject: "",
        description: "",
        maxMarks: "20",
        dueDays: "5"
      });
      setLoading(true);
      await fetchAssignments();
    } catch (err) {
      alert(err.message || "Failed to create assignment.");
    } finally {
      setCreating(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "teacher", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-[var(--font-heading)]", children: "Manage Assignments" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "hero", onClick: () => setShowCreate(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
        "Create Assignment"
      ] })
    ] }),
    showCreate && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: -10
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "bg-card rounded-2xl p-6 shadow-sm border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold font-[var(--font-heading)]", children: "New Assignment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowCreate(false), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreate, className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium block mb-1", children: "Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.title, onChange: (e) => setForm({
            ...form,
            title: e.target.value
          }), required: true, placeholder: "Assignment title", className: "w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium block mb-1", children: "Subject" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.subject, onChange: (e) => setForm({
              ...form,
              subject: e.target.value
            }), required: true, placeholder: "e.g. DSA", className: "w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium block mb-1", children: "Max Marks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: form.maxMarks, onChange: (e) => setForm({
              ...form,
              maxMarks: e.target.value
            }), required: true, className: "w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium block mb-1", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: form.description, onChange: (e) => setForm({
            ...form,
            description: e.target.value
          }), placeholder: "Assignment details...", className: "w-full h-20 p-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium block mb-1", children: "Deadline (days from now)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "1", max: "30", value: form.dueDays, onChange: (e) => setForm({
            ...form,
            dueDays: e.target.value
          }), className: "w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", variant: "hero", className: "w-full", disabled: creating, children: creating ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" }) : "Create Assignment" })
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border", children: "Loading..." }) : assignments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border", children: 'No assignments created yet. Click "Create Assignment" to get started!' }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: assignments.map((a, i) => {
      const due = a.dueDate?.toDate?.() || /* @__PURE__ */ new Date();
      const isActive = due > /* @__PURE__ */ new Date();
      return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: i * 0.08
      }, className: "bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-6 h-6 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold font-[var(--font-heading)]", children: a.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
              due.toLocaleDateString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3" }),
              a.submissionCount || 0,
              " submissions"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: isActive ? "Pending" : "Locked" })
      ] }) }, a.id);
    }) })
  ] }) });
}
export {
  TeacherAssignments as component
};
