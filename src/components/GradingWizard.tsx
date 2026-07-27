import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, ChevronLeft, ChevronRight, CheckCircle2, 
  RotateCcw, Send, FileText, User, MessageSquare,
  AlertCircle, GraduationCap, PenTool
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpecialAnswerBlock } from "./SpecialAnswerBlock";
import type { Assignment, Submission, Answer } from "@/firebase/firestoreService";

interface Props {
  assignment: Assignment;
  submission: Submission;
  isSubmitting: boolean;
  onClose: () => void;
  onGrade: (marks: number, grade: string, feedback: string, status: Submission["status"]) => void;
}

export function GradingWizard({ assignment, submission, isSubmitting, onClose, onGrade }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [marks, setMarks] = useState<string>(submission.marks?.toString() || "");
  const [grade, setGrade] = useState<string>(submission.grade || "");
  const [feedback, setFeedback] = useState<string>(submission.feedback || "");
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});
  const [view, setView] = useState<"questions" | "summary">("questions");

  const questions = assignment.questions || [];
  const hasQuestions = questions.length > 0;
  const totalSteps = hasQuestions ? questions.length : 1;
  const currentQ = hasQuestions ? questions[currentIdx] : null;
  const currentAns = submission.answers?.find(a => a.questionIndex === currentIdx);

  const toggleChecked = (idx: number) => {
    setCheckedQuestions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const goNext = () => {
    if (currentIdx < totalSteps - 1) setCurrentIdx(currentIdx + 1);
    else setView("summary");
  };

  const goPrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[100] flex flex-col bg-background"
    >
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between bg-card/90 backdrop-blur shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              Grading: {submission.studentName || "Student"}
              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">v{submission.version}</span>
            </h2>
            <p className="text-xs text-muted-foreground">{assignment.title} • {assignment.subject}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1 mr-4">
            <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-success" 
                animate={{ width: `${(Object.keys(checkedQuestions).length / totalSteps) * 100}%` }} 
              />
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {Object.keys(checkedQuestions).length}/{totalSteps} Checked
            </span>
          </div>
          <Button variant="hero" size="sm" onClick={() => setView("summary")}>
            <CheckCircle2 className="w-4 h-4 mr-2" />Finalize Grade
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-muted/20">
        <div className="max-w-4xl mx-auto p-6">
          <AnimatePresence mode="wait">
            {view === "questions" ? (
              <motion.div 
                key="questions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Progress Indicators */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIdx(i)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center relative ${
                        i === currentIdx 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" 
                          : checkedQuestions[i]
                          ? "bg-success/20 text-success border border-success/30"
                          : "bg-card text-muted-foreground border border-border"
                      }`}
                    >
                      {i + 1}
                      {checkedQuestions[i] && (
                        <div className="absolute -top-1 -right-1 bg-success text-white rounded-full p-0.5 border-2 border-background">
                          <CheckCircle2 className="w-2 h-2" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Question Display */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Question {currentIdx + 1}</span>
                      <h3 className="text-xl font-bold font-[var(--font-heading)] leading-tight">
                        {currentQ?.text || "General Submission Content"}
                      </h3>
                    </div>
                    <div className="bg-muted px-3 py-1 rounded-lg text-xs font-bold">
                      {currentQ?.points || 0} Points
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Student's Answer */}
                    <div className="relative">
                      <div className="absolute -left-10 top-0 hidden lg:block">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User className="w-4 h-4" />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Text Answer */}
                        <div className="bg-background rounded-2xl border border-border p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] relative overflow-hidden">
                          {/* Notebook lines for theory */}
                          <div className="absolute inset-0 pointer-events-none">
                            {Array.from({ length: 15 }).map((_, i) => (
                              <div key={i} className="border-b border-primary/5" style={{ height: "1.75rem", marginTop: i === 0 ? "1rem" : 0 }} />
                            ))}
                            <div className="absolute top-0 left-10 bottom-0 w-px bg-red-200/20" />
                          </div>
                          <div className="relative z-10 pl-8 font-[Georgia,serif] text-base leading-7 whitespace-pre-wrap">
                            {currentAns?.text || "No written answer provided."}
                          </div>
                          
                          {/* Red Pen Markings */}
                          {checkedQuestions[currentIdx] && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 2, rotate: -20 }}
                              animate={{ opacity: 1, scale: 1, rotate: -15 }}
                              className="absolute top-4 right-10 z-20 pointer-events-none"
                            >
                              <div className="border-4 border-destructive/60 text-destructive/60 font-black text-3xl px-4 py-1 rounded-xl uppercase tracking-tighter mix-blend-multiply opacity-80">
                                Checked ✓
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Special Block (Code/Math/etc) */}
                        {currentAns?.blockCode && (
                          <div className="mt-4">
                             <p className="text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-wide">Technical Content Block</p>
                             <div className="pointer-events-none opacity-90">
                               <SpecialAnswerBlock 
                                 blockType={currentAns.blockType || "code"} 
                                 blockCode={currentAns.blockCode} 
                                 onTypeChange={() => {}} 
                                 onCodeChange={() => {}} 
                               />
                             </div>
                          </div>
                        )}

                        {/* Images */}
                        {currentAns?.imageUrls && currentAns.imageUrls.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {currentAns.imageUrls.map((url, i) => (
                              <div key={i} className="rounded-2xl overflow-hidden border border-border aspect-video group cursor-zoom-in">
                                <img src={url} alt={`Diagram ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question Actions */}
                <div className="flex items-center justify-between bg-card border border-border p-4 rounded-[2rem] shadow-sm">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant={checkedQuestions[currentIdx] ? "success" : "outline"}
                      className="rounded-xl h-12 px-6 font-bold transition-all"
                      onClick={() => toggleChecked(currentIdx)}
                    >
                      <PenTool className="w-4 h-4 mr-2" />
                      {checkedQuestions[currentIdx] ? "Marked as Checked" : "Mark as Checked"}
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 w-12 rounded-xl p-0" onClick={goPrev} disabled={currentIdx === 0}>
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div className="text-sm font-bold text-muted-foreground px-4">
                      {currentIdx + 1} / {totalSteps}
                    </div>
                    <Button variant="hero" className="h-12 px-8 rounded-xl font-bold" onClick={goNext}>
                      {currentIdx < totalSteps - 1 ? "Next Question" : "View Summary"}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto space-y-6"
              >
                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold font-[var(--font-heading)]">Final Assessment</h2>
                    <p className="text-sm text-muted-foreground">Submit the final grade and feedback for {submission.studentName}.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Marks Obtained (Max: {assignment.maxMarks})</label>
                      <input 
                        type="number" 
                        max={assignment.maxMarks}
                        value={marks} 
                        onChange={(e) => setMarks(e.target.value)} 
                        className="w-full h-12 px-4 rounded-2xl border border-input bg-background font-bold text-lg focus:ring-2 focus:ring-primary" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Letter Grade</label>
                      <select 
                        value={grade} 
                        onChange={(e) => setGrade(e.target.value)} 
                        className="w-full h-12 px-4 rounded-2xl border border-input bg-background font-bold focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select Grade</option>
                        <option value="A+">A+ (Outstanding)</option>
                        <option value="A">A (Excellent)</option>
                        <option value="B">B (Good)</option>
                        <option value="C">C (Satisfactory)</option>
                        <option value="D">D (Pass)</option>
                        <option value="F">F (Fail)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Instructor Feedback</label>
                    <textarea 
                      value={feedback} 
                      onChange={(e) => setFeedback(e.target.value)} 
                      placeholder="Enter detailed feedback here..."
                      className="w-full h-32 p-4 rounded-2xl border border-input bg-background resize-none focus:ring-2 focus:ring-primary font-medium"
                    />
                  </div>

                  <div className="pt-4 flex flex-col gap-3">
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20 font-bold"
                      onClick={() => onGrade(parseInt(marks) || 0, grade, feedback, "graded")}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting Grade..." : "Finish Grading & Notify Student"}
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="h-12 rounded-2xl border-destructive/20 text-destructive hover:bg-destructive/10"
                        onClick={() => onGrade(0, "", feedback, "returned")}
                        disabled={isSubmitting}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Ask to Write Again
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-12 rounded-2xl"
                        onClick={() => setView("questions")}
                      >
                        Back to Questions
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-warning/10 border border-warning/30 rounded-2xl p-4 flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <p className="text-xs text-warning-foreground font-medium leading-relaxed">
                    By submitting the grade, the student will receive a real-time notification and an automated email containing their marks, grade, and feedback. If you choose "Ask to Write Again", the status will be changed to "Returned" and the student will be notified to resubmit.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Navigation (only in question view) */}
      {view === "questions" && (
        <div className="border-t border-border px-6 py-4 bg-card/50 backdrop-blur flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
             <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> Green = Answered</span>
             <span className="flex items-center gap-1.5"><PenTool className="w-3.5 h-3.5 text-destructive" /> Red Pen = Manual Check</span>
          </div>
          <div>Shortcut: Next Question (Enter) • Summary (End)</div>
        </div>
      )}
    </motion.div>
  );
}
