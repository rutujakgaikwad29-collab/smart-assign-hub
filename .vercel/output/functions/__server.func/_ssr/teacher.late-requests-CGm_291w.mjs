import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { D as DashboardLayout } from "./DashboardLayout-CFb5339N.mjs";
import { S as StatusBadge } from "./DashboardWidgets-Bhuz2KXT.mjs";
import { B as Button } from "./button-B-O6dpt1.mjs";
import { u as useAuth, d as db } from "./router-DpWtc24d.mjs";
import { b as getLateRequestsByTeacher, c as getAssignment, d as updateLateRequest } from "./firestoreService-B1PFKYMM.mjs";
import { a as getDoc, d as doc } from "../_libs/firebase__firestore.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { f as Clock } from "../_libs/lucide-react.mjs";
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
function TeacherLateRequests() {
  const {
    user
  } = useAuth();
  const [requests, setRequests] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const reqs = await getLateRequestsByTeacher(user.uid);
        const rows = await Promise.all(reqs.map(async (r) => {
          const userDoc = await getDoc(doc(db, "users", r.studentUid));
          const studentName = userDoc.exists() ? userDoc.data().fullName : "Unknown";
          const assignment = await getAssignment(r.assignmentId);
          return {
            ...r,
            studentName,
            assignmentTitle: assignment?.title || "Assignment"
          };
        }));
        setRequests(rows);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);
  const handleAction = async (id, status) => {
    try {
      await updateLateRequest(id, {
        status
      });
      setRequests((prev) => prev.map((r) => r.id === id ? {
        ...r,
        status
      } : r));
    } catch (err) {
      alert(err.message || "Failed to update.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "teacher", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-[var(--font-heading)]", children: "Late Submission Requests" }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border", children: "Loading..." }) : requests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border", children: "No late requests." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: requests.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      delay: i * 0.08
    }, className: "bg-card rounded-2xl p-5 shadow-sm border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-5 h-5 text-warning-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold font-[var(--font-heading)]", children: r.studentName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: r.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: r.assignmentTitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
          'Reason: "',
          r.reason,
          '"'
        ] }),
        r.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "success", size: "sm", onClick: () => handleAction(r.id, "approved"), children: "Approve" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", size: "sm", onClick: () => handleAction(r.id, "rejected"), children: "Reject" })
        ] })
      ] })
    ] }) }, r.id)) })
  ] }) });
}
export {
  TeacherLateRequests as component
};
