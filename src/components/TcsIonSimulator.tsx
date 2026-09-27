import React, { useState, useEffect, useRef, useCallback } from 'react';
import { evaluateSscDest, type SscCategory, type SscResult } from '@/lib/sscEvaluation';
import { soundEngine, type SoundProfile } from '@/lib/soundEngine';
import { KinematicTracker, type KinematicAnalysisSummary } from '@/lib/kinematicTelemetry';
import { SscScorecardModal } from './SscScorecardModal';
import { SscPyqModal } from './SscPyqModal';
import { SSC_PYQ_PASSAGES, type SscPyqPassage } from '@/lib/sscPyqPassages';
import { Volume2, BookOpen } from 'lucide-react';

interface Props {
  passageText: string;
  passageTitle: string;
  onExit: () => void;
  onNextPassage: () => void;
  onSelectPyqPassage?: (passage: SscPyqPassage) => void;
}

export const TcsIonSimulator: React.FC<Props> = ({
  passageText,
  passageTitle,
  onExit,
  onNextPassage,
  onSelectPyqPassage,
}) => {
  const [typedText, setTypedText] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [category, setCategory] = useState<SscCategory>('UR');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<SscResult | null>(null);
  const [started, setStarted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [examReady, setExamReady] = useState(false);
  const [soundProfile, setSoundProfile] = useState<SoundProfile>(soundEngine.getProfile());
  const [kinematicSummary, setKinematicSummary] = useState<KinematicAnalysisSummary | null>(null);
  const kinematicTrackerRef = useRef(new KinematicTracker());

  // Active PYQ Passage Management
  const [activePyq, setActivePyq] = useState<SscPyqPassage | null>(() => {
    return (
      SSC_PYQ_PASSAGES.find((p) => p.text === passageText || p.title === passageTitle) ||
      SSC_PYQ_PASSAGES[0]
    );
  });
  const [currentPassageText, setCurrentPassageText] = useState<string>(() => {
    return passageText || SSC_PYQ_PASSAGES[0].text;
  });
  const [currentPassageTitle, setCurrentPassageTitle] = useState<string>(() => {
    return passageTitle || SSC_PYQ_PASSAGES[0].title;
  });
  const [isPyqModalOpen, setIsPyqModalOpen] = useState(false);

  const taRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // References to prevent stale closure during auto-submission
  const typedTextRef = useRef('');
  typedTextRef.current = typedText;

  const categoryRef = useRef<SscCategory>('UR');
  categoryRef.current = category;

  const submittedRef = useRef(false);
  submittedRef.current = submitted;

  const examReadyRef = useRef(false);
  examReadyRef.current = examReady;

  // Auto-focus textarea on start
  useEffect(() => {
    if (examReady && !submitted) {
      taRef.current?.focus();
    }
  }, [examReady, submitted]);

  // Sync when prop passage changes
  useEffect(() => {
    setCurrentPassageText(passageText);
    setCurrentPassageTitle(passageTitle);
    const found = SSC_PYQ_PASSAGES.find((p) => p.text === passageText || p.title === passageTitle);
    setActivePyq(found || null);
  }, [passageText, passageTitle]);

  // Reset when active passage text changes
  useEffect(() => {
    setTypedText('');
    typedTextRef.current = '';
    setSecondsLeft(15 * 60);
    setSubmitted(false);
    submittedRef.current = false;
    setResult(null);
    setStarted(false);
    setShowConfirmModal(false);
    setExamReady(false);
    kinematicTrackerRef.current.reset();
    setKinematicSummary(null);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [currentPassageText]);

  const handleSelectPyq = (pyq: SscPyqPassage) => {
    setActivePyq(pyq);
    setCurrentPassageText(pyq.text);
    setCurrentPassageTitle(pyq.title);
    setTypedText('');
    typedTextRef.current = '';
    setSecondsLeft(15 * 60);
    setSubmitted(false);
    submittedRef.current = false;
    setResult(null);
    setStarted(false);
    setShowConfirmModal(false);
    setExamReady(false);
    kinematicTrackerRef.current.reset();
    setKinematicSummary(null);
    if (timerRef.current) clearInterval(timerRef.current);
    onSelectPyqPassage?.(pyq);
  };

  const doSubmit = useCallback(() => {
    if (submittedRef.current) return;
    setSubmitted(true);
    submittedRef.current = true;
    setShowConfirmModal(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const activeText = typedTextRef.current;
    const activeCat = categoryRef.current;
    const r = evaluateSscDest(currentPassageText, activeText, activeCat, 15);
    setResult(r);
    const kinSummary = kinematicTrackerRef.current.analyze();
    setKinematicSummary(kinSummary);
  }, [currentPassageText]);

  // 15-minute countdown with zero stale closure
  useEffect(() => {
    if (submitted || !examReady) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          doSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [submitted, examReady, doSubmit]);

  // Security Interceptor (Right-click, Cut, Copy, Paste, Drag)
  const block = (e: React.SyntheticEvent) => {
    e.preventDefault();
    return false;
  };

  // Keyboard shortcut blocking (Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, F5, Ctrl+R)
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!started) setStarted(true);
    soundEngine.playKeySound(e.key === ' ', e.key === 'Backspace');
    kinematicTrackerRef.current.recordKeystroke(e.key, e.code);

    if (e.ctrlKey || e.metaKey) {
      const blockedKeys = ['c', 'v', 'x', 'a', 'r', 'p', 'u', 's'];
      if (blockedKeys.includes(e.key.toLowerCase())) {
        e.preventDefault();
        return false;
      }
    }
    if (e.key === 'F5') {
      e.preventDefault();
      return false;
    }
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  const strokes = typedText.length;
  const strokePct = Math.min(100, (strokes / 2000) * 100);
  const wordCount = typedText.trim() ? typedText.trim().split(/\s+/).length : 0;

  return (
    <div
      className="flex flex-col h-screen w-screen text-xs select-none overflow-hidden"
      style={{ background: '#f0f0f0', color: '#222', fontFamily: 'Arial, sans-serif' }}
      onContextMenu={block}
    >
      {/* ═══ HEADER ═══════════════════════════════════════════════════════════ */}
      <header
        className="flex items-center justify-between px-4 py-2 shadow-sm"
        style={{ background: '#244c6d', color: '#fff', borderBottom: '3px solid #f39c12' }}
      >
        <div className="flex items-center space-x-3">
          <div
            className="px-2 py-0.5 rounded font-extrabold text-sm tracking-wider"
            style={{ background: '#fff', color: '#244c6d' }}
          >
            iON
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide leading-tight">
              STAFF SELECTION COMMISSION — CGL TIER-II
            </h1>
            <p className="text-[10px]" style={{ color: '#b0c4de' }}>
              Module-II: Data Entry Speed Assessment Test (DEST)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-5">
          {/* Candidate info */}
          <div className="text-right leading-snug hidden sm:block">
            <div>
              Candidate:{' '}
              <strong style={{ color: '#ffd700' }}>BHUMIT SHARMA</strong>
            </div>
            <div className="text-[10px]" style={{ color: '#b0c4de' }}>
              Roll No: <strong className="font-mono">2201049182</strong> &nbsp;|&nbsp;
              Node: <strong>LAB-02 C-108</strong>
            </div>
            <div className="mt-0.5 flex items-center justify-end space-x-1">
              <span>Category:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SscCategory)}
                disabled={started}
                className="px-1 rounded border text-[11px] focus:outline-none"
                style={{ background: '#19364f', color: '#fff', borderColor: '#456' }}
              >
                <option value="UR">UR (≤20%)</option>
                <option value="OBC">OBC (≤25%)</option>
                <option value="EWS">EWS (≤25%)</option>
                <option value="SC">SC (≤30%)</option>
                <option value="ST">ST (≤30%)</option>
                <option value="PwD">PwD (≤30%)</option>
              </select>
            </div>
          </div>

          {/* Photo placeholder */}
          <div
            className="w-11 h-14 rounded flex items-center justify-center"
            style={{ background: '#c8d6e5', border: '2px solid #fff' }}
          >
            <svg className="w-6 h-6" style={{ color: '#7f8c8d' }} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </header>

      {/* ═══ SUB-HEADER: TIMER & STATS ════════════════════════════════════════ */}
      <div
        className="flex items-center justify-between px-4 py-1.5 shadow-sm text-xs"
        style={{ background: '#1a365d', color: '#ecf0f1' }}
      >
        <div className="flex items-center space-x-3">
          <span className="font-semibold">
            Passage:{' '}
            <span style={{ color: '#f1c40f' }}>{currentPassageTitle}</span>
          </span>
          {activePyq && (
            <span className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-blue-500/30 text-blue-200 border border-blue-400/30">
              {activePyq.exam} • {activePyq.year} ({activePyq.shift})
            </span>
          )}
          <span style={{ color: '#7f8c8d' }}>|</span>
          <span className="text-[11px]" style={{ color: '#bdc3c7' }}>
            Target: <strong>2,000 Key Depressions</strong> (15 min)
          </span>
          <button
            onClick={() => setIsPyqModalOpen(true)}
            className="ml-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 transition flex items-center space-x-1"
            title="Browse official SSC previous year question papers"
          >
            <BookOpen className="w-3 h-3" />
            <span>Select PYQ</span>
          </button>
        </div>

        {/* Sound Profile Switcher */}
        <div className="hidden md:flex items-center space-x-1 bg-black/30 px-2 py-0.5 rounded border border-white/10 text-[10px]">
          <Volume2 className="w-3 h-3 text-sky-300 mr-0.5" />
          {(['cherry-blue', 'thock', 'typewriter', 'pop', 'silent'] as SoundProfile[]).map((sp) => (
            <button
              key={sp}
              onClick={() => {
                soundEngine.setProfile(sp);
                setSoundProfile(sp);
              }}
              className={`px-1.5 py-0.5 rounded capitalize transition ${
                soundProfile === sp
                  ? 'bg-amber-400 text-slate-900 font-bold'
                  : 'opacity-65 hover:opacity-100 text-slate-300'
              }`}
            >
              {sp === 'cherry-blue' ? 'Cherry' : sp}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <span className="uppercase text-[10px] tracking-wider" style={{ color: '#bdc3c7' }}>
            Time Remaining:
          </span>
          <div
            className="px-2.5 py-0.5 rounded font-mono text-sm font-bold tracking-widest shadow-inner"
            style={{
              background: secondsLeft < 120 ? '#c0392b' : '#0d233a',
              color: secondsLeft < 120 ? '#fff' : '#f39c12',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {mm}:{ss}
          </div>
        </div>
      </div>

      {/* ═══ START GATE OR SPLIT VIEW ═══════════════════════════════════════ */}
      {!examReady ? (
        <main className="flex-1 flex flex-col items-center justify-center p-4" style={{ background: '#f0f0f0' }}>
          <div className="bg-white rounded shadow-md p-6 max-w-xl w-full text-center" style={{ borderTop: '4px solid #244c6d' }}>
            <h2 className="text-xl font-bold mb-1" style={{ color: '#244c6d' }}>DEST — Data Entry Speed Assessment Test</h2>
            <p className="text-xs text-gray-500 mb-4">Official Staff Selection Commission Examination Simulation</p>

            {/* Selected PYQ Paper Card */}
            <div className="p-3.5 mb-5 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50/80 to-slate-50 text-left">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white">
                  {activePyq ? `${activePyq.exam} • ${activePyq.year} (${activePyq.shift})` : 'Official DEST Paper'}
                </span>
                <button
                  onClick={() => setIsPyqModalOpen(true)}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 underline flex items-center space-x-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Choose from 12 PYQs →</span>
                </button>
              </div>
              <div className="font-bold text-slate-900 text-base leading-snug">
                {currentPassageTitle}
              </div>
              {activePyq && (
                <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                  {activePyq.description}
                </p>
              )}
              <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 font-medium">
                <span>Category: <strong>{activePyq?.category || 'General'}</strong></span>
                <span>•</span>
                <span>Target: <strong>~{activePyq?.targetKeystrokes.toLocaleString() || '2,000'}</strong> Key Depressions</span>
                <span>•</span>
                <span>Words: <strong>{activePyq?.wordCount || 240}</strong></span>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded border border-slate-200 mb-5 text-sm text-left space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Time allowed:</span>
                <strong className="text-gray-800">15 minutes (900 seconds)</strong>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Evaluation Standard:</span>
                <strong className="text-gray-800">SSC Full / Half Penalty Alignment Matrix</strong>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-600">Select Category:</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SscCategory)}
                  className="px-2 py-1 rounded border text-sm focus:outline-none"
                  style={{ background: '#fff', borderColor: '#ccc', color: '#222' }}
                >
                  <option value="UR">UR (Cutoff: ≤20% Errors)</option>
                  <option value="OBC">OBC (Cutoff: ≤25% Errors)</option>
                  <option value="EWS">EWS (Cutoff: ≤25% Errors)</option>
                  <option value="SC">SC (Cutoff: ≤30% Errors)</option>
                  <option value="ST">ST (Cutoff: ≤30% Errors)</option>
                  <option value="PwD">PwD (Cutoff: ≤30% Errors)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPyqModalOpen(true)}
                className="py-3 px-4 rounded text-slate-700 font-bold text-sm border border-slate-300 bg-white hover:bg-slate-50 transition flex items-center justify-center space-x-2 shadow-xs"
              >
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Browse PYQ Papers</span>
              </button>
              <button
                onClick={() => {
                  setExamReady(true);
                }}
                className="flex-1 py-3 px-4 rounded text-white font-bold text-base shadow hover:opacity-90 transition-opacity"
                style={{ background: '#27ae60' }}
              >
                Start Official Exam →
              </button>
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
        {/* UPPER PANE: Master Passage (static, read-only, native scrollbars) */}
        <section
          className="flex-1 flex flex-col rounded bg-white overflow-hidden shadow-sm"
          style={{ border: '1px solid #bbb' }}
        >
          <div
            className="flex items-center justify-between px-3 py-1.5"
            style={{ background: '#e4ebf2', borderBottom: '1px solid #c8d4e0' }}
          >
            <span className="font-bold uppercase" style={{ color: '#1f3f60' }}>
              Master Text Passage
            </span>
            <span className="text-[10px] italic" style={{ color: '#7f8c8d' }}>
              Read-only · Copying & selection disabled
            </span>
          </div>

          <div
            className="flex-1 p-3.5 overflow-y-scroll leading-relaxed text-[13.5px] select-none"
            style={{
              fontFamily: 'Georgia, serif',
              color: '#222',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
            onContextMenu={block}
            onCopy={block}
            onCut={block}
            onPaste={block}
          >
            {currentPassageText}
          </div>
        </section>

        {/* LOWER PANE: Candidate Text Input Box */}
        <section
          className="flex-1 flex flex-col rounded bg-white overflow-hidden shadow-sm"
          style={{ border: '1px solid #bbb' }}
        >
          <div
            className="flex items-center justify-between px-3 py-1.5"
            style={{ background: '#e4ebf2', borderBottom: '1px solid #c8d4e0' }}
          >
            <span className="font-bold uppercase" style={{ color: '#1f3f60' }}>
              Candidate Response
            </span>
            <div className="flex items-center space-x-3 font-semibold">
              <span>
                Keystrokes:{' '}
                <strong
                  className="font-mono"
                  style={{ color: strokes >= 2000 ? '#27ae60' : '#1a5276' }}
                >
                  {strokes}
                </strong>{' '}
                / 2000
              </span>
              <span style={{ color: '#999' }}>|</span>
              <span>
                Words: <strong className="font-mono">{wordCount}</strong>
              </span>
            </div>
          </div>

          <textarea
            ref={taRef}
            value={typedText}
            onChange={(e) => {
              if (!started) setStarted(true);
              setTypedText(e.target.value);
            }}
            onKeyDown={onKeyDown}
            onCopy={block}
            onCut={block}
            onPaste={block}
            onContextMenu={block}
            disabled={submitted}
            placeholder="Click here and begin typing the passage shown above. Copy, paste, and right-click are strictly disabled."
            className="flex-1 p-3 w-full resize-none text-[13.5px] leading-relaxed focus:outline-none"
            style={{
              fontFamily: 'Consolas, monospace',
              color: '#2c3e50',
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />

          {/* Stroke progress bar */}
          <div className="w-full h-1.5" style={{ background: '#ddd' }}>
            <div
              className="h-full transition-all"
              style={{
                width: `${strokePct}%` ,
                background: strokes >= 2000 ? '#27ae60' : '#e67e22',
              }}
            />
          </div>
        </section>
      </main>
      )}

      {/* ═══ FOOTER ═══════════════════════════════════════════════════════════ */}
      <footer
        className="flex items-center justify-between px-4 py-2"
        style={{ background: '#ddd', borderTop: '1px solid #bbb' }}
      >
        <div className="flex items-center space-x-3">
          <button
            onClick={onExit}
            className="px-3 py-1 text-white font-bold rounded shadow-sm transition-colors hover:bg-slate-700"
            style={{ background: '#555' }}
          >
            ← Exit Exam
          </button>
          <button
            onClick={() => setIsPyqModalOpen(true)}
            disabled={started && !submitted}
            className="px-3 py-1 text-white font-bold rounded shadow-sm hover:bg-slate-800 disabled:opacity-50 transition flex items-center space-x-1"
            style={{ background: '#34495e' }}
          >
            <BookOpen className="w-3 h-3" />
            <span>📚 Choose PYQ</span>
          </button>
          <button
            onClick={onNextPassage}
            disabled={started && !submitted}
            className="px-3 py-1 text-white font-bold rounded shadow-sm hover:bg-blue-600 disabled:opacity-50"
            style={{ background: '#2980b9' }}
          >
            🔀 Next Passage
          </button>
        </div>

        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={submitted}
          className="px-6 py-1.5 text-white font-bold uppercase tracking-wider rounded shadow transition-all hover:bg-emerald-700 disabled:opacity-50"
          style={{ background: '#27ae60' }}
        >
          {submitted ? 'Submitted' : 'Submit Exam'}
        </button>
      </footer>

      {/* ═══ SUBMIT CONFIRMATION MODAL ════════════════════════════════════════ */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md shadow-2xl max-w-md w-full border border-slate-300 overflow-hidden text-slate-800">
            <div className="bg-[#244c6d] text-white px-4 py-2.5 font-bold text-sm">
              Confirm Test Submission
            </div>
            <div className="p-5 text-xs space-y-3">
              <p className="font-semibold text-sm">Are you sure you want to conclude and submit your DEST session?</p>
              <div className="bg-slate-100 p-3 rounded font-mono space-y-1">
                <p>Total Key Depressions: <strong>{strokes} / 2000</strong></p>
                <p>Time Remaining: <strong>{mm}:{ss}</strong></p>
                <p>Candidate Category: <strong>{category}</strong></p>
              </div>
              <p className="text-rose-600 font-semibold">
                Once submitted, your responses will be evaluated against the official SSC CGL error rules.
              </p>
            </div>
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded text-xs font-semibold hover:bg-white"
              >
                Cancel
              </button>
              <button
                onClick={doSubmit}
                className="px-4 py-1.5 bg-[#244c6d] text-white rounded text-xs font-bold hover:bg-[#1a365d]"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ OFFICIAL RESULTS MODAL ═══════════════════════════════════════════ */}
      {submitted && result && (
        <SscScorecardModal
          result={result}
          kinematicSummary={kinematicSummary}
          onClose={onExit}
          onRetry={() => {
            setSubmitted(false);
            submittedRef.current = false;
            setTypedText('');
            typedTextRef.current = '';
            setSecondsLeft(15 * 60);
            setResult(null);
            setStarted(false);
            setExamReady(false);
            kinematicTrackerRef.current.reset();
            setKinematicSummary(null);
          }}
          onNextPassage={onNextPassage}
          onSelectPyq={() => setIsPyqModalOpen(true)}
        />
      )}

      {/* ═══ OFFICIAL SSC PYQ SELECTION MODAL ═════════════════════════════════ */}
      <SscPyqModal
        isOpen={isPyqModalOpen}
        currentPassageId={activePyq?.id}
        onSelect={handleSelectPyq}
        onClose={() => setIsPyqModalOpen(false)}
      />
    </div>
  );
};
