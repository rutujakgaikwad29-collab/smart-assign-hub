import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "primary"
}) {
  const colorMap = {
    primary: "gradient-primary",
    accent: "gradient-accent",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      whileHover: { y: -2 },
      className: "bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-card-foreground font-[var(--font-heading)] mt-1", children: value }),
          trend && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-success mt-1", children: trend })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-10 h-10 rounded-xl ${colorMap[color]} flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 text-primary-foreground" }) })
      ] })
    }
  );
}
function StatusBadge({ status }) {
  const styles = {
    pending: "bg-warning/15 text-warning-foreground border-warning/30",
    submitted: "bg-success/15 text-success border-success/30",
    locked: "bg-destructive/15 text-destructive border-destructive/30",
    approved: "bg-success/15 text-success border-success/30",
    rejected: "bg-destructive/15 text-destructive border-destructive/30",
    graded: "bg-info/15 text-info border-info/30"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status.toLowerCase()] || "bg-muted text-muted-foreground border-border"}`, children: status });
}
function ProgressBar({ value, max = 100, label }) {
  const percentage = Math.min(value / max * 100, 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    label && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        Math.round(percentage),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { width: 0 },
        animate: { width: `${percentage}%` },
        transition: { duration: 0.8, ease: "easeOut" },
        className: "h-full rounded-full gradient-accent"
      }
    ) })
  ] });
}
export {
  ProgressBar as P,
  StatusBadge as S,
  StatCard as a
};
