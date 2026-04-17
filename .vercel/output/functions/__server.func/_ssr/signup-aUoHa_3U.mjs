import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-B-O6dpt1.mjs";
import { R as Route$l, u as useAuth, i as isFirebaseConfigured, f as firebaseConfigMessage, v as validateCollegeEmail, a as validateFacultyId, g as getFirebaseAuthErrorMessage } from "./router-DpWtc24d.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__storage.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { B as BookOpen, C as CircleAlert, U as User, M as Mail, L as Lock, E as EyeOff, a as Eye, b as Building, H as Hash, c as Briefcase, S as Shield, A as ArrowLeft } from "../_libs/lucide-react.mjs";
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
function InputField({
  icon: Icon,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = true
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-foreground mb-1.5 block", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, onChange: (e) => onChange(e.target.value), placeholder, required, className: "w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" })
    ] })
  ] });
}
function SignupPage() {
  const {
    role
  } = Route$l.useSearch();
  const navigate = useNavigate();
  const {
    signup
  } = useAuth();
  const [loading, setLoading] = reactExports.useState(false);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [form, setForm] = reactExports.useState({
    fullName: "",
    email: "",
    password: "",
    department: "",
    rollNumber: "",
    prn: "",
    year: "",
    semester: "",
    division: "",
    facultyId: "",
    adminId: "",
    adminSecretCode: "",
    designation: ""
  });
  const updateForm = (key, value) => setForm((prev) => ({
    ...prev,
    [key]: value
  }));
  const roleLabels = {
    student: "Student",
    teacher: "Teacher",
    admin: "Admin"
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (role === "student" && !validateCollegeEmail(form.email)) {
      setError("Please use a valid college email address (e.g., yourname@college.edu.in).");
      return;
    }
    if (role === "teacher" && !validateFacultyId(form.facultyId)) {
      setError("Please provide a valid Faculty ID (e.g., FAC-2024-001).");
      return;
    }
    if (role === "admin") {
      if (!form.adminSecretCode.trim()) {
        setError("Admin authorization code is required.");
        return;
      }
      if (!form.designation) {
        setError("Please select your designation.");
        return;
      }
    }
    setLoading(true);
    try {
      await signup(form.email, form.password, role, form);
      navigate({
        to: `/${role}/dashboard`
      });
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen gradient-hero flex items-center justify-center px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: false, animate: {
    opacity: 1,
    y: 0
  }, transition: {
    duration: 0.5
  }, className: "w-full max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl gradient-accent flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-foreground font-[var(--font-heading)]", children: "SmartAssign Pro" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-foreground font-[var(--font-heading)]", children: [
        roleLabels[role],
        " Registration"
      ] })
    ] }),
    !isFirebaseConfigured && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm text-amber-700 dark:text-amber-300", children: firebaseConfigMessage }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-2 text-sm text-destructive", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 shrink-0" }),
      error
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSignup, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { icon: User, label: "Full Name", placeholder: "John Doe", value: form.fullName, onChange: (v) => updateForm("fullName", v) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { icon: Mail, label: role === "student" ? "College Email" : "Email", type: "email", placeholder: role === "student" ? "yourname@college.edu.in" : "you@example.com", value: form.email, onChange: (v) => updateForm("email", v) }),
      role === "student" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground -mt-1 ml-1", children: "Use your college email address to register" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-foreground mb-1.5 block", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: showPassword ? "text" : "password", value: form.password, onChange: (e) => updateForm("password", e.target.value), placeholder: "••••••••", required: true, className: "w-full h-11 pl-10 pr-10 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { icon: Building, label: "Department", placeholder: "Computer Science", value: form.department, onChange: (v) => updateForm("department", v) }),
      role === "student" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { icon: Hash, label: "Roll Number", placeholder: "CS-101", value: form.rollNumber, onChange: (v) => updateForm("rollNumber", v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { icon: Hash, label: "PRN", placeholder: "202301001", value: form.prn, onChange: (v) => updateForm("prn", v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-foreground mb-1 block", children: "Year" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.year, onChange: (e) => updateForm("year", e.target.value), required: true, className: "w-full h-10 rounded-xl border border-input bg-background text-foreground text-sm px-2 focus:outline-none focus:ring-2 focus:ring-ring", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Year" }),
              [1, 2, 3, 4].map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: String(y), children: y }, y))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-foreground mb-1 block", children: "Semester" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.semester, onChange: (e) => updateForm("semester", e.target.value), required: true, className: "w-full h-10 rounded-xl border border-input bg-background text-foreground text-sm px-2 focus:outline-none focus:ring-2 focus:ring-ring", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Sem" }),
              [1, 2, 3, 4, 5, 6, 7, 8].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: String(s), children: s }, s))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium text-foreground mb-1 block", children: "Division" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.division, onChange: (e) => updateForm("division", e.target.value), required: true, className: "w-full h-10 rounded-xl border border-input bg-background text-foreground text-sm px-2 focus:outline-none focus:ring-2 focus:ring-ring", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Div" }),
              ["A", "B", "C", "D"].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: d, children: d }, d))
            ] })
          ] })
        ] })
      ] }),
      role === "teacher" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { icon: Hash, label: "Faculty ID", placeholder: "FAC-2024-001", value: form.facultyId, onChange: (v) => updateForm("facultyId", v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground -mt-1 ml-1", children: "Enter your official faculty ID for verification" })
      ] }),
      role === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(InputField, { icon: Hash, label: "Admin ID", placeholder: "ADM-001", value: form.adminId, onChange: (v) => updateForm("adminId", v) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-foreground mb-1.5 block", children: "Designation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.designation, onChange: (e) => updateForm("designation", e.target.value), required: true, className: "w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Designation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "HOD", children: "Head of Department (HOD)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Principal", children: "Principal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Dean", children: "Dean" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Vice Principal", children: "Vice Principal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Registrar", children: "Registrar" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-foreground mb-1.5 block", children: "Authorization Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: form.adminSecretCode, onChange: (e) => updateForm("adminSecretCode", e.target.value), placeholder: "Enter admin secret code", required: true, className: "w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 ml-1", children: "Contact the system administrator for the authorization code" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", variant: "hero", size: "lg", className: "w-full", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" }) : "Create Account" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 text-center space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", search: {
          role
        }, className: "text-accent font-medium hover:underline", children: "Sign In" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-3 h-3" }),
        "Change role"
      ] })
    ] })
  ] }) }) });
}
export {
  SignupPage as component
};
