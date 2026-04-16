import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { MessageSquare, Star } from "lucide-react";

export const Route = createFileRoute("/student/feedback")({
  head: () => ({ meta: [{ title: "Feedback — SmartAssign Pro" }] }),
  component: StudentFeedback,
});

const feedback = [
  { id: 1, assignment: "DBMS ER Diagram", teacher: "Prof. Mehta", marks: "18/20", comment: "Well-structured diagram. Minor normalization issues in 3NF." },
  { id: 2, assignment: "CN TCP Analysis", teacher: "Prof. Singh", marks: "16/20", comment: "Good understanding of TCP handshake. Improve the flow chart section." },
  { id: 3, assignment: "DSA Lab 4", teacher: "Prof. Kumar", marks: "19/20", comment: "Excellent implementation of AVL tree rotations." },
];

function StudentFeedback() {
  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-[var(--font-heading)]">Marks & Feedback</h1>
        <div className="grid gap-4">
          {feedback.map((f, i) => (
            <motion.div key={f.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-5 shadow-sm border border-border">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shrink-0"><MessageSquare className="w-5 h-5 text-primary-foreground" /></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold font-[var(--font-heading)]">{f.assignment}</h3>
                    <span className="text-lg font-bold text-success">{f.marks}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">By {f.teacher}</p>
                  <p className="text-sm text-muted-foreground bg-muted/50 rounded-xl p-3">{f.comment}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
