// ═══════════════════════════════════════════════════════════════════════════════
// ProTypist / TypePulse - Pillar 1: Generative Typing vs Visual Transcription
// Thought-to-Keyboard Drills & Web Speech Audio-Shadowing / Dictation Engine
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Clock,
  Activity,
  CheckCircle,
} from 'lucide-react';
import { speechDictation } from '../lib/speechDictation';
import { soundEngine } from '../lib/soundEngine';

export type GenerativeSubMode = 'thought-to-keyboard' | 'audio-dictation';

const PROMPTS = [
  {
    id: 'p1',
    topic: 'Static vs Dynamic Typing',
    prompt:
      'Argue in 50 to 100 words why static typing provides higher long-term software maintainability than dynamic typing in large engineering teams.',
    targetWords: 75,
  },
  {
    id: 'p2',
    topic: 'Constitutional Separation of Powers',
    prompt:
      'Explain in 60 to 100 words how the doctrine of separation of powers between the legislature, executive, and judiciary prevents democratic backsliding.',
    targetWords: 80,
  },
  {
    id: 'p3',
    topic: 'Touch Typing as Cognitive Offloading',
    prompt:
      'Describe why touch typing acts as a form of cognitive offloading, freeing mental bandwidth from mechanical execution to abstract formulation.',
    targetWords: 70,
  },
  {
    id: 'p4',
    topic: 'Sustainable Urban Logistics',
    prompt:
      'Propose three concrete measures a metropolitan city can adopt to electrify public transit and reduce last-mile delivery carbon emissions.',
    targetWords: 80,
  },
];

const DICTATION_PASSAGES = [
  {
    id: 'd1',
    title: 'The Nature of Scientific Discovery',
    text:
      'Scientific discovery rarely follows a neat linear path. It is characterized by persistent experimentation, systematic error elimination, and sudden perceptual synthesis. When empirical observations diverge from prevailing theoretical models, inquisitive minds find the impetus for revolutionary conceptual breakthroughs.',
  },
  {
    id: 'd2',
    title: 'Civil Administration and the Public Interest',
    text:
      'The primary duty of an administrative functionary is to uphold the rule of law without prejudice or favoritism. When civil servants document public decisions with precision and transparency, they strengthen the democratic bonds of trust between the citizen and the state.',
  },
  {
    id: 'd3',
    title: 'Architectural Discipline in Software Engineering',
    text:
      'Writing maintainable code requires rigorous attention to interfaces and boundary contracts. Complex systems inevitably fail when individual components harbor hidden assumptions. By isolating dependencies and adhering to simplicity, software engineers craft resilient platforms.',
  },
];

