// ═══════════════════════════════════════════════════════════════════════════════
// ProTypist - Interactive Welcome & Architectural Onboarding Modal
// Introduces the 5 pillars of the next-generation typing cognitive framework
// ═══════════════════════════════════════════════════════════════════════════════

import React from 'react';
import {
  Keyboard,
  Shield,
  Brain,
  Wrench,
  Eye,
  Sparkles,
  CheckCircle2,
  X,
  Volume2,
  Activity,
  Layers,
} from 'lucide-react';
import type { AppMainMode } from '../App';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode?: (mode: AppMainMode) => void;
}

export const OnboardingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectMode,
}) => {
  if (!isOpen) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem('protypist_onboarded', '1');
    } catch {
      // Ignore storage errors
    }
    onClose();
  };

  const pillars = [
    {
      mode: 'classic' as AppMainMode,
      icon: <Keyboard className="w-5 h-5 text-amber-400" />,
      title: 'Monkeytype Classic & 1,000+ Corpus',
      subtitle: 'Kinematic Speed Testing',
      desc: 'Sub-millisecond inter-key interval tracking, Same-Finger Bigram (SFB) bottleneck detection, bilateral hand heatmaps, and customizable mechanical key sounds.',
      badge: 'Core Engine',
      badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    },
    {
      mode: 'exam' as AppMainMode,
      icon: <Shield className="w-5 h-5 text-blue-400" />,
      title: 'TCS iON SSC DEST Exam Simulator',
      subtitle: 'Official Government Assessment',
      desc: 'Authentic 15-minute examination environment replicating SSC CGL/CHSL DEST rules: 2,000 key depressions target, KDPH metrics, and official Full vs Half mistake audit.',
      badge: 'SSC CGL / CHSL',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    },
    {
      mode: 'generative' as AppMainMode,
      icon: <Brain className="w-5 h-5 text-purple-400" />,
      title: 'Generative Thought-to-Keyboard',
      subtitle: 'Cognitive Formulation Drills',
      desc: 'Typing at 130 WPM in transcription often drops to 50 WPM when formulating original thoughts. Train formulation velocity, hesitation cluster logging, and speech audio dictation.',
      badge: 'Pillar 1',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    },
    {
      mode: 'micro-editing' as AppMainMode,
      icon: <Wrench className="w-5 h-5 text-sky-400" />,
      title: 'Micro-Editing & Cursor Locomotion',
      subtitle: 'Keyboard Shortcut Discipline',
      desc: 'Mouse navigation is strictly blocked. Master non-destructive edits with Ctrl+Arrows, Home/End, word deletes, and IDE snippet autocomplete discipline.',
      badge: 'Pillar 2',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    },
    {
      mode: 'lookahead' as AppMainMode,
      icon: <Eye className="w-5 h-5 text-emerald-400" />,
      title: 'Visual Lookahead & Eye-Buffer',
      subtitle: 'Foveal Expansion Training',
      desc: 'Speed ceilings are perceptual bottlenecks. Dynamic trailing curtain masking hides current characters, forcing your eyes 2–4 words ahead of the motor cursor.',
      badge: 'Pillar 4',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden"
        style={{
          background: 'var(--card, #0f172a)',
          borderColor: 'color-mix(in srgb, var(--sub, #64748b) 30%, transparent)',
          color: 'var(--text, #f8fafc)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{
            borderColor: 'color-mix(in srgb, var(--sub, #64748b) 20%, transparent)',
            background: 'color-mix(in srgb, var(--bg, #020617) 60%, transparent)',
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/40">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black tracking-wider font-mono" style={{ color: 'var(--main, #facc15)' }}>
                  PROTYPIST
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  NEXT-GEN
                </span>
              </div>
              <p className="text-xs opacity-75 mt-0.5">
                Beyond transcription: cognitive motor training, exam readiness, and kinematic ergonomics
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-white/10 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="p-3.5 rounded-xl border bg-black/20 text-xs leading-relaxed opacity-90">
            <strong>Welcome to ProTypist!</strong> Unlike standard transcription engines, ProTypist diagnoses motor bottlenecks, conditions your visual lookahead, trains original thought composition, and prepares Indian government exam aspirants with an authentic TCS iON SSC DEST simulator.
          </div>

          <div className="space-y-3">
            {pillars.map((p) => (
              <div
                key={p.mode}
                onClick={() => {
                  if (onSelectMode) onSelectMode(p.mode);
                  handleDismiss();
                }}
                className="group p-4 rounded-xl border transition-all cursor-pointer hover:border-[var(--main)] hover:bg-black/30 flex items-start justify-between gap-4"
                style={{
                  background: 'color-mix(in srgb, var(--bg, #020617) 40%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--sub, #64748b) 20%, transparent)',
                }}
              >
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 group-hover:scale-110 transition duration-200">
                    {p.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm tracking-wide text-white group-hover:text-[var(--main)] transition">
                        {p.title}
                      </h4>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono font-bold ${p.badgeColor}`}>
                        {p.badge}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold opacity-70 mt-0.5">
                      {p.subtitle}
                    </div>
                    <p className="text-xs opacity-75 mt-1.5 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-2 text-center text-xs">
            <div className="p-2.5 rounded-lg border bg-black/20">
              <span className="font-bold text-sky-400">1,050+ Passages</span>
              <div className="text-[11px] opacity-70 mt-0.5">Non-repeating offline exam bank</div>
            </div>
            <div className="p-2.5 rounded-lg border bg-black/20">
              <span className="font-bold text-emerald-400">Web Audio Synthesizer</span>
              <div className="text-[11px] opacity-70 mt-0.5">Cherry Blue, Thock, Typewriter</div>
            </div>
            <div className="p-2.5 rounded-lg border bg-black/20">
              <span className="font-bold text-purple-400">100% Offline</span>
              <div className="text-[11px] opacity-70 mt-0.5">Runs anywhere, zero cloud lag</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-3.5 border-t bg-black/30"
          style={{
            borderColor: 'color-mix(in srgb, var(--sub, #64748b) 20%, transparent)',
          }}
        >
          <div className="text-[11px] opacity-65 font-mono">
            Press any mode card above or click Get Started
          </div>

          <button
            onClick={handleDismiss}
            className="px-6 py-2 rounded-xl text-xs font-bold text-slate-950 shadow-lg transition flex items-center space-x-2"
            style={{ background: 'var(--main, #facc15)' }}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Get Started with ProTypist</span>
          </button>
        </div>
      </div>
    </div>
  );
};
