import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { D as DashboardLayout } from "./DashboardLayout-CdNrvs_m.mjs";
import { S as StatusBadge } from "./DashboardWidgets-Bhuz2KXT.mjs";
import { B as Button } from "./button-B-O6dpt1.mjs";
import { u as useAuth, d as db } from "./router-sh8vhz73.mjs";
import { g as getAssignmentsByTeacher, a as getSubmissionsByAssignment, u as updateSubmission } from "./firestoreService-ZkHiLvKN.mjs";
import { a as getDoc, d as doc } from "../_libs/firebase__firestore.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { D as Download, a as Eye } from "../_libs/lucide-react.mjs";
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
function TeacherSubmissions() {
  const {
    user
  } = useAuth();
  const [rows, setRows] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [grading, setGrading] = reactExports.useState(null);
  const [gradeForm, setGradeForm] = reactExports.useState({
    marks: "",
    feedback: ""
  });
  reactExports.useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const myAssignments = await getAssignmentsByTeacher(user.uid);
        const allRows = [];
        for (const a of myAssignments) {
          if (!a.id) continue;
          const subs = await getSubmissionsByAssignment(a.id);
          for (const s of subs) {
            const userDoc = await getDoc(doc(db, "users", s.studentUid));
            const studentName = userDoc.exists() ? userDoc.data().fullName : "Unknown";
            allRows.push({
              ...s,
              studentName,
              assignmentTitle: a.title,
              maxMarks: a.maxMarks
            });
          }
        }
        setRows(allRows);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);
  const handleGrade = async (submissionId) => {
    try {
      await updateSubmission(submissionId, {
        marks: parseInt(gradeForm.marks) || 0,
        feedback: gradeForm.feedback,
        status: "graded"
      });
      setRows((prev) => prev.map((r) => r.id === submissionId ? {
        ...r,
        marks: parseInt(gradeForm.marks),
        feedback: gradeForm.feedback,
        status: "graded"
      } : r));
      setGrading(null);
      setGradeForm({
        marks: "",
        feedback: ""
      });
    } catch (err) {
      alert(err.message || "Failed to grade.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "teacher", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-[var(--font-heading)]", children: "Review Submissions" }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border", children: "Loading..." }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border", children: "No submissions to review." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: rows.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      delay: i * 0.06
    }, className: "bg-card rounded-2xl p-5 shadow-sm border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full gradient-primary flex items-center justify-center shrink-0 text-xs font-bold text-primary-foreground", children: s.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: s.studentName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            s.assignmentTitle,
            " · ",
            s.submittedAt?.toDate?.()?.toLocaleDateString() || "N/A"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          s.status === "graded" && s.marks !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-success", children: [
            s.marks,
            "/",
            s.maxMarks
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: s.status }),
          s.fileUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: s.fileUrl, target: "_blank", rel: "noopener noreferrer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }) }) }),
          s.status !== "graded" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => {
            setGrading(s.id);
            setGradeForm({
              marks: "",
              feedback: ""
            });
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3" }),
            "Grade"
          ] })
        ] })
      ] }),
      grading === s.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        height: 0
      }, animate: {
        opacity: 1,
        height: "auto"
      }, className: "mt-4 pt-4 border-t border-border space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm font-medium block mb-1", children: [
            "Marks (/",
            s.maxMarks,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", max: s.maxMarks, value: gradeForm.marks, onChange: (e) => setGradeForm({
            ...gradeForm,
            marks: e.target.value
          }), className: "w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium block mb-1", children: "Feedback" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: gradeForm.feedback, onChange: (e) => setGradeForm({
            ...gradeForm,
            feedback: e.target.value
          }), placeholder: "Write feedback...", className: "w-full h-20 p-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "hero", size: "sm", onClick: () => handleGrade(s.id), children: "Submit Grade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setGrading(null), children: "Cancel" })
        ] })
      ] })
    ] }, s.id)) })
  ] }) });
}
export {
  TeacherSubmissions as component
};
