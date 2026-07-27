import { useState, useRef, useEffect } from "react";
import { Code2, BarChart3, Calculator, Cpu, Wrench, Leaf, ChevronDown, Grid3x3 } from "lucide-react";

export type AnswerBlockType =
  | "none" | "code" | "pseudocode" | "circuit" | "graph" | "math" | "sql" | "chemistry";

interface BlockMeta {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  dept: string;
  theme: "vscode" | "matlab" | "cad" | "math" | "sql" | "lab" | "plain";
  filename: string;
}

const BLOCKS: Record<AnswerBlockType, BlockMeta> = {
  none: { label: "None (Theory only)", icon: <span>✏️</span>, placeholder: "", dept: "All", theme: "plain", filename: "" },
  code: {
    label: "Code Block (CS / IT / AI & DS)",
    icon: <Code2 className="w-4 h-4" />,
    placeholder: "// Write your program here\nfunction solution() {\n  // Your logic\n  return result;\n}",
    dept: "CS / IT / AI",
    theme: "vscode",
    filename: "solution.js",
  },
  pseudocode: {
    label: "Algorithm / Pseudocode",
    icon: <span className="text-xs font-mono font-black">PS</span>,
    placeholder: "Algorithm: BubbleSort(A, n)\nBEGIN\n  FOR i = 0 TO n-1\n    FOR j = 0 TO n-i-2\n      IF A[j] > A[j+1] THEN\n        SWAP(A[j], A[j+1])\n      END IF\n    END FOR\n  END FOR\nEND",
    dept: "CS / IT / AI / ECE",
    theme: "plain",
    filename: "algorithm.txt",
  },
  sql: {
    label: "SQL / Database Query",
    icon: <span className="text-xs font-mono font-black">SQL</span>,
    placeholder: "-- Write your SQL query here\nSELECT s.name, s.roll_no, AVG(m.marks) AS avg_marks\nFROM students s\nINNER JOIN marks m ON s.id = m.student_id\nWHERE s.department = 'CS'\nGROUP BY s.id\nHAVING avg_marks > 60\nORDER BY avg_marks DESC;",
    dept: "CS / IT",
    theme: "sql",
    filename: "query.sql",
  },
  circuit: {
    label: "Circuit / MATLAB / Signal Analysis (ECE / E&TC)",
    icon: <Cpu className="w-4 h-4" />,
    placeholder: "% MATLAB / Circuit Analysis\n% ----------------------------\nclc; clear all;\n\n% Define component values\nR = 1000;    % Resistance in Ohms\nC = 1e-6;    % Capacitance in Farads\nL = 0.01;    % Inductance in Henry\n\n% Transfer function\nnum = [1];\nden = [L*C, R*C, 1];\nsys = tf(num, den);\n\n% Frequency response\nbode(sys); grid on;\ntitle('Bode Plot - RLC Circuit');",
    dept: "ECE / E&TC",
    theme: "matlab",
    filename: "circuit_analysis.m",
  },
  graph: {
    label: "Civil / Mechanical — Calculation & Design",
    icon: <Grid3x3 className="w-4 h-4" />,
    placeholder: "DESIGN CALCULATION SHEET\n================================\nProject  : Beam Design\nSubject  : Structural Analysis\nDate     : ___________\n\nGIVEN DATA:\n  Span (L)         = ___ m\n  Load (W)         = ___ kN/m\n  Grade of Concrete = M___\n  Grade of Steel    = Fe___\n\nSTEP 1 — Bending Moment:\n  M_max = wL²/8\n        = ___ × ___² / 8\n        = ___ kN·m\n\nSTEP 2 — Shear Force:\n  V_max = wL/2\n        = ___ kN\n\nSTEP 3 — Section Design:\n  ...\n\nRESULT:\n  Adopt section: ___ × ___ mm",
    dept: "Civil / Mech",
    theme: "cad",
    filename: "design_calc.dwg",
  },
  math: {
    label: "Mathematical Derivation / Proof",
    icon: <Calculator className="w-4 h-4" />,
    placeholder: "Theorem / Derivation\n====================\n\nStatement:\n  [Write the theorem or problem statement here]\n\nGiven:\n  • f(x) = ...\n  • Boundary conditions: ...\n\nProof / Derivation:\n\n  Step 1: ...\n\n  Step 2: Differentiating both sides,\n    df/dx = ...\n\n  Step 3: Substituting values,\n    = ...\n    = ...\n\n  ∴ Result: [QED / Final Answer]\n\n∫ ∑ ∂ √ π ∞ ≈ ≠ ≤ ≥ ← → ↑ ↓ α β γ θ λ μ σ",
    dept: "All Engineering",
    theme: "math",
    filename: "derivation.tex",
  },
  chemistry: {
    label: "Chemical Equation / Lab Report",
    icon: <Leaf className="w-4 h-4" />,
    placeholder: "LAB NOTEBOOK\n============\nExperiment  : [Title]\nDate        : ___________\nAim         : To determine ...\n\nREACTION:\n  Reactants + Reactants → Products\n  [Balance the equation]\n\nOBSERVATIONS:\n  Sr.No | Observation | Inference\n  ------+-------------+----------\n    1   |             |\n    2   |             |\n\nCALCULATIONS:\n  Molecular weight = ...\n  Normality = ...\n\nRESULT:\n  The experiment confirms that ...",
    dept: "Chem / Bio",
    theme: "lab",
    filename: "lab_report.txt",
  },
};

