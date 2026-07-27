import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  Timestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./config";

export interface Question {
  text: string;
  type: "text" | "mcq" | "file";
  options?: string[];
  points?: number;
}

export interface Assignment {
  id?: string;
  teacherUid: string;
  subject: string;
  title: string;
  description: string;
  createdAt: any;
  dueDate: Timestamp;
  maxMarks: number;
  allowLateRequest: boolean;
  attachmentUrl?: string; // Legacy / Primary attachment
  attachmentUrls?: string[]; // Multi-file support for teacher
  classId?: string;
  createdBy?: string;
  type?: "standard" | "quiz" | "group";
  questions?: Question[];
  templateUrl?: string;
}

export interface Answer {
  questionIndex: number;
  text?: string;
  selectedOption?: number;
  imageUrls?: string[];
}

export interface SubmissionFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface Submission {
  id?: string;
  assignmentId: string;
  studentUid: string;
  studentName?: string;
  fileUrl?: string; // Legacy single file
  files?: SubmissionFile[]; // Multi-file support
  answers?: Answer[];
  submittedAt: any;
  status: "pending" | "submitted" | "graded" | "returned" | "late";
  marks: number | null;
  grade?: string;
  feedback: string;
  version: number;
  isGroup?: boolean;
  groupId?: string;
  members?: string[]; // UIDs or Names
  activityLog?: Array<{
    action: string;
    timestamp: any;
    user: string;
  }>;
}

export interface LateRequest {
  id?: string;
  assignmentId: string;
  studentUid: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: any;
}

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: "assignment" | "grade" | "feedback" | "system" | "resubmit";
  read: boolean;
  createdAt: any;
}

// ---- Assignments ----

export async function createAssignment(data: Omit<Assignment, "id" | "createdAt">): Promise<string> {
  const cleanData = { ...data };
  if (cleanData.attachmentUrl === undefined) cleanData.attachmentUrl = "";
  
  const docRef = await addDoc(collection(db, "assignments"), {
    ...cleanData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getAssignments(): Promise<Assignment[]> {
  const q = query(collection(db, "assignments"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Assignment));
}

export async function getAssignmentsByTeacher(teacherUid: string): Promise<Assignment[]> {
  // Using only where() without orderBy() to avoid requiring a composite index.
  // Sorting is done client-side instead.
  const q = query(
    collection(db, "assignments"),
    where("teacherUid", "==", teacherUid)
  );
  const snapshot = await getDocs(q);
  const results = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Assignment));
  // Sort client-side: newest first
  return results.sort((a, b) => {
    const aTime = a.createdAt?.seconds || 0;
    const bTime = b.createdAt?.seconds || 0;
    return bTime - aTime;
  });
}

export async function getAssignment(id: string): Promise<Assignment | null> {
  const docSnap = await getDoc(doc(db, "assignments", id));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Assignment;
  }
  return null;
}

export async function updateAssignment(id: string, data: Partial<Assignment>): Promise<void> {
  await updateDoc(doc(db, "assignments", id), data);
}

export async function deleteAssignment(id: string): Promise<void> {
  await deleteDoc(doc(db, "assignments", id));
}

// ---- Submissions ----

export async function submitAssignment(data: Omit<Submission, "id" | "submittedAt" | "version">): Promise<string> {
  // Check for existing submission to determine version
  const existing = await getSubmission(data.assignmentId, data.studentUid);
  const nextVersion = existing ? (existing.version || 1) + 1 : 1;
  
  const submissionData = {
    ...data,
    version: nextVersion,
    submittedAt: serverTimestamp(),
    activityLog: [
      ...(existing?.activityLog || []),
      {
        action: nextVersion === 1 ? "First Submission" : `Resubmission (v${nextVersion})`,
        timestamp: new Date(),
        user: data.studentUid
      }
    ]
  };

  if (existing && existing.id) {
    await updateDoc(doc(db, "submissions", existing.id), submissionData);
    return existing.id;
  } else {
    const docRef = await addDoc(collection(db, "submissions"), submissionData);
    return docRef.id;
  }
}

