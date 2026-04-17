import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { D as DashboardLayout } from "./DashboardLayout-CFb5339N.mjs";
import { B as Button } from "./button-B-O6dpt1.mjs";
import { u as useAuth } from "./router-DpWtc24d.mjs";
import { o as onStudentsChange } from "./firestoreService-B1PFKYMM.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { g as ShieldAlert, h as Sparkles, B as BookOpen, i as SunMedium, j as MoonStar, U as User, k as ChevronDown, M as Mail, F as FileText, T as TriangleAlert, l as ChartColumn, m as Clock3, d as Users, e as CircleCheck, D as Download, n as Search, R as RefreshCcw, o as Send, p as Flag, a as Eye, G as GraduationCap } from "../_libs/lucide-react.mjs";
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
async function detectAIContent(text) {
  {
    console.warn("GPTZero API Key is missing. Returning simulated result.");
    return simulateDetection(text);
  }
}
async function simulateDetection(text) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const aiMarkers = ["as an ai language model", "furthermore", "in conclusion", "it is important to note"];
  let score = 5 + Math.floor(Math.random() * 20);
  const lowerText = text.toLowerCase();
  aiMarkers.forEach((marker) => {
    if (lowerText.includes(marker)) score += 25;
  });
  if (score > 100) score = 100;
  let risk = "Low";
  if (score > 60) risk = "High";
  else if (score > 25) risk = "Medium";
  return {
    score,
    risk,
    predictedClass: score > 50 ? "ai" : "human",
    confidenceCategory: "low"
  };
}
const initialRows = [{
  id: "1",
  student: "Rutuja Gaikwad",
  assignment: "DSA Lab 5",
  course: "CSE 2A",
  submittedOn: "Apr 16, 2026",
  score: 18,
  risk: "Low",
  action: "Accept",
  notes: "Consistent with class drafts and references.",
  email: "rutuja@example.edu"
}, {
  id: "2",
  student: "Aarav Patil",
  assignment: "DBMS Mini Project",
  course: "CSE 2B",
  submittedOn: "Apr 16, 2026",
  score: 66,
  risk: "High",
  action: "Viva",
  notes: "Highly polished, abrupt tone shifts, weak draft trail.",
  email: "aarav@example.edu"
}, {
  id: "3",
  student: "Sneha Desai",
  assignment: "OS Scheduling Notes",
  course: "CSE 1A",
  submittedOn: "Apr 15, 2026",
  score: 42,
  risk: "Medium",
  action: "Resubmit",
  notes: "Looks generic in several sections.",
  email: "sneha@example.edu"
}, {
  id: "4",
  student: "Neha Kulkarni",
  assignment: "Web Dev Portfolio",
  course: "CSE 2A",
  submittedOn: "Apr 15, 2026",
  score: 24,
  risk: "Low",
  action: "Accept",
  notes: "Personal examples and edits are visible.",
  email: "neha@example.edu"
}, {
  id: "5",
  student: "Ayush Chavan",
  assignment: "ML Quiz",
  course: "CSE 3A",
  submittedOn: "Apr 14, 2026",
  score: 79,
  risk: "High",
  action: "Flag",
  notes: "Answers mirror public AI phrasing.",
  email: "ayush@example.edu"
}];
const alerts = [{
  title: "2 high-risk submissions need attention",
  body: "Start with viva or clarification.",
  tone: "high"
}, {
  title: "1 late request pending",
  body: "Review the extension request soon.",
  tone: "medium"
}, {
  title: "4 low-risk submissions ready",
  body: "These are good candidates for quick acceptance.",
  tone: "low"
}];
function TeacherDashboard() {
  const {
    profile
  } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = reactExports.useState("");
  const [course, setCourse] = reactExports.useState("all");
  const [risk, setRisk] = reactExports.useState("all");
  const [date, setDate] = reactExports.useState("all");
  const [darkMode, setDarkMode] = reactExports.useState(false);
  const [selected, setSelected] = reactExports.useState([]);
  const [menuOpen, setMenuOpen] = reactExports.useState(false);
  const [recentStudents, setRecentStudents] = reactExports.useState([]);
  const [dataRows, setDataRows] = reactExports.useState(initialRows);
  const [scanningIds, setScanningIds] = reactExports.useState({});
  const handleAIScan = async (row) => {
    setScanningIds((prev) => ({
      ...prev,
      [row.id]: true
    }));
    try {
      const result = await detectAIContent(row.notes);
      setDataRows((current) => current.map((r) => r.id === row.id ? {
        ...r,
        score: result.score,
        risk: result.risk
      } : r));
      toast.success(`Scan complete for ${row.student}: ${result.score}% AI likelihood.`);
    } catch (error) {
      toast.error("AI detection failed. Please check your API key in .env");
    } finally {
      setScanningIds((prev) => ({
        ...prev,
        [row.id]: false
      }));
    }
  };
  reactExports.useEffect(() => {
    const unsubscribe = onStudentsChange((students) => {
      const sorted = [...students].sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });
      setRecentStudents(sorted.slice(0, 6));
    });
    return () => unsubscribe();
  }, []);
  reactExports.useEffect(() => {
    const saved = window.localStorage.getItem("smartassign-theme");
    const useDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(useDark);
    document.documentElement.classList.toggle("dark", useDark);
  }, []);
  reactExports.useEffect(() => {
    window.localStorage.setItem("smartassign-theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);
  const filtered = dataRows.filter((row) => {
    const matchesSearch = row.student.toLowerCase().includes(search.toLowerCase()) || row.assignment.toLowerCase().includes(search.toLowerCase()) || row.course.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = course === "all" || row.course === course;
    const matchesRisk = risk === "all" || row.risk === risk;
    const matchesDate = date === "all" || date === "today" && row.submittedOn === "Apr 16, 2026" || date === "week" && row.submittedOn !== "Apr 14, 2026";
    return matchesSearch && matchesCourse && matchesRisk && matchesDate;
  });
  const lowRiskIds = dataRows.filter((row) => row.risk === "Low").map((row) => row.id);
  const stats = {
    assignments: dataRows.length,
    highRisk: dataRows.filter((row) => row.risk === "High").length,
    late: 1,
    average: Math.round(dataRows.reduce((sum, row) => sum + row.score, 0) / dataRows.length)
  };
  const csvExport = () => {
    const data = [["Student", "Assignment", "Course", "AI Score", "Risk", "Suggested Action", "Submitted On"], ...filtered.map((row) => [row.student, row.assignment, row.course, String(row.score), row.risk, row.action, row.submittedOn])];
    const csv = data.map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "smartassign-ai-review.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };
  const pdfExport = () => window.print();
  const toggleSelect = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const selectLowRisk = () => setSelected(lowRiskIds);
  const bulkAccept = () => window.alert(`Prepared ${selected.length} submission(s) for final faculty review.`);
  const requestClarification = (row) => {
    const subject = encodeURIComponent(`Clarification request: ${row.assignment}`);
    const body = encodeURIComponent(`Hello ${row.student},

Please clarify a few points in your ${row.assignment} submission.

Thank you.`);
    window.location.href = `mailto:${row.email}?subject=${subject}&body=${body}`;
  };
  const riskBadge = (risk2) => risk2 === "Low" ? "bg-success/10 text-success border-success/20" : risk2 === "Medium" ? "bg-warning/15 text-warning-foreground border-warning/30" : "bg-destructive/10 text-destructive border-destructive/20";
  const actionBadge = (action) => action === "Accept" ? "bg-success/10 text-success border-success/20" : action === "Resubmit" ? "bg-warning/15 text-warning-foreground border-warning/30" : action === "Viva" ? "bg-info/10 text-info-foreground border-info/20" : "bg-destructive/10 text-destructive border-destructive/20";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "teacher", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.section, { initial: {
      opacity: 0,
      y: 16
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_28%)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-info/20 bg-info/10 px-3 py-1 text-xs font-medium text-info-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-3.5 w-3.5" }),
            "AI analysis is advisory only. Final decision rests with faculty."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl md:text-4xl font-bold tracking-tight font-[var(--font-heading)]", children: [
              "Welcome, ",
              profile?.fullName || "Teacher"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-2xl text-sm md:text-base text-muted-foreground", children: "Review student submissions with AI-suspicion guidance, transparent suggested actions, and quick faculty controls." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "hero", onClick: () => navigate({
              to: "/teacher/assignments"
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
              "New Assignment"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => navigate({
              to: "/teacher/ai-advisory"
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4" }),
              "Integrity Guide"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setDarkMode((value) => !value), children: [
              darkMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(SunMedium, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MoonStar, { className: "h-4 w-4" }),
              darkMode ? "Light Mode" : "Dark Mode"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setMenuOpen((value) => !value), className: "inline-flex items-center gap-3 rounded-2xl border border-border bg-background/80 px-4 py-3 shadow-sm backdrop-blur hover:shadow-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm font-semibold", children: profile?.fullName || "Teacher" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-xs text-muted-foreground", children: profile?.email || "teacher@smartassign.pro" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })
          ] }),
          menuOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 top-[calc(100%+0.75rem)] z-20 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-muted/60", onClick: () => navigate({
              to: "/teacher/profile"
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" }),
              "Profile"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-muted/60", onClick: () => navigate({
              to: "/teacher/notifications"
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
              "Notifications"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-muted/60", onClick: () => navigate({
              to: "/teacher/ai-advisory"
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4" }),
              "AI Advisory"
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Active Assignments", value: stats.assignments, icon: FileText, accent: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "High-Risk Queue", value: stats.highRisk, icon: TriangleAlert, accent: "destructive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Average AI Score", value: `${stats.average}%`, icon: ChartColumn, accent: "accent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { title: "Late Requests", value: stats.late, icon: Clock3, accent: "warning" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,0.9fr)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 16
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "rounded-[1.75rem] border border-border bg-card shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold font-[var(--font-heading)]", children: "Submission Review Queue" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Student name, assignment, AI suspicion score, risk level, and suggested action." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: selectLowRisk, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
              "Select Low Risk"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "success", size: "sm", onClick: bulkAccept, disabled: selected.length === 0, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
              "Accept Selected (",
              selected.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: csvExport, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
              "CSV"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: pdfExport, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
              "PDF"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_auto]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 rounded-xl border border-input bg-background px-3 h-11", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search student, assignment, course", className: "w-full bg-transparent text-sm outline-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: course, onChange: (e) => setCourse(e.target.value), className: "h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Courses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "CSE 1A", children: "CSE 1A" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "CSE 2A", children: "CSE 2A" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "CSE 2B", children: "CSE 2B" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "CSE 3A", children: "CSE 3A" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: risk, onChange: (e) => setRisk(e.target.value), className: "h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Risk Levels" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Low", children: "Low Risk" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Medium", children: "Medium Risk" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "High", children: "High Risk" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: date, onChange: (e) => setDate(e.target.value), className: "h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Any Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "today", children: "Today" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "week", children: "This Week" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => {
            setSearch("");
            setCourse("all");
            setRisk("all");
            setDate("all");
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "h-4 w-4" }),
            "Reset"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border", children: [
          filtered.map((row) => {
            const isSelected = selected.includes(row.id);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
              opacity: 0,
              y: 12
            }, animate: {
              opacity: 1,
              y: 0
            }, className: `p-5 transition-colors hover:bg-muted/30 ${isSelected ? "bg-primary/5" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 xl:grid-cols-[auto_minmax(0,1.2fr)_minmax(260px,0.8fr)]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: isSelected, onChange: () => toggleSelect(row.id), className: "mt-2 h-4 w-4 rounded border-border accent-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-2xl gradient-primary text-sm font-semibold text-primary-foreground", children: row.student.split(" ").map((part) => part[0]).join("").slice(0, 2) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "truncate text-base font-semibold font-[var(--font-heading)]", children: row.student }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `rounded-full border px-2.5 py-0.5 text-xs font-medium ${riskBadge(row.risk)}`, children: [
                      row.risk,
                      " risk"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground", children: row.course }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6 ml-auto", onClick: () => handleAIScan(row), disabled: scanningIds[row.id], children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: `h-3 w-3 ${scanningIds[row.id] ? "animate-spin" : ""}` }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
                    row.assignment,
                    " · Submitted ",
                    row.submittedOn
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: row.notes })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 rounded-2xl border border-border bg-background p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "AI Suspicion Score" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-[var(--font-heading)]", children: scanningIds[row.id] ? "..." : `${row.score}%` })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-14 w-14 items-center justify-center rounded-full border ${riskBadge(row.risk)}`, title: "Score indicates likelihood of AI-generated content. Use judgment before finalizing.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold", children: [
                    row.score,
                    "%"
                  ] }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full rounded-full ${row.risk === "Low" ? "bg-success" : row.risk === "Medium" ? "bg-warning" : "bg-destructive"}`, style: {
                  width: `${row.score}%`
                } }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `rounded-full border px-2.5 py-1 text-xs font-medium ${actionBadge(row.action)}`, children: [
                    "Suggested: ",
                    row.action
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground", children: "Hover for AI guidance" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-between gap-3 rounded-2xl border border-border bg-background p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => window.alert(`Accepted ${row.student} for final faculty review.`), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
                    "Accept"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => window.alert(`Requested resubmission from ${row.student}.`), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
                    "Resubmit"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => window.alert(`Marked ${row.student} for viva.`), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-4 w-4" }),
                    "Viva"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => window.alert(`Submission flagged for deeper review.`), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
                    "Flag"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "hero", size: "sm", onClick: () => requestClarification(row), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
                    "Request clarification"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => window.alert(`Opening detailed review for ${row.assignment}.`), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }),
                    "View details"
                  ] })
                ] })
              ] })
            ] }) }, row.id);
          }),
          filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-sm text-muted-foreground", children: "No submissions match your filters." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.section, { initial: {
          opacity: 0,
          y: 16
        }, animate: {
          opacity: 1,
          y: 0
        }, className: "rounded-[1.75rem] border border-border bg-card p-5 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold font-[var(--font-heading)]", children: "AI Risk Distribution" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Class-level overview." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-5 w-5 text-muted-foreground" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [{
            label: "Low",
            value: 58,
            color: "bg-success"
          }, {
            label: "Medium",
            value: 27,
            color: "bg-warning"
          }, {
            label: "High",
            value: 15,
            color: "bg-destructive"
          }].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                item.label,
                " risk"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                item.value,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full rounded-full ${item.color}`, style: {
              width: `${item.value}%`
            } }) })
          ] }, item.label)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.section, { initial: {
          opacity: 0,
          y: 16
        }, animate: {
          opacity: 1,
          y: 0
        }, className: "rounded-[1.75rem] border border-border bg-card p-5 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold font-[var(--font-heading)]", children: "Notifications" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Workflow alerts." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-warning-foreground" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: alerts.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl border p-4 ${item.tone === "high" ? "border-destructive/20 bg-destructive/10" : item.tone === "medium" ? "border-warning/30 bg-warning/10" : "border-success/20 bg-success/10"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: item.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: item.body })
          ] }, item.title)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.section, { initial: {
          opacity: 0,
          y: 16
        }, animate: {
          opacity: 1,
          y: 0
        }, className: "rounded-[1.75rem] border border-border bg-card p-5 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold font-[var(--font-heading)]", children: "Transparency Note" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Keep this visible for every review." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-5 w-5 text-info-foreground" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border bg-background p-4 text-sm leading-6 text-muted-foreground", children: "AI analysis is advisory only. Final decisions should use judgment, drafts, oral checks, and classroom context." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.section, { initial: {
          opacity: 0,
          y: 16
        }, animate: {
          opacity: 1,
          y: 0
        }, className: "rounded-[1.75rem] border border-border bg-card p-5 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold font-[var(--font-heading)]", children: "Recently Enrolled Students" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Live updates • New enrollments appear automatically" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-success animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-5 w-5 text-info-foreground" })
            ] })
          ] }),
          recentStudents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm text-muted-foreground py-4", children: "No students enrolled yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: recentStudents.map((student) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-border bg-background p-3 hover:bg-muted/30 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground", children: (student.fullName || "?").split(" ").map((n) => n[0]).join("").slice(0, 2) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: student.fullName || "N/A" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
                student.department || "No dept",
                " • ",
                student.rollNumber || "No roll"
              ] })
            ] })
          ] }, student.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.section, { initial: {
          opacity: 0,
          y: 16
        }, animate: {
          opacity: 1,
          y: 0
        }, className: "rounded-[1.75rem] border border-border bg-card p-5 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold font-[var(--font-heading)]", children: "Quick Activity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "What needs a decision now." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-info-foreground" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-2xl border border-border bg-background p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pending reviews" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: stats.assignments })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-2xl border border-border bg-background p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Viva recommendations" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: dataRows.filter((row) => row.action === "Viva").length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-2xl border border-border bg-background p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Clarifications needed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: dataRows.filter((row) => row.risk !== "Low").length })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
function StatCard({
  title,
  value,
  icon: Icon,
  accent
}) {
  const map = {
    primary: "gradient-primary",
    accent: "gradient-accent",
    warning: "bg-warning",
    destructive: "bg-destructive"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
    opacity: 0,
    y: 12
  }, animate: {
    opacity: 1,
    y: 0
  }, whileHover: {
    y: -2
  }, className: "rounded-[1.5rem] border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-3xl font-bold tracking-tight font-[var(--font-heading)]", children: value })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-11 w-11 items-center justify-center rounded-2xl text-primary-foreground ${map[accent]}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) })
  ] }) });
}
export {
  TeacherDashboard as component
};
