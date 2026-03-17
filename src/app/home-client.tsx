"use client";

import { useState, useEffect, useRef } from "react";

// ─── Data ───────────────────────────────────────

const SETUP_LINES: { prompt: boolean; text: string }[] = [
  { prompt: true, text: "npm install" },
  { prompt: false, text: "added 624 packages in 16s" },
  { prompt: true, text: "docker compose up -d" },
  { prompt: false, text: "✔ Container postgres-1  Started" },
  { prompt: true, text: "cp .env.sample .env" },
  { prompt: true, text: "npm run db:migrate" },
  { prompt: false, text: "✔ Migration applied successfully" },
  { prompt: true, text: "npm run dev" },
  { prompt: false, text: "▲ Ready on http://localhost:3000" },
];

const FEATURES = [
  {
    title: "Claude Code Skills",
    items: ["/tdd", "/add-field", "/db-migrate"],
    note: ".claude/skills/",
  },
  {
    title: "Spec-First + TDD",
    items: ["docs/specs/", "openapi.yaml", "Vitest + MSW"],
    note: "仕様が真実",
  },
  {
    title: "全部入り",
    items: ["Prisma + PostgreSQL", "Auth.js", "shadcn/ui"],
    note: "認証・DB・UI 設定済",
  },
];

// ─── Typing hook ────────────────────────────────

// Phases:
//   typing  — prompt行を1文字ずつタイプ中
//   wait    — タイプ完了、出力行の表示待ち or 次のコマンド待ち
//   output  — 出力行を表示したところ、次へ進む待ち
//   done    — 全行完了、カーソル点滅
type Phase =
  | { stage: "typing"; lineIdx: number; charIdx: number }
  | { stage: "wait"; lineIdx: number }
  | { stage: "output"; lineIdx: number }
  | { stage: "done" };

function useTerminalAnimation(lines: typeof SETUP_LINES) {
  const [phase, setPhase] = useState<Phase>({ stage: "typing", lineIdx: 0, charIdx: 0 });
  const [rendered, setRendered] = useState<{ prompt: boolean; text: string }[]>([]);

  useEffect(() => {
    if (phase.stage === "done") return;

    if (phase.stage === "typing") {
      const line = lines[phase.lineIdx];
      if (!line) {
        const t = setTimeout(() => setPhase({ stage: "done" }), 0);
        return () => clearTimeout(t);
      }
      // prompt行を1文字ずつタイプ
      if (phase.charIdx <= line.text.length) {
        const delay = phase.charIdx === 0 ? 300 : 30 + Math.random() * 40;
        const t = setTimeout(() => {
          setPhase({ stage: "typing", lineIdx: phase.lineIdx, charIdx: phase.charIdx + 1 });
        }, delay);
        return () => clearTimeout(t);
      }
      // タイプ完了 → rendered に追加して wait へ
      const t = setTimeout(() => {
        setRendered((r) => [...r, { prompt: true, text: line.text }]);
        setPhase({ stage: "wait", lineIdx: phase.lineIdx });
      }, 0);
      return () => clearTimeout(t);
    }

    if (phase.stage === "wait") {
      const nextIdx = phase.lineIdx + 1;
      const nextLine = lines[nextIdx];
      if (nextLine && !nextLine.prompt) {
        // 次が出力行 → 少し待ってから表示
        const t = setTimeout(() => {
          setRendered((r) => [...r, { prompt: false, text: nextLine.text }]);
          setPhase({ stage: "output", lineIdx: nextIdx });
        }, 400);
        return () => clearTimeout(t);
      }
      // 次がコマンド行 or 終了 → 少し待ってタイプ開始
      const t = setTimeout(() => {
        if (!nextLine) {
          setPhase({ stage: "done" });
        } else {
          setPhase({ stage: "typing", lineIdx: nextIdx, charIdx: 0 });
        }
      }, 500);
      return () => clearTimeout(t);
    }

    if (phase.stage === "output") {
      // 出力表示後 → 次の行へ
      const nextIdx = phase.lineIdx + 1;
      const nextLine = lines[nextIdx];
      const t = setTimeout(() => {
        if (!nextLine) {
          setPhase({ stage: "done" });
        } else {
          setPhase({ stage: "typing", lineIdx: nextIdx, charIdx: 0 });
        }
      }, 500);
      return () => clearTimeout(t);
    }
  }, [phase, lines]);

  // タイプ中のテキスト（部分表示）
  const typingText =
    phase.stage === "typing" && lines[phase.lineIdx]?.prompt
      ? lines[phase.lineIdx].text.slice(0, phase.charIdx)
      : null;

  // wait/output 中は点滅カーソルを出す
  const isWaiting = phase.stage === "wait" || phase.stage === "output";

  return { rendered, typingText, isWaiting, isDone: phase.stage === "done" };
}