// ── Theme Configs ────────────────────────────────────────────────────────────
const THEMES = {
  vscode: {
    outer: "border-slate-700",
    titleBar: "bg-[#1e1e2e] border-b border-slate-700",
    titleText: "text-slate-400",
    editor: "bg-[#1e1e2e]",
    textarea: "text-slate-200 bg-transparent",
    footer: "bg-[#181825] text-slate-500",
    lineNum: "text-slate-500 border-r border-slate-600",
    dots: ["bg-red-500/80", "bg-amber-500/80", "bg-green-500/80"],
    label: "VS CODE",
    labelColor: "text-blue-400",
  },
  matlab: {
    outer: "border-[#005594]",
    titleBar: "bg-[#0076a8] border-b border-[#005594]",
    titleText: "text-white",
    editor: "bg-[#0a0e1a]",
    textarea: "text-[#00ff88] bg-transparent",
    footer: "bg-[#050810] text-[#007acc]",
    lineNum: "text-[#007acc] border-r border-[#005594]",
    dots: ["bg-red-400", "bg-yellow-400", "bg-green-400"],
    label: "MATLAB",
    labelColor: "text-[#00c8ff]",
  },
  cad: {
    outer: "border-slate-600",
    titleBar: "bg-[#1a1a2e] border-b border-slate-600",
    titleText: "text-gray-300",
    editor: "bg-[#0d1117]",
    textarea: "text-gray-100 bg-transparent",
    footer: "bg-[#0a0c10] text-gray-500",
    lineNum: "text-gray-600 border-r border-slate-600",
    dots: ["bg-red-400", "bg-amber-400", "bg-blue-400"],
    label: "AUTOCAD / CIVIL",
    labelColor: "text-amber-400",
  },
  sql: {
    outer: "border-[#336791]",
    titleBar: "bg-[#336791] border-b border-[#2a5578]",
    titleText: "text-white",
    editor: "bg-[#1a1a2a]",
    textarea: "text-[#61afef] bg-transparent",
    footer: "bg-[#111120] text-[#336791]",
    lineNum: "text-[#336791] border-r border-[#2a5578]",
    dots: ["bg-red-400", "bg-yellow-400", "bg-green-400"],
    label: "PostgreSQL / MySQL",
    labelColor: "text-[#61afef]",
  },
  math: {
    outer: "border-amber-200",
    titleBar: "bg-amber-50 border-b border-amber-200",
    titleText: "text-amber-900",
    editor: "bg-[#fffef5]",
    textarea: "text-slate-800 bg-transparent",
    footer: "bg-amber-50 text-amber-700",
    lineNum: "text-amber-300 border-r border-amber-200",
    dots: ["bg-red-300", "bg-amber-300", "bg-green-300"],
    label: "MATH NOTEPAD",
    labelColor: "text-amber-700",
  },
  lab: {
    outer: "border-green-300",
    titleBar: "bg-[#f0fdf4] border-b border-green-300",
    titleText: "text-green-900",
    editor: "bg-[#fafff5]",
    textarea: "text-slate-700 bg-transparent",
    footer: "bg-[#f0fdf4] text-green-600",
    lineNum: "text-green-300 border-r border-green-200",
    dots: ["bg-red-300", "bg-amber-300", "bg-green-400"],
    label: "LAB NOTEBOOK",
    labelColor: "text-green-700",
  },
  plain: {
    outer: "border-border",
    titleBar: "bg-muted border-b border-border",
    titleText: "text-foreground",
    editor: "bg-background",
    textarea: "text-foreground bg-transparent",
    footer: "bg-muted text-muted-foreground",
    lineNum: "text-muted-foreground border-r border-border",
    dots: ["bg-red-400", "bg-amber-400", "bg-green-400"],
    label: "TEXT EDITOR",
    labelColor: "text-muted-foreground",
  },
};

interface Props {
  blockType: AnswerBlockType;
  blockCode: string;
  onTypeChange: (t: AnswerBlockType) => void;
  onCodeChange: (c: string) => void;
}

