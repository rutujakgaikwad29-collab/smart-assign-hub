import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { D as DashboardLayout } from "./DashboardLayout-DAtcqoQL.mjs";
import { S as StatusBadge } from "./DashboardWidgets-Bhuz2KXT.mjs";
import { B as Button } from "./button-B-O6dpt1.mjs";
import { u as useAuth, d as db } from "./router-DwMASB40.mjs";
import { g as getAssignmentsByTeacher, a as getSubmissionsByAssignment, u as updateSubmission } from "./firestoreService-BtrQqQo_.mjs";
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
    }, className: "bg-card rounded-[2rem] p-6 shadow-sm border border-border hover:shadow-md transition-all", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[1fr_auto]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary text-sm font-semibold text-primary-foreground shadow-sm", children: s.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-card ${s.status === "graded" ? "bg-success" : "bg-warning"}` })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "truncate text-lg font-bold font-[var(--font-heading)]", children: s.studentName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: s.status }),
              s.marks !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full border border-success/20 bg-success/10 px-2.5 py-0.5 text-[10px] font-bold text-success uppercase tracking-wider", children: [
                s.marks,
                "/",
                s.maxMarks,
                " Marks"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-2 text-sm text-muted-foreground font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: s.assignmentTitle }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Submitted ",
                s.submittedAt?.toDate?.()?.toLocaleDateString() || "N/A"
              ] })
            ] }),
            s.feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2 italic border-l-2 border-primary/20 pl-3", children: [
              '"',
              s.feedback,
              '"'
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-stretch", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full sm:w-20 flex-col items-center justify-between gap-3 rounded-[2.5rem] border border-border bg-muted/20 py-5 px-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground leading-tight", children: [
                "STATUS",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                "REVIEW"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-border mx-auto", children: s.status === "graded" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircle2, { className: "h-4 w-4 text-success" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Clock3, { className: "h-4 w-4 text-warning" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-16 w-1.5 rounded-full bg-muted/50 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
              height: 0
            }, animate: {
              height: s.status === "graded" ? "100%" : "50%"
            }, className: `absolute bottom-0 w-full rounded-full ${s.status === "graded" ? "bg-success" : "bg-warning"}` }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] font-black uppercase tracking-tighter text-muted-foreground text-center", children: s.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-between gap-4 rounded-[2rem] border border-border bg-background/50 p-5 shadow-xl backdrop-blur-sm min-w-[280px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              s.fileUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: s.fileUrl, target: "_blank", rel: "noopener noreferrer", className: "contents", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "h-10 rounded-xl gap-2 font-bold text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
                "Download"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "h-10 rounded-xl gap-2 font-bold text-xs", onClick: () => window.alert(`Opening detailed view`), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" }),
                "View"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: s.status !== "graded" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "hero", size: "sm", className: "w-full h-11 rounded-xl gap-2 font-bold shadow-lg", onClick: () => {
              setGrading(s.id);
              setGradeForm({
                marks: "",
                feedback: ""
              });
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-4 w-4" }),
              "Grade Submission"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "w-full h-11 rounded-xl gap-2 font-bold text-muted-foreground", onClick: () => {
              setGrading(s.id);
              setGradeForm({
                marks: s.marks?.toString() || "",
                feedback: s.feedback || ""
              });
            }, children: "Edit Grade" }) })
          ] })
        ] })
      ] }),
      grading === s.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        height: 0
      }, animate: {
        opacity: 1,
        height: "auto"
      }, className: "mt-6 pt-6 border-t border-border space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block", children: [
              "Marks (Max: ",
              s.maxMarks,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", max: s.maxMarks, value: gradeForm.marks, onChange: (e) => setGradeForm({
              ...gradeForm,
              marks: e.target.value
            }), className: "w-full h-11 px-4 rounded-xl border border-input bg-background text-sm font-bold focus:outline-none focus:ring-2 focus:ring-ring transition-all" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block", children: "Final Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 flex items-center px-4 rounded-xl border border-border bg-muted/30 text-sm font-medium", children: "Grading in progress..." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block", children: "Faculty Feedback" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: gradeForm.feedback, onChange: (e) => setGradeForm({
            ...gradeForm,
            feedback: e.target.value
          }), placeholder: "Provide constructive feedback...", className: "w-full h-24 p-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all font-medium" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "hero", size: "lg", className: "px-8 shadow-lg", onClick: () => handleGrade(s.id), children: "Submit Grade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "lg", className: "px-8", onClick: () => setGrading(null), children: "Cancel" })
        ] })
      ] })
    ] }, s.id)) })
  ] }) });
}
export {
  TeacherSubmissions as component
};
