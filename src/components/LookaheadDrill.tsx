// ═══════════════════════════════════════════════════════════════════════════════
// ProTypist / TypePulse - Pillar 4: Visual Lookahead & Eye-Buffer Conditioning
// Dynamic Trailing Curtain Masking & Foveal Expansion Multi-Word Chunk Flasher
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  RotateCcw,
  CheckCircle2,
  Clock,
  Gauge,
} from 'lucide-react';
import { soundEngine } from '../lib/soundEngine';
import { PassageManager, CORPUS_1000_PASSAGES } from '../lib/corpus1000';

export type LookaheadSubMode = 'trailing-curtain' | 'foveal-flasher';

const SAMPLE_PASSAGES = [
  'The human visual cortex possesses an extraordinary capacity to buffer multi-word semantic units before motor commands are dispatched to the fingertips.',
  'By deliberately masking the word under the cursor, the typist is forced to extend their perceptual gaze three words into the future.',
  'Speed ceilings in transcription are rarely mechanical limits; they are perceptual bottlenecks caused by fixating on the immediate keystroke.',
];

// Generate 50 three-word chunks from corpus passages for foveal training
const GENERATED_CHUNKS: string[][] = (() => {
  const chunks: string[][] = [];
  for (const p of CORPUS_1000_PASSAGES.slice(0, 80)) {
    const words = p.text.split(/\s+/).filter(w => w.length >= 4);
    for (let i = 0; i + 2 < words.length && chunks.length < 50; i += 5) {
      chunks.push([words[i], words[i + 1], words[i + 2]]);
    }
    if (chunks.length >= 50) break;
  }
  return chunks.length > 0 ? chunks : [
    ['constitutional', 'remedies', 'guarantee'],
    ['digital', 'public', 'infrastructure'],
    ['sustainable', 'renewable', 'energy'],
  ];
})();

