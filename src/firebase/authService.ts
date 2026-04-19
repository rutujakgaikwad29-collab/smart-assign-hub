import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, firebaseConfigMessage, isFirebaseConfigured } from "./config";

export type UserRole = "student" | "teacher" | "admin";

// Secret code required for admin registration (HOD/Principal only)
const ADMIN_SECRET_CODE = "SMARTASSIGN-ADMIN-2026";

// Allowed college email domains for students
const COLLEGE_EMAIL_DOMAINS = [
  "edu", "edu.in", "ac.in", "college.edu", "university.edu",
  "gmail.com", // Allow gmail for demo purposes - remove in production
];

export interface UserProfile {
  uid: string;
  role: UserRole;
  fullName: string;
  email: string;
  department: string;
  createdAt: any;
}


export interface StudentProfile extends UserProfile {
  rollNumber: string;
  prn: string;
  department: string;
  year: string;
  semester: string;
  division: string;
}

export interface TeacherProfile extends UserProfile {
  facultyId: string;
  department: string;
  subjects: string[];
}

export interface AdminProfile extends UserProfile {
  adminId: string;
  department: string;
  designation: string;
}

export function validateCollegeEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  return COLLEGE_EMAIL_DOMAINS.some((allowed) => domain.endsWith(allowed));
}

export function validateFacultyId(facultyId: string): boolean {
  // Faculty ID must be in format: FAC-XXXX-XXX or similar (at least 3 chars)
  return facultyId.trim().length >= 3;
}

export function validateAdminCode(code: string): boolean {
  return code === ADMIN_SECRET_CODE;
}

export function getFirebaseAuthErrorMessage(err: unknown, fallback: string) {
  const code = typeof err === "object" && err !== null && "code" in err ? String((err as { code?: unknown }).code ?? "") : "";
  const message = typeof err === "object" && err !== null && "message" in err ? String((err as { message?: unknown }).message ?? "") : "";
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

export async function signUp(
  email: string,
  password: string,
  role: UserRole,
  profileData: Record<string, any>
): Promise<User> {
  if (!isFirebaseConfigured) {
    throw new Error(firebaseConfigMessage);
  }

  // Validate college email for students
  if (role === "student" && !validateCollegeEmail(email)) {
    throw new Error("Please use a valid college email address to register as a student.");
  }

  // Validate faculty ID for teachers
  if (role === "teacher" && !validateFacultyId(profileData.facultyId || "")) {
    throw new Error("Please provide a valid Faculty ID to register as a teacher.");
  }

  // Validate admin secret code
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

  // Create user document in 'users' collection
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    role,
    fullName: profileData.fullName,
    email,
    department: profileData.department || "",
    createdAt: serverTimestamp(),
  });


  // Create role-specific document with COMPLETE profile data
  const roleCollection =
    role === "student" ? "students" : role === "teacher" ? "teachers" : "admins";

  const commonData = {
    uid: user.uid,
    fullName: profileData.fullName,
    email,
    createdAt: serverTimestamp(),
  };

  let roleData: Record<string, any> = { ...commonData };

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

export async function logIn(email: string, password: string): Promise<User> {
  if (!isFirebaseConfigured) {
    throw new Error(firebaseConfigMessage);
  }

  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

export async function getUserRole(uid: string): Promise<UserRole | null> {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    return userDoc.data().role as UserRole;
  }
  return null;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const role = await getUserRole(uid);
  if (!role) return null;

  const roleCollection =
    role === "student" ? "students" : role === "teacher" ? "teachers" : "admins";
  
  const profileSnap = await getDoc(doc(db, roleCollection, uid));
  if (profileSnap.exists()) {
    return { ...profileSnap.data(), role } as UserProfile;
  }
  
  // Fallback to basic user doc if role doc fails
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  }
  return null;
}


export function onAuthChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
