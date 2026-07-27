import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  X, ChevronLeft, ChevronRight, Eye, Image as ImageIcon,
  Trash2, Brain, ZoomIn, FileText, Send, RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiScoreBar, detectAI } from "./AiScoreBar";
import { AnswerToolbar } from "./AnswerToolbar";
import { SpecialAnswerBlock, type AnswerBlockType } from "./SpecialAnswerBlock";
import type { Assignment } from "@/firebase/firestoreService";

export interface QuestionAnswer {
  text: string;
  images: Array<{ file: File; preview: string; name: string }>;
  blockType?: AnswerBlockType;
  blockCode?: string;
}

export interface WizardState {
  assignment: Assignment;
  answers: Record<number, QuestionAnswer>;
  currentIdx: number;
  phase: "answer" | "review" | "receipt";
  isGroup: boolean;
  groupMembers: string;
  receiptData?: {
    id: string;
    timestamp: string;
    totalAnswers: number;
    totalImages: number;
  };
}

interface Props {
  flow: WizardState;
  isSubmitting: boolean;
  onUpdate: (flow: WizardState) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function SubmissionWizard({ flow, isSubmitting, onUpdate, onClose, onSubmit }: Props) {
  const [aiResults, setAiResults] = useState<Record<number, { score: number; flags: string[] }>>({});
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [pendingImgIdx, setPendingImgIdx] = useState<number | null>(null);
  const [answerError, setAnswerError] = useState<string | null>(null);
  const [shakeFooter, setShakeFooter] = useState(false);

  const questions = flow.assignment.questions || [];
  const hasQuestions = questions.length > 0;
  const totalSteps = hasQuestions ? questions.length : 1;
  const curIdx = flow.currentIdx;
  const ansKey = hasQuestions ? curIdx : -1;
  const curAnswer = flow.answers[ansKey] || { text: "", images: [] };
  const progress = hasQuestions ? Math.round((curIdx + 1) / totalSteps * 100) : 100;

  const setAnswer = (key: number, patch: Partial<QuestionAnswer>) => {
    onUpdate({
      ...flow,
      answers: {
        ...flow.answers,
        [key]: { ...flow.answers[key], ...patch }
      }
    });
  };

  const addImage = (file: File) => {
    const key = hasQuestions ? curIdx : -1;
    const preview = URL.createObjectURL(file);
    const existing = flow.answers[key]?.images || [];
    setAnswer(key, { images: [...existing, { file, preview, name: file.name }] });
  };

  const removeImage = (key: number, i: number) => {
    const imgs = [...(flow.answers[key]?.images || [])];
    URL.revokeObjectURL(imgs[i].preview);
    imgs.splice(i, 1);
    setAnswer(key, { images: imgs });
  };

  const runAI = (key: number) => {
    const text = flow.answers[key]?.text || "";
    setAiResults(p => ({ ...p, [key]: detectAI(text) }));
  };

  const isAnswered = (key: number) => {
    const ans = flow.answers[key];
    return (
      (ans?.text?.trim().length || 0) > 0 ||
      (ans?.images?.length || 0) > 0 ||
      (ans?.blockCode?.trim().length || 0) > 0
    );
  };

  const triggerShake = (msg: string) => {
    setAnswerError(msg);
    setShakeFooter(true);
    setTimeout(() => setShakeFooter(false), 600);
  };

  const goNext = () => {
    const key = hasQuestions ? curIdx : -1;
    if (!isAnswered(key)) {
      const qNum = hasQuestions ? `Question ${curIdx + 1}` : "this question";
      triggerShake(`Please answer ${qNum} before moving forward.`);
      return;
    }
    setAnswerError(null);
    if (curIdx < totalSteps - 1) onUpdate({ ...flow, currentIdx: curIdx + 1 });
    else onUpdate({ ...flow, phase: "review" });
  };

  const goReview = () => {
    const key = hasQuestions ? curIdx : -1;
    if (!isAnswered(key)) {
      const qNum = hasQuestions ? `Question ${curIdx + 1}` : "this question";
      triggerShake(`Please answer ${qNum} before reviewing.`);
      return;
    }
    setAnswerError(null);
    onUpdate({ ...flow, phase: "review" });
  };

  const goPrev = () => {
    setAnswerError(null);
    if (curIdx > 0) onUpdate({ ...flow, currentIdx: curIdx - 1 });
  };

  const jumpTo = (i: number) => { setAnswerError(null); onUpdate({ ...flow, currentIdx: i, phase: "answer" }); };

  const wordCount = (text: string) => text.trim() ? text.trim().split(/\s+/).length : 0;

  /* ── RECEIPT ─────────────────────────────────────── */
  if (flow.phase === "receipt" && flow.receiptData) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
        <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} className="bg-card w-full max-w-md rounded-3xl shadow-2xl border-2 border-success/30 p-8 text-center">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center text-white text-xl shadow-lg">✓</div>
          </div>
          <h2 className="text-2xl font-bold mb-1">Submission Successful!</h2>
          <p className="text-sm text-muted-foreground mb-6">Your assignment has been recorded.</p>
          <div className="bg-muted/50 rounded-2xl p-5 text-left space-y-2.5 mb-6 border border-border text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Receipt ID</span><span className="font-mono">{flow.receiptData.id.slice(0, 14)}...</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Assignment</span><span className="font-medium">{flow.assignment.title}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Answers</span><span className="font-medium">{flow.receiptData.totalAnswers} submitted</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Images</span><span className="font-medium">{flow.receiptData.totalImages} attached</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date & Time</span><span className="font-medium">{flow.receiptData.timestamp}</span></div>
          </div>
          <Button variant="hero" className="w-full h-12 rounded-2xl" onClick={onClose}>Got it, Close</Button>
        </motion.div>
      </motion.div>
    );
  }

  /* ── REVIEW ──────────────────────────────────────── */
  if (flow.phase === "review") {
    const allKeys = hasQuestions ? questions.map((_, i) => i) : [-1];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl">
        <div className="border-b border-border px-6 py-4 flex items-center gap-4 bg-card/80">
          <button onClick={() => onUpdate({ ...flow, phase: "answer", currentIdx: hasQuestions ? questions.length - 1 : -1 })} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-base font-bold">Review Your Answers</h2>
            <p className="text-xs text-muted-foreground">{flow.assignment.title} • {flow.assignment.subject}</p>
          </div>
          <Button variant="hero" className="h-10 px-6 rounded-2xl shadow-lg shadow-primary/20" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />Submitting...</> : <><Send className="w-4 h-4 mr-2" />Final Submit</>}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full space-y-5">
          {allKeys.map((key) => {
            const q = hasQuestions ? questions[key] : null;
            const ans = flow.answers[key];
            const ai = aiResults[key];
            return (
              <div key={key} className="bg-card border border-border rounded-2xl p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {q ? (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{key + 1}</span>
                          <span className="text-xs text-muted-foreground">{q.points} pts • {q.type}</span>
                          {ai && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ai.score < 30 ? "bg-emerald-100 text-emerald-700" : ai.score < 65 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>AI: {ai.score}%</span>}
                        </div>
                        <p className="text-sm font-medium">{q.text}</p>
                      </>
                    ) : (
                      <p className="text-sm font-semibold text-muted-foreground">General Submission</p>
                    )}
                  </div>
                  <button onClick={() => jumpTo(key === -1 ? 0 : key)} className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0">
                    <RotateCcw className="w-3 h-3" />Edit
                  </button>
                </div>
                {ans?.text ? (
                  <div className="bg-muted/40 rounded-xl p-3 text-sm leading-relaxed whitespace-pre-wrap border border-border/50 max-h-40 overflow-y-auto">{ans.text}</div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No text answer provided</p>
                )}
                {ans?.images?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {ans.images.map((img, ii) => (
                      <img key={ii} src={img.preview} alt={img.name} className="w-16 h-16 object-cover rounded-xl border border-border cursor-pointer hover:opacity-80" onClick={() => setLightboxSrc(img.preview)} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {lightboxSrc && (
          <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4" onClick={() => setLightboxSrc(null)}>
            <img src={lightboxSrc} className="max-w-full max-h-full rounded-2xl" alt="preview" />
          </div>
        )}
      </motion.div>
    );
  }

  /* ── ANSWER EDITOR ──────────────────────────────── */
  const currentQ = hasQuestions ? questions[curIdx] : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border px-4 sm:px-6 py-3 flex items-center gap-3 bg-card/90 backdrop-blur shrink-0">
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors shrink-0"><X className="w-5 h-5" /></button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-bold truncate">{flow.assignment.title}</span>
            <span className="hidden sm:inline text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full shrink-0">{flow.assignment.subject}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full" animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 80 }} />
            </div>
            {hasQuestions && <span className="text-xs text-muted-foreground shrink-0 font-medium">Q{curIdx + 1}/{totalSteps}</span>}
          </div>
        </div>
        <Button variant="outline" size="sm" className="shrink-0 h-8 text-xs" onClick={goReview}>
          <Eye className="w-3 h-3 mr-1" />Review
        </Button>
      </div>

      {/* Question Map (dots) */}
      {hasQuestions && (
        <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-border bg-muted/30 overflow-x-auto">
          {questions.map((_, i) => {
            const answered = isAnswered(i);
            return (
              <button key={i} onClick={() => jumpTo(i)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all shrink-0 ${i === curIdx ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-110" : answered ? "bg-success/20 text-success border border-success/30" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                {i + 1}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">

          {/* Question */}
          {currentQ ? (
            <div className="bg-gradient-to-br from-primary/5 to-violet-500/5 border border-primary/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-xl bg-primary text-primary-foreground text-xs font-black flex items-center justify-center shadow-sm">Q{curIdx + 1}</span>
                <span className="text-xs text-muted-foreground font-medium">{currentQ.points} points • {currentQ.type === "mcq" ? "Multiple Choice" : currentQ.type === "file" ? "File Upload" : "Written Answer"}</span>
              </div>
              <p className="text-base font-semibold leading-relaxed">{currentQ.text}</p>
            </div>
          ) : (
            <div className="bg-muted/30 border border-border rounded-2xl p-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold">General Submission</p>
                <p className="text-xs text-muted-foreground">Write your answer, notes, or attach supporting files below</p>
              </div>
            </div>
          )}

          {/* MCQ Options */}
          {currentQ?.type === "mcq" && currentQ.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentQ.options.map((opt, oi) => (
                <button key={oi} onClick={() => setAnswer(ansKey, { text: opt })}
                  className={`p-3.5 text-left text-sm rounded-2xl border-2 transition-all font-medium ${curAnswer.text === opt ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/20" : "border-border hover:border-primary/40 hover:bg-muted"}`}>
                  <span className="w-5 h-5 rounded-lg bg-muted inline-flex items-center justify-center text-xs font-bold mr-2">{String.fromCharCode(65 + oi)}</span>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Text Answer — Notebook Style with Toolbar */}
          {(!currentQ || currentQ.type === "text") && (
            <div className="space-y-0">
              <AnswerToolbar
                textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
                value={curAnswer.text}
                onChange={text => setAnswer(ansKey, { text })}
              />
              <div className="relative">
                <div className="absolute inset-0 pointer-events-none rounded-b-2xl overflow-hidden">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="border-b border-primary/5" style={{ height: "1.75rem", marginTop: i === 0 ? "1rem" : 0 }} />
                  ))}
                  <div className="absolute top-0 left-14 bottom-0 w-px bg-red-200/40" />
                </div>
                <textarea
                  ref={textareaRef}
                  value={curAnswer.text}
                  onChange={e => setAnswer(ansKey, { text: e.target.value })}
                  placeholder="Write your answer here... You can type, paste, bold, highlight, and format freely."
                  className="relative w-full min-h-[22rem] p-4 pl-16 pt-4 rounded-b-2xl border border-input border-t-0 bg-white dark:bg-card text-sm leading-7 focus:ring-2 focus:ring-primary outline-none transition-all resize-y font-[Georgia,serif]"
                  style={{ lineHeight: "1.75rem" }}
                />
                <div className="absolute bottom-3 right-4 text-[10px] text-muted-foreground bg-background/80 px-2 py-0.5 rounded-lg">
                  {wordCount(curAnswer.text)} words
                </div>
              </div>

              {/* Department-specific Special Block */}
              <div className="pt-3">
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Optional: Add Special Content Block</p>
                <SpecialAnswerBlock
                  blockType={curAnswer.blockType || "none"}
                  blockCode={curAnswer.blockCode || ""}
                  onTypeChange={t => setAnswer(ansKey, { blockType: t, blockCode: "" })}
                  onCodeChange={c => setAnswer(ansKey, { blockCode: c })}
                />
              </div>
            </div>
          )}

          {/* Image Attachments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                Diagrams & Images
                {curAnswer.images.length > 0 && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{curAnswer.images.length}</span>}
              </h4>
              <button
                onClick={() => { setPendingImgIdx(ansKey); imgInputRef.current?.click(); }}
                className="flex items-center gap-1.5 text-xs text-primary hover:bg-primary/10 px-3 py-1.5 rounded-xl transition-colors font-medium border border-primary/20">
                <ImageIcon className="w-3.5 h-3.5" />Add Image
              </button>
            </div>

            {curAnswer.images.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {curAnswer.images.map((img, ii) => (
                  <div key={ii} className="relative group rounded-2xl overflow-hidden border border-border aspect-square bg-muted">
                    <img src={img.preview} alt={img.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button onClick={() => setLightboxSrc(img.preview)} className="p-1.5 bg-white/90 rounded-full"><ZoomIn className="w-3.5 h-3.5 text-foreground" /></button>
                      <button onClick={() => removeImage(ansKey, ii)} className="p-1.5 bg-white/90 rounded-full"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/50 text-white text-[9px] truncate">{img.name}</div>
                  </div>
                ))}
                <button onClick={() => { setPendingImgIdx(ansKey); imgInputRef.current?.click(); }}
                  className="aspect-square rounded-2xl border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary">
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Add More</span>
                </button>
              </div>
            ) : (
              <button onClick={() => { setPendingImgIdx(ansKey); imgInputRef.current?.click(); }}
                className="w-full h-20 rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-3 text-muted-foreground hover:text-primary">
                <ImageIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Add diagram, flowchart, or screenshot (JPG, PNG)</span>
              </button>
            )}
          </div>

          {/* AI Checker */}
          {(!currentQ || currentQ.type === "text") && (
            <div className="space-y-3">
              {aiResults[ansKey] ? (
                <AiScoreBar score={aiResults[ansKey].score} flags={aiResults[ansKey].flags} onDismiss={() => setAiResults(p => { const n = { ...p }; delete n[ansKey]; return n; })} />
              ) : (
                <button onClick={() => runAI(ansKey)}
                  disabled={!curAnswer.text.trim()}
                  className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary border border-border hover:border-primary/40 px-4 py-2.5 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed w-full justify-center">
                  <Brain className="w-4 h-4" />Check AI Content Score
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div
        className={`border-t border-border px-4 sm:px-6 py-3 flex flex-col gap-2 bg-card/90 backdrop-blur shrink-0 transition-all ${shakeFooter ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
        style={shakeFooter ? { animation: "shake 0.4s ease-in-out" } : {}}
      >
        {/* Error message */}
        {answerError && (
          <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-xl text-xs text-destructive font-medium">
            <span className="text-base">⚠️</span>
            {answerError}
          </div>
        )}
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 px-5 rounded-2xl" onClick={goPrev} disabled={!hasQuestions || curIdx === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" />Previous
          </Button>
          <div className="flex-1 text-center text-xs text-muted-foreground">
            {hasQuestions ? `Question ${curIdx + 1} of ${totalSteps}` : "General Submission"}
          </div>
          {hasQuestions && curIdx < totalSteps - 1 ? (
            <Button variant="hero" className="h-11 px-6 rounded-2xl" onClick={goNext}>
              Next<ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button variant="hero" className="h-11 px-6 rounded-2xl" onClick={goReview}>
              <Eye className="w-4 h-4 mr-1" />Review & Submit
            </Button>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input ref={imgInputRef} type="file" accept=".jpg,.jpeg,.png,.gif,.webp,.bmp" className="hidden"
        onChange={e => {
          const f = e.target.files?.[0];
          if (f && pendingImgIdx !== null) addImage(f);
          if (imgInputRef.current) imgInputRef.current.value = "";
          setPendingImgIdx(null);
        }} />

      {/* Lightbox */}
      {lightboxSrc && (
        <div className="fixed inset-0 z-[60] bg-black/85 flex items-center justify-center p-4" onClick={() => setLightboxSrc(null)}>
          <img src={lightboxSrc} className="max-w-full max-h-full rounded-2xl shadow-2xl" alt="preview" />
          <button className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30"><X className="w-5 h-5 text-white" /></button>
        </div>
      )}
    </motion.div>
  );
}
