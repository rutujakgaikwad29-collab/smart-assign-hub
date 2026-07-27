import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, BookOpen, Phone, Edit, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setupRecaptcha, sendPhoneVerificationCode, verifyPhoneCode } from "@/firebase/authService";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export const Route = createFileRoute("/teacher/profile")({
  head: () => ({ meta: [{ title: "Teacher Profile — SmartAssign Pro" }] }),
  component: TeacherProfilePage,
});

function TeacherProfilePage() {
  const { profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationStep, setVerificationStep] = useState<"idle" | "verifying" | "success">("idle");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const [editForm, setEditForm] = useState({
    fullName: "",
    mobileNumber: "",
    department: "",
  });

  useEffect(() => {
    if (profile) {
      setEditForm({
        fullName: profile.fullName || "",
        mobileNumber: profile.mobileNumber || "",
        department: profile.department || "",
      });
    }
    setupRecaptcha("teacher-profile-recaptcha");
  }, [profile]);

  const handleStartEdit = async () => {
    setError("");
    if (!profile?.mobileNumber) {
      setError("No mobile number registered to send verification code. Please contact system admin.");
      return;
    }
    setLoading(true);
    setVerificationStep("verifying");
    try {
      const verifier = (window as any).recaptchaVerifier;
      const result = await sendPhoneVerificationCode(profile.mobileNumber, verifier);
      setConfirmationResult(result);
    } catch (err: any) {
      console.error(err);
      setError("Failed to send verification SMS. Make sure Phone Auth is enabled.");
      setVerificationStep("idle");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setError("");
    setLoading(true);
    try {
      if (confirmationResult && verificationCode) {
        await verifyPhoneCode(confirmationResult, verificationCode);
        setVerificationStep("success");
        setIsEditing(true);
      }
    } catch (err: any) {
      setError("Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setError("");
    setLoading(true);
    try {
      const teacherRef = doc(db, "teachers", profile!.uid);
      const userRef = doc(db, "users", profile!.uid);

      await updateDoc(teacherRef, editForm);
      await updateDoc(userRef, {
        fullName: editForm.fullName,
        mobileNumber: editForm.mobileNumber,
        department: editForm.department,
      });

      setIsEditing(false);
      setVerificationStep("idle");
      window.location.reload();
    } catch (err: any) {
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-[var(--font-heading)]">Teacher Profile</h1>
            <p className="text-muted-foreground text-sm mt-1">Your faculty account summary and details.</p>
          </div>
          {!isEditing && verificationStep === "idle" && (
            <Button variant="outline" onClick={handleStartEdit} disabled={loading}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <div id="teacher-profile-recaptcha"></div>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 shrink-0" />{error}
          </div>
        )}

        {verificationStep === "verifying" && (
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
            <h3 className="text-lg font-semibold mb-2">Security Verification</h3>
            <p className="text-sm text-muted-foreground mb-4">We sent an SMS with a 6-digit verification code to {profile?.mobileNumber}</p>
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                placeholder="123456" 
                value={verificationCode} 
                onChange={(e) => setVerificationCode(e.target.value)}
                className="h-11 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring outline-none"
              />
              <Button variant="hero" onClick={handleVerifyCode} disabled={loading || verificationCode.length < 6}>
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
              <Button variant="ghost" onClick={() => setVerificationStep("idle")} disabled={loading}>Cancel</Button>
            </div>
          </div>
        )}

        {isEditing ? (
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Identity Verified. You can now edit your profile.
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                <input type="text" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} className="w-full h-11 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Mobile Number</label>
                <input type="text" value={editForm.mobileNumber} onChange={(e) => setEditForm({ ...editForm, mobileNumber: e.target.value })} className="w-full h-11 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Department</label>
                <input type="text" value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} className="w-full h-11 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring outline-none" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
              <Button variant="outline" onClick={() => { setIsEditing(false); setVerificationStep("idle"); }}>Cancel</Button>
              <Button variant="hero" onClick={handleSaveProfile} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-border shadow-sm shrink-0 bg-muted">
                {profile?.profilePhotoUrl ? (
                  <img src={profile.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full gradient-accent flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold font-[var(--font-heading)]">{profile?.fullName}</h2>
                <div className="flex items-center gap-2 mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary w-fit text-xs font-medium">
                  Faculty • {(profile as any)?.facultyId || ""}
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Email Address</p>
                <p className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-muted-foreground" /> {profile?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Mobile Number</p>
                <p className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-muted-foreground" /> {profile?.mobileNumber || "Not Provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Department</p>
                <p className="flex items-center gap-2 text-sm"><BookOpen className="w-4 h-4 text-muted-foreground" /> {profile?.department}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
