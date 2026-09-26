// ═══════════════════════════════════════════════════════════════════════════════
// ProTypist / TypePulse - Pillar 2: Micro-Editing & Cursor Locomotion Sandbox
// Shortcut-Based Error Remediation & IDE Tool Autocomplete Discipline
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from 'react';
import {
  Code,
  Wrench,
  CheckCircle2,
  RotateCcw,
  Zap,
  Clock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { soundEngine } from '../lib/soundEngine';

export type MicroEditingSubMode = 'locomotion-remediation' | 'ide-discipline';

interface RemediationChallenge {
  id: string;
  title: string;
  category: 'Code Refactor' | 'Grammar Remediation' | 'Data Fixing';
  initialText: string;
  targetText: string;
  targetDescription: string;
  minOptimalKeystrokes: number;
}

const REMEDIATION_CHALLENGES: RemediationChallenge[] = [
  {
    id: 'rem-1',
    title: 'JavaScript Async/Await Refactor',
    category: 'Code Refactor',
    initialText: 'function fetchUserData(id) { const res = fetch(/api/user/ + id); return res.json(); }',
    targetText: 'async function fetchUserData(id) { const res = await fetch(`/api/user/${id}`); return await res.json(); }',
    targetDescription:
      'Add "async" before function, wrap fetch with "await", change string to template literal `/api/user/${id}`, and add "await" before res.json().',
    minOptimalKeystrokes: 22,
  },
  {
    id: 'rem-2',
    title: 'Constitutional Terminology Correction',
    category: 'Grammar Remediation',
    initialText: 'The Supreme Court of India may issue writs including habeas corpuss, mandamuss, and certiorari.',
    targetText: 'The Supreme Court of India may issue writs including habeas corpus, mandamus, and certiorari.',
    targetDescription: 'Fix typographical spelling errors in "habeas corpuss" -> "corpus" and "mandamuss" -> "mandamus".',
    minOptimalKeystrokes: 12,
  },
  {
    id: 'rem-3',
    title: 'TypeScript Interface Property Repair',
    category: 'Code Refactor',
    initialText: 'interface User { name: strng; age: num; isActive: bool; }',
    targetText: 'interface User { name: string; age: number; isActive: boolean; }',
    targetDescription: 'Fix types: "strng" -> "string", "num" -> "number", "bool" -> "boolean".',
    minOptimalKeystrokes: 16,
  },
];

const IDE_SNIPPETS = [
  {
    trigger: 'calc',
    expansion: 'const calculateGrossSpeed = (strokes: number) => strokes / 5;',
    description: 'Gross typing speed calculator',
    savedKeystrokes: 62,
  },
  {
    trigger: 'afn',
    expansion: 'async function fetchData(url: string): Promise<Response> { return await fetch(url); }',
    description: 'Async fetch function template',
    savedKeystrokes: 78,
  },
  {
    trigger: 'intf',
    expansion: 'interface UserProfile { id: string; name: string; email: string; isActive: boolean; }',
    description: 'TypeScript interface template',
    savedKeystrokes: 75,
  },
  {
    trigger: 'arr',
    expansion: 'const result = items.filter(Boolean).map(x => x.trim()).sort();',
    description: 'Filter-map-sort chain',
    savedKeystrokes: 55,
  },
  {
    trigger: 'trycatch',
    expansion: 'try { await processData(); } catch (error) { console.error("Failed:", error); throw error; }',
    description: 'Try-catch error handler',
    savedKeystrokes: 82,
  },
];

export const MicroEditingDrill: React.FC = () => {
  const [subMode, setSubMode] = useState<MicroEditingSubMode>('locomotion-remediation');

  // Remediation State
  const [challengeIdx, setChallengeIdx] = useState(0);
  const challenge = REMEDIATION_CHALLENGES[challengeIdx];
  const [editText, setEditText] = useState(challenge.initialText);
  const [keystrokesCount, setKeystrokesCount] = useState(0);
  const [locomotionCount, setLocomotionCount] = useState(0); // Ctrl+arrows, Home, End
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // IDE Tool State
  const [ideInput, setIdeInput] = useState('');
  const [ideSnippetIdx, setIdeSnippetIdx] = useState(0);
  const activeSnippet = IDE_SNIPPETS[ideSnippetIdx];
  const [ideSnippetTriggered, setIdeSnippetTriggered] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset challenge
  useEffect(() => {
    setEditText(challenge.initialText);
    setKeystrokesCount(0);
    setLocomotionCount(0);
    setStartTime(null);
    setElapsedSeconds(0);
    setIsSuccess(false);
  }, [challengeIdx]);

  // Elapsed timer
  useEffect(() => {
    if (startTime && !isSuccess) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.round((performance.now() - startTime) / 1000));
      }, 500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isSuccess]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!startTime) setStartTime(performance.now());
    soundEngine.playKeySound(e.key === ' ', e.key === 'Backspace');

    setKeystrokesCount((k) => k + 1);

    // Track navigation locomotion shortcuts
    if (
      (e.ctrlKey || e.altKey) &&
      ['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete'].includes(e.key)
    ) {
      setLocomotionCount((c) => c + 1);
    } else if (['Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) {
      setLocomotionCount((c) => c + 1);
    }
  };

  const handleKeyUp = () => {
    // Check if target is satisfied
    if (editText.trim() === challenge.targetText.trim()) {
      setIsSuccess(true);
    }
  };



  // Locomotion Efficiency Score (% optimal vs actual)
  const efficiencyScore = Math.max(
    10,
    Math.min(
      100,
      Math.round(
        (challenge.minOptimalKeystrokes / Math.max(challenge.minOptimalKeystrokes, keystrokesCount)) *
          100
      )
    )
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6 animate-fade-in select-none">
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between p-3 rounded-2xl border"
        style={{
          background: 'var(--card, #0f172a)',
          borderColor: 'color-mix(in srgb, var(--sub, #64748b) 25%, transparent)',
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-wide">
              Pillar 2: Micro-Editing and Cursor Locomotion
            </h2>
            <p className="text-xs opacity-70">
              Master non-destructive text manipulation shortcuts (`Ctrl+Arrows`, `Home/End`, `Ctrl+Del`)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-xs bg-black/30 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setSubMode('locomotion-remediation')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              subMode === 'locomotion-remediation'
                ? 'bg-sky-600 text-white shadow'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            Locomotion Remediation
          </button>
          <button
            onClick={() => setSubMode('ide-discipline')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              subMode === 'ide-discipline'
                ? 'bg-sky-600 text-white shadow'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            IDE Tool Awareness
          </button>
        </div>
      </div>

      {/* ── Sub-Mode 1: Locomotion Remediation ─────────────────────────── */}
      {subMode === 'locomotion-remediation' && (
        <div className="space-y-5">
          {/* Challenge Description Card */}
          <div
            className="p-5 rounded-2xl border space-y-3 shadow-lg"
            style={{
              background: 'color-mix(in srgb, var(--card, #0f172a) 80%, black)',
              borderColor: 'color-mix(in srgb, var(--sub, #64748b) 25%, transparent)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                CHALLENGE #{challengeIdx + 1}: {challenge.title}
              </span>
              <button
                onClick={() =>
                  setChallengeIdx((i) => (i + 1) % REMEDIATION_CHALLENGES.length)
                }
                className="text-xs text-sky-400 hover:underline"
              >
                Next Challenge &rarr;
              </button>
            </div>

            <p className="text-xs opacity-80 leading-relaxed">
              <strong>Objective:</strong> {challenge.targetDescription}
            </p>

            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                <strong>Mouse navigation disabled:</strong> Navigate strictly using{' '}
                <code>Ctrl+Left/Right</code> (word jump), <code>Home/End</code> (line bounds), and{' '}
                <code>Ctrl+Backspace/Delete</code>.
              </span>
            </div>
          </div>

          {/* Locomotion HUD Metrics */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border bg-black/20 text-center">
              <span className="text-[10px] uppercase tracking-wider opacity-60">
                Keystrokes Taken
              </span>
              <div className="text-2xl font-mono font-black mt-0.5">
                {keystrokesCount}{' '}
                <span className="text-xs font-normal opacity-60">
                  (Min: {challenge.minOptimalKeystrokes})
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl border bg-black/20 text-center">
              <span className="text-[10px] uppercase tracking-wider opacity-60">
                Shortcut Jumps
              </span>
              <div className="text-2xl font-mono font-black text-sky-400 mt-0.5">
                {locomotionCount}
              </div>
            </div>

            <div className="p-3 rounded-xl border bg-black/20 text-center">
              <span className="text-[10px] uppercase tracking-wider opacity-60">
                Efficiency Rating
              </span>
              <div
                className={`text-2xl font-mono font-black mt-0.5 ${
                  efficiencyScore >= 70
                    ? 'text-emerald-400'
                    : efficiencyScore >= 40
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {efficiencyScore}%
              </div>
            </div>

            <div className="p-3 rounded-xl border bg-black/20 text-center">
              <span className="text-[10px] uppercase tracking-wider opacity-60">
                Time Elapsed
              </span>
              <div className="text-2xl font-mono font-black mt-0.5">
                {elapsedSeconds}s
              </div>
            </div>
          </div>

          {/* Target Reference vs Editable Editor */}
          <div className="space-y-2">
            <div className="text-xs font-bold opacity-75">Target Correct State:</div>
            <div className="p-3 rounded-lg border bg-slate-900/60 font-mono text-xs text-emerald-400">
              {challenge.targetText}
            </div>
          </div>

          <div className="relative">
            <div className="text-xs font-bold opacity-75 mb-1.5">
              Live Workspace (Mouse Click Disabled):
            </div>
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                className="w-full h-32 p-4 rounded-xl border font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-sky-400/50"
                style={{
                  background: 'var(--card, #0f172a)',
                  borderColor: 'color-mix(in srgb, var(--sub, #64748b) 30%, transparent)',
                  color: 'var(--text, #f8fafc)',
                }}
              />
              {/* Transparent click-blocker overlay */}
              <div
                className="absolute inset-0 rounded-xl"
                style={{ zIndex: 10, cursor: 'not-allowed' }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  textareaRef.current?.focus();
                }}
                title="Mouse navigation is disabled — use Ctrl+Arrows, Home/End, Ctrl+Backspace/Delete"
              />
            </div>
          </div>

          {/* Success Banner */}
          {isSuccess && (
            <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 flex items-center justify-between animate-fade-in">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold text-sm">
                  Remediation Complete! Locomotion Efficiency: {efficiencyScore}%
                </span>
              </div>
              <button
                onClick={() =>
                  setChallengeIdx((i) => (i + 1) % REMEDIATION_CHALLENGES.length)
                }
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition"
              >
                Next Challenge &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Sub-Mode 2: IDE Tool Awareness ────────────────────────────── */}
      {subMode === 'ide-discipline' && (
        <div className="space-y-5">
          <div
            className="p-5 rounded-2xl border space-y-3 shadow-lg"
            style={{
              background: 'color-mix(in srgb, var(--card, #0f172a) 80%, black)',
              borderColor: 'color-mix(in srgb, var(--sub, #64748b) 25%, transparent)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                IDE AUTOCOMPLETE & PAIR DISCIPLINE
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
                Snippet {ideSnippetIdx + 1} of {IDE_SNIPPETS.length}
              </span>
            </div>
            <p className="text-xs opacity-80 leading-relaxed">
              Fast programmers know <strong>when to stop typing</strong>. Practice typing auto-closing
              brackets <code>()</code>, <code>{}</code>, and hitting <code>Tab</code> on snippet triggers
              rather than manually typing repetitive boilerplate.
            </p>
          </div>

          <div className="p-4 rounded-xl border bg-black/20 space-y-3 font-mono text-xs">
            <div className="opacity-70 font-bold flex justify-between">
              <span>Target Code:</span>
              <span className="text-sky-400">{activeSnippet.description}</span>
            </div>
            <div className="text-emerald-400 p-2.5 rounded bg-slate-900/80 border border-slate-700/50">
              {activeSnippet.expansion}
            </div>

            <div className="opacity-70 font-bold pt-2">Type below. Type `{activeSnippet.trigger}` and hit `Tab` for snippet:</div>
            <div className="relative">
              <input
                type="text"
                value={ideInput}
                onChange={(e) => setIdeInput(e.target.value)}
                onKeyDown={(e) => {
                  soundEngine.playKeySound(e.key === ' ', e.key === 'Backspace');
                  if (e.key === 'Tab' && ideInput.startsWith(activeSnippet.trigger)) {
                    e.preventDefault();
                    setIdeInput(activeSnippet.expansion);
                    setIdeSnippetTriggered(true);
                  }
                }}
                placeholder={`type '${activeSnippet.trigger}' and hit Tab...`}
                className="w-full p-3 rounded-lg border bg-slate-950 text-sky-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />

              {ideInput === activeSnippet.trigger && !ideSnippetTriggered && (
                <div className="absolute left-1 top-12 z-10 p-2 rounded bg-slate-900 border border-sky-500/50 text-[11px] shadow-xl text-sky-300 animate-pulse">
                  ⚡ Snippet: Press <strong>Tab</strong> to expand `{activeSnippet.expansion.substring(0, 20)}...`
                </div>
              )}
            </div>

            {ideSnippetTriggered && (
              <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Snippet expanded with 1 keystroke instead of {activeSnippet.savedKeystrokes}!</span>
                </div>
                {ideSnippetIdx < IDE_SNIPPETS.length - 1 && (
                  <button
                    onClick={() => {
                      setIdeSnippetIdx(i => i + 1);
                      setIdeInput('');
                      setIdeSnippetTriggered(false);
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition"
                  >
                    Next Snippet →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
