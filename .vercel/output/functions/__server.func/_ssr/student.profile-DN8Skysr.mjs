import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { D as DashboardLayout } from "./DashboardLayout-CFb5339N.mjs";
import { u as useAuth } from "./router-DpWtc24d.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import { U as User, M as Mail, B as BookOpen } from "../_libs/lucide-react.mjs";
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
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
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
function StudentProfilePage() {
  const {
    profile
  } = useAuth();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "student", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-4xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-[var(--font-heading)]", children: "Student Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Your account summary and enrollment details." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl p-6 shadow-sm border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-11 h-11 rounded-xl gradient-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-5 h-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold font-[var(--font-heading)]", children: profile?.fullName || "Student" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Profile Overview" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 text-sm md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-4 h-4 text-muted-foreground" }),
          profile?.email || "No email available"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4 text-muted-foreground" }),
          "Department: ",
          profile?.department || "Not set"
        ] })
      ] })
    ] })
  ] }) });
}
export {
  StudentProfilePage as component
};