export async function createSubmission(data: Omit<Submission, "id" | "submittedAt">): Promise<string> {
  const docRef = await addDoc(collection(db, "submissions"), {
    ...data,
    submittedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getSubmissionsByAssignment(assignmentId: string): Promise<Submission[]> {
  const q = query(
    collection(db, "submissions"),
    where("assignmentId", "==", assignmentId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Submission));
}

export async function getSubmissionsByStudent(studentUid: string): Promise<Submission[]> {
  const q = query(
    collection(db, "submissions"),
    where("studentUid", "==", studentUid)
  );
  const snapshot = await getDocs(q);
  const results = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Submission));
  return results.sort((a, b) => {
    const aTime = a.submittedAt?.seconds || 0;
    const bTime = b.submittedAt?.seconds || 0;
    return bTime - aTime;
  });
}

export async function getSubmission(assignmentId: string, studentUid: string): Promise<Submission | null> {
  const q = query(
    collection(db, "submissions"),
    where("assignmentId", "==", assignmentId),
    where("studentUid", "==", studentUid)
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const d = snapshot.docs[0];
    return { id: d.id, ...d.data() } as Submission;
  }
  return null;
}

export async function updateSubmission(id: string, data: Partial<Submission>): Promise<void> {
  await updateDoc(doc(db, "submissions", id), data);
}

// ---- Late Requests ----

export async function createLateRequest(data: Omit<LateRequest, "id" | "createdAt">): Promise<string> {
  const docRef = await addDoc(collection(db, "lateRequests"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getLateRequestsByTeacher(teacherUid: string): Promise<LateRequest[]> {
  const assignments = await getAssignmentsByTeacher(teacherUid);
  const assignmentIds = assignments.map((a) => a.id).filter(Boolean);
  if (assignmentIds.length === 0) return [];

  const allRequests: LateRequest[] = [];
  const chunks = [];
  for (let i = 0; i < assignmentIds.length; i += 30) {
    chunks.push(assignmentIds.slice(i, i + 30));
  }

  for (const chunk of chunks) {
    const q = query(
      collection(db, "lateRequests"),
      where("assignmentId", "in", chunk)
    );
    const snapshot = await getDocs(q);
    allRequests.push(...snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as LateRequest)));
  }

  return allRequests;
}

export async function getLateRequestsByStudent(studentUid: string): Promise<LateRequest[]> {
  const q = query(
    collection(db, "lateRequests"),
    where("studentUid", "==", studentUid)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as LateRequest));
}

export async function updateLateRequest(id: string, data: Partial<LateRequest>): Promise<void> {
  await updateDoc(doc(db, "lateRequests", id), data);
}

// ---- Users (one-time fetch) ----

export async function getAllStudents() {
  const snapshot = await getDocs(collection(db, "students"));
  const students = [];
  for (const d of snapshot.docs) {
    const studentData = d.data();
    const userDoc = await getDoc(doc(db, "users", d.id));
    const userData = userDoc.exists() ? userDoc.data() : {};
    students.push({ id: d.id, ...userData, ...studentData });
  }
  return students;
}

export async function getAllTeachers() {
  const snapshot = await getDocs(collection(db, "teachers"));
  const teachers = [];
  for (const d of snapshot.docs) {
    const teacherData = d.data();
    const userDoc = await getDoc(doc(db, "users", d.id));
    const userData = userDoc.exists() ? userDoc.data() : {};
    teachers.push({ id: d.id, ...userData, ...teacherData });
  }
  return teachers;
}

// ---- Real-time listeners (auto-refresh within ~2 seconds) ----

export function onStudentsChange(callback: (students: any[]) => void): Unsubscribe {
  return onSnapshot(collection(db, "students"), (snapshot) => {
    const students = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    callback(students);
  });
}

export function onTeachersChange(callback: (teachers: any[]) => void): Unsubscribe {
  return onSnapshot(collection(db, "teachers"), (snapshot) => {
    const teachers = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    callback(teachers);
  });
}

// ---- Real-time listeners for Assignments and Submissions ----

export function onStudentAssignmentsChange(classIdWithBatch: string, classIdWithoutBatch: string, callback: (assignments: Assignment[]) => void): Unsubscribe {
  if (!classIdWithBatch && !classIdWithoutBatch) {
    callback([]);
    return () => {};
  }
  const classIds = Array.from(new Set([classIdWithBatch, classIdWithoutBatch].filter(Boolean)));
  const q = query(
    collection(db, "assignments"),
    where("classId", "in", classIds)
  );
  return onSnapshot(q, (snapshot) => {
    const results = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Assignment));
    results.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });
    callback(results);
  });
}

