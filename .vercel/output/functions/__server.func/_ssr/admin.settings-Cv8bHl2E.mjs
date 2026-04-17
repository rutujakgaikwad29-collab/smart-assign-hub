import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { D as DashboardLayout } from "./DashboardLayout-CFb5339N.mjs";
import { B as Button } from "./button-B-O6dpt1.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import { S as Shield, u as Database, v as Bell, w as Settings, e as CircleCheck, x as Copy, y as Save } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function AdminSettings() {
  const [activeTab, setActiveTab] = reactExports.useState(null);
  const [saved, setSaved] = reactExports.useState(false);
  const [copied, setCopied] = reactExports.useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2e3);
  };
  const copyCode = () => {
    navigator.clipboard.writeText("SMARTASSIGN-ADMIN-2026");
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  const settingItems = [{
    id: "security",
    icon: Shield,
    title: "Security",
    desc: "Manage roles, permissions, and access control"
  }, {
    id: "database",
    icon: Database,
    title: "Database",
    desc: "Backup, restore, and manage system data"
  }, {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    desc: "Configure email and push notification settings"
  }, {
    id: "general",
    icon: Settings,
    title: "General",
    desc: "App name, timezone, and system preferences"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "admin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-4xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-[var(--font-heading)]", children: "System Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Configure your institution's portal preferences." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1 space-y-3", children: settingItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab(item.id), className: `w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center gap-3 ${activeTab === item.id ? "bg-accent/10 border-accent shadow-sm" : "bg-card border-border hover:border-accent/40 hover:bg-muted/50"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activeTab === item.id ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold font-[var(--font-heading)] text-sm", children: item.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground truncate", children: item.desc })
        ] })
      ] }, item.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: activeTab ? /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        x: 10
      }, animate: {
        opacity: 1,
        x: 0
      }, exit: {
        opacity: 0,
        x: -10
      }, className: "bg-card rounded-[2rem] border border-border shadow-sm p-6 md:p-8 min-h-[400px] flex flex-col", children: [
        activeTab === "security" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-6 h-6 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold font-[var(--font-heading)]", children: "Security Settings" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-2xl bg-muted/50 border border-border space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold", children: "Admin Authorization Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "This code is required during Admin registration. Keep it secret and only share with authorized HODs or Principals." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "flex-1 bg-background border border-border px-3 py-2 rounded-lg text-sm font-mono tracking-wider", children: "SMARTASSIGN-ADMIN-2026" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: copyCode, className: "gap-2", children: [
                copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-success" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" }),
                copied ? "Copied" : "Copy"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold", children: "Role Permissions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ["Allow Students to edit profile", "Allow Teachers to delete submissions", "Require email verification"].map((perm, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:bg-muted/30 cursor-pointer transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: perm }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", defaultChecked: true, className: "w-4 h-4 rounded text-accent focus:ring-accent" })
            ] }, i)) })
          ] })
        ] }),
        activeTab === "general" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-6 h-6 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold font-[var(--font-heading)]", children: "General Settings" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1.5 block", children: "Institution Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", defaultValue: "SmartAssign Pro University", className: "w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent outline-none text-sm transition-all" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1.5 block", children: "Contact Support Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", defaultValue: "support@smartassign.pro", className: "w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent outline-none text-sm transition-all" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1.5 block", children: "Timezone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent outline-none text-sm transition-all", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Indian Standard Time (IST)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "UTC (GMT)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Eastern Time (ET)" })
              ] })
            ] })
          ] })
        ] }),
        activeTab === "notifications" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-6 h-6 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold font-[var(--font-heading)]", children: "Notifications" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ["Email alerts for new assignments", "Push notifications for submissions", "Weekly summary reports", "System maintenance alerts"].map((n, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 rounded-2xl border border-border bg-background shadow-sm hover:shadow-md transition-all", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: n }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: "Automated alerts sent to all users" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-6 rounded-full bg-accent/20 relative cursor-pointer p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 rounded-full bg-accent ml-auto" }) })
          ] }, i)) })
        ] }),
        activeTab === "database" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 text-center py-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-3xl bg-accent/10 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-8 h-8 text-accent" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold font-[var(--font-heading)]", children: "Maintenance & Backups" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs mx-auto", children: "Your data is automatically backed up every 24 hours. Manual maintenance tools are currently locked for your region." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", disabled: true, className: "mt-4", children: "Run Manual Optimization" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto pt-8 flex items-center justify-between border-t border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground italic", children: "Last update: April 2026" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSave, className: "gap-2 min-w-[120px]", children: [
            saved ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
            saved ? "Saved!" : "Save Changes"
          ] })
        ] })
      ] }, activeTab) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full min-h-[400px] border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-center p-8 bg-muted/5 group hover:bg-muted/10 transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-8 h-8 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg", children: "System Configuration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs mt-2", children: "Select a category from the left to start configuring your portal's global settings." })
      ] }) }) })
    ] })
  ] }) });
}
export {
  AdminSettings as component
};
