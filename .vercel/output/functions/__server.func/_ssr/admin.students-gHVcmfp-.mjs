import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { D as DashboardLayout } from "./DashboardLayout-CFb5339N.mjs";
import { o as onStudentsChange } from "./firestoreService-B1PFKYMM.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import { n as Search, d as Users } from "../_libs/lucide-react.mjs";
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
function AdminStudents() {
  const [students, setStudents] = reactExports.useState([]);
  const [search, setSearch] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const unsubscribe = onStudentsChange((data) => {
      setStudents(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const filtered = students.filter((s) => (s.fullName || "").toLowerCase().includes(search.toLowerCase()) || (s.rollNumber || "").toLowerCase().includes(search.toLowerCase()) || (s.email || "").toLowerCase().includes(search.toLowerCase()) || (s.department || "").toLowerCase().includes(search.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "admin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-[var(--font-heading)]", children: "Manage Students" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
          students.length,
          " student",
          students.length !== 1 ? "s" : "",
          " registered • Live updates enabled"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-xs font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-success animate-pulse" }),
        "Live"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search by name, roll number, email, or department...", className: "w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 border-2 border-primary/40 border-t-primary rounded-full animate-spin mx-auto mb-3" }),
      "Loading students..."
    ] }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-10 h-10 mx-auto mb-3 opacity-30" }),
      search ? "No students match your search." : "No students registered yet."
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      y: 12
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "bg-card rounded-2xl shadow-sm border border-border overflow-hidden overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-medium text-muted-foreground px-5 py-3", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-medium text-muted-foreground px-5 py-3", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-medium text-muted-foreground px-5 py-3", children: "Roll No" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-medium text-muted-foreground px-5 py-3", children: "Department" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center text-xs font-medium text-muted-foreground px-5 py-3", children: "Year" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center text-xs font-medium text-muted-foreground px-5 py-3", children: "Sem" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center text-xs font-medium text-muted-foreground px-5 py-3", children: "Div" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: filtered.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-5 py-3.5 text-sm font-medium flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground", children: (s.fullName || "?").split(" ").map((n) => n[0]).join("").slice(0, 2) }),
          s.fullName || "N/A"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-sm text-muted-foreground", children: s.email || "-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-sm text-muted-foreground", children: s.rollNumber || "-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-sm text-muted-foreground", children: s.department || "-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-sm text-center", children: s.year || "-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-sm text-center", children: s.semester || "-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-sm text-center", children: s.division || "-" })
      ] }, s.id)) })
    ] }) })
  ] }) });
}
export {
  AdminStudents as component
};
