import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Mail, Lock, User, ArrowLeft, Eye, EyeOff, Hash, Building, AlertCircle, Shield, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { firebaseConfigMessage, isFirebaseConfigured } from "@/firebase/config";
import { getFirebaseAuthErrorMessage, validateCollegeEmail, validateFacultyId } from "@/firebase/authService";

type UserRole = "student" | "teacher" | "admin";

// Defined OUTSIDE the component so React doesn't recreate it on every render (fixes cursor/focus loss)
function InputField({ icon: Icon, label, type = "text", placeholder, value, onChange, required = true }: {
  icon: any; label: string; type?: string; placeholder: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, unknown>) => ({
    role: (search.role as UserRole) || "student",
  }),
  head: () => ({
    meta: [
      { title: "Sign Up — SmartAssign Pro" },
      { name: "description", content: "Create your SmartAssign Pro account." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { role } = Route.useSearch();
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", department: "",
    rollNumber: "", prn: "", year: "", semester: "", division: "",
    facultyId: "", adminId: "", adminSecretCode: "", designation: "",
  });

  const updateForm = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const roleLabels: Record<UserRole, string> = { student: "Student", teacher: "Teacher", admin: "Admin" };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validations
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }

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
      navigate({ to: `/${role}/dashboard` as any });
    } catch (err: any) {
      setError(getFirebaseAuthErrorMessage(err, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-12">
      <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="glass-card rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground font-[var(--font-heading)]">SmartAssign Pro</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground font-[var(--font-heading)]">{roleLabels[role]} Registration</h1>
          </div>

          {!isFirebaseConfigured && (
            <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm text-amber-700 dark:text-amber-300">
              {firebaseConfigMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3">
            <InputField icon={User} label="Full Name" placeholder="John Doe" value={form.fullName} onChange={(v) => updateForm("fullName", v)} />
            <InputField icon={Mail} label={role === "student" ? "College Email" : "Email"} type="email" placeholder={role === "student" ? "yourname@college.edu.in" : "you@example.com"} value={form.email} onChange={(v) => updateForm("email", v)} />
            {role === "student" && (
              <p className="text-xs text-muted-foreground -mt-1 ml-1">Use your college email address to register</p>
            )}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => updateForm("password", e.target.value)} placeholder="••••••••" required className="w-full h-11 pl-10 pr-10 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <InputField icon={Building} label="Department" placeholder="Computer Science" value={form.department} onChange={(v) => updateForm("department", v)} />

            {role === "student" && (
              <>
                <InputField icon={Hash} label="Roll Number" placeholder="CS-101" value={form.rollNumber} onChange={(v) => updateForm("rollNumber", v)} />
                <InputField icon={Hash} label="PRN" placeholder="202301001" value={form.prn} onChange={(v) => updateForm("prn", v)} />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Year</label>
                    <select value={form.year} onChange={(e) => updateForm("year", e.target.value)} required className="w-full h-10 rounded-xl border border-input bg-background text-foreground text-sm px-2 focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">Year</option>
                      {[1, 2, 3, 4].map((y) => <option key={y} value={String(y)}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Semester</label>
                    <select value={form.semester} onChange={(e) => updateForm("semester", e.target.value)} required className="w-full h-10 rounded-xl border border-input bg-background text-foreground text-sm px-2 focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">Sem</option>
                      {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={String(s)}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Division</label>
                    <select value={form.division} onChange={(e) => updateForm("division", e.target.value)} required className="w-full h-10 rounded-xl border border-input bg-background text-foreground text-sm px-2 focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">Div</option>
                      {["A","B","C","D"].map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}

            {role === "teacher" && (
              <>
                <InputField icon={Hash} label="Faculty ID" placeholder="FAC-2024-001" value={form.facultyId} onChange={(v) => updateForm("facultyId", v)} />
                <p className="text-xs text-muted-foreground -mt-1 ml-1">Enter your official faculty ID for verification</p>
              </>
            )}

            {role === "admin" && (
              <>
                <InputField icon={Hash} label="Admin ID" placeholder="ADM-001" value={form.adminId} onChange={(v) => updateForm("adminId", v)} />
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Designation</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <select value={form.designation} onChange={(e) => updateForm("designation", e.target.value)} required className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all">
                      <option value="">Select Designation</option>
                      <option value="HOD">Head of Department (HOD)</option>
                      <option value="Principal">Principal</option>
                      <option value="Dean">Dean</option>
                      <option value="Vice Principal">Vice Principal</option>
                      <option value="Registrar">Registrar</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Authorization Code</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="password" value={form.adminSecretCode} onChange={(e) => updateForm("adminSecretCode", e.target.value)} placeholder="Enter admin secret code" required className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 ml-1">Contact the system administrator for the authorization code</p>
                </div>
              </>
            )}

            <div className="pt-2">
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading ? <div className="w-5 h-5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" /> : "Create Account"}
              </Button>
            </div>
          </form>

          <div className="mt-5 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" search={{ role }} className="text-accent font-medium hover:underline">Sign In</Link>
            </p>
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-3 h-3" />Change role
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
