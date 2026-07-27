import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/DashboardWidgets";
import { motion } from "framer-motion";
import { FileText, Plus, Calendar, Users, X, ChevronDown, ChevronUp, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { 
  getAssignmentsByTeacher, 
  createAssignment, 
  getSubmissionsByAssignment, 
  onTeacherAssignmentsChange, 
  onTeacherSubmissionsChange,
  updateSubmission,
  checkPlagiarism,
  sendNotification,
  type Assignment,
  type Submission
} from "@/firebase/firestoreService";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/config";
import { GradingWizard } from "@/components/GradingWizard";

const DEPARTMENTS = [
  "Artificial Intelligence And Data science (AI & DS)",
  "Civil Engineering",
  "Electronics & Telecommunications Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Electronics and Computer Engineering",
  "Information Technology",
  "Computer Engineering",
  "Automation & Robotics"
];

export const Route = createFileRoute("/teacher/assignments")({
  head: () => ({ meta: [{ title: "Manage Assignments — SmartAssign Pro" }] }),
  component: TeacherAssignments,
});

function TeacherAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<(Assignment & { submissionCount?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", subject: "", description: "", maxMarks: "20", dueDays: "5", department: "", year: "", section: "", batch: "", type: "standard" as const });
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);

  const [selectedSubmissions, setSelectedSubmissions] = useState<any[]>([]);
  const [viewingSubmissionsId, setViewingSubmissionsId] = useState<string | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<any | null>(null);
  const [gradingForm, setGradingForm] = useState({ marks: "", grade: "", feedback: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const filteredAssignments = assignments.filter(a => 
    subjectFilter === "all" ? true : a.subject === subjectFilter
  );

  const subjects = Array.from(new Set(assignments.map(a => a.subject))).filter(Boolean);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onTeacherAssignmentsChange(user.uid, (myAssignments) => {
      setAssignments(myAssignments);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!viewingSubmissionsId) {
      setSelectedSubmissions([]);
      return;
    }
    const unsubscribe = onTeacherSubmissionsChange(viewingSubmissionsId, (subs) => {
      setSelectedSubmissions(subs);
    });
    return () => unsubscribe();
  }, [viewingSubmissionsId]);

  const getBatches = (year: string, div: string) => {
    if (!year || !div) return [];
    const prefix = year.charAt(0); // F, S, T, B
    const divIndex = ["A", "B", "C", "D"].indexOf(div);
    if (divIndex === -1) return [];
    const start = divIndex * 4 + 1;
    return Array.from({ length: 4 }, (_, i) => `${prefix}${start + i}`);
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        reject(new Error("Only image files (JPG, PNG) are supported. Please convert documents to images."));
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.6));
        };
        img.onerror = () => reject(new Error("Failed to load image for compression."));
      };
      reader.onerror = () => reject(new Error("Failed to read file."));
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Validation: Require either description or an attachment
    if (!form.description.trim() && !attachmentFile) {
      toast.error("Please enter the assignment questions in the description or attach a file.");
      return;
    }

    setCreating(true);
    try {
      if (!user?.uid) throw new Error("User session expired. Please log in again.");
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (parseInt(form.dueDays) || 5));
      
      let attachmentUrl = "";
      if (attachmentFile) {
        // Compress the image and bypass Firebase Storage completely to avoid billing/CORS issues
        attachmentUrl = await compressImage(attachmentFile);
      }
      
      console.log("Creating assignment for:", user.uid);
      
      const b = form.batch && form.batch !== "All" ? `-${form.batch}` : "";
      const classId = `${form.department}-${form.year}-${form.section}${b}`.toUpperCase();

      await createAssignment({
        teacherUid: user.uid,
        createdBy: user.uid,
        classId,
        title: form.title || "Untitled Assignment",
        subject: form.subject || "General",
        description: form.description || "",
        maxMarks: parseInt(form.maxMarks) || 20,
        dueDate: Timestamp.fromDate(dueDate),
        allowLateRequest: true,
        attachmentUrl: attachmentUrl || undefined,
        type: form.type as any,
        questions: questions.length > 0 ? questions : undefined,
      });
      
      setShowCreate(false);
      setForm({ title: "", subject: "", description: "", maxMarks: "20", dueDays: "5", department: "", year: "", section: "", batch: "", type: "standard" });
      setAttachmentFile(null);
      // Removed setLoading(true) to keep UI smooth and let the listener handle updates naturally
      
      toast.success("Assignment created and synchronized!");
    } catch (err: any) {
      console.error("Assignment creation error:", err);
      toast.error(`Creation failed: ${err.message || "Unknown error"}`);
    } finally {
      setCreating(false);
    }
  };

  const handleGrade = async (marks: number, grade: string, feedback: string, status: Submission["status"]) => {
    if (!gradingSubmission) return;
    setCreating(true); // Reusing for grading spinner
    try {
      await updateSubmission(gradingSubmission.id, {
        marks,
        grade,
        feedback,
        status
      });

      // Send Notification to Student
      const title = status === "graded" ? "Assignment Graded" : "Assignment Returned";
      const message = status === "graded" 
        ? `Your submission for "${gradingSubmission.assignmentTitle || "Assignment"}" has been graded: ${marks} Marks (${grade}).`
        : `Your submission for "${gradingSubmission.assignmentTitle || "Assignment"}" was returned. Please check feedback and resubmit.`;
      
      await sendNotification(gradingSubmission.studentUid, title, message, status === "graded" ? "grade" : "resubmit");

      toast.success(status === "graded" ? "Submission graded successfully!" : "Assignment returned for revision.");
      setGradingSubmission(null);
    } catch (err: any) {
      toast.error("Grading failed: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-[var(--font-heading)]">Manage Assignments</h1>
            <p className="text-muted-foreground text-sm mt-1">Track and grade curriculum-wide coursework.</p>
          </div>
          <Button variant="hero" onClick={() => setShowCreate(true)}><Plus className="w-4 h-4 mr-1" />Create Assignment</Button>
        </div>

        {/* Subject Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button 
            onClick={() => setSubjectFilter("all")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${subjectFilter === "all" ? "bg-primary text-white shadow-md" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}
          >
            All Subjects
          </button>
          {subjects.map(s => (
            <button 
              key={s}
              onClick={() => setSubjectFilter(s)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${subjectFilter === s ? "bg-primary text-white shadow-md" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Create form */}
        {showCreate && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold font-[var(--font-heading)]">New Assignment</h2>
              <button onClick={() => setShowCreate(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Assignment title" className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Subject</label>
                  <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required placeholder="e.g. DSA" className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Max Marks</label>
                  <input type="number" value={form.maxMarks} onChange={(e) => setForm({ ...form, maxMarks: e.target.value })} required className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Department</label>
                  <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select Dept</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Year</label>
                  <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value, batch: "" })} required className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select Year</option>
                    <option value="FE">FE</option>
                    <option value="SE">SE</option>
                    <option value="TE">TE</option>
                    <option value="BE">BE</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Section</label>
                  <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value, batch: "" })} required className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select Sec</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Batch</label>
                  <select value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} required disabled={!form.year || !form.section} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50">
                    <option value="">Select Batch</option>
                    <option value="All">All Batches</option>
                    {getBatches(form.year, form.section).map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Questions / Description</label>
                <textarea value={form.description} onChange={(e) => { setForm({ ...form, description: e.target.value }); e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }} placeholder="Type or paste the assignment questions here. The box will grow automatically as you type..." className="w-full min-h-[80px] p-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none overflow-hidden" style={{ lineHeight: "1.6" }} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Attachment (Optional)</label>
                <input type="file" onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)} className="w-full h-10 px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium block mb-1">Assignment Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm">
                    <option value="standard">Standard (File Upload)</option>
                    <option value="quiz">Quiz (Questions & Answers)</option>
                    <option value="group">Group Assignment</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium block mb-1">Deadline (days)</label>
                  <input type="number" min="1" max="30" value={form.dueDays} onChange={(e) => setForm({ ...form, dueDays: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm" />
                </div>
              </div>

              {/* Question Editor */}
              <div className="border border-border rounded-xl p-4 bg-muted/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Questions ({questions.length})</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => setQuestions([...questions, { text: "", type: "text", points: 5 }])}>
                    <Plus className="w-3 h-3 mr-1" /> Add Question
                  </Button>
                </div>
                <div className="space-y-3">
                  {questions.map((q, idx) => (
                    <div key={idx} className="flex gap-2 items-start bg-card p-3 rounded-lg border border-border shadow-sm">
                      <div className="flex-1 space-y-2">
                        <textarea value={q.text} onChange={(e) => {
                          const newQ = [...questions];
                          newQ[idx].text = e.target.value;
                          setQuestions(newQ);
                          e.target.style.height = "auto";
                          e.target.style.height = e.target.scrollHeight + "px";
                        }} placeholder="Enter question text... (expands as you type or paste)" rows={2} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none overflow-hidden" style={{ lineHeight: "1.5" }} />
                        <div className="flex gap-2">
                          <select value={q.type} onChange={(e) => {
                            const newQ = [...questions];
                            newQ[idx].type = e.target.value;
                            setQuestions(newQ);
                          }} className="h-8 px-2 rounded-lg border border-input bg-background text-xs">
                            <option value="text">Written Answer</option>
                            <option value="mcq">MCQ</option>
                            <option value="file">File Upload</option>
                          </select>
                          <input type="number" value={q.points} onChange={(e) => {
                            const newQ = [...questions];
                            newQ[idx].points = parseInt(e.target.value);
                            setQuestions(newQ);
                          }} className="h-8 w-20 px-2 rounded-lg border border-input bg-background text-xs" placeholder="Points" />
                        </div>
                      </div>
                      <button type="button" onClick={() => setQuestions(questions.filter((_, i) => i !== idx))} className="text-muted-foreground hover:text-destructive">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {questions.length === 0 && <p className="text-center text-xs text-muted-foreground py-2">No specific questions added yet.</p>}
                </div>
              </div>
              
              {!form.description.trim() && !attachmentFile && (
                <p className="text-xs text-destructive text-center font-medium bg-destructive/10 p-2 rounded-lg">
                  Please enter the assignment questions or attach a file to create the assignment.
                </p>
              )}
              
              <Button type="submit" variant="hero" className="w-full" disabled={creating || (!form.description.trim() && !attachmentFile)}>
                {creating ? <div className="w-5 h-5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" /> : "Create Assignment"}
              </Button>
            </form>
          </motion.div>
        )}

        {loading ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">Loading...</div>
        ) : assignments.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center text-muted-foreground text-sm shadow-sm border border-border">No assignments created yet. Click "Create Assignment" to get started!</div>
        ) : (
          <div className="grid gap-4">
            {filteredAssignments.map((a, i) => {
              const due = a.dueDate?.toDate?.() || new Date();
              const isActive = due > new Date();
              return (
                <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer" onClick={() => setExpandedId(expandedId === a.id ? null : a.id || null)}>
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0"><FileText className="w-6 h-6 text-primary-foreground" /></div>
                    <div className="flex-1">
                      <h3 className="font-semibold font-[var(--font-heading)]">{a.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{due.toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{a.submissionCount || 0} submissions</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setViewingSubmissionsId(a.id!); }}>
                        View Submissions
                      </Button>
                      <StatusBadge status={isActive ? "Pending" : "Locked"} />
                      <button className="text-muted-foreground hover:text-foreground">
                        {expandedId === a.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  {expandedId === a.id && (
                    <div className="px-5 pb-5 pt-2 border-t border-border bg-muted/20">
                      <h4 className="font-medium text-sm mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{a.description || "No description provided."}</p>
                      {a.attachmentUrl && (
                        <div className="mt-4">
                          <a href={a.attachmentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium">
                            <LinkIcon className="w-4 h-4" /> View Attachment
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
        {/* Submissions List Modal */}
        {viewingSubmissionsId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl border border-border flex flex-col">
              <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                <div>
                  <h2 className="text-xl font-bold">Submissions</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">Total: {selectedSubmissions.length}</span>
                    <span className="text-xs px-2 py-0.5 bg-warning/10 text-amber-600 rounded-full font-bold">{selectedSubmissions.filter(s => s.status === "submitted").length} Unchecked</span>
                    <span className="text-xs px-2 py-0.5 bg-success/10 text-success rounded-full font-bold">{selectedSubmissions.filter(s => s.status === "graded").length} Checked</span>
                    <span className="text-xs px-2 py-0.5 bg-destructive/10 text-destructive rounded-full font-bold">{selectedSubmissions.filter(s => s.status === "returned").length} Returned</span>
                  </div>
                </div>
                <button onClick={() => setViewingSubmissionsId(null)} className="p-2 hover:bg-muted rounded-full"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {/* Classification Tabs */}
                <div className="flex gap-2 mb-4 p-1 bg-muted/50 rounded-2xl w-fit overflow-x-auto no-scrollbar">
                  {["all","submitted","graded","returned","late"].map(tab => (
                    <button key={tab} onClick={() => setStatusFilter(tab)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                        statusFilter === tab ? "bg-card shadow text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}>
                      {tab === "all" ? "All" : tab === "submitted" ? "⏳ Unchecked" : tab === "graded" ? "✅ Checked" : tab === "returned" ? "🔄 Returned" : "⚠️ Late"}
                      <span className="ml-1.5 px-1.5 py-0.5 bg-muted rounded-lg text-[10px]">
                        {tab === "all" ? selectedSubmissions.length : selectedSubmissions.filter(s => s.status === tab).length}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by student name..." className="flex-1 h-10 px-4 rounded-xl border border-input bg-background text-sm" />
                </div>

                {selectedSubmissions.filter(s => 
                  (statusFilter === "all" || s.status === statusFilter) &&
                  (s.studentName || "").toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 ? (
                  <div className="text-center py-20 text-muted-foreground">No matching submissions found.</div>
                ) : (
                  <div className="grid gap-4">
                    {selectedSubmissions
                      .filter(s => 
                        (statusFilter === "all" || s.status === statusFilter) &&
                        (s.studentName || "").toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((s) => (
                      <div key={s.id} className="bg-muted/10 p-4 rounded-2xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {s.studentName?.charAt(0) || "S"}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{s.studentName || "Anonymous Student"}</p>
                            <p className="text-[10px] text-muted-foreground">v{s.version} • {s.submittedAt?.toDate?.()?.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {s.status === "graded" && (
                            <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-lg">Graded: {s.marks} marks</span>
                          )}
                          <Button variant="hero" size="sm" onClick={() => {
                            const assignment = assignments.find(a => a.id === viewingSubmissionsId);
                            setGradingSubmission({ ...s, assignmentTitle: assignment?.title });
                          }}>
                            {s.status === "graded" ? "Review" : "Grade Now"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Grading Wizard Integration */}
        {gradingSubmission && (
          <GradingWizard 
            assignment={assignments.find(a => a.id === viewingSubmissionsId)!}
            submission={gradingSubmission}
            isSubmitting={creating}
            onClose={() => setGradingSubmission(null)}
            onGrade={handleGrade}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
