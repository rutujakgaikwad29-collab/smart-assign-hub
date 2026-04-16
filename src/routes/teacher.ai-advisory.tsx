import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BarChart3, AlertTriangle, CheckCircle, Eye } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/teacher/ai-advisory")({
  head: () => ({
    meta: [{ title: "AI Suspicion Analysis — SmartAssign Pro" }],
  }),
  component: AIAdvisoryPage,
});

const submissions = [
  { id: 1, student: "Rahul Sharma", assignment: "DSA Lab 5", score: 15, risk: "Low", recommendation: "Accept" },
  { id: 2, student: "Priya Patel", assignment: "DBMS Project", score: 72, risk: "High", recommendation: "Viva" },
  { id: 3, student: "Amit Kumar", assignment: "OS Scheduling", score: 40, risk: "Medium", recommendation: "Resubmit" },
  { id: 4, student: "Sneha Desai", assignment: "Web Dev Portfolio", score: 8, risk: "Low", recommendation: "Accept" },
];

function AIAdvisoryPage() {
  const riskColor = (risk: string) => {
    if (risk === "Low") return "text-success";
    if (risk === "Medium") return "text-warning-foreground";
    return "text-destructive";
  };

  const riskBg = (risk: string) => {
    if (risk === "Low") return "bg-success/10";
    if (risk === "Medium") return "bg-warning/10";
    return "bg-destructive/10";
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-heading)]">AI Suspicion Analysis Assistant</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Advisory tool for reviewing assignment submissions
          </p>
          <div className="mt-3 bg-warning/10 border border-warning/30 rounded-xl p-3 text-xs text-warning-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span><strong>Advisory only</strong> — not a real AI detector. Use professional judgment for final decisions.</span>
          </div>
        </div>

        <div className="grid gap-4">
          {submissions.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold font-[var(--font-heading)]">{s.student}</h3>
                  <p className="text-sm text-muted-foreground">{s.assignment}</p>
                </div>

                <div className="flex items-center gap-6">
                  {/* Suspicion Score */}
                  <div className="text-center">
                    <div className={`w-14 h-14 rounded-full ${riskBg(s.risk)} flex items-center justify-center`}>
                      <span className={`text-lg font-bold ${riskColor(s.risk)}`}>{s.score}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Score</p>
                  </div>

                  {/* Risk Level */}
                  <div className="text-center">
                    <span className={`text-sm font-semibold ${riskColor(s.risk)}`}>{s.risk}</span>
                    <p className="text-xs text-muted-foreground">Risk</p>
                  </div>

                  {/* Recommendation */}
                  <div className="text-center">
                    <span className="text-sm font-medium text-foreground">{s.recommendation}</span>
                    <p className="text-xs text-muted-foreground">Suggested</p>
                  </div>

                  <Button variant="outline" size="sm">
                    <Eye className="w-3 h-3" />
                    Review
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
