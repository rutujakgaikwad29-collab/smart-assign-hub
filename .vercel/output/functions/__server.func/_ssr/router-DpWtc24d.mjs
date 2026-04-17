import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as createRouter, u as useRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, H as HeadContent, S as Scripts, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { g as getAuth, o as onAuthStateChanged, s as signOut, c as createUserWithEmailAndPassword, a as signInWithEmailAndPassword } from "../_libs/firebase__auth.mjs";
import { c as getApps, i as initializeApp, g as getApp } from "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import { g as getFirestore, s as setDoc, d as doc, a as getDoc, b as serverTimestamp } from "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import { g as getStorage } from "../_libs/firebase__storage.mjs";
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
const PLACEHOLDER_VALUES = /* @__PURE__ */ new Set([
  "YOUR_API_KEY",
  "YOUR_PROJECT.firebaseapp.com",
  "YOUR_PROJECT_ID",
  "YOUR_PROJECT.appspot.com",
  "YOUR_SENDER_ID",
  "YOUR_APP_ID"
]);
function normalize(value) {
  return typeof value === "string" ? value.trim() : "";
}
function isPlaceholder(value) {
  return !value || PLACEHOLDER_VALUES.has(value) || value.startsWith("your_");
}
function readFirebaseConfig() {
  return {
    apiKey: normalize("AIzaSyDTpy9vtVtTbD8xCX4eGLUzaDObWZlJVPw"),
    authDomain: normalize("smart-assign-pro.firebaseapp.com"),
    projectId: normalize("smart-assign-pro"),
    storageBucket: normalize("smart-assign-pro.firebasestorage.app"),
    messagingSenderId: normalize("655746575039"),
    appId: normalize("1:655746575039:web:7d4cbbc1db00c9d6c9f40a")
  };
}
const firebaseConfig = readFirebaseConfig();
const isFirebaseConfigured = ![
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.storageBucket,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId
].some(isPlaceholder);
const firebaseConfigMessage = isFirebaseConfigured ? "" : "Firebase is not configured. Add valid VITE_FIREBASE_* values to .env and restart the dev server.";
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const ADMIN_SECRET_CODE = "SMARTASSIGN-ADMIN-2026";
const COLLEGE_EMAIL_DOMAINS = [
  "edu",
  "edu.in",
  "ac.in",
  "college.edu",
  "university.edu",
  "gmail.com"
  // Allow gmail for demo purposes - remove in production
];
function validateCollegeEmail(email) {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  return COLLEGE_EMAIL_DOMAINS.some((allowed) => domain.endsWith(allowed));
}
function validateFacultyId(facultyId) {
  return facultyId.trim().length >= 3;
}
function validateAdminCode(code) {
  return code === ADMIN_SECRET_CODE;
}
function getFirebaseAuthErrorMessage(err, fallback) {
  const code = typeof err === "object" && err !== null && "code" in err ? String(err.code ?? "") : "";
  const message = typeof err === "object" && err !== null && "message" in err ? String(err.message ?? "") : "";
  const normalized = `${code} ${message}`.toLowerCase();
  if (normalized.includes("api-key-not-valid")) {
    return firebaseConfigMessage || "Firebase API key is invalid. Update the VITE_FIREBASE_* values in .env with the credentials from your Firebase project.";
  }
  if (!isFirebaseConfigured && normalized.includes("auth")) {
    return firebaseConfigMessage || fallback;
  }
  if (code === "auth/email-already-in-use") {
    return "An account with this email already exists.";
  }
  if (code === "auth/weak-password") {
    return "Password is too weak. Use at least 6 characters.";
  }
  if (code === "auth/invalid-credential") {
    return "Invalid email or password.";
  }
  if (code === "auth/user-not-found") {
    return "No account found with this email.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many attempts. Please try again later.";
  }
  return message || fallback;
}
async function signUp(email, password, role, profileData) {
  if (!isFirebaseConfigured) {
    throw new Error(firebaseConfigMessage);
  }
  if (role === "student" && !validateCollegeEmail(email)) {
    throw new Error("Please use a valid college email address to register as a student.");
  }
  if (role === "teacher" && !validateFacultyId(profileData.facultyId || "")) {
    throw new Error("Please provide a valid Faculty ID to register as a teacher.");
  }
  if (role === "admin") {
    if (!validateAdminCode(profileData.adminSecretCode || "")) {
      throw new Error("Invalid admin authorization code. Contact the system administrator.");
    }
    if (!profileData.designation) {
      throw new Error("Please select your designation to register as admin.");
    }
  }
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    role,
    fullName: profileData.fullName,
    email,
    createdAt: serverTimestamp()
  });
  const roleCollection = role === "student" ? "students" : role === "teacher" ? "teachers" : "admins";
  const commonData = {
    uid: user.uid,
    fullName: profileData.fullName,
    email,
    createdAt: serverTimestamp()
  };
  let roleData = { ...commonData };
  if (role === "student") {
    roleData.rollNumber = profileData.rollNumber || "";
    roleData.prn = profileData.prn || "";
    roleData.department = profileData.department || "";
    roleData.year = profileData.year || "";
    roleData.semester = profileData.semester || "";
    roleData.division = profileData.division || "";
  } else if (role === "teacher") {
    roleData.facultyId = profileData.facultyId || "";
    roleData.department = profileData.department || "";
    roleData.subjects = profileData.subjects || [];
  } else {
    roleData.adminId = profileData.adminId || "";
    roleData.department = profileData.department || "";
    roleData.designation = profileData.designation || "";
  }
  await setDoc(doc(db, roleCollection, user.uid), roleData);
  return user;
}
async function logIn(email, password) {
  if (!isFirebaseConfigured) {
    throw new Error(firebaseConfigMessage);
  }
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}
async function logOut() {
  await signOut(auth);
}
async function getUserRole(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    return userDoc.data().role;
  }
  return null;
}
async function getUserProfile(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    return userDoc.data();
  }
  return null;
}
function onAuthChanged(callback) {
  return onAuthStateChanged(auth, callback);
}
const AuthContext = reactExports.createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = reactExports.useState(null);
  const [profile, setProfile] = reactExports.useState(null);
  const [role, setRole] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const unsubscribe = onAuthChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userRole = await getUserRole(firebaseUser.uid);
        setRole(userRole);
        const userProfile = await getUserProfile(firebaseUser.uid);
        setProfile(userProfile);
      } else {
        setUser(null);
        setRole(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  const login = async (email, password) => {
    const firebaseUser = await logIn(email, password);
    const userRole = await getUserRole(firebaseUser.uid);
    const userProfile = await getUserProfile(firebaseUser.uid);
    setUser(firebaseUser);
    setRole(userRole);
    setProfile(userProfile);
    return userRole;
  };
  const signup = async (email, password, role2, profileData) => {
    const firebaseUser = await signUp(email, password, role2, profileData);
    setUser(firebaseUser);
    setRole(role2);
    const userProfile = await getUserProfile(firebaseUser.uid);
    setProfile(userProfile);
  };
  const logout = async () => {
    await logOut();
    setUser(null);
    setRole(null);
    setProfile(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value: { user, profile, role, loading, login, signup, logout }, children });
}
function useAuth() {
  const context = reactExports.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
const appCss = "/assets/styles-CPQwS4nJ.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground font-[var(--font-heading)]", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90", children: "Go home" }) })
  ] }) });
}
const Route$m = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SmartAssign Pro — Smart Assignment Management" },
      { name: "description", content: "A smart assignment tracking and submission management system for students, teachers, and administrators." },
      { name: "author", content: "SmartAssign Pro" },
      { property: "og:title", content: "SmartAssign Pro" },
      { property: "og:description", content: "Smart assignment tracking and submission management system." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon.png" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
const $$splitComponentImporter$l = () => import("./signup-aUoHa_3U.mjs");
const Route$l = createFileRoute("/signup")({
  validateSearch: (search) => ({
    role: search.role || "student"
  }),
  head: () => ({
    meta: [{
      title: "Sign Up — SmartAssign Pro"
    }, {
      name: "description",
      content: "Create your SmartAssign Pro account."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./login-DSASwdRY.mjs");
const Route$k = createFileRoute("/login")({
  validateSearch: (search) => ({
    role: search.role || "student"
  }),
  head: () => ({
    meta: [{
      title: "Login — SmartAssign Pro"
    }, {
      name: "description",
      content: "Log in to your SmartAssign Pro account."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./index-CY5NBN6_.mjs");
const Route$j = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "SmartAssign Pro — Smart Assignment Management"
    }, {
      name: "description",
      content: "A smart assignment tracking and submission management system for students, teachers, and administrators."
    }, {
      property: "og:title",
      content: "SmartAssign Pro"
    }, {
      property: "og:description",
      content: "Smart assignment tracking and submission management system."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./teacher.submissions-VIfZCsVW.mjs");
const Route$i = createFileRoute("/teacher/submissions")({
  head: () => ({
    meta: [{
      title: "Review Submissions — SmartAssign Pro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./teacher.profile-DBEgoGX6.mjs");
const Route$h = createFileRoute("/teacher/profile")({
  head: () => ({
    meta: [{
      title: "Teacher Profile — SmartAssign Pro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./teacher.notifications-CtUOELhE.mjs");
const Route$g = createFileRoute("/teacher/notifications")({
  head: () => ({
    meta: [{
      title: "Teacher Notifications — SmartAssign Pro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./teacher.late-requests-CGm_291w.mjs");
const Route$f = createFileRoute("/teacher/late-requests")({
  head: () => ({
    meta: [{
      title: "Late Requests — SmartAssign Pro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./teacher.dashboard-CwTdIYUs.mjs");
const Route$e = createFileRoute("/teacher/dashboard")({
  head: () => ({
    meta: [{
      title: "Teacher Dashboard - SmartAssign Pro"
    }, {
      name: "description",
      content: "Review assignments with AI-suspicion guidance and clear faculty controls."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./teacher.assignments-DBZz9z4r.mjs");
const Route$d = createFileRoute("/teacher/assignments")({
  head: () => ({
    meta: [{
      title: "Manage Assignments — SmartAssign Pro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./teacher.ai-advisory-PlEUe_Ab.mjs");
const Route$c = createFileRoute("/teacher/ai-advisory")({
  head: () => ({
    meta: [{
      title: "AI Suspicion Analysis — SmartAssign Pro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./student.submissions-CZv4HMtE.mjs");
const Route$b = createFileRoute("/student/submissions")({
  head: () => ({
    meta: [{
      title: "My Submissions — SmartAssign Pro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./student.profile-DN8Skysr.mjs");
const Route$a = createFileRoute("/student/profile")({
  head: () => ({
    meta: [{
      title: "Student Profile — SmartAssign Pro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./student.notifications-CNwpm0Z-.mjs");
const Route$9 = createFileRoute("/student/notifications")({
  head: () => ({
    meta: [{
      title: "Student Notifications — SmartAssign Pro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./student.late-requests-SXKA9xXD.mjs");
const Route$8 = createFileRoute("/student/late-requests")({
  head: () => ({
    meta: [{
      title: "Late Requests — SmartAssign Pro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./student.feedback-CS-Lu05V.mjs");
const Route$7 = createFileRoute("/student/feedback")({
  head: () => ({
    meta: [{
      title: "Feedback — SmartAssign Pro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./student.dashboard-BClgVWtb.mjs");
const Route$6 = createFileRoute("/student/dashboard")({
  head: () => ({
    meta: [{
      title: "Student Dashboard — SmartAssign Pro"
    }, {
      name: "description",
      content: "View your assignments, submissions, and progress."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./student.assignments-DZvUQ89E.mjs");
const Route$5 = createFileRoute("/student/assignments")({
  head: () => ({
    meta: [{
      title: "Assignments — SmartAssign Pro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./admin.teachers-CGU39KKE.mjs");
const Route$4 = createFileRoute("/admin/teachers")({
  head: () => ({
    meta: [{
      title: "Manage Teachers — SmartAssign Pro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./admin.subjects-BdUebmfm.mjs");
const Route$3 = createFileRoute("/admin/subjects")({
  head: () => ({
    meta: [{
      title: "Manage Subjects — SmartAssign Pro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin.students-gHVcmfp-.mjs");
const Route$2 = createFileRoute("/admin/students")({
  head: () => ({
    meta: [{
      title: "Manage Students — SmartAssign Pro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin.settings-Cv8bHl2E.mjs");
const Route$1 = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [{
      title: "Settings — SmartAssign Pro"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./admin.dashboard-BuHh5sVL.mjs");
const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [{
      title: "Admin Dashboard — SmartAssign Pro"
    }, {
      name: "description",
      content: "System overview and management for SmartAssign Pro."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SignupRoute = Route$l.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$m
});
const LoginRoute = Route$k.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$m
});
const IndexRoute = Route$j.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$m
});
const TeacherSubmissionsRoute = Route$i.update({
  id: "/teacher/submissions",
  path: "/teacher/submissions",
  getParentRoute: () => Route$m
});
const TeacherProfileRoute = Route$h.update({
  id: "/teacher/profile",
  path: "/teacher/profile",
  getParentRoute: () => Route$m
});
const TeacherNotificationsRoute = Route$g.update({
  id: "/teacher/notifications",
  path: "/teacher/notifications",
  getParentRoute: () => Route$m
});
const TeacherLateRequestsRoute = Route$f.update({
  id: "/teacher/late-requests",
  path: "/teacher/late-requests",
  getParentRoute: () => Route$m
});
const TeacherDashboardRoute = Route$e.update({
  id: "/teacher/dashboard",
  path: "/teacher/dashboard",
  getParentRoute: () => Route$m
});
const TeacherAssignmentsRoute = Route$d.update({
  id: "/teacher/assignments",
  path: "/teacher/assignments",
  getParentRoute: () => Route$m
});
const TeacherAiAdvisoryRoute = Route$c.update({
  id: "/teacher/ai-advisory",
  path: "/teacher/ai-advisory",
  getParentRoute: () => Route$m
});
const StudentSubmissionsRoute = Route$b.update({
  id: "/student/submissions",
  path: "/student/submissions",
  getParentRoute: () => Route$m
});
const StudentProfileRoute = Route$a.update({
  id: "/student/profile",
  path: "/student/profile",
  getParentRoute: () => Route$m
});
const StudentNotificationsRoute = Route$9.update({
  id: "/student/notifications",
  path: "/student/notifications",
  getParentRoute: () => Route$m
});
const StudentLateRequestsRoute = Route$8.update({
  id: "/student/late-requests",
  path: "/student/late-requests",
  getParentRoute: () => Route$m
});
const StudentFeedbackRoute = Route$7.update({
  id: "/student/feedback",
  path: "/student/feedback",
  getParentRoute: () => Route$m
});
const StudentDashboardRoute = Route$6.update({
  id: "/student/dashboard",
  path: "/student/dashboard",
  getParentRoute: () => Route$m
});
const StudentAssignmentsRoute = Route$5.update({
  id: "/student/assignments",
  path: "/student/assignments",
  getParentRoute: () => Route$m
});
const AdminTeachersRoute = Route$4.update({
  id: "/admin/teachers",
  path: "/admin/teachers",
  getParentRoute: () => Route$m
});
const AdminSubjectsRoute = Route$3.update({
  id: "/admin/subjects",
  path: "/admin/subjects",
  getParentRoute: () => Route$m
});
const AdminStudentsRoute = Route$2.update({
  id: "/admin/students",
  path: "/admin/students",
  getParentRoute: () => Route$m
});
const AdminSettingsRoute = Route$1.update({
  id: "/admin/settings",
  path: "/admin/settings",
  getParentRoute: () => Route$m
});
const AdminDashboardRoute = Route.update({
  id: "/admin/dashboard",
  path: "/admin/dashboard",
  getParentRoute: () => Route$m
});
const rootRouteChildren = {
  IndexRoute,
  LoginRoute,
  SignupRoute,
  AdminDashboardRoute,
  AdminSettingsRoute,
  AdminStudentsRoute,
  AdminSubjectsRoute,
  AdminTeachersRoute,
  StudentAssignmentsRoute,
  StudentDashboardRoute,
  StudentFeedbackRoute,
  StudentLateRequestsRoute,
  StudentNotificationsRoute,
  StudentProfileRoute,
  StudentSubmissionsRoute,
  TeacherAiAdvisoryRoute,
  TeacherAssignmentsRoute,
  TeacherDashboardRoute,
  TeacherLateRequestsRoute,
  TeacherNotificationsRoute,
  TeacherProfileRoute,
  TeacherSubmissionsRoute
};
const routeTree = Route$m._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({
  error,
  reset
}) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$l as R,
  validateFacultyId as a,
  Route$k as b,
  db as d,
  firebaseConfigMessage as f,
  getFirebaseAuthErrorMessage as g,
  isFirebaseConfigured as i,
  router as r,
  storage as s,
  useAuth as u,
  validateCollegeEmail as v
};