export function onTeacherAssignmentsChange(teacherUid: string, callback: (assignments: Assignment[]) => void): Unsubscribe {
  const q = query(
    collection(db, "assignments"),
    where("teacherUid", "==", teacherUid)
  );
  return onSnapshot(q, (snapshot) => {
    const results = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Assignment));
    results.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });
    callback(results);
  });
}

export function onStudentSubmissionsChange(studentUid: string, callback: (submissions: Submission[]) => void): Unsubscribe {
  const q = query(
    collection(db, "submissions"),
    where("studentUid", "==", studentUid)
  );
  return onSnapshot(q, (snapshot) => {
    const results = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Submission));
    results.sort((a, b) => {
      const aTime = a.submittedAt?.seconds || 0;
      const bTime = b.submittedAt?.seconds || 0;
      return bTime - aTime;
    });
    callback(results);
  });
}

export function onTeacherSubmissionsChange(assignmentId: string, callback: (submissions: Submission[]) => void): Unsubscribe {
  const q = query(
    collection(db, "submissions"),
    where("assignmentId", "==", assignmentId)
  );
  return onSnapshot(q, (snapshot) => {
    const results = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Submission));
    callback(results);
  });
}

export async function checkPlagiarism(assignmentId: string, currentSubmissionId: string, currentText: string): Promise<{ score: number, matches: string[] }> {
  const allSubmissions = await getSubmissionsByAssignment(assignmentId);
  const others = allSubmissions.filter(s => s.id !== currentSubmissionId && s.answers);
  
  let maxScore = 0;
  const matches: string[] = [];
  
  const currentWords = currentText.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  if (currentWords.length === 0) return { score: 0, matches: [] };
  
  for (const other of others) {
    const otherText = other.answers?.map(a => a.text).join(" ") || "";
    const otherWords = otherText.toLowerCase().split(/\s+/);
    
    // Simple word overlap coefficient
    const common = currentWords.filter(w => otherWords.includes(w));
    const score = (common.length / currentWords.length) * 100;
    
    if (score > 10) {
      matches.push(`${other.studentName || "Anonymous"} (${Math.round(score)}% overlap)`);
      if (score > maxScore) maxScore = score;
    }
  }
  
  return { score: Math.round(maxScore), matches };
}

// ---- Admin Operations ----

export async function deleteUserRecords(uid: string, role: "student" | "teacher"): Promise<void> {
  const collectionName = role === "student" ? "students" : "teachers";
  await deleteDoc(doc(db, "users", uid));
  await deleteDoc(doc(db, collectionName, uid));
}

export async function adminAddStudentRecord(data: any): Promise<string> {
  const docRef = await addDoc(collection(db, "students"), {
    ...data,
    createdAt: serverTimestamp(),
    isPendingSignUp: true
  });
  
  await setDoc(doc(db, "users", docRef.id), {
    uid: docRef.id,
    email: data.email,
    fullName: data.fullName,
    role: "student",
    department: data.department || "",
    createdAt: serverTimestamp(),
    isPendingSignUp: true
  });
  
  return docRef.id;
}

export async function adminAddTeacherRecord(data: any): Promise<string> {
  const docRef = await addDoc(collection(db, "teachers"), {
    ...data,
    createdAt: serverTimestamp(),
    isPendingSignUp: true
  });
  
  await setDoc(doc(db, "users", docRef.id), {
    uid: docRef.id,
    email: data.email,
    fullName: data.fullName,
    role: "teacher",
    department: data.department || "",
    createdAt: serverTimestamp(),
    isPendingSignUp: true
  });
  
  return docRef.id;
}

// ---- Notifications ----

export async function sendNotification(userId: string, title: string, message: string, type: Notification["type"]) {
  await addDoc(collection(db, "notifications"), {
    userId,
    title,
    message,
    type,
    read: false,
    createdAt: serverTimestamp()
  });
  
  // Mock Email Sending
  console.log(`[MAILER] Sending email to User ${userId}...`);
  console.log(`[MAILER] Subject: ${title}`);
  console.log(`[MAILER] Content: ${message}`);
}

export function onNotificationsChange(userId: string, callback: (notifications: Notification[]) => void): Unsubscribe {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Notification)));
  });
}

export async function markNotificationAsRead(id: string) {
  await updateDoc(doc(db, "notifications", id), { read: true });
}

