import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { VirtualKeyboard } from './VirtualKeyboard';
import { soundEngine, type SoundProfile } from '../lib/soundEngine';
import { KinematicTracker, type KinematicAnalysisSummary } from '../lib/kinematicTelemetry';
import { KinematicsDashboard } from './KinematicsDashboard';
import { ErgonomicsPanel } from './ErgonomicsPanel';
import { Volume2, Activity, HeartPulse, Sparkles, Sliders } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

export type CaretStyle = 'smooth' | 'block' | 'underline';
export type GameMode = 'time' | 'words' | 'quote' | 'paragraph' | 'lesson';

interface KeyStat {
  total: number;
  errors: number;
}

interface WpmPoint {
  sec: number;
  wpm: number;
  raw: number;
  errs: number;
}

interface LessonInfo {
  id: string;
  title: string;
  module: string;
  level: number;
  targetKeys: string[];
}

interface ParagraphInfo {
  id: string;
  title: string;
  category: string;
}

interface Props {
  wordsText: string;
  mode: GameMode;
  timeLimit: number;
  wordLimit: number;
  showKeyboard?: boolean;
  lessonInfo?: LessonInfo;
  paragraphInfo?: ParagraphInfo;
  onOpenLessons?: () => void;
  onNextLesson?: () => void;
  onRestart: () => void;
  onSwitchToExam: () => void;
}

// ─── Keyboard Layout for Heatmap ────────────────────────────────────────────

const KB_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

// ═════════════════════════════════════════════════════════════════════════════

