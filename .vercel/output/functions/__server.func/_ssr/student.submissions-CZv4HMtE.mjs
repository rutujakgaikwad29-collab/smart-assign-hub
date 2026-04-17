import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { D as DashboardLayout } from "./DashboardLayout-CFb5339N.mjs";
import { S as StatusBadge } from "./DashboardWidgets-Bhuz2KXT.mjs";
import { u as useAuth } from "./router-DpWtc24d.mjs";
import { f as getSubmissionsByStudent, c as getAssignment } from "./firestoreService-B1PFKYMM.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { r as CircleCheckBig } from "../_libs/lucide-react.mjs";
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
function StudentSubmissions() {
  const {
    user
  } = useAuth();
  const [submissions, setSubmissions] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const subs = await getSubmissionsByStudent(user.uid);
        const withAssignments = await Promise.all(subs.map(async (s) => {
          const assignment = await getAssignment(s.assignmentId);
          return {
            ...s,
            assignment
          };
        }));
        setSubmissions(withAssignments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "student", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-[var(--font-heading)]", children: "My Submissions" }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border", children: "Loading..." }) : submissions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border", children: "No submissions yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: submissions.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      delay: i * 0.08
    }, className: "bg-card rounded-2xl p-5 shadow-sm border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 text-success" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold font-[var(--font-heading)]", children: s.assignment?.title || "Assignment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Submitted: ",
            s.submittedAt?.toDate?.()?.toLocaleDateString() || "N/A"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          s.marks !== null && s.marks !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-success", children: [
            s.marks,
            "/",
            s.assignment?.maxMarks || "?"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: s.status })
        ] })
      ] }),
      s.feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm text-muted-foreground bg-muted/50 rounded-xl p-3", children: [
        "💬 ",
        s.feedback
      ] })
    ] }, s.id)) })
  ] }) });
}
export {
  StudentSubmissions as component
};
