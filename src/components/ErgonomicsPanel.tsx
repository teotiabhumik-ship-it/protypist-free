// ═══════════════════════════════════════════════════════════════════════════════
// ProTypist / TypePulse - Pillar 5: Ergonomic Load & Muscle Fatigue Telemetry
// Bilateral Hand Labor Split, Per-Finger Heatmap & 15-Minute Exam Fatigue Detector
// ═══════════════════════════════════════════════════════════════════════════════

import React from 'react';
import type {
  ErgonomicWorkloadReport,
  FatigueReport,
  FingerName,
} from '../lib/kinematicTelemetry';
import { ShieldAlert, HeartPulse, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  ergonomics: ErgonomicWorkloadReport;
  fatigue: FatigueReport;
}

const FINGER_LABELS: Record<FingerName, string> = {
  LP: 'Left Pinky',
  LR: 'Left Ring',
  LM: 'Left Middle',
  LI: 'Left Index',
  LT: 'Left Thumb',
  RT: 'Right Thumb',
  RI: 'Right Index',
  RM: 'Right Middle',
  RR: 'Right Ring',
  RP: 'Right Pinky',
};

export const ErgonomicsPanel: React.FC<Props> = ({ ergonomics, fatigue }) => {
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
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <HeartPulse className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-base">Ergonomic Load & Muscle Fatigue Telemetry</h3>
          <p className="text-xs opacity-70">
            Workload distribution, finger asymmetry, and neuromuscular rhythm jitter monitoring
          </p>
        </div>
      </div>

      {/* ── Neuromuscular Fatigue Alert Banner (if triggered) ────────────── */}
      {fatigue.isFatigued ? (
        <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 flex items-start space-x-3 animate-pulse">
          <ShieldAlert className="w-5 h-5 mt-0.5 text-rose-400 flex-shrink-0" />
          <div className="space-y-1 text-xs">
            <div className="font-bold text-sm text-rose-400">
              Neuromuscular Fatigue Warning: Inter-Key Jitter Spike (+{fatigue.jitterIncreasePercent}%)
            </div>
            <p>
              Your typing rhythm deviation has exceeded the 35% fatigue threshold. In long 15-minute
              SSC exam sessions, neuromuscular strain increases error rates exponentially.
            </p>
            <div className="pt-1 font-semibold text-rose-200">
              Recommended Cool-Down: Take a 60-second break, extend both wrists backward, and gently
              shake out finger tension.
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 flex items-center space-x-2.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            Neuromuscular rhythm is steady (Jitter: {fatigue.currentJitterPercent}%). No cognitive or
            musculoskeletal fatigue detected.
          </span>
        </div>
      )}

      {/* ── Bilateral Hand Workload Split ───────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold">Bilateral Mechanical Workload Split:</span>
          <div className="flex items-center space-x-4 font-mono font-bold">
            <span className="text-sky-400">Left: {ergonomics.leftHandPercent}%</span>
            <span className="text-purple-400">Right: {ergonomics.rightHandPercent}%</span>
          </div>
        </div>

        {/* Dual Progress Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800">
          <div
            className="h-full bg-sky-500 transition-all duration-500"
            style={{ width: `${ergonomics.leftHandPercent}%` }}
          />
          <div
            className="h-full bg-purple-500 transition-all duration-500"
            style={{ width: `${ergonomics.rightHandPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] opacity-60">
          <span>{ergonomics.leftHandCount} strokes on Left Hand</span>
          <span>{ergonomics.rightHandCount} strokes on Right Hand</span>
        </div>
      </div>

      {/* ── Per-Finger Strain Heatmap ────────────────────────────────────── */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold opacity-80 uppercase tracking-wider">
          Individual Finger Mechanical Labor Split
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 text-xs font-mono">
          {(Object.keys(FINGER_LABELS) as FingerName[]).map((f) => {
            const count = ergonomics.fingerCounts[f] || 0;
            const pct = ergonomics.fingerPercents[f] || 0;

            const isHighStrain = pct > 22;

            return (
              <div
                key={f}
                className={`p-3 rounded-xl border text-center transition ${
                  isHighStrain
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                    : 'border-slate-800 bg-black/20 text-slate-300'
                }`}
              >
                <div className="text-[10px] opacity-70 truncate">{FINGER_LABELS[f]}</div>
                <div className="text-lg font-black mt-0.5">{pct}%</div>
                <div className="text-[10px] opacity-60">{count} strokes</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
