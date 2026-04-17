import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { D as DashboardLayout } from "./DashboardLayout-CFb5339N.mjs";
import { S as StatusBadge } from "./DashboardWidgets-Bhuz2KXT.mjs";
import { B as Button } from "./button-B-O6dpt1.mjs";
import { u as useAuth, s as storage } from "./router-DpWtc24d.mjs";
import { i as getAssignments, f as getSubmissionsByStudent, j as createSubmission, k as createLateRequest } from "./firestoreService-B1PFKYMM.mjs";
import { r as ref, u as uploadBytes, a as getDownloadURL } from "../_libs/firebase__storage.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { F as FileText, q as Calendar, f as Clock, T as TriangleAlert, t as Upload } from "../_libs/lucide-react.mjs";
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
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/jpg"
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only PDF, DOCX, and JPG files are allowed.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File size must be under 10MB.";
  }
  return null;
}
async function uploadAssignmentFile(file, studentUid, assignmentId) {
  const error = validateFile(file);
  if (error) throw new Error(error);
  const ext = file.name.split(".").pop();
  const path = `submissions/${assignmentId}/${studentUid}_${Date.now()}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}
function StudentAssignments() {
  const {
    user
  } = useAuth();
  const [assignments, setAssignments] = reactExports.useState([]);
  const [submissions, setSubmissions] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [uploading, setUploading] = reactExports.useState(null);
  const [requestingLate, setRequestingLate] = reactExports.useState(null);
  const [lateReason, setLateReason] = reactExports.useState("");
  const fileInputRef = reactExports.useRef(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const [allAssignments, mySubmissions] = await Promise.all([getAssignments(), getSubmissionsByStudent(user.uid)]);
        setAssignments(allAssignments);
        setSubmissions(mySubmissions);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);
  const getStatus = (a) => {
    const sub = submissions.find((s) => s.assignmentId === a.id);
    if (sub) return sub.status === "graded" ? "Graded" : "Submitted";
    const due = a.dueDate?.toDate?.() || /* @__PURE__ */ new Date(0);
    return due < /* @__PURE__ */ new Date() ? "Locked" : "Pending";
  };
  const getDaysLeft = (a) => {
    const due = a.dueDate?.toDate?.() || /* @__PURE__ */ new Date(0);
    return Math.ceil((due.getTime() - Date.now()) / (1e3 * 60 * 60 * 24));
  };
  const handleFileSelect = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    fileInputRef.current?.click();
  };
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAssignmentId || !user) return;
    const validationError = validateFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }
    setUploading(selectedAssignmentId);
    try {
      const fileUrl = await uploadAssignmentFile(file, user.uid, selectedAssignmentId);
      await createSubmission({
        assignmentId: selectedAssignmentId,
        studentUid: user.uid,
        fileUrl,
        status: "submitted",
        marks: null,
        feedback: ""
      });
      const mySubmissions = await getSubmissionsByStudent(user.uid);
      setSubmissions(mySubmissions);
      alert("Submission uploaded successfully!");
    } catch (err) {
      alert(err.message || "Upload failed.");
    } finally {
      setUploading(null);
      setSelectedAssignmentId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const handleLateRequest = async (assignmentId) => {
    if (!user || !lateReason.trim()) return;
    try {
      await createLateRequest({
        assignmentId,
        studentUid: user.uid,
        reason: lateReason.trim(),
        status: "pending"
      });
      alert("Late request submitted!");
      setRequestingLate(null);
      setLateReason("");
    } catch (err) {
      alert(err.message || "Request failed.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { role: "student", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-[var(--font-heading)]", children: "Assignments" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "View and submit your assignments" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileInputRef, type: "file", accept: ".pdf,.docx,.jpg,.jpeg", className: "hidden", onChange: handleUpload }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border", children: "Loading assignments..." }) : assignments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border", children: "No assignments available yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: assignments.map((a, i) => {
      const status = getStatus(a);
      const daysLeft = getDaysLeft(a);
      const isLocked = status === "Locked";
      const canRequestLate = isLocked && daysLeft >= -2;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: i * 0.08
      }, className: "bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-6 h-6 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold font-[var(--font-heading)] truncate", children: a.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
                a.subject
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                "Due: ",
                a.dueDate?.toDate?.()?.toLocaleDateString() || "N/A"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Max: ",
                a.maxMarks,
                " marks"
              ] })
            ] }),
            a.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-2", children: a.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0 flex-wrap", children: [
            daysLeft > 0 && status === "Pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-medium ${daysLeft <= 2 ? "text-destructive" : "text-warning-foreground"}`, children: [
              daysLeft,
              "d left"
            ] }),
            canRequestLate && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => setRequestingLate(a.id), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3" }),
              "Request Late"
            ] }),
            status === "Pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "hero", size: "sm", disabled: uploading === a.id, onClick: () => handleFileSelect(a.id), children: uploading === a.id ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3 h-3" }),
              "Submit"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status })
          ] })
        ] }),
        requestingLate === a.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          height: 0
        }, animate: {
          opacity: 1,
          height: "auto"
        }, className: "mt-4 pt-4 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium block mb-2", children: "Reason for late submission:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: lateReason, onChange: (e) => setLateReason(e.target.value), placeholder: "Explain your reason...", className: "w-full h-20 rounded-xl border border-input bg-background text-sm p-3 focus:outline-none focus:ring-2 focus:ring-ring resize-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "hero", size: "sm", onClick: () => handleLateRequest(a.id), disabled: !lateReason.trim(), children: "Submit Request" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => {
              setRequestingLate(null);
              setLateReason("");
            }, children: "Cancel" })
          ] })
        ] })
      ] }, a.id);
    }) })
  ] }) });
}
export {
  StudentAssignments as component
};
