import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/jpg",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only PDF, DOCX, and JPG files are allowed.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File size must be under 10MB.";
  }
  return null;
}

export async function uploadAssignmentFile(
  file: File,
  studentUid: string,
  assignmentId: string
): Promise<string> {
  const error = validateFile(file);
  if (error) throw new Error(error);

  const ext = file.name.split(".").pop();
  const path = `submissions/${assignmentId}/${studentUid}_${Date.now()}.${ext}`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
}
