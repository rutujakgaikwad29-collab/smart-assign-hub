import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  Eye,
  FileText,
  Filter,
  Flag,
  GraduationCap,
  Mail,
  MoonStar,
  RefreshCcw,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  SunMedium,
  User,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { onStudentsChange, getAssignmentsByTeacher, getSubmissionsByAssignment } from "@/firebase/firestoreService";
import { detectAIContent } from "@/services/aiDetectionService";
import { toast } from "sonner";


export const Route = createFileRoute("/teacher/dashboard")({
  head: () => ({
    meta: [
      { title: "Teacher Dashboard - SmartAssign Pro" },
      { name: "description", content: "Review assignments with AI-suspicion guidance and clear faculty controls." },
    ],
  }),
  component: TeacherDashboard,
});

type Risk = "Low" | "Medium" | "High";
type Action = "Accept" | "Resubmit" | "Viva" | "Flag";

type ReviewRow = {
  id: string;
  student: string;
  assignment: string;
  course: string;
  submittedOn: string;
  score: number;
  risk: Risk;
  action: Action;
  notes: string;
  email: string;
};

const initialRows: ReviewRow[] = [
  { id: "1", student: "Rutuja Gaikwad", assignment: "DSA Lab 5", course: "CSE 2A", submittedOn: "Apr 16, 2026", score: 18, risk: "Low", action: "Accept", notes: "Consistent with class drafts and references.", email: "rutuja@example.edu" },
  { id: "2", student: "Aarav Patil", assignment: "DBMS Mini Project", course: "CSE 2B", submittedOn: "Apr 16, 2026", score: 66, risk: "High", action: "Viva", notes: "Highly polished, abrupt tone shifts, weak draft trail.", email: "aarav@example.edu" },
  { id: "3", student: "Sneha Desai", assignment: "OS Scheduling Notes", course: "CSE 1A", submittedOn: "Apr 15, 2026", score: 42, risk: "Medium", action: "Resubmit", notes: "Looks generic in several sections.", email: "sneha@example.edu" },
  { id: "4", student: "Neha Kulkarni", assignment: "Web Dev Portfolio", course: "CSE 2A", submittedOn: "Apr 15, 2026", score: 24, risk: "Low", action: "Accept", notes: "Personal examples and edits are visible.", email: "neha@example.edu" },
  { id: "5", student: "Ayush Chavan", assignment: "ML Quiz", course: "CSE 3A", submittedOn: "Apr 14, 2026", score: 79, risk: "High", action: "Flag", notes: "Answers mirror public AI phrasing.", email: "ayush@example.edu" },
];


const alerts = [
  { title: "2 high-risk submissions need attention", body: "Start with viva or clarification.", tone: "high" as const },
  { title: "1 late request pending", body: "Review the extension request soon.", tone: "medium" as const },
  { title: "4 low-risk submissions ready", body: "These are good candidates for quick acceptance.", tone: "low" as const },
];

function TeacherDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("all");
  const [risk, setRisk] = useState("all");
  const [date, setDate] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [dataRows, setDataRows] = useState<ReviewRow[]>(initialRows);
  const [scanningIds, setScanningIds] = useState<Record<string, boolean>>({});
  const [realStats, setRealStats] = useState({ assignments: 0, highRisk: 0, average: 0 });

  useEffect(() => {
    async function fetchRealStats() {
      if (!profile?.uid && !profile?.id) return;
      const uid = profile.uid || profile.id;
      try {
        const myAssignments = await getAssignmentsByTeacher(uid);
        let totalSubs = 0;
        let highRiskCount = 0;
        let totalScore = 0;

        for (const a of myAssignments) {
          if (!a.id) continue;
          const subs = await getSubmissionsByAssignment(a.id);
          totalSubs += subs.length;
          // In a real app, we'd check each submission's AI score
        }

        setRealStats({
          assignments: myAssignments.length,
          highRisk: dataRows.filter(r => r.risk === "High").length, // Mix with demo for visual fullness
          average: Math.round(dataRows.reduce((sum, row) => sum + row.score, 0) / dataRows.length),
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    }
    fetchRealStats();
  }, [profile, dataRows]);

  const handleAIScan = async (row: ReviewRow) => {
    setScanningIds(prev => ({ ...prev, [row.id]: true }));
    try {
      // In a real app, we would fetch the full text from the submission file/storage
      // For this demo, we use the 'notes' field as the text to analyze
      const result = await detectAIContent(row.notes);
      
      setDataRows(current => 
        current.map(r => 
          r.id === row.id 
            ? { ...r, score: result.score, risk: result.risk } 
            : r
        )
      );
      
      toast.success(`Scan complete for ${row.student}: ${result.score}% AI likelihood.`);
    } catch (error) {
      toast.error("AI detection failed. Please check your API key in .env");
    } finally {
      setScanningIds(prev => ({ ...prev, [row.id]: false }));
    }
  };


  // Real-time student enrollment tracking
  useEffect(() => {
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

  useEffect(() => {
    const saved = window.localStorage.getItem("smartassign-theme");
    const useDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(useDark);
    document.documentElement.classList.toggle("dark", useDark);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("smartassign-theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const filtered = dataRows.filter((row) => {
    const matchesSearch =
      row.student.toLowerCase().includes(search.toLowerCase()) ||
      row.assignment.toLowerCase().includes(search.toLowerCase()) ||
      row.course.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = course === "all" || row.course === course;
    const matchesRisk = risk === "all" || row.risk === risk;
    const matchesDate =
      date === "all" || (date === "today" && row.submittedOn === "Apr 16, 2026") || (date === "week" && row.submittedOn !== "Apr 14, 2026");
    return matchesSearch && matchesCourse && matchesRisk && matchesDate;
  });

  const lowRiskIds = dataRows.filter((row) => row.risk === "Low").map((row) => row.id);
  const stats = {
    assignments: realStats.assignments || dataRows.length,
    highRisk: realStats.highRisk,
    late: 1,
    average: realStats.average,
  };


  const csvExport = () => {
    const data = [
      ["Student", "Assignment", "Course", "AI Score", "Risk", "Suggested Action", "Submitted On"],
      ...filtered.map((row) => [row.student, row.assignment, row.course, String(row.score), row.risk, row.action, row.submittedOn]),
    ];
    const csv = data.map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "smartassign-ai-review.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const pdfExport = () => window.print();
  const toggleSelect = (id: string) => setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  const selectLowRisk = () => setSelected(lowRiskIds);
  const bulkAccept = () => window.alert(`Prepared ${selected.length} submission(s) for final faculty review.`);
  const requestClarification = (row: ReviewRow) => {
    const subject = encodeURIComponent(`Clarification request: ${row.assignment}`);
    const body = encodeURIComponent(`Hello ${row.student},\n\nPlease clarify a few points in your ${row.assignment} submission.\n\nThank you.`);
    window.location.href = `mailto:${row.email}?subject=${subject}&body=${body}`;
  };

  const riskBadge = (risk: Risk) =>
    risk === "Low"
      ? "bg-success/10 text-success border-success/20"
      : risk === "Medium"
        ? "bg-warning/15 text-warning-foreground border-warning/30"
        : "bg-destructive/10 text-destructive border-destructive/20";

  const actionBadge = (action: Action) =>
    action === "Accept"
      ? "bg-success/10 text-success border-success/20"
      : action === "Resubmit"
        ? "bg-warning/15 text-warning-foreground border-warning/30"
        : action === "Viva"
          ? "bg-info/10 text-info-foreground border-info/20"
          : "bg-destructive/10 text-destructive border-destructive/20";

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_28%)]" />
          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/15 px-4 py-1.5 text-xs font-semibold text-sky-700 dark:text-sky-300">
                <ShieldAlert className="h-3.5 w-3.5" />
                AI analysis is advisory only. Final decision rests with faculty.
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm shrink-0">
                    {profile?.profilePhotoUrl ? (
                      <img src={profile.profilePhotoUrl} alt="Teacher Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground">
                        {(profile?.fullName || "?").charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-[var(--font-heading)]">Welcome, {profile?.fullName || "Teacher"}</h1>
                  </div>
                </div>
                <p className="max-w-2xl text-sm md:text-base text-muted-foreground mt-2">
                  Review student submissions with AI-suspicion guidance, transparent suggested actions, and quick faculty controls.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="hero" onClick={() => navigate({ to: "/teacher/assignments" })}>
                  <Sparkles className="h-4 w-4" />
                  New Assignment
                </Button>
                <Button variant="outline" onClick={() => navigate({ to: "/teacher/ai-advisory" })}>
                  <BookOpen className="h-4 w-4" />
                  Integrity Guide
                </Button>
                <Button variant="outline" onClick={() => setDarkMode((value) => !value)}>
                  {darkMode ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </Button>
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                className="inline-flex items-center gap-3 rounded-2xl border border-border bg-background/80 px-4 py-3 shadow-sm backdrop-blur hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-primary-foreground">
                  <User className="h-5 w-5" />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-semibold">{profile?.fullName || "Teacher"}</span>
                  <span className="block text-xs text-muted-foreground">{profile?.email || "teacher@smartassign.pro"}</span>
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] z-20 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                  <button className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-muted/60" onClick={() => navigate({ to: "/teacher/profile" })}>
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-muted/60" onClick={() => navigate({ to: "/teacher/notifications" })}>
                    <Mail className="h-4 w-4" />
                    Notifications
                  </button>
                  <button className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-muted/60" onClick={() => navigate({ to: "/teacher/ai-advisory" })}>
                    <BookOpen className="h-4 w-4" />
                    AI Advisory
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Active Assignments" value={stats.assignments} icon={FileText} accent="primary" />
          <StatCard title="High-Risk Queue" value={stats.highRisk} icon={AlertTriangle} accent="destructive" />
          <StatCard title="Average AI Score" value={`${stats.average}%`} icon={BarChart3} accent="accent" />
          <StatCard title="Late Requests" value={stats.late} icon={Clock3} accent="warning" />
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-6">
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold font-[var(--font-heading)]">Quick Activity</h2>
                  <p className="text-xs text-muted-foreground">What needs a decision now.</p>
                </div>
                <Sparkles className="h-5 w-5 text-info-foreground" />
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-3 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate({ to: "/teacher/submissions" })}>
                  <span>Pending reviews</span>
                  <span className="font-semibold">{stats.assignments}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-3 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate({ to: "/teacher/late-requests" })}>
                  <span>Late requests</span>
                  <span className="font-semibold">{stats.late}</span>
                </div>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold font-[var(--font-heading)]">Notifications</h2>
                  <p className="text-xs text-muted-foreground">Workflow alerts.</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-warning-foreground" />
              </div>
              <div className="space-y-3">
                {alerts.map((item) => (
                  <div
                    key={item.title}
                    className={`rounded-2xl border p-4 ${
                      item.tone === "high" ? "border-destructive/20 bg-destructive/10" : item.tone === "medium" ? "border-warning/30 bg-warning/10" : "border-success/20 bg-success/10"
                    }`}
                  >
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.body}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          <div className="space-y-6">
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm h-full">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold font-[var(--font-heading)]">Recently Enrolled Students</h2>
                  <p className="text-xs text-muted-foreground">Live updates</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <GraduationCap className="h-5 w-5 text-info-foreground" />
                </div>
              </div>
              {recentStudents.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-4">No students enrolled yet.</div>
              ) : (
                <div className="space-y-2">
                  {recentStudents.map((student) => (
                    <div key={student.id} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3 hover:bg-muted/30 transition-colors">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-border shrink-0">
                        {student.profilePhotoUrl ? (
                          <img src={student.profilePhotoUrl} alt={student.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full gradient-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                            {(student.fullName || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{student.fullName || "N/A"}</p>
                        <p className="text-xs text-muted-foreground truncate">{student.department || "No dept"} • {student.year} {student.division}{student.batch ? `-${student.batch}` : ""}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm" className="w-full rounded-xl" onClick={() => navigate({ to: "/teacher/students" })}>
                  View All Students
                </Button>
              </div>
            </motion.section>
          </div>
          
          <div className="space-y-6">
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold font-[var(--font-heading)]">AI Risk Distribution</h2>
                  <p className="text-xs text-muted-foreground">Class-level overview.</p>
                </div>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {[
                  { label: "Low", value: 58, color: "bg-success" },
                  { label: "Medium", value: 27, color: "bg-warning" },
                  { label: "High", value: 15, color: "bg-destructive" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.label} risk</span>
                      <span className="text-muted-foreground">{item.value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
            
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold font-[var(--font-heading)]">Transparency Note</h2>
                  <p className="text-xs text-muted-foreground">Keep this visible for every review.</p>
                </div>
                <BookOpen className="h-5 w-5 text-info-foreground" />
              </div>
              <div className="rounded-2xl border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">
                AI analysis is advisory only. Final decisions should use judgment, drafts, oral checks, and classroom context.
              </div>
            </motion.section>
          </div>

        </section>
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  accent: "primary" | "accent" | "warning" | "destructive";
}) {
  const map = {
    primary: "gradient-primary",
    accent: "gradient-accent",
    warning: "bg-warning",
    destructive: "bg-destructive",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight font-[var(--font-heading)]">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-primary-foreground ${map[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
