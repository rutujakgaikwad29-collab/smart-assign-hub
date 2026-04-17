import { o as onSnapshot, c as collection, q as query, e as orderBy, w as where, f as getDocs, u as updateDoc, d as doc, a as getDoc, h as addDoc, b as serverTimestamp } from "../_libs/firebase__firestore.mjs";
import { d as db } from "./router-DpWtc24d.mjs";
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
function onStudentsChange(callback) {
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
function onTeachersChange(callback) {
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
  onTeachersChange as l,
  onStudentsChange as o,
  updateSubmission as u
};
