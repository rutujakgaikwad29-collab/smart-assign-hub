import { useRef } from "react";
import {
  Bold, Italic, Underline, Highlighter, List, ListOrdered,
  Table, Minus, Quote
} from "lucide-react";

interface Props {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (val: string) => void;
}

function wrap(
  ta: HTMLTextAreaElement,
  value: string,
  before: string,
  after: string,
  onChange: (v: string) => void
) {
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const selected = value.slice(start, end) || "text";
  const next = value.slice(0, start) + before + selected + after + value.slice(end);
  onChange(next);
  setTimeout(() => {
    ta.focus();
    ta.setSelectionRange(start + before.length, start + before.length + selected.length);
  }, 0);
}

function insertAtCursor(
  ta: HTMLTextAreaElement,
  value: string,
  text: string,
  onChange: (v: string) => void
) {
  const pos = ta.selectionStart;
  const next = value.slice(0, pos) + text + value.slice(pos);
  onChange(next);
  setTimeout(() => { ta.focus(); ta.setSelectionRange(pos + text.length, pos + text.length); }, 0);
}

const TABLE_TEMPLATE = `\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n`;

export function AnswerToolbar({ textareaRef, value, onChange }: Props) {
  const ta = () => textareaRef.current!;

  const tools = [
    { icon: <Bold className="w-3.5 h-3.5" />, title: "Bold", action: () => wrap(ta(), value, "**", "**", onChange) },
    { icon: <Italic className="w-3.5 h-3.5" />, title: "Italic", action: () => wrap(ta(), value, "_", "_", onChange) },
    { icon: <Underline className="w-3.5 h-3.5" />, title: "Underline", action: () => wrap(ta(), value, "<u>", "</u>", onChange) },
    { icon: <Highlighter className="w-3.5 h-3.5" />, title: "Highlight", action: () => wrap(ta(), value, "==", "==", onChange) },
    null,
    { icon: <List className="w-3.5 h-3.5" />, title: "Bullet List", action: () => insertAtCursor(ta(), value, "\n• ", onChange) },
    { icon: <ListOrdered className="w-3.5 h-3.5" />, title: "Numbered List", action: () => insertAtCursor(ta(), value, "\n1. ", onChange) },
    { icon: <Quote className="w-3.5 h-3.5" />, title: "Quote", action: () => wrap(ta(), value, "\n> ", "\n", onChange) },
    null,
    { icon: <Table className="w-3.5 h-3.5" />, title: "Insert Table", action: () => insertAtCursor(ta(), value, TABLE_TEMPLATE, onChange) },
    { icon: <Minus className="w-3.5 h-3.5" />, title: "Divider", action: () => insertAtCursor(ta(), value, "\n---\n", onChange) },
  ];

  return (
    <div className="flex items-center gap-0.5 px-2 py-1.5 bg-muted/60 border border-border border-b-0 rounded-t-2xl flex-wrap">
      {tools.map((t, i) =>
        t === null ? (
          <div key={i} className="w-px h-4 bg-border mx-1" />
        ) : (
          <button
            key={i}
            type="button"
            title={t.title}
            onClick={t.action}
            className="p-1.5 rounded-lg hover:bg-background hover:shadow-sm transition-all text-muted-foreground hover:text-foreground"
          >
            {t.icon}
          </button>
        )
      )}
      <span className="ml-auto text-[10px] text-muted-foreground pr-1 font-medium">Formatting toolbar</span>
    </div>
  );
}
