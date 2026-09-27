// ═══════════════════════════════════════════════════════════════════════════════
// ProTypist / TypePulse - SSC DEST Official Scorecard & Error Audit Modal
// Provides a transparent, official evaluation breakdown conforming to SSC rules
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import type { SscResult, SscCategory } from '../lib/sscEvaluation';
import type { KinematicAnalysisSummary } from '../lib/kinematicTelemetry';
import { KinematicsDashboard } from './KinematicsDashboard';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  FileText,
  Award,
  Filter,
  Activity,
  BookOpen,
} from 'lucide-react';

interface Props {
  result: SscResult;
  candidateName?: string;
  rollNumber?: string;
  kinematicSummary?: KinematicAnalysisSummary | null;
  onClose: () => void;
  onRetry: () => void;
  onNextPassage: () => void;
  onSelectPyq?: () => void;
}

export const SscScorecardModal: React.FC<Props> = ({
  result,
  candidateName = 'GOVERNMENT ASPIRANT',
  rollNumber = '2401089201',
  kinematicSummary,
  onClose,
  onRetry,
  onNextPassage,
  onSelectPyq,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'FULL' | 'HALF'>('ALL');
  const [showKinematicsModal, setShowKinematicsModal] = useState(false);

  const filteredMistakes = result.mistakes.filter((m) => {
    if (filterType === 'ALL') return true;
    return m.type === filterType;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden"
        style={{
          background: 'var(--card, #0f172a)',
          borderColor: 'color-mix(in srgb, var(--sub, #64748b) 30%, transparent)',
          color: 'var(--text, #f8fafc)',
        }}
      >
        {/* ── Modal Header Banner ────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{
            borderColor: 'color-mix(in srgb, var(--sub, #64748b) 20%, transparent)',
            background: 'color-mix(in srgb, var(--bg, #020617) 60%, transparent)',
          }}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`p-2.5 rounded-xl ${
                result.qualified
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                SSC DEST Official Assessment Scorecard
              </h2>
              <div className="flex items-center space-x-2 text-xs opacity-75 font-mono">
                <span>Roll: {rollNumber}</span>
                <span>•</span>
                <span>Candidate: {candidateName}</span>
                <span>•</span>
                <span>Category: {result.category}</span>
              </div>
            </div>
          </div>

          <div
            className={`px-4 py-1.5 rounded-full font-bold text-sm tracking-wide border flex items-center space-x-1.5 ${
              result.qualified
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'bg-rose-500/15 border-rose-500/50 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
            }`}
          >
            {result.qualified ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>QUALIFIED</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                <span>NOT QUALIFIED</span>
              </>
            )}
          </div>
        </div>

        {/* ── Main Score Summary Grid ──────────────────────────────────────── */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl border bg-black/20 text-center">
              <span className="text-xs uppercase tracking-wider opacity-60">
                Key Depressions
              </span>
              <div className="text-2xl font-mono font-black mt-1">
                {result.typedKeystrokes.toLocaleString()}
              </div>
              <div className="text-[11px] mt-1 text-slate-400">
                Target: 2,000 / 15 Min
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    result.typedKeystrokes >= 2000 ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                  style={{
                    width: `${Math.min(100, (result.typedKeystrokes / 2000) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-black/20 text-center">
              <span className="text-xs uppercase tracking-wider opacity-60">
                Mistake Percentage
              </span>
              <div
                className={`text-2xl font-mono font-black mt-1 ${
                  result.errorPercent <= result.cutoffPercent
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {result.errorPercent}%
              </div>
              <div className="text-[11px] mt-1 opacity-70">
                Permissible: &le; {result.cutoffPercent}% ({result.category})
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-black/20 text-center">
              <span className="text-xs uppercase tracking-wider opacity-60">Net Speed</span>
              <div className="text-2xl font-mono font-black text-sky-400 mt-1">
                {result.netWpm}{' '}
                <span className="text-xs font-normal opacity-70">WPM</span>
              </div>
              <div className="text-[11px] mt-1 opacity-70">Gross: {result.grossWpm} WPM</div>
            </div>

            <div className="p-4 rounded-xl border bg-black/20 text-center">
              <span className="text-xs uppercase tracking-wider opacity-60">
                Total Mistakes
              </span>
              <div className="text-2xl font-mono font-black text-amber-400 mt-1">
                {result.totalErrors}
              </div>
              <div className="text-[11px] mt-1 opacity-70">
                Full: {result.fullMistakes} • Half: {result.halfMistakes}
              </div>
            </div>
          </div>

          {/* Detailed Error Audit Breakdown */}
          <div className="p-5 rounded-xl border bg-black/10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-sm">Official Error Audit & Classification</h3>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center space-x-1 text-xs bg-slate-900/60 p-1 rounded-lg border border-slate-700/60">
                <button
                  onClick={() => setFilterType('ALL')}
                  className={`px-2.5 py-1 rounded transition ${
                    filterType === 'ALL'
                      ? 'bg-sky-500 text-white font-semibold'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  All ({result.mistakes.length})
                </button>
                <button
                  onClick={() => setFilterType('FULL')}
                  className={`px-2.5 py-1 rounded transition ${
                    filterType === 'FULL'
                      ? 'bg-rose-500 text-white font-semibold'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  Full Mistakes ({result.fullMistakes})
                </button>
                <button
                  onClick={() => setFilterType('HALF')}
                  className={`px-2.5 py-1 rounded transition ${
                    filterType === 'HALF'
                      ? 'bg-amber-500 text-white font-semibold'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  Half Mistakes ({result.halfMistakes})
                </button>
              </div>
            </div>

            {filteredMistakes.length === 0 ? (
              <div className="py-8 text-center text-sm opacity-60">
                {result.mistakes.length === 0
                  ? 'Flawless transcription! No mistakes detected.'
                  : 'No mistakes matching this filter.'}
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60 border rounded-lg">
                {filteredMistakes.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 text-xs flex items-center justify-between hover:bg-white/5 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          m.type === 'FULL'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {m.category} (-{m.penalty})
                      </span>
                      <span className="opacity-90">{m.description}</span>
                    </div>

                    {m.expected && m.actual && (
                      <div className="font-mono text-[11px] opacity-75">
                        <span className="text-emerald-400 line-through mr-1">
                          {m.expected}
                        </span>
                        <span>&rarr;</span>
                        <span className="text-rose-400 ml-1">{m.actual}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Modal Footer Controls ───────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t bg-black/30"
          style={{
            borderColor: 'color-mix(in srgb, var(--sub, #64748b) 20%, transparent)',
          }}
        >
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-sm font-semibold opacity-80 hover:opacity-100 transition"
            >
              Review Document
            </button>
            {kinematicSummary && (
              <button
                onClick={() => setShowKinematicsModal(true)}
                className="px-3.5 py-2 rounded-lg border text-sm font-semibold flex items-center space-x-1.5 transition text-sky-400 border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20"
              >
                <Activity className="w-4 h-4" />
                <span>Kinematic Diagnostics</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {onSelectPyq && (
              <button
                onClick={onSelectPyq}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 flex items-center space-x-1.5 transition"
              >
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>Choose PYQ Paper</span>
              </button>
            )}
            <button
              onClick={onRetry}
              className="px-4 py-2 rounded-lg text-sm font-semibold border flex items-center space-x-1.5 opacity-90 hover:opacity-100 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Test</span>
            </button>
            <button
              onClick={onNextPassage}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-lg transition bg-blue-600 hover:bg-blue-500"
            >
              Next Exam Passage &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* ── Kinematics Dashboard Sub-Modal ───────────────────────────── */}
      {showKinematicsModal && kinematicSummary && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <KinematicsDashboard
              summary={kinematicSummary}
              onClose={() => setShowKinematicsModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
