import { q as query, o as orderBy, w as where, c as collection, e as getDocs, u as updateDoc, d as doc, a as getDoc, f as addDoc, b as serverTimestamp } from "../_libs/firebase__firestore.mjs";
import { d as db } from "./router-sh8vhz73.mjs";
async function createAssignment(data) {
  const docRef = await addDoc(collection(db, "assignments"), {
    ...data,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}
async function getAssignments() {
  const q = query(collection(db, "assignments"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
async function getAssignmentsByTeacher(teacherUid) {
  const q = query(
    collection(db, "assignments"),
    where("teacherUid", "==", teacherUid),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
async function getAssignment(id) {
  const docSnap = await getDoc(doc(db, "assignments", id));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}
async function createSubmission(data) {
  const docRef = await addDoc(collection(db, "submissions"), {
    ...data,
    submittedAt: serverTimestamp()
  });
  return docRef.id;
}
async function getSubmissionsByAssignment(assignmentId) {
  const q = query(
    collection(db, "submissions"),
    where("assignmentId", "==", assignmentId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
async function getSubmissionsByStudent(studentUid) {
  const q = query(
    collection(db, "submissions"),
    where("studentUid", "==", studentUid),
    orderBy("submittedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
async function updateSubmission(id, data) {
  await updateDoc(doc(db, "submissions", id), data);
}
async function createLateRequest(data) {
  const docRef = await addDoc(collection(db, "lateRequests"), {
    ...data,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}
async function getLateRequestsByTeacher(teacherUid) {
  const assignments = await getAssignmentsByTeacher(teacherUid);
  const assignmentIds = assignments.map((a) => a.id).filter(Boolean);
  if (assignmentIds.length === 0) return [];
  const allRequests = [];
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
    allRequests.push(...snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  }
  return allRequests;
}
async function getLateRequestsByStudent(studentUid) {
  const q = query(
    collection(db, "lateRequests"),
    where("studentUid", "==", studentUid)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
async function updateLateRequest(id, data) {
  await updateDoc(doc(db, "lateRequests", id), data);
}
async function getAllStudents() {
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
async function getAllTeachers() {
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
export {
  getSubmissionsByAssignment as a,
  getLateRequestsByTeacher as b,
  getAssignment as c,
  updateLateRequest as d,
  createAssignment as e,
  getSubmissionsByStudent as f,
  getAssignmentsByTeacher as g,
  getLateRequestsByStudent as h,
  getAssignments as i,
  createSubmission as j,
  createLateRequest as k,
  getAllTeachers as l,
  getAllStudents as m,
  updateSubmission as u
};