export function SpecialAnswerBlock({ blockType, blockCode, onTypeChange, onCodeChange }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const textRef = useRef<HTMLTextAreaElement>(null);
  const meta = BLOCKS[blockType];
  const theme = THEMES[meta.theme] ?? THEMES.plain;

  useEffect(() => {
    if (blockType !== "none" && !blockCode && meta.placeholder) {
      onCodeChange(meta.placeholder);
    }
  }, [blockType]);

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = Math.max(200, el.scrollHeight) + "px";
  };

  return (
    <div className="space-y-2">
      {/* Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-2xl border border-border bg-muted/30 hover:bg-muted/60 transition-all text-sm font-medium"
        >
          <span className="text-primary">{meta.icon}</span>
          <span className="flex-1 text-left">{meta.label}</span>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-lg shrink-0">{meta.dept}</span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute z-20 mt-1 w-full bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
            {(Object.entries(BLOCKS) as [AnswerBlockType, BlockMeta][]).map(([key, val]) => (
              <button
                key={key}
                type="button"
                onClick={() => { onTypeChange(key); setOpen(false); setTab("edit"); }}
                className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left hover:bg-muted transition-colors ${blockType === key ? "bg-primary/10 text-primary font-semibold" : ""}`}
              >
                <span className="text-primary w-5 flex items-center justify-center shrink-0">{val.icon}</span>
                <span className="flex-1 min-w-0">{val.label}</span>
                <span className="text-[10px] text-muted-foreground shrink-0">{val.dept}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Editor */}
      {blockType !== "none" && (
        <div className={`rounded-2xl overflow-hidden border shadow-lg ${theme.outer}`}>
          {/* Title Bar */}
          <div className={`flex items-center gap-2 px-4 py-2 ${theme.titleBar}`}>
            <div className="flex gap-1.5">
              {theme.dots.map((c, i) => <div key={i} className={`w-3 h-3 rounded-full ${c}`} />)}
            </div>
            <span className={`text-[11px] font-mono ml-2 flex-1 ${theme.titleText}`}>
              {meta.filename}
            </span>
            <span className={`text-[9px] font-black tracking-widest uppercase mr-2 ${theme.labelColor}`}>
              {theme.label}
            </span>
            <div className={`flex rounded-lg overflow-hidden border ${blockType === "math" || blockType === "lab" ? "border-current/20" : "border-slate-600"}`}>
              {(["edit", "preview"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-3 py-0.5 text-[10px] font-bold capitalize transition-colors ${
                    tab === t
                      ? blockType === "math" || blockType === "lab"
                        ? "bg-amber-200 text-amber-900"
                        : "bg-slate-600 text-white"
                      : blockType === "math" || blockType === "lab"
                        ? "text-amber-700 hover:bg-amber-100"
                        : "text-slate-400 hover:text-white"
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Editor Body */}
          <div className={`${theme.editor} p-4`}>
            {tab === "edit" ? (
              <div className="flex gap-0">
                {/* Line numbers */}
                <div className={`select-none text-right pr-3 mr-3 text-[11px] leading-5 font-mono min-w-[2.5rem] ${theme.lineNum}`}>
                  {blockCode.split("\n").map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <textarea
                  ref={textRef}
                  value={blockCode}
                  onChange={e => { onCodeChange(e.target.value); autoResize(e.target); }}
                  onKeyDown={e => {
                    if (e.key === "Tab") {
                      e.preventDefault();
                      const s = e.currentTarget.selectionStart;
                      const next = blockCode.slice(0, s) + "  " + blockCode.slice(s);
                      onCodeChange(next);
                      setTimeout(() => {
                        if (textRef.current) textRef.current.selectionStart = textRef.current.selectionEnd = s + 2;
                      }, 0);
                    }
                  }}
                  className={`flex-1 font-mono text-xs leading-5 outline-none resize-none min-h-[200px] ${theme.textarea}`}
                  style={{ tabSize: 2 }}
                  spellCheck={false}
                  placeholder={meta.placeholder}
                />
              </div>
            ) : (
              /* Preview — same as edit but read-only */
              <div className="flex gap-0">
                <div className={`select-none text-right pr-3 mr-3 text-[11px] leading-5 font-mono min-w-[2.5rem] ${theme.lineNum}`}>
                  {blockCode.split("\n").map((_, i) => <div key={i}>{i + 1}</div>)}
                </div>
                <pre className={`flex-1 font-mono text-xs leading-5 whitespace-pre-wrap break-words ${theme.textarea}`}>{blockCode}</pre>
              </div>
            )}
          </div>

          {/* Status bar */}
          <div className={`px-4 py-1.5 flex items-center justify-between text-[10px] font-mono ${theme.footer}`}>
            <span>{meta.label} • {blockCode.split("\n").length} lines • {blockCode.length} chars</span>
            <span>Tab = 2 spaces • {tab === "edit" ? "✎ Editing" : "👁 Preview"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
