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
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./config";

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
}

export interface Submission {
  id?: string;
  assignmentId: string;
  studentUid: string;
  fileUrl: string;
  submittedAt: any;
  status: "pending" | "submitted" | "graded" | "locked";
  marks: number | null;
  feedback: string;
}

export interface LateRequest {
  id?: string;
  assignmentId: string;
  studentUid: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: any;
}

// ---- Assignments ----

export async function createAssignment(data: Omit<Assignment, "id" | "createdAt">): Promise<string> {
  const docRef = await addDoc(collection(db, "assignments"), {
    ...data,
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
  const q = query(
    collection(db, "assignments"),
    where("teacherUid", "==", teacherUid),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Assignment));
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
    where("studentUid", "==", studentUid),
    orderBy("submittedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Submission));
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
  return onSnapshot(collection(db, "students"), async (snapshot) => {
    const students = [];
    for (const d of snapshot.docs) {
      const studentData = d.data();
      if (!studentData.fullName) {
        const userDoc = await getDoc(doc(db, "users", d.id));
        const userData = userDoc.exists() ? userDoc.data() : {};
        students.push({ id: d.id, ...userData, ...studentData });
      } else {
        students.push({ id: d.id, ...studentData });
      }
    }
    callback(students);
  });
}

export function onTeachersChange(callback: (teachers: any[]) => void): Unsubscribe {
  return onSnapshot(collection(db, "teachers"), async (snapshot) => {
    const teachers = [];
    for (const d of snapshot.docs) {
      const teacherData = d.data();
      if (!teacherData.fullName) {
        const userDoc = await getDoc(doc(db, "users", d.id));
        const userData = userDoc.exists() ? userDoc.data() : {};
        teachers.push({ id: d.id, ...userData, ...teacherData });
      } else {
        teachers.push({ id: d.id, ...teacherData });
      }
    }
    callback(teachers);
  });
}
