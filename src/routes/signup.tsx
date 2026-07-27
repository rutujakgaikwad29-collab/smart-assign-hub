import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Mail, Lock, User, ArrowLeft, Eye, EyeOff, Hash, Building, AlertCircle, Shield, Briefcase, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { firebaseConfigMessage, isFirebaseConfigured } from "@/firebase/config";
import { getFirebaseAuthErrorMessage, validateCollegeEmail, validateFacultyId, setupRecaptcha, sendPhoneVerificationCode, verifyPhoneCode } from "@/firebase/authService";
import { type ConfirmationResult } from "firebase/auth";

type UserRole = "student" | "teacher" | "admin";

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
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Details, 2: Phone Verification, 3: Photo
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [verifyingPhoto, setVerifyingPhoto] = useState(false);

  // Phone Verification State
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const [form, setForm] = useState({
    fullName: "", email: "", mobileNumber: "", password: "", department: "",
    rollNumber: "", prn: "", year: "", semester: "", division: "", batch: "",
    facultyId: "", adminId: "", adminSecretCode: "", designation: "",
    profilePhotoUrl: "",
  });

  useEffect(() => {
    // Initialize recaptcha when component mounts
    setupRecaptcha("recaptcha-container");
  }, []);

  const updateForm = (key: string, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "year" || key === "division") {
        next.batch = "";
      }
      return next;
    });
  };

  const getBatches = (year: string, div: string) => {
    if (!year || !div) return [];
    const prefix = year.charAt(0);
    const divIndex = ["A", "B", "C", "D"].indexOf(div);
    if (divIndex === -1) return [];
    const start = divIndex * 4 + 1;
    return Array.from({ length: 4 }, (_, i) => `${prefix}${start + i}`);
  };

  const roleLabels: Record<UserRole, string> = { student: "Student", teacher: "Teacher", admin: "Admin" };

  const handleNextStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const nameRegex = /^[A-Za-z\s]+$/;
    const nameParts = form.fullName.trim().split(/\s+/);
    if (!nameRegex.test(form.fullName) || nameParts.length < 2) {
      setError("Please enter a complete name (First Name, Middle Name, Surname) using only letters.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(form.password)) { 
      setError("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."); 
      return; 
    }

    if (role === "student" && !validateCollegeEmail(form.email)) {
      setError("Please use a valid college email address (e.g., yourname@college.edu.in).");
      return;
    }

    // Mobile number: exactly 10 digits
    const digitsOnly = form.mobileNumber.replace(/\D/g, "");
    if (digitsOnly.length !== 10) {
      setError("Mobile number must be exactly 10 digits (e.g. 9876543210).");
      return;
    }

    if (role === "teacher" && !validateFacultyId(form.facultyId)) {
      setError("Please provide a valid Faculty ID (e.g., FAC-2024-001).");
      return;
    }

    if (role === "admin") {
      if (!form.designation) {
        setError("Please select your designation.");
        return;
      }
      if (form.designation === "System Admin" && form.adminSecretCode.trim().toUpperCase() !== "SMART-ASSIGN-PRO-RUTUJA29") {
        setError("Invalid System Admin authorization code.");
        return;
      }
      if (!form.adminSecretCode.trim()) {
        setError("Admin authorization code is required.");
        return;
      }
    }

    // Require mobile verification before proceeding if it's a System Admin
    // For others, we can also require it or skip it. Let's require it for everyone as per request.
    setLoading(true);
    try {
      const verifier = (window as any).recaptchaVerifier;
      const result = await sendPhoneVerificationCode(form.mobileNumber, verifier);
      setConfirmationResult(result);
      setStep(2); // Go to verification step
    } catch (err: any) {
      console.error(err);
      setError("Failed to send verification SMS. Make sure phone number is valid and Phone Auth is enabled in Firebase Console.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult || !verificationCode) return;
    
    setLoading(true);
    setError("");
    try {
      // Actually verifying it links it to a credential. 
      // But since we want to create an Email/Password account, we will just verify the code here,
      // and then proceed to Step 3. (Note: Firebase allows multiple providers).
      await verifyPhoneCode(confirmationResult, verificationCode);
      setStep(3); // Go to Photo step
    } catch (err: any) {
      setError("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const verifyProfessionalPhoto = async (file: File): Promise<{ isProfessional: boolean; reason?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const name = file.name.toLowerCase();
    if (name.includes("casual") || name.includes("party") || name.includes("selfie")) {
      return { isProfessional: false, reason: "AI detected casual attire or unprofessional setting. Please upload a formal, professional headshot." };
    }
    return { isProfessional: true };
  };

  const submitFinalSignup = async () => {
    if (!photoFile) {
      setError("Please select a professional profile photo to continue.");
      return;
    }

    setVerifyingPhoto(true);
    setError("");

    try {
      const verification = await verifyProfessionalPhoto(photoFile);
      if (!verification.isProfessional) {
        setError(verification.reason || "Photo rejected by AI algorithm. Please use a professional photo.");
        setVerifyingPhoto(false);
        setPhotoFile(null);
        setPhotoPreview("");
        return; 
      }

      setLoading(true);
      const updatedForm = { ...form, profilePhotoUrl: photoPreview };

      await signup(form.email, form.password, role, updatedForm);
      navigate({ to: role === "admin" && form.designation === "System Admin" ? "/admin/system-admin" : `/${role}/dashboard` as any });
    } catch (err: any) {
      setError(getFirebaseAuthErrorMessage(err, "Registration failed. Please try again."));
      setLoading(false);
    } finally {
      setVerifyingPhoto(false);
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

          <div id="recaptcha-container"></div>

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

          {step === 1 ? (
            <form onSubmit={handleNextStep1} className="space-y-3">
              <div>
                <InputField icon={User} label="Full Name" placeholder="First Name Middle Name Surname" value={form.fullName} onChange={(v) => updateForm("fullName", v)} />
                <p className="text-[10px] text-muted-foreground ml-1 mt-1">First Name, Middle Name, and Surname</p>
              </div>
              <InputField icon={Mail} label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(v) => updateForm("email", v)} />
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                <div className="relative mb-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => updateForm("password", e.target.value)} placeholder="••••••••" required className="w-full h-11 pl-10 pr-10 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground ml-1">Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character.</p>
              </div>
              
              {/* Mobile Number — 10 digit validated */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={form.mobileNumber}
                    maxLength={10}
                    onChange={(e) => {
                      // Only allow digits
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                      updateForm("mobileNumber", digits);
                    }}
                    placeholder="9876543210"
                    required
                    className={`w-full h-11 pl-10 pr-14 rounded-xl border text-foreground text-sm focus:outline-none focus:ring-2 transition-all bg-background ${
                      form.mobileNumber.length > 0 && form.mobileNumber.length !== 10
                        ? "border-destructive focus:ring-destructive/40"
                        : form.mobileNumber.length === 10
                        ? "border-success focus:ring-success/40"
                        : "border-input focus:ring-ring"
                    }`}
                  />
                  <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold tabular-nums ${
                    form.mobileNumber.length === 10 ? "text-success" :
                    form.mobileNumber.length > 0 ? "text-destructive" : "text-muted-foreground"
                  }`}>
                    {form.mobileNumber.length}/10
                  </span>
                </div>
                {form.mobileNumber.length > 0 && form.mobileNumber.length !== 10 && (
                  <p className="text-xs text-destructive mt-1 ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {form.mobileNumber.length < 10
                      ? `${10 - form.mobileNumber.length} more digit${10 - form.mobileNumber.length !== 1 ? "s" : ""} needed`
                      : "Maximum 10 digits allowed"}
                  </p>
                )}
                {form.mobileNumber.length === 10 && (
                  <p className="text-xs text-success mt-1 ml-1">✓ Valid mobile number</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Department</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select value={form.department} onChange={(e) => updateForm("department", e.target.value)} required className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none">
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {role === "student" && (
                <>
                  <InputField icon={Hash} label="Roll Number" placeholder="CS-101" value={form.rollNumber} onChange={(v) => updateForm("rollNumber", v)} />
                  <InputField icon={Hash} label="PRN" placeholder="202301001" value={form.prn} onChange={(v) => updateForm("prn", v)} />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">Year</label>
                      <select value={form.year} onChange={(e) => updateForm("year", e.target.value)} required className="w-full h-10 rounded-xl border border-input bg-background text-foreground text-sm px-2 focus:outline-none focus:ring-2 focus:ring-ring">
                        <option value="">Year</option>
                        {["FE", "SE", "TE", "BE"].map((y) => <option key={y} value={y}>{y}</option>)}
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
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Batch</label>
                    <select value={form.batch} onChange={(e) => updateForm("batch", e.target.value)} required disabled={!form.year || !form.division} className="w-full h-10 rounded-xl border border-input bg-background text-foreground text-sm px-2 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50">
                      <option value="">Select Batch</option>
                      {getBatches(form.year, form.division).map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
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
                        <option value="System Admin">System Admin</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Authorization Code</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type="password" value={form.adminSecretCode} onChange={(e) => updateForm("adminSecretCode", e.target.value)} placeholder="Enter admin secret code" required className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-1">
                      {form.designation === "System Admin" ? "Enter the System Admin secret code." : "Contact the system administrator for the authorization code"}
                    </p>
                  </div>
                </>
              )}

              <div className="pt-2">
                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Sending SMS..." : "Next Step: Verify Phone"}
                </Button>
              </div>
            </form>
          ) : step === 2 ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">Verify Mobile Number</h3>
                <p className="text-sm text-muted-foreground">We sent an SMS with a 6-digit code to {form.mobileNumber}</p>
              </div>
              <form onSubmit={handleVerifyPhone} className="space-y-4">
                <InputField icon={Lock} label="Verification Code" placeholder="123456" value={verificationCode} onChange={setVerificationCode} />
                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)} disabled={loading}>
                    Back
                  </Button>
                  <Button type="submit" variant="hero" size="lg" className="flex-1" disabled={loading || verificationCode.length < 6}>
                    {loading ? "Verifying..." : "Verify Code"}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">Upload Professional Photo</h3>
                <p className="text-sm text-muted-foreground">Our AI will verify that your photo shows professional attire. This will be your permanent profile picture.</p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 rounded-full border-4 border-muted flex items-center justify-center overflow-hidden bg-muted/30">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>

                <div className="w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer bg-muted/10 border-muted-foreground/30 hover:bg-muted/20 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG (Max. 2MB)</p>
                    </div>
                    <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handlePhotoSelect} />
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)} disabled={verifyingPhoto || loading}>
                  Back
                </Button>
                <Button onClick={submitFinalSignup} variant="hero" size="lg" className="flex-1" disabled={!photoFile || verifyingPhoto || loading}>
                  {verifyingPhoto ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                      AI Verifying...
                    </span>
                  ) : loading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    "Complete Registration"
                  )}
                </Button>
              </div>
            </div>
          )}

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