export const ModernTypingEngine: React.FC<Props> = ({
  wordsText,
  mode,
  timeLimit,
  wordLimit,
  showKeyboard = true,
  lessonInfo,
  paragraphInfo,
  onOpenLessons,
  onNextLesson,
  onRestart,
  onSwitchToExam,
}) => {
  // ── Word Tokenization ─────────────────────────────────────────────────────
  const targetWords = useMemo(
    () => wordsText.trim().split(/\s+/).filter(Boolean),
    [wordsText]
  );

  // ── State ─────────────────────────────────────────────────────────────────
  const [activeWordIdx, setActiveWordIdx] = useState(0);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [currWordInput, setCurrWordInput] = useState('');
  
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [caretStyle, setCaretStyle] = useState<CaretStyle>('smooth');
  const [history, setHistory] = useState<WpmPoint[]>([]);
  const [keyMap, setKeyMap] = useState<Record<string, KeyStat>>({});
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [kinematicSummary, setKinematicSummary] = useState<KinematicAnalysisSummary | null>(null);
  const [showKinematicsModal, setShowKinematicsModal] = useState(false);
  const [showErgonomicsModal, setShowErgonomicsModal] = useState(false);
  const [soundProfile, setSoundProfile] = useState<SoundProfile>(soundEngine.getProfile());
  const kinematicTrackerRef = useRef(new KinematicTracker());

  // Caret coordinates
  const [caretX, setCaretX] = useState(0);
  const [caretY, setCaretY] = useState(0);
  const [caretH, setCaretH] = useState(28);
  const [caretW, setCaretW] = useState(14);
  const [caretVisible, setCaretVisible] = useState(false);

  // Paragraph overflow and scrolling gradient indicators
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const wordsBoxRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkScrollOverflow = useCallback(() => {
    const box = wordsBoxRef.current;
    if (!box) return;
    const hasMoreBelow = box.scrollHeight - box.scrollTop - box.clientHeight > 8;
    const hasMoreAbove = box.scrollTop > 8;
    setCanScrollDown(hasMoreBelow);
    setCanScrollUp(hasMoreAbove);
  }, []);

  // Live refs to guarantee fresh data inside timer closure
  const liveStatsRef = useRef({
    typedWords: [] as string[],
    currWordInput: '',
    activeWordIdx: 0,
    startTime: null as number | null,
    totalKeystrokes: 0,
    totalErrors: 0,
  });

  // Keep refs in sync with state
  useEffect(() => {
    liveStatsRef.current.typedWords = typedWords;
    liveStatsRef.current.currWordInput = currWordInput;
    liveStatsRef.current.activeWordIdx = activeWordIdx;
    liveStatsRef.current.startTime = startTime;
  }, [typedWords, currWordInput, activeWordIdx, startTime]);

  // ── Reset on text change ──────────────────────────────────────────────────
  useEffect(() => {
    setActiveWordIdx(0);
    setTypedWords([]);
    setCurrWordInput('');
    setStartTime(null);
    setElapsed(0);
    setFinished(false);
    setHistory([]);
    setKeyMap({});
    setActiveKey(null);
    setKinematicSummary(null);
    setShowKinematicsModal(false);
    setShowErgonomicsModal(false);
    kinematicTrackerRef.current.reset();
    liveStatsRef.current = {
      typedWords: [],
      currWordInput: '',
      activeWordIdx: 0,
      startTime: null,
      totalKeystrokes: 0,
      totalErrors: 0,
    };
    if (wordsBoxRef.current) {
      wordsBoxRef.current.scrollTop = 0;
    }
    setCanScrollUp(false);
    setTimeout(checkScrollOverflow, 50);
    hiddenInputRef.current?.focus();
    if (timerRef.current) clearInterval(timerRef.current);
  }, [wordsText, checkScrollOverflow]);

  // ── Synchronize Caret Position ────────────────────────────────────────────
  const syncCaret = useCallback(() => {
    const box = wordsBoxRef.current;
    if (!box) return;

    // Find active character element inside the active word
    const activeWordSpan = box.querySelector(`[data-word-idx="${activeWordIdx}"]`);
    if (!activeWordSpan) return;

    const charSpans = activeWordSpan.querySelectorAll<HTMLSpanElement>('[data-char-idx]');
    const targetCharSpan = charSpans[currWordInput.length];

    const boxRect = box.getBoundingClientRect();
    const borderLeft = box.clientLeft || 0;
    const borderTop = box.clientTop || 0;

    let targetX = 0;
    let targetY = 0;
    let targetH = 28;
    let targetW = 14;

    if (targetCharSpan) {
      const charRect = targetCharSpan.getBoundingClientRect();
      const charW = Math.max(8, charRect.width || 14);
      targetW = charW;

      if (caretStyle === 'underline') {
        const underlineThickness = 3;
        targetH = underlineThickness;
        targetX = charRect.left - boxRect.left - borderLeft;
        targetY =
          charRect.top -
          boxRect.top -
          borderTop +
          box.scrollTop +
          charRect.height -
          underlineThickness -
          2;
      } else {
        const caretHeight = 28;
        targetH = caretHeight;
        // Center the 28px vertical bar within the character span's line height
        const vOffset = Math.max(0, (charRect.height - caretHeight) / 2);
        targetX = charRect.left - boxRect.left - borderLeft;
        targetY = charRect.top - boxRect.top - borderTop + box.scrollTop + vOffset;
      }

      // Smooth auto-scroll when line changes
      const relTop = charRect.top - boxRect.top;
      if (relTop > 90) {
        box.scrollTo({ top: box.scrollTop + 40, behavior: 'smooth' });
      } else if (relTop < 10 && box.scrollTop > 0) {
        box.scrollTo({ top: Math.max(0, box.scrollTop - 40), behavior: 'smooth' });
      }
    } else if (charSpans.length > 0) {
      // Placed at the end of the current word
      const lastSpan = charSpans[charSpans.length - 1];
      const lastRect = lastSpan.getBoundingClientRect();
      const charW = Math.max(8, lastRect.width || 14);
      targetW = charW;

      if (caretStyle === 'underline') {
        const underlineThickness = 3;
        targetH = underlineThickness;
        targetX = lastRect.right - boxRect.left - borderLeft;
        targetY =
          lastRect.top -
          boxRect.top -
          borderTop +
          box.scrollTop +
          lastRect.height -
          underlineThickness -
          2;
      } else {
        const caretHeight = 28;
        targetH = caretHeight;
        const vOffset = Math.max(0, (lastRect.height - caretHeight) / 2);
        targetX = lastRect.right - boxRect.left - borderLeft;
        targetY = lastRect.top - boxRect.top - borderTop + box.scrollTop + vOffset;
      }
    } else {
      const wordRect = activeWordSpan.getBoundingClientRect();
      const caretHeight = 28;
      const vOffset = Math.max(0, (wordRect.height - caretHeight) / 2);
      targetX = wordRect.left - boxRect.left - borderLeft;
      targetY = wordRect.top - boxRect.top - borderTop + box.scrollTop + vOffset;
      targetH = caretHeight;
      targetW = 14;
    }

    setCaretX(targetX);
    setCaretY(targetY);
    setCaretH(targetH);
    setCaretW(targetW);
    setCaretVisible(true);
    checkScrollOverflow();
  }, [activeWordIdx, currWordInput.length, caretStyle, checkScrollOverflow]);

  useEffect(() => {
    syncCaret();
    checkScrollOverflow();
    const rafId = requestAnimationFrame(() => {
      syncCaret();
      checkScrollOverflow();
    });

    const box = wordsBoxRef.current;
    const handleUpdate = () => {
      syncCaret();
      checkScrollOverflow();
    };

    window.addEventListener('resize', handleUpdate);
    if (box) {
      box.addEventListener('scroll', handleUpdate);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleUpdate);
      if (box) {
        box.removeEventListener('scroll', handleUpdate);
      }
    };
  }, [syncCaret, checkScrollOverflow]);

  // ── Keystroke Calculations ────────────────────────────────────────────────
  const { correctChars, totalTypedChars, totalErrors } = useMemo(() => {
    let correct = 0;
    let typed = 0;
    let errors = 0;

    // Evaluate fully submitted previous words
    typedWords.forEach((word, wIdx) => {
      const target = targetWords[wIdx] || '';
      for (let i = 0; i < word.length; i++) {
        typed++;
        if (i < target.length && word[i] === target[i]) {
          correct++;
        } else {
          errors++;
        }
      }
      // Trailing space for previous words
      typed++;
      correct++;
    });

    // Evaluate in-progress current word
    const currentTarget = targetWords[activeWordIdx] || '';
    for (let i = 0; i < currWordInput.length; i++) {
      typed++;
      if (i < currentTarget.length && currWordInput[i] === currentTarget[i]) {
        correct++;
      } else {
        errors++;
      }
    }

    return { correctChars: correct, totalTypedChars: typed, totalErrors: errors };
  }, [typedWords, currWordInput, targetWords, activeWordIdx]);

  const activeMinutes = Math.max(elapsed, 1) / 60;
  const liveWpm = Math.round((correctChars / 5) / activeMinutes);
  const liveRawWpm = Math.round((totalTypedChars / 5) / activeMinutes);
  const liveAcc =
    totalTypedChars > 0
      ? Number(((correctChars / totalTypedChars) * 100).toFixed(1))
      : 100;

  // ── High-Precision Drift-Free Timer ───────────────────────────────────────
  const finish = useCallback(() => {
    setFinished(true);
    setActiveKey(null);
    if (timerRef.current) clearInterval(timerRef.current);
    const summary = kinematicTrackerRef.current.analyze();
    setKinematicSummary(summary);
  }, []);

  useEffect(() => {
    if (!startTime || finished) return;

    timerRef.current = setInterval(() => {
      const actualElapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
      setElapsed(actualElapsed);

      // Fresh telemetry snapshot
      const currentStats = liveStatsRef.current;
      const curWords = [...currentStats.typedWords, currentStats.currWordInput];
      let cChars = 0;
      let tChars = 0;

      curWords.forEach((w, idx) => {
        const target = targetWords[idx] || '';
        for (let i = 0; i < w.length; i++) {
          tChars++;
          if (i < target.length && w[i] === target[i]) cChars++;
        }
        if (idx < curWords.length - 1) {
          tChars++;
          cChars++;
        }
      });

      const snapWpm = Math.round((cChars / 5) / (actualElapsed / 60));
      const snapRaw = Math.round((tChars / 5) / (actualElapsed / 60));
      const snapErrors = tChars - cChars;

      setHistory((h) => [
        ...h,
        { sec: actualElapsed, wpm: snapWpm, raw: snapRaw, errs: snapErrors },
      ]);

      if (mode === 'time' && actualElapsed >= timeLimit) {
        finish();
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, finished, mode, timeLimit, finish, targetWords]);

  // ── Keystroke Event Listener ──────────────────────────────────────────────
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (finished) return;

      if (e.key === 'Tab') {
        e.preventDefault();
        onRestart();
        return;
      }

      setActiveKey(e.key);

      if (!startTime && (e.key.length === 1 || e.key === ' ')) {
        setStartTime(Date.now());
      }

      const currentTargetWord = targetWords[activeWordIdx] || '';

      // Spacebar: Advance Word
      if (e.key === ' ') {
        e.preventDefault();
        if (currWordInput.length === 0) return; // Prevent multiple empty spaces

        soundEngine.playKeySound(true, false);
        kinematicTrackerRef.current.recordKeystroke(' ', 'Space', false);

        const nextTyped = [...typedWords, currWordInput];
        setTypedWords(nextTyped);
        setCurrWordInput('');

        const nextWordIdx = activeWordIdx + 1;
        setActiveWordIdx(nextWordIdx);

        // Check completion
        if (nextWordIdx >= targetWords.length || (mode === 'words' && nextWordIdx >= wordLimit)) {
          finish();
        }
        return;
      }

      // Backspace: Delete character or step back into previous word
      if (e.key === 'Backspace') {
        e.preventDefault();
        soundEngine.playKeySound(false, true);
        kinematicTrackerRef.current.recordKeystroke('Backspace', 'Backspace', false);

        if (currWordInput.length > 0) {
          setCurrWordInput((prev) => prev.slice(0, -1));
        } else if (activeWordIdx > 0 && e.ctrlKey) {
          // Jump back to previous word on Ctrl+Backspace
          const prevWord = typedWords[activeWordIdx - 1];
          setTypedWords((prev) => prev.slice(0, -1));
          setCurrWordInput(prevWord || '');
          setActiveWordIdx((prev) => prev - 1);
        }
        return;
      }

      // Single printable character
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const expectedChar = currentTargetWord[currWordInput.length];
        const isErr = expectedChar !== undefined && e.key !== expectedChar;

        soundEngine.playKeySound(false, false, isErr);
        kinematicTrackerRef.current.recordKeystroke(e.key, e.code, isErr);

        // Log to heatmap: track error against the target key
        const heatmapTarget = (expectedChar || e.key).toLowerCase();
        setKeyMap((prev) => {
          const s = prev[heatmapTarget] ?? { total: 0, errors: 0 };
          return {
            ...prev,
            [heatmapTarget]: {
              total: s.total + 1,
              errors: s.errors + (isErr ? 1 : 0),
            },
          };
        });

        // Cap maximum extra characters per word to +10
        if (currWordInput.length < currentTargetWord.length + 10) {
          const nextInput = currWordInput + e.key;
          setCurrWordInput(nextInput);

          // If last word in quote/paragraph mode matches completely
          if (
            activeWordIdx === targetWords.length - 1 &&
            nextInput === currentTargetWord
          ) {
            setTypedWords([...typedWords, nextInput]);
            finish();
          }
        }
      }
    },
    [
      finished,
      startTime,
      activeWordIdx,
      currWordInput,
      targetWords,
      typedWords,
      mode,
      wordLimit,
      onRestart,
      finish,
    ]
  );

  const onKeyUp = useCallback(() => {
    setActiveKey(null);
  }, []);

  // ── Heatmap Color Evaluator ───────────────────────────────────────────────
  const heatColor = (c: string) => {
    const s = keyMap[c];
    if (!s || s.total === 0) return { bg: 'var(--card)', color: 'var(--sub)' };
    const rate = s.errors / s.total;
    if (rate > 0.3) return { bg: '#dc2626', color: '#fff' };
    if (rate > 0.15) return { bg: '#d97706', color: '#fff' };
    return { bg: '#059669', color: '#fff' };
  };

  return (
    <div
      ref={containerRef}
      onClick={() => hiddenInputRef.current?.focus()}
      className="max-w-5xl mx-auto w-full flex flex-col justify-center px-4 py-4 select-none outline-none font-mono"
    >
      {/* Hidden input to capture native keystrokes & mobile IME */}
      <input
        ref={hiddenInputRef}
        type="text"
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        className="opacity-0 absolute w-0 h-0 pointer-events-none"
        autoFocus
        aria-label="Typing input"
      />

      {!finished ? (
        <div className="space-y-4">
          {/* Optional Lesson / Paragraph Info Bar */}
          {mode === 'lesson' && lessonInfo && (
            <div
              className="flex items-center justify-between px-4 py-2.5 rounded-lg border text-xs"
              style={{
                background: 'var(--card)',
                borderColor: 'color-mix(in srgb, var(--sub) 25%, transparent)',
              }}
            >
              <div className="flex items-center space-x-3">
                <span
                  className="px-2 py-0.5 rounded font-bold uppercase text-[10px]"
                  style={{
                    background: 'color-mix(in srgb, var(--main) 20%, transparent)',
                    color: 'var(--main)',
                  }}
                >
                  Lvl {lessonInfo.level} · {lessonInfo.module}
                </span>
                <span className="font-bold text-[var(--text)]">{lessonInfo.title}</span>
                <span className="text-[var(--sub)] hidden sm:inline">
                  Targets: {lessonInfo.targetKeys.join(' ')}
                </span>
              </div>

              {onOpenLessons && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLessons();
                  }}
                  className="px-2.5 py-1 rounded border font-semibold hover:border-[var(--main)] transition-colors"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--sub) 40%, transparent)',
                    color: 'var(--main)',
                  }}
                >
                  Change Lesson ▾
                </button>
              )}
            </div>
          )}

          {mode === 'paragraph' && paragraphInfo && (
            <div
              className="flex items-center justify-between px-4 py-2 rounded-lg border text-xs"
              style={{
                background: 'var(--card)',
                borderColor: 'color-mix(in srgb, var(--sub) 25%, transparent)',
              }}
            >
              <div className="flex items-center space-x-2">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                  style={{
                    background: 'color-mix(in srgb, var(--main) 20%, transparent)',
                    color: 'var(--main)',
                  }}
                >
                  {paragraphInfo.category}
                </span>
                <span className="font-bold text-[var(--text)]">{paragraphInfo.title}</span>
              </div>
              <span className="text-[11px] text-[var(--sub)]">
                {wordsText.length} characters · {targetWords.length} words
              </span>
            </div>
          )}

          {/* ── Live Minimalist HUD ────────────────────────────────────────── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <span
                className="text-3xl font-extrabold tabular-nums tracking-tight"
                style={{ color: 'var(--main)' }}
              >
                {mode === 'time' ? `${Math.max(0, timeLimit - elapsed)}` : liveWpm}
              </span>
              <span className="text-sm font-semibold" style={{ color: 'var(--sub)' }}>
                {mode === 'time' ? 'seconds' : 'wpm'}
              </span>
              <span className="text-sm font-medium" style={{ color: 'var(--sub)' }}>
                {liveAcc}% acc
              </span>
              <span className="text-xs hidden sm:inline" style={{ color: 'var(--sub)' }}>
                {activeWordIdx + 1}/{targetWords.length} words
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Sound Profile Switcher */}
              <div
                className="flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-semibold"
                style={{ background: 'var(--card)', color: 'var(--sub)' }}
              >
                <Volume2 className="w-3.5 h-3.5 mr-0.5 opacity-70" />
                {(['cherry-blue', 'thock', 'typewriter', 'silent'] as SoundProfile[]).map((p) => (
                  <button
                    key={p}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      soundEngine.setProfile(p);
                      setSoundProfile(p);
                      soundEngine.playKeySound();
                    }}
                    className="px-1.5 py-0.5 rounded capitalize transition-colors text-[10px]"
                    style={{
                      color: soundProfile === p ? 'var(--main)' : undefined,
                      fontWeight: soundProfile === p ? 700 : 400,
                    }}
                  >
                    {p === 'cherry-blue' ? 'Cherry' : p}
                  </button>
                ))}
              </div>

              {/* Caret Style Switcher */}
              <div
                className="flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-semibold"
                style={{ background: 'var(--card)', color: 'var(--sub)' }}
              >
                {(['smooth', 'block', 'underline'] as CaretStyle[]).map((s) => (
                  <button
                    key={s}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setCaretStyle(s);
                    }}
                    className="px-1.5 py-0.5 rounded capitalize transition-colors text-[10px]"
                    style={{
                      color: caretStyle === s ? 'var(--main)' : undefined,
                      fontWeight: caretStyle === s ? 700 : 400,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Word Streamer Box with Smooth Caret & Overflow Gradients ─── */}
          <div className="relative rounded-xl">
            <div
              ref={wordsBoxRef}
              onScroll={checkScrollOverflow}
              className="relative overflow-hidden text-2xl leading-relaxed tracking-wider break-words rounded-xl p-5 border transition-all"
              style={{
                background: 'var(--card)',
                borderColor: 'color-mix(in srgb, var(--sub) 20%, transparent)',
                height: '160px',
              }}
            >
              {/* Dynamic Caret Element */}
              <div
                className={`absolute top-0 left-0 pointer-events-none transition-all duration-75 ease-out ${
                  !caretVisible ? 'opacity-0' : 'opacity-100'
                } ${
                  caretStyle === 'smooth'
                    ? 'w-[2.5px] rounded-full bg-[var(--caret,var(--main))] caret-blink shadow-[0_0_8px_var(--caret,var(--main))]'
                    : caretStyle === 'block'
                    ? 'bg-[var(--caret,var(--main))] opacity-35 rounded-sm'
                    : 'bg-[var(--caret,var(--main))] rounded-full'
                }`}
                style={{
                  transform: `translate3d(${caretX}px, ${caretY}px, 0)`,
                  height: `${caretH}px`,
                  width: caretStyle === 'smooth' ? '2.5px' : `${caretW}px`,
                }}
              />

              {/* Word List Rendering */}
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {targetWords.map((word, wIdx) => {
                  const isPassed = wIdx < activeWordIdx;
                  const isCurrent = wIdx === activeWordIdx;
                  const typedWord = isPassed
                    ? typedWords[wIdx] || ''
                    : isCurrent
                    ? currWordInput
                    : '';

                  // Extra characters typed beyond word length
                  const extraChars = isCurrent && currWordInput.length > word.length
                    ? currWordInput.slice(word.length)
                    : '';

                  return (
                    <span
                      key={wIdx}
                      data-word-idx={wIdx}
                      className={`relative inline-block transition-opacity duration-150 ${
                        isPassed ? 'opacity-80' : isCurrent ? 'opacity-100' : 'opacity-50'
                      }`}
                    >
                      {word.split('').map((char, cIdx) => {
                        let charClass = 'text-[var(--sub)]';
                        if (cIdx < typedWord.length) {
                          charClass =
                            typedWord[cIdx] === char
                              ? 'text-[var(--text)] font-semibold'
                              : 'text-[var(--error)] bg-red-500/15 rounded-sm';
                        }

                        return (
                          <span
                            key={cIdx}
                            data-char-idx={cIdx}
                            className={`transition-colors duration-75 ${charClass}`}
                          >
                            {char}
                          </span>
                        );
                      })}

                      {/* Render Extra Characters Typed in Red */}
                      {extraChars.split('').map((xChar, xIdx) => (
                        <span
                          key={`x-${xIdx}`}
                          data-char-idx={word.length + xIdx}
                          className="text-[var(--error)] opacity-90 underline font-bold"
                        >
                          {xChar}
                        </span>
                      ))}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Top Fade Gradient (shown when user scrolled down) */}
            <div
              className="absolute top-[1px] left-[1px] right-[1px] h-10 pointer-events-none rounded-t-[11px] transition-opacity duration-300"
              style={{
                background:
                  'linear-gradient(to bottom, var(--card) 10%, color-mix(in srgb, var(--card) 60%, transparent) 60%, transparent 100%)',
                opacity: canScrollUp ? 1 : 0,
              }}
            />

            {/* Bottom Fade Gradient (shown when text extends below visible viewport) */}
            <div
              className="absolute bottom-[1px] left-[1px] right-[1px] h-16 pointer-events-none rounded-b-[11px] transition-opacity duration-300"
              style={{
                background:
                  'linear-gradient(to top, var(--card) 20%, color-mix(in srgb, var(--card) 70%, transparent) 60%, transparent 100%)',
                opacity: canScrollDown ? 1 : 0,
              }}
            />
          </div>

          {/* Virtual Keyboard (Illuminates on active key press) */}
          {showKeyboard && (
            <VirtualKeyboard
              activeKey={activeKey}
              nextKey={targetWords[activeWordIdx]?.[currWordInput.length] || ' '}
            />
          )}

          {/* Bottom Hint */}
          <div className="text-center">
            <span className="text-xs" style={{ color: 'var(--sub)' }}>
              Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--card)] border border-[var(--sub)]/30 text-[10px]">Tab</kbd> or click ↻ to restart test
            </span>
          </div>
        </div>
      ) : (
        /* ── Post-Test Analytics & Heatmap Dashboard ─────────────────────── */
        <div className="space-y-6 animate-fade-in">
          {/* Summary Stat Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Net WPM', value: liveWpm, color: 'var(--main)' },
              { label: 'Raw WPM', value: liveRawWpm, color: 'var(--text)' },
              { label: 'Accuracy', value: `${liveAcc}%`, color: '#10b981' },
              { label: 'Errors', value: totalErrors, color: 'var(--error)' },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="p-4 rounded-xl border bg-[var(--card)]"
                style={{ borderColor: 'color-mix(in srgb, var(--sub) 25%, transparent)' }}
              >
                <span className="text-xs uppercase font-bold" style={{ color: 'var(--sub)' }}>
                  {label}
                </span>
                <p className="text-4xl font-black mt-1" style={{ color }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* WPM Progression Timeline Chart */}
          <div
            className="p-5 rounded-xl border bg-[var(--card)]"
            style={{ borderColor: 'color-mix(in srgb, var(--sub) 25%, transparent)' }}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--sub)' }}>
              Speed Progression Over Time (Net WPM vs. Raw Keystrokes)
            </h4>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid stroke="var(--sub)" strokeOpacity={0.15} />
                  <XAxis
                    dataKey="sec"
                    stroke="var(--sub)"
                    tickFormatter={(s) => `${s}s`}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis stroke="var(--sub)" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--sub)',
                      color: 'var(--text)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="wpm"
                    stroke="var(--main)"
                    strokeWidth={3}
                    dot={false}
                    name="Net WPM"
                  />
                  <Line
                    type="monotone"
                    dataKey="raw"
                    stroke="var(--sub)"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                    name="Raw WPM"
                  />
                  <Line
                    type="monotone"
                    dataKey="errs"
                    stroke="var(--error)"
                    strokeWidth={1.5}
                    dot={false}
                    name="Errors"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Keyboard Error Heatmap */}
          <div
            className="p-5 rounded-xl border bg-[var(--card)]"
            style={{ borderColor: 'color-mix(in srgb, var(--sub) 25%, transparent)' }}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--sub)' }}>
              Key Precision Heatmap
            </h4>
            <p className="text-xs mb-4" style={{ color: 'var(--sub)' }}>
              Keys frequently missed highlight in amber/red with negative error counts.
            </p>
            <div
              className="flex flex-col items-center gap-1.5 p-3 rounded-lg"
              style={{ background: 'var(--bg)' }}
            >
              {KB_ROWS.map((row, ri) => (
                <div key={ri} className="flex gap-1.5" style={{ marginLeft: ri * 14 }}>
                  {row.map((k) => {
                    const { bg, color } = heatColor(k);
                    const errCount = keyMap[k]?.errors || 0;
                    return (
                      <div
                        key={k}
                        className="w-9 h-9 rounded flex flex-col items-center justify-center text-xs font-bold uppercase shadow-sm transition-all"
                        style={{ background: bg, color }}
                      >
                        <span>{k}</span>
                        {errCount > 0 && (
                          <span className="text-[8px] opacity-75 leading-none">
                            -{errCount}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Kinematic & Ergonomics Inspection Actions */}
          {kinematicSummary && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowKinematicsModal((k) => !k);
                  setShowErgonomicsModal(false);
                }}
                className="px-4 py-2 text-xs font-bold rounded-lg border flex items-center space-x-2 transition"
                style={{
                  background: showKinematicsModal ? 'var(--main)' : 'var(--card)',
                  color: showKinematicsModal ? 'var(--bg)' : 'var(--text)',
                  borderColor: 'var(--main)',
                }}
              >
                <Activity className="w-4 h-4" />
                <span>
                  {showKinematicsModal
                    ? 'Hide Kinematics'
                    : `Kinematic Diagnostics (${kinematicSummary.sfbs.count} SFBs)`}
                </span>
              </button>

              <button
                onClick={() => {
                  setShowErgonomicsModal((e) => !e);
                  setShowKinematicsModal(false);
                }}
                className="px-4 py-2 text-xs font-bold rounded-lg border flex items-center space-x-2 transition"
                style={{
                  background: showErgonomicsModal ? '#10b981' : 'var(--card)',
                  color: showErgonomicsModal ? '#fff' : 'var(--text)',
                  borderColor: '#10b981',
                }}
              >
                <HeartPulse className="w-4 h-4" />
                <span>
                  {showErgonomicsModal
                    ? 'Hide Ergonomics'
                    : `Ergonomic Load (${kinematicSummary.ergonomics.leftHandPercent}% L / ${kinematicSummary.ergonomics.rightHandPercent}% R)`}
                </span>
              </button>
            </div>
          )}

          {/* Render Kinematics or Ergonomics */}
          {showKinematicsModal && kinematicSummary && (
            <KinematicsDashboard
              summary={kinematicSummary}
              onClose={() => setShowKinematicsModal(false)}
            />
          )}

          {showErgonomicsModal && kinematicSummary && (
            <ErgonomicsPanel
              ergonomics={kinematicSummary.ergonomics}
              fatigue={kinematicSummary.fatigue}
            />
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={onRestart}
              className="px-6 py-2.5 font-bold text-xs uppercase tracking-wider rounded-lg transition-opacity hover:opacity-90 shadow-md"
              style={{ background: 'var(--main)', color: 'var(--bg)' }}
            >
              ↻ Start New Run
            </button>

            {mode === 'lesson' && onNextLesson && (
              <button
                onClick={onNextLesson}
                className="px-5 py-2 font-bold text-xs uppercase rounded-lg transition-opacity hover:opacity-90 shadow"
                style={{
                  background: 'color-mix(in srgb, var(--main) 25%, var(--card))',
                  border: '1.5px solid var(--main)',
                  color: 'var(--main)',
                }}
              >
                Next Lesson →
              </button>
            )}

            {mode === 'lesson' && onOpenLessons && (
              <button
                onClick={onOpenLessons}
                className="px-4 py-2 font-bold text-xs uppercase rounded-lg border transition-colors hover:border-[var(--main)]"
                style={{
                  borderColor: 'color-mix(in srgb, var(--sub) 40%, transparent)',
                  color: 'var(--text)',
                }}
              >
                Lesson Catalog 📚
              </button>
            )}

            <button
              onClick={onSwitchToExam}
              className="px-5 py-2 font-bold text-xs uppercase rounded-lg border transition-colors hover:bg-white/5"
              style={{
                background: 'transparent',
                color: 'var(--text)',
                borderColor: 'var(--sub)',
              }}
            >
              🏛️ SSC CGL DEST Mode →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
