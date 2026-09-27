import React, { useState, useEffect, useCallback } from 'react';
import { ModernTypingEngine, type GameMode } from './components/ModernTypingEngine';
import { TcsIonSimulator } from './components/TcsIonSimulator';
import { ThemeSelector } from './components/ThemeSelector';
import { LessonSelector } from './components/LessonSelector';
import { GenerativeTypingDrill } from './components/GenerativeTypingDrill';
import { MicroEditingDrill } from './components/MicroEditingDrill';
import { LookaheadDrill } from './components/LookaheadDrill';
import { PublicApiModal } from './components/PublicApiModal';
import { OnboardingModal } from './components/OnboardingModal';
import {
  generateText,
  getRandomPassage,
  getRandomParagraph,
  SSC_PASSAGES,
} from './lib/textGenerator';
import { TYPING_LESSONS, type TypingLesson } from './lib/lessons';
import { applyTheme, THEMES } from './lib/themes';
import { PassageManager, CORPUS_1000_PASSAGES, type CorpusPassage } from './lib/corpus1000';
import { SSC_PYQ_PASSAGES, type SscPyqPassage } from './lib/sscPyqPassages';
import {
  Brain,
  Wrench,
  Eye,
  Shield,
  Keyboard,
  Globe,
  Shuffle,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';

export type AppMainMode =
  | 'classic'
  | 'exam'
  | 'generative'
  | 'micro-editing'
  | 'lookahead';

const MODE_DESCRIPTIONS: Record<
  AppMainMode,
  { label: string; icon: string; desc: string }
> = {
  classic: {
    label: 'Monkeytype Engine & 1,000+ Exam Corpus',
    icon: '⌨️',
    desc: 'Kinematic typing tests with inter-key latency diagnostics, SFB bottleneck detection, and mechanical key sounds.',
  },
  exam: {
    label: 'TCS iON SSC DEST Exam Simulator',
    icon: '🛡️',
    desc: 'Official 15-minute examination console with 12 authentic CGL/CHSL PYQ shifts: 2,000 key depressions target, KDPH speed scoring, and Full/Half mistake penalties.',
  },
  generative: {
    label: 'Pillar 1: Thought-to-Keyboard & Audio Dictation',
    icon: '🧠',
    desc: 'Train original composition velocity, cognitive formulation pause telemetry, and real-time auditory shadowing.',
  },
  'micro-editing': {
    label: 'Pillar 2: Micro-Editing & Locomotion Sandbox',
    icon: '🔧',
    desc: 'Mouse navigation strictly blocked! Remediate code errors using Ctrl+Arrows, Home/End, and master IDE snippet autocomplete.',
  },
  lookahead: {
    label: 'Pillar 4: Visual Lookahead & Eye-Buffer Training',
    icon: '👁️',
    desc: 'Dynamic trailing curtain masking hides active words to condition your visual gaze 2–4 words ahead of motor output.',
  },
};

export default function App() {
  const [appMode, setAppMode] = useState<AppMainMode>('classic');
  const [gameMode, setGameMode] = useState<GameMode>('time');
  const [timeLimit, setTimeLimit] = useState(30);
  const [wordLimit, setWordLimit] = useState(25);
  const [punct, setPunct] = useState(false);
  const [nums, setNums] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [text, setText] = useState('');
  const [textKey, setTextKey] = useState(0);

  // 1,000+ Corpus & Non-Repeat Shuffler State
  const [currentCorpusPassage, setCurrentCorpusPassage] = useState<CorpusPassage>(
    CORPUS_1000_PASSAGES[0]
  );
  const [corpusCategory, setCorpusCategory] = useState<CorpusPassage['category'] | 'ALL'>('ALL');
  const [corpusStats, setCorpusStats] = useState(PassageManager.getStats());

  // Public API Modal State
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // Onboarding Modal State (shows on first visit)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('protypist_onboarded');
  });

  // Lessons State
  const [currentLesson, setCurrentLesson] = useState<TypingLesson>(TYPING_LESSONS[0]);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  // Exam Mode State (defaults to authentic official PYQ passage)
  const [examPassage, setExamPassage] = useState<CorpusPassage | SscPyqPassage>(
    () => SSC_PYQ_PASSAGES[0]
  );

  // Apply saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('typepulse_theme') || 'serikaDark';
    if (THEMES[saved]) {
      applyTheme(THEMES[saved]);
    } else if (THEMES.darkMagic) {
      applyTheme(THEMES.darkMagic);
    }
  }, []);

  // Keyboard shortcut: Alt + K toggles on-screen keyboard
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setShowKeyboard((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, []);

  // Keep corpusStats synced
  useEffect(() => {
    setCorpusStats(PassageManager.getStats());
  }, []);

  const shuffleNextPassage = useCallback(() => {
    const category = corpusCategory === 'ALL' ? undefined : corpusCategory;
    const { passage } = PassageManager.getNextPassage(category, currentCorpusPassage.id);
    setCurrentCorpusPassage(passage);
    setExamPassage(passage);
    setText(passage.text);
    setTextKey((k) => k + 1);
    setCorpusStats(PassageManager.getStats());
  }, [corpusCategory, currentCorpusPassage.id]);

  const resetPassageCycle = useCallback(() => {
    PassageManager.resetSeenHistory();
    setCorpusStats(PassageManager.getStats());
    shuffleNextPassage();
  }, [shuffleNextPassage]);

  const shuffle = useCallback(() => {
    if (gameMode === 'lesson') {
      setText(currentLesson.text);
    } else if (gameMode === 'paragraph') {
      shuffleNextPassage();
    } else {
      setText(
        generateText({
          mode: gameMode,
          wordCount: gameMode === 'words' ? wordLimit : 150,
          includePunctuation: punct,
          includeNumbers: nums,
        })
      );
    }
    setTextKey((k) => k + 1);
  }, [gameMode, wordLimit, punct, nums, currentLesson, shuffleNextPassage]);

  // Avoid double mount on paragraph mode
  useEffect(() => {
    if (gameMode === 'paragraph') {
      setText(currentCorpusPassage.text);
      setTextKey((k) => k + 1);
      return;
    }
    shuffle();
  }, [gameMode, currentLesson, wordLimit, punct, nums, shuffle]);

  const handleSelectLesson = (lesson: TypingLesson) => {
    setCurrentLesson(lesson);
    setText(lesson.text);
    setTextKey((k) => k + 1);
  };

  const handleNextLesson = () => {
    const currIdx = TYPING_LESSONS.findIndex((l) => l.id === currentLesson.id);
    const nextIdx = (currIdx + 1) % TYPING_LESSONS.length;
    handleSelectLesson(TYPING_LESSONS[nextIdx]);
  };

  const handleCustomOrApiPassage = (customText: string, customTitle: string) => {
    setText(customText);
    setTextKey((k) => k + 1);
    setExamPassage({
      id: `custom-${Date.now()}`,
      title: customTitle,
      category: 'SSC_DEST_OFFICIAL',
      keystrokes: customText.length,
      wordCount: customText.trim().split(/\s+/).length,
      text: customText,
    });
  };

  // ─── Standard Platform View ───────────────────────────────────────────────
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      {/* ═══ TOP MASTER NAVIGATION BAR ═══════════════════════════════════════ */}
      <nav
        className="flex flex-wrap items-center justify-between px-5 py-2.5 border-b gap-3 select-none"
        style={{
          background: 'var(--card)',
          borderColor: 'color-mix(in srgb, var(--sub) 25%, transparent)',
        }}
      >
        {/* Brand & Theme Selector */}
        <div className="flex items-center space-x-3">
          <div
            onClick={() => setAppMode('classic')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <span
              className="font-black text-lg tracking-widest font-mono"
              style={{ color: 'var(--main)' }}
            >
              ProTypist
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30">
              NEXT-GEN
            </span>
          </div>

          <ThemeSelector />
        </div>

        {/* Center: Module Mode Switcher Pills (Horizontal Scroll on Mobile) */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-black/25 border border-slate-700/50 text-xs overflow-x-auto max-w-full">
          <button
            onClick={() => setAppMode('classic')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 whitespace-nowrap transition ${
              appMode === 'classic'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Monkeytype</span>
          </button>

          <button
            onClick={() => setAppMode('exam')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 whitespace-nowrap transition ${
              appMode === 'exam'
                ? 'bg-blue-600 text-white font-bold shadow'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>TCS iON SSC Exam</span>
            <span className="text-[9px] px-1 py-0.5 rounded font-extrabold uppercase bg-amber-400 text-slate-900 ml-0.5">
              12 PYQs
            </span>
          </button>

          <button
            onClick={() => setAppMode('generative')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 whitespace-nowrap transition ${
              appMode === 'generative'
                ? 'bg-purple-600 text-white font-bold shadow'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Generative Typing</span>
          </button>

          <button
            onClick={() => setAppMode('micro-editing')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 whitespace-nowrap transition ${
              appMode === 'micro-editing'
                ? 'bg-sky-600 text-white font-bold shadow'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Micro-Editing</span>
          </button>

          <button
            onClick={() => setAppMode('lookahead')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 whitespace-nowrap transition ${
              appMode === 'lookahead'
                ? 'bg-amber-600 text-white font-bold shadow'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visual Lookahead</span>
          </button>
        </div>

        {/* Right Tools: 1,000+ Shuffler & Public API */}
        <div className="flex items-center space-x-2 text-xs">
          {/* 1,000+ Shuffler Tracker */}
          <div className="flex items-center space-x-1">
            <button
              onClick={shuffleNextPassage}
              title="Click to load next non-repeating unseen passage"
              className="px-2.5 py-1.5 rounded-lg border flex items-center space-x-1.5 hover:border-[var(--main)] transition"
              style={{
                borderColor: 'color-mix(in srgb, var(--sub) 30%, transparent)',
                background: 'var(--card)',
              }}
            >
              <Shuffle className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-mono text-[11px]">
                📖 {corpusStats.seenCount} / {corpusStats.total} seen
              </span>
            </button>
            <button
              onClick={resetPassageCycle}
              title="Reset seen passage tracker back to zero"
              className="px-1.5 py-1.5 rounded-lg border text-[10px] opacity-60 hover:opacity-100 transition"
              style={{
                borderColor: 'color-mix(in srgb, var(--sub) 20%, transparent)',
              }}
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Online Public API & File Upload */}
          <button
            onClick={() => setIsApiModalOpen(true)}
            title="Connect to public Quotable/Wikipedia APIs or upload text"
            className="px-2.5 py-1.5 rounded-lg border flex items-center space-x-1.5 hover:border-[var(--main)] transition"
            style={{
              borderColor: 'color-mix(in srgb, var(--sub) 30%, transparent)',
              background: 'var(--card)',
            }}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Online API / Upload</span>
          </button>

          {/* Virtual Keyboard Toggle */}
          <button
            onClick={() => setShowKeyboard(!showKeyboard)}
            title="Toggle Virtual Keyboard (Alt + K)"
            className="px-2.5 py-1.5 rounded-lg border transition flex items-center space-x-1"
            style={{
              borderColor: showKeyboard ? 'var(--main)' : 'color-mix(in srgb, var(--sub) 30%, transparent)',
              color: showKeyboard ? 'var(--main)' : undefined,
            }}
          >
            <span>⌨️</span>
            <span className="hidden md:inline">Alt+K</span>
          </button>

          {/* Guide / Onboarding Button */}
          <button
            onClick={() => setIsOnboardingOpen(true)}
            title="Open ProTypist Framework Guide & Onboarding"
            className="px-2 py-1.5 rounded-lg border transition text-sky-400 hover:text-sky-300"
            style={{
              borderColor: 'color-mix(in srgb, var(--sub) 30%, transparent)',
            }}
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* ═══ CONTEXTUAL MODE DESCRIPTION BANNER ═════════════════════════════ */}
      <div
        className="flex items-center justify-between px-5 py-2 border-b text-xs select-none transition-all"
        style={{
          background: 'color-mix(in srgb, var(--card) 60%, transparent)',
          borderColor: 'color-mix(in srgb, var(--sub) 15%, transparent)',
        }}
      >
        <div className="flex items-center space-x-2">
          <span className="text-base">{MODE_DESCRIPTIONS[appMode].icon}</span>
          <span className="font-bold" style={{ color: 'var(--main)' }}>
            {MODE_DESCRIPTIONS[appMode].label}:
          </span>
          <span className="opacity-80 hidden sm:inline">
            {MODE_DESCRIPTIONS[appMode].desc}
          </span>
        </div>

        <button
          onClick={() => setIsOnboardingOpen(true)}
          className="flex items-center space-x-1 text-[11px] opacity-70 hover:opacity-100 transition px-2 py-0.5 rounded border border-transparent hover:border-slate-700"
        >
          <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden md:inline">Framework Guide</span>
        </button>
      </div>

      {/* ═══ ACTIVE VIEWPORT SWITCHER ════════════════════════════════════════ */}
      {appMode === 'exam' ? (
        <TcsIonSimulator
          passageText={examPassage.text}
          passageTitle={examPassage.title}
          onExit={() => setAppMode('classic')}
          onNextPassage={shuffleNextPassage}
          onSelectPyqPassage={(pyq) => setExamPassage(pyq)}
        />
      ) : (
        <main className="flex-1 flex flex-col items-center justify-start p-3 sm:px-6 w-full">
          {appMode === 'generative' && (
            <div className="w-full my-auto py-4">
              <GenerativeTypingDrill />
            </div>
          )}
          {appMode === 'micro-editing' && (
            <div className="w-full my-auto py-4">
              <MicroEditingDrill />
            </div>
          )}
          {appMode === 'lookahead' && (
            <div className="w-full my-auto py-4">
              <LookaheadDrill />
            </div>
          )}

          {appMode === 'classic' && (
            <div className="w-full flex flex-col items-center my-auto py-4">
            {/* ── Sub-Mode Controller Strip ───────────────────────────────── */}
            <div
              className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-xl border mb-4 shadow-sm"
              style={{
                background: 'var(--card)',
                borderColor: 'color-mix(in srgb, var(--sub) 25%, transparent)',
                color: 'var(--sub)',
              }}
            >
              {/* Core modes */}
              {(['time', 'words', 'quote', 'paragraph', 'lesson'] as GameMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setGameMode(m)}
                  className="px-2.5 py-1 rounded capitalize transition-colors"
                  style={{
                    color: gameMode === m ? 'var(--main)' : undefined,
                    fontWeight: gameMode === m ? 700 : 400,
                  }}
                >
                  {m === 'paragraph' ? '1,000+ Exam Corpus' : m}
                </button>
              ))}

              <span style={{ color: 'var(--sub)', opacity: 0.35 }}>|</span>

              {/* Time limits */}
              {gameMode === 'time' && (
                <>
                  {[15, 30, 60, 120].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeLimit(t)}
                      className="px-2 py-1 rounded transition-colors font-mono"
                      style={{
                        color: timeLimit === t ? 'var(--main)' : undefined,
                        fontWeight: timeLimit === t ? 700 : 400,
                      }}
                    >
                      {t}s
                    </button>
                  ))}
                </>
              )}

              {/* Word limits */}
              {gameMode === 'words' && (
                <>
                  {[10, 25, 50, 100].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWordLimit(w)}
                      className="px-2 py-1 rounded transition-colors font-mono"
                      style={{
                        color: wordLimit === w ? 'var(--main)' : undefined,
                        fontWeight: wordLimit === w ? 700 : 400,
                      }}
                    >
                      {w}
                    </button>
                  ))}
                </>
              )}

              {/* Corpus Category Filter (When in 1,000+ Exam Corpus Mode) */}
              {gameMode === 'paragraph' && (
                <div className="flex items-center space-x-1">
                  {(
                    [
                      'ALL',
                      'SSC_DEST_OFFICIAL',
                      'INDIAN_POLITY_ECONOMY',
                      'EDITORIALS_GOVERNANCE',
                      'SCIENCE_TECHNOLOGY',
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCorpusCategory(cat);
                        const { passage } = PassageManager.getNextPassage(
                          cat === 'ALL' ? undefined : cat,
                          currentCorpusPassage.id
                        );
                        setCurrentCorpusPassage(passage);
                        setExamPassage(passage);
                        setText(passage.text);
                        setTextKey((k) => k + 1);
                        setCorpusStats(PassageManager.getStats());
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                        corpusCategory === cat
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      {cat === 'ALL'
                        ? 'All'
                        : cat === 'SSC_DEST_OFFICIAL'
                        ? 'SSC Official'
                        : cat === 'INDIAN_POLITY_ECONOMY'
                        ? 'Polity'
                        : cat === 'EDITORIALS_GOVERNANCE'
                        ? 'Editorials'
                        : 'SciTech'}
                    </button>
                  ))}
                </div>
              )}

              {/* Modifiers */}
              {(gameMode === 'time' || gameMode === 'words') && (
                <>
                  <span style={{ color: 'var(--sub)', opacity: 0.35 }}>|</span>
                  <button
                    onClick={() => setPunct(!punct)}
                    className="px-2 py-1 rounded transition-colors"
                    style={{ color: punct ? 'var(--main)' : undefined }}
                  >
                    @ punct
                  </button>
                  <button
                    onClick={() => setNums(!nums)}
                    className="px-2 py-1 rounded transition-colors"
                    style={{ color: nums ? 'var(--main)' : undefined }}
                  >
                    # numbers
                  </button>
                </>
              )}

              {/* Shuffle button */}
              <span style={{ color: 'var(--sub)', opacity: 0.35 }}>|</span>
              <button
                onClick={shuffle}
                title="Restart / Shuffle next"
                className="px-2 py-1 rounded hover:text-[var(--main)] transition"
              >
                ↻ Shuffle
              </button>
            </div>

            {/* Modern Typing Engine */}
            <ModernTypingEngine
              key={textKey}
              wordsText={text}
              mode={gameMode}
              timeLimit={timeLimit}
              wordLimit={wordLimit}
              showKeyboard={showKeyboard}
              lessonInfo={
                gameMode === 'lesson'
                  ? {
                      id: currentLesson.id,
                      title: currentLesson.title,
                      module: currentLesson.module,
                      level: currentLesson.level,
                      targetKeys: currentLesson.targetKeys,
                    }
                  : undefined
              }
              paragraphInfo={
                gameMode === 'paragraph'
                  ? {
                      id: currentCorpusPassage.id,
                      title: currentCorpusPassage.title,
                      category: currentCorpusPassage.category,
                    }
                  : undefined
              }
              onOpenLessons={() => setIsLessonModalOpen(true)}
              onNextLesson={handleNextLesson}
              onRestart={shuffle}
              onSwitchToExam={() => setAppMode('exam')}
            />
          </div>
        )}
      </main>
      )}

      {/* ═══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer
        className="text-center py-2 text-xs border-t select-none flex items-center justify-between px-6"
        style={{
          color: 'var(--sub)',
          borderColor: 'color-mix(in srgb, var(--sub) 15%, transparent)',
        }}
      >
        <div>
          <kbd className="px-1.5 py-0.5 rounded mr-1" style={{ background: 'var(--card)' }}>
            Tab
          </kbd>
          <span>restart test</span>
          <span className="mx-2">•</span>
          <kbd className="px-1.5 py-0.5 rounded mr-1" style={{ background: 'var(--card)' }}>
            Alt+K
          </kbd>
          <span>toggle keyboard</span>
        </div>

        <div className="font-mono text-[11px] opacity-70">
          ProTypist • 100% Offline Multi-Sensory Pipeline
        </div>
      </footer>

      {/* ═══ MODALS ═══════════════════════════════════════════════════════════ */}
      <LessonSelector
        currentLessonId={currentLesson.id}
        onSelectLesson={handleSelectLesson}
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
      />

      <PublicApiModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onSelectPassage={handleCustomOrApiPassage}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSelectMode={(m) => setAppMode(m)}
      />
    </div>
  );
}
