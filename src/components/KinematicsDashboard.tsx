// ═══════════════════════════════════════════════════════════════════════════════
// ProTypist / TypePulse - Pillar 3: Kinematic Diagnostics & Biomechanical Telemetry
// Same-Finger Bigrams (SFB), Lateral Rolls, Alternations & Alt-Fingering Recommendations
// ═══════════════════════════════════════════════════════════════════════════════

import React from 'react';
import type { KinematicAnalysisSummary } from '../lib/kinematicTelemetry';
import { Activity, AlertTriangle, Zap, CheckCircle2, Info, ArrowRight } from 'lucide-react';

interface Props {
  summary: KinematicAnalysisSummary;
  onClose?: () => void;
}

export const KinematicsDashboard: React.FC<Props> = ({ summary, onClose }) => {
  return (
    <div
      className="p-6 rounded-2xl border space-y-6 animate-fade-in select-none shadow-2xl"
      style={{
        background: 'var(--card, #0f172a)',
        borderColor: 'color-mix(in srgb, var(--sub, #64748b) 25%, transparent)',
        color: 'var(--text, #f8fafc)',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">Kinematic Diagnostics & Biomechanical Telemetry</h3>
            <p className="text-xs opacity-70">
              Inter-key intervals, Same-Finger Bigram (SFB) stalls, and lateral roll profiling
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 opacity-70 hover:opacity-100"
          >
            Close Dashboard
          </button>
        )}
      </div>

      {/* ── Key Metrics Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border bg-black/20 text-center">
          <span className="text-[10px] uppercase tracking-wider opacity-60">
            Average IKI Latency
          </span>
          <div className="text-2xl font-mono font-black text-sky-400 mt-1">
            {summary.avgIkiMs} <span className="text-xs font-normal opacity-70">ms</span>
          </div>
          <div className="text-[11px] mt-1 opacity-70">
            Consistency: {summary.consistencyScore}%
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-black/20 text-center">
          <span className="text-[10px] uppercase tracking-wider opacity-60">
            Same-Finger Bigrams (SFB)
          </span>
          <div
            className={`text-2xl font-mono font-black mt-1 ${
              summary.sfbs.percentOfBigrams > 4.0 ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {summary.sfbs.percentOfBigrams}%
          </div>
          <div className="text-[11px] mt-1 opacity-70">
            {summary.sfbs.count} transitions ({summary.sfbs.avgIkiMs}ms avg)
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-black/20 text-center">
          <span className="text-[10px] uppercase tracking-wider opacity-60">
            Inward vs Outward Rolls
          </span>
          <div className="text-2xl font-mono font-black text-amber-400 mt-1">
            {summary.rolls.inwardCount}{' '}
            <span className="text-xs font-normal opacity-60">in</span> /{' '}
            {summary.rolls.outwardCount}{' '}
            <span className="text-xs font-normal opacity-60">out</span>
          </div>
          <div className="text-[11px] mt-1 opacity-70">
            Inward: {summary.rolls.inwardAvgIkiMs}ms • Outward: {summary.rolls.outwardAvgIkiMs}ms
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-black/20 text-center">
          <span className="text-[10px] uppercase tracking-wider opacity-60">
            Center-Column Reaches
          </span>
          <div className="text-2xl font-mono font-black text-purple-400 mt-1">
            {summary.centerColumnReaches.count}
          </div>
          <div className="text-[11px] mt-1 opacity-70">
            T, G, B, Y, H, N ({summary.centerColumnReaches.avgIkiMs}ms avg)
          </div>
        </div>
      </div>

      {/* ── Chronic SFB Bottlenecks & Worst Transitions ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border bg-black/10 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Highest Latency Same-Finger Bigrams (SFBs)</span>
          </div>

          {summary.sfbs.worstSfbs.length === 0 ? (
            <div className="py-6 text-center text-xs opacity-60">
              No severe same-finger row stalls detected in this session.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60 text-xs">
              {summary.sfbs.worstSfbs.map((s, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-mono">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                      "{s.bigram}"
                    </span>
                    <span className="opacity-70">{s.count} occurrences</span>
                  </div>
                  <span className="font-mono text-rose-400 font-bold">{s.avgIkiMs} ms</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Alt-Fingering Recommendations */}
        <div className="p-4 rounded-xl border bg-black/10 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-400">
            <Zap className="w-4 h-4" />
            <span>Dynamic Alt-Fingering & Biomechanical Advice</span>
          </div>

          {summary.altFingeringAdvice.length === 0 ? (
            <div className="py-6 text-center text-xs opacity-60">
              Excellent biomechanical balance and minimal finger hopping!
            </div>
          ) : (
            <ul className="space-y-2 text-xs leading-relaxed">
              {summary.altFingeringAdvice.map((advice, idx) => (
                <li
                  key={idx}
                  className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-200 flex items-start space-x-2"
                >
                  <ArrowRight className="w-3.5 h-3.5 mt-0.5 text-sky-400 flex-shrink-0" />
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
