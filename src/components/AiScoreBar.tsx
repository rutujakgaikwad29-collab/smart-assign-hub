import { motion } from "framer-motion";
import { Brain, AlertCircle, CheckCircle2 } from "lucide-react";

const AI_PHRASES = [
  "as an ai", "certainly!", "it's worth noting", "in conclusion,",
  "firstly,", "secondly,", "thirdly,", "moreover,", "furthermore,",
  "in summary,", "to summarize,", "it is important to note",
  "i'd be happy to", "delve into", "dive into", "leverage",
  "utilize", "facilitate", "paradigm", "nuanced", "robust",
  "seamless", "holistic", "synergy", "cutting-edge", "comprehensive",
  "it's crucial", "it's essential", "notably,", "additionally,",
  "this ensures", "it can be", "one can argue",
];

export function detectAI(text: string): { score: number; flags: string[] } {
  if (!text || text.trim().length < 40) return { score: 0, flags: [] };
  const lower = text.toLowerCase();
  const flags: string[] = [];
  let score = 0;

  for (const phrase of AI_PHRASES) {
    if (lower.includes(phrase)) {
      if (!flags.includes(phrase)) flags.push(phrase);
      score += 7;
    }
  }

  // Overly long sentences (AI tends to write long ones)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const avgLen = sentences.reduce((a, s) => a + s.trim().split(" ").length, 0) / (sentences.length || 1);
  if (avgLen > 25) score += 12;
  if (avgLen > 35) score += 10;

  // Comma overuse (AI lists)
  const commaRatio = (text.match(/,/g) || []).length / (text.split(" ").length || 1);
  if (commaRatio > 0.12) score += 8;

  // Penalise very short text
  if (text.length < 80) score = Math.max(0, score - 25);

  return { score: Math.min(100, Math.round(score)), flags: flags.slice(0, 6) };
}

interface AiScoreBarProps {
  score: number;
  flags: string[];
  onDismiss?: () => void;
}

export function AiScoreBar({ score, flags, onDismiss }: AiScoreBarProps) {
  const isLow = score < 30;
  const isMid = score >= 30 && score < 65;
  const isHigh = score >= 65;

  const color = isLow
    ? "from-emerald-500 to-green-400"
    : isMid
    ? "from-amber-500 to-yellow-400"
    : "from-red-500 to-rose-400";

  const label = isLow ? "Looks Human-Written ✓" : isMid ? "Possibly AI-Assisted" : "High AI Content Detected";
  const textColor = isLow ? "text-emerald-600" : isMid ? "text-amber-600" : "text-red-500";
  const bgColor = isLow ? "bg-emerald-50 border-emerald-200" : isMid ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-4 space-y-3 ${bgColor}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className={`w-4 h-4 ${textColor}`} />
          <span className={`text-xs font-bold ${textColor}`}>AI Detection</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-black ${textColor}`}>{score}%</span>
          {onDismiss && (
            <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground transition-colors">
              <AlertCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Score Bar */}
      <div className="h-2 bg-black/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <p className={`text-[11px] font-semibold ${textColor}`}>{label}</p>

      {flags.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground font-medium">Flagged phrases — edit these:</p>
          <div className="flex flex-wrap gap-1">
            {flags.map((f, i) => (
              <span key={i} className="px-2 py-0.5 bg-black/10 rounded-lg text-[10px] font-mono italic">
                "{f}"
              </span>
            ))}
          </div>
        </div>
      )}

      {isHigh && (
        <div className="flex items-start gap-2 text-[10px] text-red-600 bg-red-100 rounded-xl p-2">
          <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
          <span>Your answer may be flagged for plagiarism. Rewrite flagged phrases in your own words.</span>
        </div>
      )}
      {isLow && (
        <div className="flex items-center gap-2 text-[10px] text-emerald-600">
          <CheckCircle2 className="w-3 h-3 shrink-0" />
          <span>Great! Your answer appears original and human-written.</span>
        </div>
      )}
    </motion.div>
  );
}