export const LookaheadDrill: React.FC = () => {
  const [subMode, setSubMode] = useState<LookaheadSubMode>('trailing-curtain');

  // Trailing Curtain State
  const [currentPassage, setCurrentPassage] = useState(() => {
    const { passage } = PassageManager.getNextPassage();
    return passage;
  });
  const targetWords = useMemo(
    () => currentPassage.text.split(/\s+/),
    [currentPassage]
  );
  const [activeWordIdx, setActiveWordIdx] = useState(0);
  const [currWordInput, setCurrWordInput] = useState('');
  const [maskCurrentWord, setMaskCurrentWord] = useState(true);
  const [curtainFinished, setCurtainFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Foveal Flasher State
  const [chunkIdx, setChunkIdx] = useState(0);
  const [flashDurationMs, setFlashDurationMs] = useState(350); // 250 - 500ms
  const [isFlashing, setIsFlashing] = useState(false);
  const [hasFlashed, setHasFlashed] = useState(false);
  const [chunkInput, setChunkInput] = useState('');
  const [fovealScore, setFovealScore] = useState<{ total: number; correct: number }>({
    total: 0,
    correct: 0,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer loop
  useEffect(() => {
    if (startTime && !curtainFinished) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.round((performance.now() - startTime) / 1000));
      }, 500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, curtainFinished]);

  // Handle word typing for Trailing Curtain
  const handleCurtainKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!startTime) setStartTime(performance.now());
    soundEngine.playKeySound(e.key === ' ', e.key === 'Backspace');

    if (e.key === ' ') {
      e.preventDefault();
      if (currWordInput.trim() === targetWords[activeWordIdx]) {
        if (activeWordIdx + 1 >= targetWords.length) {
          setCurtainFinished(true);
        } else {
          setActiveWordIdx((idx) => idx + 1);
          setCurrWordInput('');
        }
      }
    }
  };

  // Flash a chunk in Foveal mode
  const triggerFovealFlash = () => {
    setChunkInput('');
    setIsFlashing(true);
    setHasFlashed(false);

    setTimeout(() => {
      setIsFlashing(false);
      setHasFlashed(true);
    }, flashDurationMs);
  };

  const handleChunkSubmit = () => {
    const target = GENERATED_CHUNKS[chunkIdx].join(' ');
    const isCorrect = chunkInput.trim().toLowerCase() === target.toLowerCase();

    setFovealScore((s) => ({
      total: s.total + 1,
      correct: s.correct + (isCorrect ? 1 : 0),
    }));

    setChunkIdx((idx) => (idx + 1) % GENERATED_CHUNKS.length);
    setHasFlashed(false);
    setChunkInput('');
  };

  const resetAll = () => {
    setActiveWordIdx(0);
    setCurrWordInput('');
    setStartTime(null);
    setElapsedSeconds(0);
    setCurtainFinished(false);
    setIsFlashing(false);
    setHasFlashed(false);
    setChunkInput('');
  };

  const curtainWpm =
    elapsedSeconds > 0 ? Math.round((activeWordIdx / elapsedSeconds) * 60) : 0;

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
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-wide">
              Pillar 4: Visual Lookahead & Eye-Buffer Training
            </h2>
            <p className="text-xs opacity-70">
              Condition your eyes to look 2–4 words ahead rather than gazing at the active cursor
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-xs bg-black/30 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => {
              resetAll();
              setSubMode('trailing-curtain');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              subMode === 'trailing-curtain'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            Trailing Curtain Masking
          </button>
          <button
            onClick={() => {
              resetAll();
              setSubMode('foveal-flasher');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              subMode === 'foveal-flasher'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            Foveal Chunk Flasher
          </button>
        </div>
      </div>

      {/* ── Sub-Mode 1: Trailing Curtain Masking ───────────────────────── */}
      {subMode === 'trailing-curtain' && (
        <div className="space-y-5">
          <div
            className="p-5 rounded-2xl border space-y-3 shadow-lg"
            style={{
              background: 'color-mix(in srgb, var(--card, #0f172a) 80%, black)',
              borderColor: 'color-mix(in srgb, var(--sub, #64748b) 25%, transparent)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-400/20 text-amber-400 border border-amber-400/30">
                DYNAMIC CURTAIN MASKING
              </span>

              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={() => setMaskCurrentWord((m) => !m)}
                  className={`px-3 py-1 rounded-lg border font-semibold flex items-center space-x-1.5 transition ${
                    maskCurrentWord
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'opacity-70'
                  }`}
                >
                  {maskCurrentWord ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Current Word Masked</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Curtain Transparent</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs opacity-80 leading-relaxed">
              <strong>Mechanism:</strong> The word currently being typed is hidden behind a
              sensory curtain. Your perceptual buffer must memorize words ahead of the cursor and
              dispatch motor signals from short-term memory!
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl border bg-black/20 text-center">
              <span className="text-[10px] uppercase tracking-wider opacity-60">
                Lookahead Velocity
              </span>
              <div className="text-2xl font-mono font-black text-amber-400 mt-0.5">
                {curtainWpm} <span className="text-xs font-normal opacity-60">WPM</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border bg-black/20 text-center">
              <span className="text-[10px] uppercase tracking-wider opacity-60">
                Words Buffered & Typed
              </span>
              <div className="text-2xl font-mono font-black mt-0.5">
                {activeWordIdx} / {targetWords.length}
              </div>
            </div>

            <div className="p-3 rounded-xl border bg-black/20 text-center">
              <span className="text-[10px] uppercase tracking-wider opacity-60">
                Time
              </span>
              <div className="text-2xl font-mono font-black mt-0.5">
                {elapsedSeconds}s
              </div>
            </div>
          </div>

          {/* Interactive Dynamic Word Stream with Curtain Effect */}
          <div
            className="p-6 rounded-2xl border min-h-[140px] flex flex-wrap gap-2.5 items-center font-mono text-lg leading-loose"
            style={{
              background: 'var(--card, #0f172a)',
              borderColor: 'color-mix(in srgb, var(--sub, #64748b) 30%, transparent)',
            }}
          >
            {targetWords.map((word, wIdx) => {
              const isPast = wIdx < activeWordIdx;
              const isCurrent = wIdx === activeWordIdx;
              const isFuture = wIdx > activeWordIdx;

              let styleClass = 'opacity-80 text-slate-300';

              if (isPast) {
                styleClass = 'opacity-25 text-slate-600 line-through';
              } else if (isCurrent) {
                if (maskCurrentWord) {
                  return (
                    <span
                      key={wIdx}
                      className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-dashed border-amber-400/50 animate-pulse font-bold"
                    >
                      [••••• MASKED •••••]
                    </span>
                  );
                } else {
                  styleClass = 'font-bold text-amber-400 underline';
                }
              } else if (isFuture && wIdx <= activeWordIdx + 3) {
                // Next 3 words highlighted to guide gaze!
                styleClass = 'font-bold text-sky-300';
              }

              return (
                <span key={wIdx} className={`transition duration-150 ${styleClass}`}>
                  {word}
                </span>
              );
            })}
          </div>

          {/* Input Field */}
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={currWordInput}
              onChange={(e) => setCurrWordInput(e.target.value)}
              onKeyDown={handleCurtainKeyDown}
              disabled={curtainFinished}
              placeholder="Type current buffered word and press Space..."
              className="flex-1 p-3.5 rounded-xl border font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60"
              style={{
                background: 'var(--card, #0f172a)',
                borderColor: 'color-mix(in srgb, var(--sub, #64748b) 30%, transparent)',
                color: 'var(--text, #f8fafc)',
              }}
            />

            <button
              onClick={resetAll}
              className="px-4 py-3.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 opacity-80 hover:opacity-100 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {curtainFinished && (
            <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 flex items-center justify-between animate-fade-in">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold text-sm">
                  Curtain Drill Complete! Lookahead Velocity: {curtainWpm} WPM
                </span>
              </div>
              <button
                onClick={() => {
                  const { passage } = PassageManager.getNextPassage(undefined, currentPassage.id);
                  setCurrentPassage(passage);
                  resetAll();
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition"
              >
                Next Lookahead Passage &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Sub-Mode 2: Foveal Chunk Flasher ──────────────────────────── */}
      {subMode === 'foveal-flasher' && (
        <div className="space-y-5">
          <div
            className="p-5 rounded-2xl border space-y-3 shadow-lg"
            style={{
              background: 'color-mix(in srgb, var(--card, #0f172a) 80%, black)',
              borderColor: 'color-mix(in srgb, var(--sub, #64748b) 25%, transparent)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-400/20 text-amber-400 border border-amber-400/30">
                FOVEAL EXPANSION CHUNK FLASHER
              </span>

              {/* Exposure Duration Selector */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="opacity-70">Flash Exposure:</span>
                {[250, 350, 500].map((d) => (
                  <button
                    key={d}
                    onClick={() => setFlashDurationMs(d)}
                    className={`px-2 py-0.5 rounded font-mono font-bold transition ${
                      flashDurationMs === d
                        ? 'bg-amber-400 text-slate-950'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {d}ms
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs opacity-80 leading-relaxed">
              Flashes multi-word semantic blocks momentarily on screen. Trains your visual cortex to
              absorb whole phrases as single perceptual tokens rather than processing letters linearly.
            </p>
          </div>

          {/* Flash Display Box */}
          <div
            className="h-44 rounded-2xl border flex items-center justify-center text-center p-6"
            style={{
              background: 'var(--card, #0f172a)',
              borderColor: 'color-mix(in srgb, var(--sub, #64748b) 30%, transparent)',
            }}
          >
            {isFlashing ? (
              <div className="font-mono text-3xl font-black text-amber-400 tracking-wider animate-pulse">
                {GENERATED_CHUNKS[chunkIdx].join(' ')}
              </div>
            ) : hasFlashed ? (
              <div className="text-xs opacity-50 font-mono">
                [ Chunk hidden from sight — type what was flashed from working memory ]
              </div>
            ) : (
              <button
                onClick={triggerFovealFlash}
                className="px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg flex items-center space-x-2 transition"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Flash Multi-Word Chunk ({flashDurationMs}ms)</span>
              </button>
            )}
          </div>

          {/* Input & Evaluation */}
          {hasFlashed && (
            <div className="space-y-3 animate-fade-in">
              <input
                type="text"
                autoFocus
                value={chunkInput}
                onChange={(e) => setChunkInput(e.target.value)}
                onKeyDown={(e) => {
                  soundEngine.playKeySound(e.key === ' ', e.key === 'Backspace');
                  if (e.key === 'Enter') handleChunkSubmit();
                }}
                placeholder="Type recalled chunk and press Enter..."
                className="w-full p-3.5 rounded-xl border font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60"
                style={{
                  background: 'var(--card, #0f172a)',
                  borderColor: 'color-mix(in srgb, var(--sub, #64748b) 30%, transparent)',
                  color: 'var(--text, #f8fafc)',
                }}
              />

              <div className="flex items-center justify-between text-xs">
                <span className="opacity-70">
                  Recall Score: {fovealScore.correct} / {fovealScore.total}
                </span>

                <button
                  onClick={handleChunkSubmit}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition"
                >
                  Submit & Next Chunk &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