// ─── Terminal ───────────────────────────────────

function Terminal() {
  const { rendered, typingText, isWaiting, isDone } = useTerminalAnimation(SETUP_LINES);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
  }, [rendered.length, typingText]);

  return (
    <div
      className="overflow-hidden rounded-2xl border border-white/8 bg-zinc-950 shadow-2xl"
      data-testid="terminal"
    >
      {/* Title bar — sticky within terminal */}
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-white/6 bg-zinc-950 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-auto text-[11px] text-white/20">zsh</span>
      </div>
      {/* Body */}
      <div className="px-5 py-4 font-mono text-[13px] leading-7">
        {/* Completed lines */}
        {rendered.map((line, i) => (
          <div key={i}>
            {line.prompt ? (
              <div>
                <span className="select-none text-emerald-400">❯ </span>
                <span className="text-white">{line.text}</span>
              </div>
            ) : (
              <div className="pl-4 text-zinc-500">{line.text}</div>
            )}
          </div>
        ))}
        {/* Currently typing line */}
        {typingText !== null && (
          <div>
            <span className="select-none text-emerald-400">❯ </span>
            <span className="text-white">{typingText}</span>
            <span className="text-white">▌</span>
          </div>
        )}
        {/* Waiting / Done cursor */}
        {typingText === null && (isWaiting || isDone) && (
          <div className="pt-0.5">
            <span className="select-none text-emerald-400">❯ </span>
            <span className="animate-blink text-white">▌</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ─── Main ───────────────────────────────────────

export function HomeClient() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 pt-[15vh] pb-12 font-sans sm:px-6">
      <main className="w-full max-w-xl space-y-8">
        {/* Hero */}
        <section className="animate-fade-in-up space-y-3 text-center">
          <h1
            className="animate-gradient bg-linear-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl"
            data-testid="project-name"
          >
            {"{{PROJECT_NAME}}"}
          </h1>
          <p className="text-foreground/50" data-testid="project-description">
            {"{{PROJECT_DESCRIPTION}}"}
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-foreground/30">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Built for Claude Code
          </p>
        </section>

        {/* Terminal */}
        <div className="animate-fade-in-up delay-200">
          <Terminal />
        </div>

        {/* Features — 3 columns */}
        <div className="animate-fade-in-up delay-400 grid grid-cols-3 gap-3" data-testid="features">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="space-y-2 rounded-xl border border-foreground/8 p-3.5"
            >
              <div className="text-xs font-semibold text-foreground">{f.title}</div>
              <ul className="space-y-1">
                {f.items.map((item) => (
                  <li key={item} className="text-[11px] text-foreground/40">
                    {item}
                  </li>
                ))}
              </ul>
              <div className="text-[10px] text-foreground/20">{f.note}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="animate-fade-in-up delay-500 text-center text-[11px] text-foreground/25">
          <code className="text-foreground/40">src/app/page.tsx</code> を編集して始めましょう
        </footer>
      </main>
    </div>
  );
}