export const GenerativeTypingDrill: React.FC = () => {
  const [subMode, setSubMode] = useState<GenerativeSubMode>('thought-to-keyboard');

  // Thought Prompt State
  const [promptIdx, setPromptIdx] = useState(0);
  const [authorBuffer, setAuthorBuffer] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Velocity & Hesitation Telemetry
  const [hesitationClusters, setHesitationClusters] = useState<number>(0);
  const [selfEditCount, setSelfEditCount] = useState<number>(0);
  const [lastKeystrokeTime, setLastKeystrokeTime] = useState<number | null>(null);
  const [pauseDurations, setPauseDurations] = useState<number[]>([]);

  // Dictation State
  const [dictationIdx, setDictationIdx] = useState(0);
  const [dictationBuffer, setDictationBuffer] = useState('');
  const [dictationWpm, setDictationWpm] = useState(60);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [dictationFinished, setDictationFinished] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer loop for Thought-to-Keyboard
  useEffect(() => {
    if (startTime && !isCompleted) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.round((performance.now() - startTime) / 1000));
      }, 500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isCompleted]);

  const activePrompt = PROMPTS[promptIdx];
  const activeDictation = DICTATION_PASSAGES[dictationIdx];

  const currentWords = authorBuffer.trim() ? authorBuffer.trim().split(/\s+/).length : 0;
  const currentWpm =
    elapsedSeconds > 0 ? Math.round((currentWords / elapsedSeconds) * 60) : 0;

  // Keystroke handler for thought prompt
  const handleAuthorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!startTime) {
      setStartTime(performance.now());
    }

    const now = performance.now();
    soundEngine.playKeySound(e.key === ' ', e.key === 'Backspace');

    if (e.key === 'Backspace' || e.key === 'Delete') {
      setSelfEditCount((c) => c + 1);
    }

    if (lastKeystrokeTime) {
      const pauseMs = now - lastKeystrokeTime;
      // Pause > 1200ms is a cognitive formulation hesitation
      if (pauseMs > 1200) {
        setHesitationClusters((c) => c + 1);
        setPauseDurations((p) => [...p, Math.round(pauseMs)]);
      }
    }
    setLastKeystrokeTime(now);
  };

  const handleStartDictation = () => {
    if (!speechDictation.isSupported()) {
      alert('Web Speech API is not supported in this environment.');
      return;
    }

    setIsPlayingAudio(true);
    speechDictation.speak(activeDictation.text, {
      wpm: dictationWpm,
      onEnd: () => {
        setIsPlayingAudio(false);
      },
      onError: () => {
        setIsPlayingAudio(false);
      },
    });
  };

  const handleStopDictation = () => {
    speechDictation.stop();
    setIsPlayingAudio(false);
  };

  const resetAll = () => {
    speechDictation.stop();
    setAuthorBuffer('');
    setDictationBuffer('');
    setStartTime(null);
    setElapsedSeconds(0);
    setIsCompleted(false);
    setHesitationClusters(0);
    setSelfEditCount(0);
    setLastKeystrokeTime(null);
    setPauseDurations([]);
    setIsPlayingAudio(false);
    setDictationFinished(false);
  };

  // Compare dictation accuracy
  const evaluateDictation = () => {
    speechDictation.stop();
    setIsPlayingAudio(false);
    setDictationFinished(true);
  };

  const computeDictationScore = (master: string, typed: string) => {
    const mWords = master.trim().split(/\s+/);
    const tWords = typed.trim().split(/\s+/);
    let correct = 0;
    const wordResults = mWords.map((w, i) => {
      const match = tWords[i]?.toLowerCase() === w.toLowerCase();
      if (match) correct++;
      return { expected: w, actual: tWords[i] || '', match };
    });
    return { total: mWords.length, correct, pct: mWords.length > 0 ? Math.round((correct / mWords.length) * 100) : 0, wordResults };
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6 animate-fade-in">
      {/* ── Drill Navigation Bar ────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between p-3 rounded-2xl border"
        style={{
          background: 'var(--card, #0f172a)',
          borderColor: 'color-mix(in srgb, var(--sub, #64748b) 25%, transparent)',
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-wide">
              Pillar 1: Generative Typing vs. Visual Transcription
            </h2>
            <p className="text-xs opacity-70">
              Train original thought-to-motor translation and auditory working memory
            </p>
          </div>
        </div>

        {/* Sub-mode Switcher */}
        <div className="flex items-center space-x-1 text-xs bg-black/30 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => {
              resetAll();
              setSubMode('thought-to-keyboard');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              subMode === 'thought-to-keyboard'
                ? 'bg-purple-600 text-white shadow'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            Thought-to-Keyboard
          </button>
          <button
            onClick={() => {
              resetAll();
              setSubMode('audio-dictation');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              subMode === 'audio-dictation'
                ? 'bg-purple-600 text-white shadow'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            Audio-Shadowing Dictation
          </button>
        </div>
      </div>

      {/* ── Sub-Mode 1: Thought-to-Keyboard ─────────────────────────────── */}
      {subMode === 'thought-to-keyboard' && (
        <div className="space-y-5">
          {/* Prompt Display Card */}
          <div
            className="p-5 rounded-2xl border space-y-3 shadow-lg"
            style={{
              background: 'color-mix(in srgb, var(--card, #0f172a) 80%, black)',
              borderColor: 'color-mix(in srgb, var(--main, #facc15) 30%, transparent)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-400/20 text-amber-400 border border-amber-400/30">
                PROMPT #{promptIdx + 1}: {activePrompt.topic.toUpperCase()}
              </span>
              <button
                onClick={() => {
                  resetAll();
                  setPromptIdx((p) => (p + 1) % PROMPTS.length);
                }}
                className="text-xs text-sky-400 hover:underline"
              >
                Next Thought Prompt &rarr;
              </button>
            </div>
            <p className="text-base font-medium leading-relaxed" style={{ color: 'var(--text)' }}>
              "{activePrompt.prompt}"
            </p>
          </div>

          {/* Real-time Velocity & Hesitation Telemetry Bar */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border bg-black/20 text-center">
              <span className="text-[10px] uppercase tracking-wider opacity-60">
                Generation Velocity
              </span>
              <div className="text-2xl font-mono font-black text-purple-400 mt-0.5">
                {currentWpm} <span className="text-xs font-normal opacity-70">WPM</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border bg-black/20 text-center">
              <span className="text-[10px] uppercase tracking-wider opacity-60">
                Words Composed
              </span>
              <div className="text-2xl font-mono font-black mt-0.5">
                {currentWords} / {activePrompt.targetWords}
              </div>
            </div>

            <div className="p-3 rounded-xl border bg-black/20 text-center">
              <span className="text-[10px] uppercase tracking-wider opacity-60">
                Hesitation Clusters (&gt;1.2s)
              </span>
              <div
                className={`text-2xl font-mono font-black mt-0.5 ${
                  hesitationClusters > 5 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {hesitationClusters}
              </div>
            </div>

            <div className="p-3 rounded-xl border bg-black/20 text-center">
              <span className="text-[10px] uppercase tracking-wider opacity-60">
                Self-Edits (Edits/Deletes)
              </span>
              <div className="text-2xl font-mono font-black text-sky-400 mt-0.5">
                {selfEditCount}
              </div>
            </div>
          </div>

          {/* Active Authoring Textarea */}
          <div className="relative">
            <textarea
              value={authorBuffer}
              onChange={(e) => setAuthorBuffer(e.target.value)}
              onKeyDown={handleAuthorKeyDown}
              disabled={isCompleted}
              placeholder="Synthesize your response here... Begin typing to start measuring sustained generation velocity and formulation pauses."
              className="w-full h-48 p-4 rounded-xl border font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              style={{
                background: 'var(--card, #0f172a)',
                borderColor: 'color-mix(in srgb, var(--sub, #64748b) 30%, transparent)',
                color: 'var(--text, #f8fafc)',
              }}
            />
          </div>

          {/* Action Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={resetAll}
              className="px-4 py-2 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 opacity-80 hover:opacity-100 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Drill</span>
            </button>

            <button
              onClick={() => setIsCompleted(true)}
              disabled={currentWords < 20 || isCompleted}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 ${
                currentWords >= 20 && !isCompleted
                  ? 'bg-purple-600 text-white shadow-lg hover:bg-purple-500 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete & Analyze Composition</span>
            </button>
          </div>

          {isCompleted && (
            <div className="p-5 rounded-2xl border space-y-4 animate-fade-in" style={{ background: 'var(--card, #0f172a)', borderColor: 'color-mix(in srgb, var(--sub, #64748b) 25%, transparent)' }}>
              <h3 className="font-bold text-lg text-purple-400">📊 Composition Analysis Report</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl border bg-black/20 text-center">
                  <span className="text-[10px] uppercase tracking-wider opacity-60">Generation Velocity</span>
                  <div className="text-2xl font-mono font-black text-purple-400 mt-0.5">{currentWpm} <span className="text-xs font-normal opacity-70">WPM</span></div>
                </div>
                <div className="p-3 rounded-xl border bg-black/20 text-center">
                  <span className="text-[10px] uppercase tracking-wider opacity-60">Words Composed</span>
                  <div className="text-2xl font-mono font-black mt-0.5">{currentWords} / {activePrompt.targetWords}</div>
                </div>
                <div className="p-3 rounded-xl border bg-black/20 text-center">
                  <span className="text-[10px] uppercase tracking-wider opacity-60">Hesitation Clusters</span>
                  <div className={`text-2xl font-mono font-black mt-0.5 ${hesitationClusters > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>{hesitationClusters}</div>
                </div>
                <div className="p-3 rounded-xl border bg-black/20 text-center">
                  <span className="text-[10px] uppercase tracking-wider opacity-60">Self-Edits</span>
                  <div className="text-2xl font-mono font-black text-sky-400 mt-0.5">{selfEditCount}</div>
                </div>
              </div>
              {pauseDurations.length > 0 && (
                <div>
                  <div className="text-xs opacity-60 mb-1.5 font-bold">Cognitive Pause Durations (each &gt;1.2s gap):</div>
                  <div className="flex flex-wrap gap-1.5">
                    {pauseDurations.map((p, i) => <span key={i} className="px-2 py-0.5 rounded font-mono text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30">{p}ms</span>)}
                  </div>
                </div>
              )}
              <div>
                <div className="text-xs opacity-60 mb-1.5 font-bold">Your Composition (copyable):</div>
                <div className="p-3 rounded-lg border font-mono text-sm leading-relaxed select-text" style={{ background: 'var(--bg, #020617)', color: 'var(--text, #f8fafc)', borderColor: 'color-mix(in srgb, var(--sub, #64748b) 30%, transparent)' }}>
                  {authorBuffer}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={resetAll} className="px-4 py-2 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 opacity-80 hover:opacity-100 transition">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Drill</span>
                </button>
                <button onClick={() => { resetAll(); setPromptIdx((p) => (p + 1) % PROMPTS.length); }} className="px-5 py-2 rounded-lg text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 shadow transition">
                  Next Thought Prompt →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Sub-Mode 2: Audio-Shadowing / Dictation ─────────────────────── */}
      {subMode === 'audio-dictation' && (
        <div className="space-y-5">
          {/* Audio Controller Deck */}
          <div
            className="p-5 rounded-2xl border space-y-4 shadow-lg"
            style={{
              background: 'color-mix(in srgb, var(--card, #0f172a) 80%, black)',
              borderColor: 'color-mix(in srgb, var(--sub, #64748b) 25%, transparent)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-mono font-bold text-purple-400">
                  DICTATION PASSAGE #{dictationIdx + 1}
                </span>
                <h3 className="text-lg font-bold mt-0.5">{activeDictation.title}</h3>
              </div>

              {/* Dictation Speed Control */}
              <div className="flex items-center space-x-2 bg-black/30 px-3 py-1.5 rounded-xl border border-slate-700/60">
                <span className="text-xs opacity-70">Voice Rate:</span>
                {[45, 60, 80, 100].map((w) => (
                  <button
                    key={w}
                    onClick={() => {
                      setDictationWpm(w);
                      if (isPlayingAudio) handleStartDictation();
                    }}
                    className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition ${
                      dictationWpm === w
                        ? 'bg-purple-600 text-white'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {w} WPM
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs opacity-75">
              The text is hidden from visual sight. Click <strong>Start Speech</strong> to listen.
              Maintain the auditory working memory buffer and transcribe simultaneously.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              {!isPlayingAudio ? (
                <button
                  onClick={handleStartDictation}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow flex items-center space-x-2 transition"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Audio Stream</span>
                </button>
              ) : (
                <button
                  onClick={handleStopDictation}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow flex items-center space-x-2 transition"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Stop Audio Stream</span>
                </button>
              )}

              <button
                onClick={() => {
                  resetAll();
                  setDictationIdx((i) => (i + 1) % DICTATION_PASSAGES.length);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold border opacity-80 hover:opacity-100 transition"
              >
                Next Dictation Passage
              </button>
            </div>
          </div>

          {/* Dictation Typing Input */}
          <div>
            <textarea
              value={dictationBuffer}
              onChange={(e) => setDictationBuffer(e.target.value)}
              onKeyDown={(e) =>
                soundEngine.playKeySound(e.key === ' ', e.key === 'Backspace')
              }
              disabled={dictationFinished}
              placeholder="Listen to the voice stream and type what you hear in real-time..."
              className="w-full h-44 p-4 rounded-xl border font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              style={{
                background: 'var(--card, #0f172a)',
                borderColor: 'color-mix(in srgb, var(--sub, #64748b) 30%, transparent)',
                color: 'var(--text, #f8fafc)',
              }}
            />
          </div>

          {/* Evaluation Action */}
          <div className="flex items-center justify-between">
            <button
              onClick={resetAll}
              className="px-4 py-2 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 opacity-80 hover:opacity-100 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              onClick={evaluateDictation}
              disabled={dictationBuffer.trim().length === 0}
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow transition"
            >
              Verify Transcription Accuracy
            </button>
          </div>

          {/* Verification Results Panel */}
          {dictationFinished && (() => {
            const score = computeDictationScore(activeDictation.text, dictationBuffer);
            return (
              <div className="p-5 rounded-2xl border space-y-4 bg-black/20 animate-fade-in" style={{ borderColor: 'color-mix(in srgb, var(--sub, #64748b) 25%, transparent)' }}>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-purple-400">Auditory Transcription Analysis</h4>
                  <div className={`px-4 py-1.5 rounded-full font-mono font-black text-lg ${score.pct >= 90 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : score.pct >= 70 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'}`}>
                    {score.pct}% Accuracy
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl border bg-black/20 text-center">
                    <span className="text-[10px] uppercase tracking-wider opacity-60">Words Correct</span>
                    <div className="text-2xl font-mono font-black text-emerald-400 mt-0.5">{score.correct}</div>
                  </div>
                  <div className="p-3 rounded-xl border bg-black/20 text-center">
                    <span className="text-[10px] uppercase tracking-wider opacity-60">Total Words</span>
                    <div className="text-2xl font-mono font-black mt-0.5">{score.total}</div>
                  </div>
                  <div className="p-3 rounded-xl border bg-black/20 text-center">
                    <span className="text-[10px] uppercase tracking-wider opacity-60">Errors</span>
                    <div className="text-2xl font-mono font-black text-rose-400 mt-0.5">{score.total - score.correct}</div>
                  </div>
                </div>
                <div className="p-3 rounded-lg border bg-black/10">
                  <div className="text-xs opacity-60 mb-2 font-bold">Word-by-Word Comparison:</div>
                  <div className="flex flex-wrap gap-1 font-mono text-xs leading-loose">
                    {score.wordResults.map((w, i) => (
                      <span key={i} className={`px-1.5 py-0.5 rounded ${w.match ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300 line-through'}`} title={w.match ? 'Correct' : `Expected: "${w.expected}" Got: "${w.actual}"`}>
                        {w.expected}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={resetAll} className="px-4 py-2 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 opacity-80 hover:opacity-100 transition">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                  <button onClick={() => { resetAll(); setDictationIdx((i) => (i + 1) % DICTATION_PASSAGES.length); }} className="px-5 py-2 rounded-lg text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 shadow transition">
                    Next Dictation Passage →
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
