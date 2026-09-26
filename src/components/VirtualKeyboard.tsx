import React, { useMemo } from 'react';
import { QWERTY_FINGER_MAP, type FingerName } from '../lib/kinematicTelemetry';

interface Props {
  activeKey?: string | null;
  nextChar?: string | null;
  nextKey?: string | null;
  showFingerZones?: boolean;
}

interface KeyConfig {
  label: string;
  code: string;
  shiftLabel?: string;
  width?: string;
  isHome?: boolean;
  finger?: FingerName;
}

const FINGER_NAMES: Record<FingerName, string> = {
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

const FINGER_ACCENTS: Record<FingerName, string> = {
  LP: '#f43f5e', // Rose
  LR: '#8b5cf6', // Violet
  LM: '#06b6d4', // Cyan
  LI: '#10b981', // Emerald
  LT: '#38bdf8', // Sky
  RT: '#38bdf8', // Sky
  RI: '#10b981', // Emerald
  RM: '#06b6d4', // Cyan
  RR: '#8b5cf6', // Violet
  RP: '#f43f5e', // Rose
};

const KEYBOARD_ROWS: KeyConfig[][] = [
  // Number row
  [
    { label: '`', shiftLabel: '~', code: '`', finger: 'LP' },
    { label: '1', shiftLabel: '!', code: '1', finger: 'LP' },
    { label: '2', shiftLabel: '@', code: '2', finger: 'LR' },
    { label: '3', shiftLabel: '#', code: '3', finger: 'LM' },
    { label: '4', shiftLabel: '$', code: '4', finger: 'LI' },
    { label: '5', shiftLabel: '%', code: '5', finger: 'LI' },
    { label: '6', shiftLabel: '^', code: '6', finger: 'RI' },
    { label: '7', shiftLabel: '&', code: '7', finger: 'RI' },
    { label: '8', shiftLabel: '*', code: '8', finger: 'RM' },
    { label: '9', shiftLabel: '(', code: '9', finger: 'RR' },
    { label: '0', shiftLabel: ')', code: '0', finger: 'RP' },
    { label: '-', shiftLabel: '_', code: '-', finger: 'RP' },
    { label: '=', shiftLabel: '+', code: '=', finger: 'RP' },
    { label: 'Backspace', code: 'backspace', width: 'w-16 sm:w-20', finger: 'RP' },
  ],
  // Top row
  [
    { label: 'Tab', code: 'tab', width: 'w-12 sm:w-14', finger: 'LP' },
    { label: 'Q', code: 'q', finger: 'LP' },
    { label: 'W', code: 'w', finger: 'LR' },
    { label: 'E', code: 'e', finger: 'LM' },
    { label: 'R', code: 'r', finger: 'LI' },
    { label: 'T', code: 't', finger: 'LI' },
    { label: 'Y', code: 'y', finger: 'RI' },
    { label: 'U', code: 'u', finger: 'RI' },
    { label: 'I', code: 'i', finger: 'RM' },
    { label: 'O', code: 'o', finger: 'RR' },
    { label: 'P', code: 'p', finger: 'RP' },
    { label: '[', shiftLabel: '{', code: '[', finger: 'RP' },
    { label: ']', shiftLabel: '}', code: ']', finger: 'RP' },
    { label: '\\', shiftLabel: '|', code: '\\', width: 'w-10 sm:w-12', finger: 'RP' },
  ],
  // Home row
  [
    { label: 'Caps', code: 'capslock', width: 'w-14 sm:w-16', finger: 'LP' },
    { label: 'A', code: 'a', finger: 'LP' },
    { label: 'S', code: 's', finger: 'LR' },
    { label: 'D', code: 'd', finger: 'LM' },
    { label: 'F', code: 'f', isHome: true, finger: 'LI' },
    { label: 'G', code: 'g', finger: 'LI' },
    { label: 'H', code: 'h', finger: 'RI' },
    { label: 'J', code: 'j', isHome: true, finger: 'RI' },
    { label: 'K', code: 'k', finger: 'RM' },
    { label: 'L', code: 'l', finger: 'RR' },
    { label: ';', shiftLabel: ':', code: ';', finger: 'RP' },
    { label: "'", shiftLabel: '"', code: "'", finger: 'RP' },
    { label: 'Enter', code: 'enter', width: 'w-16 sm:w-20', finger: 'RP' },
  ],
  // Bottom row
  [
    { label: 'Shift', code: 'shiftleft', width: 'w-18 sm:w-22', finger: 'LP' },
    { label: 'Z', code: 'z', finger: 'LP' },
    { label: 'X', code: 'x', finger: 'LR' },
    { label: 'C', code: 'c', finger: 'LM' },
    { label: 'V', code: 'v', finger: 'LI' },
    { label: 'B', code: 'b', finger: 'LI' },
    { label: 'N', code: 'n', finger: 'RI' },
    { label: 'M', code: 'm', finger: 'RI' },
    { label: ',', shiftLabel: '<', code: ',', finger: 'RM' },
    { label: '.', shiftLabel: '>', code: '.', finger: 'RR' },
    { label: '/', shiftLabel: '?', code: '/', finger: 'RP' },
    { label: 'Shift', code: 'shiftright', width: 'w-18 sm:w-22', finger: 'RP' },
  ],
  // Space row
  [
    { label: 'Ctrl', code: 'controlleft', width: 'w-12 sm:w-14', finger: 'LP' },
    { label: 'Alt', code: 'altleft', width: 'w-12 sm:w-14', finger: 'LT' },
    { label: 'Space', code: ' ', width: 'flex-1 max-w-[320px]', finger: 'RT' },
    { label: 'Alt', code: 'altright', width: 'w-12 sm:w-14', finger: 'RT' },
    { label: 'Ctrl', code: 'controlright', width: 'w-12 sm:w-14', finger: 'RP' },
  ],
];

// Map characters to their keyboard key code
function mapCharToKey(ch: string | null | undefined): { key: string; needsShift: boolean } {
  if (!ch) return { key: '', needsShift: false };
  if (ch === ' ') return { key: ' ', needsShift: false };

  const isUpper = /[A-Z]/.test(ch);
  if (isUpper) {
    return { key: ch.toLowerCase(), needsShift: true };
  }

  const shiftSymbols: Record<string, string> = {
    '~': '`',
    '!': '1',
    '@': '2',
    '#': '3',
    '$': '4',
    '%': '5',
    '^': '6',
    '&': '7',
    '*': '8',
    '(': '9',
    ')': '0',
    '_': '-',
    '+': '=',
    '{': '[',
    '}': ']',
    '|': '\\',
    ':': ';',
    '"': "'",
    '<': ',',
    '>': '.',
    '?': '/',
  };

  if (shiftSymbols[ch]) {
    return { key: shiftSymbols[ch], needsShift: true };
  }

  return { key: ch.toLowerCase(), needsShift: false };
}

export const VirtualKeyboard: React.FC<Props> = ({
  activeKey,
  nextChar,
  nextKey,
  showFingerZones = true,
}) => {
  const charToMap = nextChar ?? nextKey;
  const { key: targetKey, needsShift } = useMemo(() => mapCharToKey(charToMap), [charToMap]);
  const normActiveKey = activeKey ? activeKey.toLowerCase() : null;

  const targetMapping = targetKey ? QWERTY_FINGER_MAP[targetKey] : null;
  const assignedFingerName = targetMapping?.finger ? FINGER_NAMES[targetMapping.finger] : null;

  return (
    <div
      className="w-full max-w-4xl mx-auto p-3 sm:p-4 rounded-xl border shadow-lg select-none transition-colors duration-200"
      style={{
        background: 'var(--card)',
        borderColor: 'color-mix(in srgb, var(--sub) 25%, transparent)',
      }}
    >
      {/* ── Key Deck ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5 w-full">
            {row.map((k) => {
              const isTarget =
                k.code === targetKey ||
                (needsShift && (k.code === 'shiftleft' || k.code === 'shiftright'));

              const isPressed =
                normActiveKey === k.code ||
                (normActiveKey === ' ' && k.code === ' ') ||
                (normActiveKey === 'backspace' && k.code === 'backspace') ||
                (normActiveKey === 'enter' && k.code === 'enter') ||
                (normActiveKey === 'shift' && (k.code === 'shiftleft' || k.code === 'shiftright'));

              const fingerAccent = k.finger ? FINGER_ACCENTS[k.finger] : undefined;

              return (
                <div
                  key={k.code + k.label}
                  className={`
                    relative flex flex-col items-center justify-center
                    h-9 sm:h-11 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold
                    transition-all duration-75 shadow-sm overflow-hidden
                    ${k.width ? k.width : 'w-8 sm:w-11'}
                  `}
                  style={{
                    background: isPressed
                      ? 'var(--main)'
                      : isTarget
                      ? 'color-mix(in srgb, var(--main) 22%, var(--bg))'
                      : 'var(--bg)',
                    color: isPressed
                      ? 'var(--bg)'
                      : isTarget
                      ? 'var(--main)'
                      : 'var(--text)',
                    border: isTarget
                      ? '1.5px solid var(--main)'
                      : '1px solid color-mix(in srgb, var(--sub) 30%, transparent)',
                    transform: isPressed ? 'translateY(2px) scale(0.96)' : 'translateY(0)',
                    boxShadow: isTarget
                      ? '0 0 10px color-mix(in srgb, var(--main) 45%, transparent)'
                      : undefined,
                  }}
                >
                  {/* Subtle top border finger zone indicator */}
                  {showFingerZones && fingerAccent && !isPressed && (
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px] opacity-75"
                      style={{ background: fingerAccent }}
                    />
                  )}

                  {/* Shift label */}
                  {k.shiftLabel && (
                    <span
                      className="text-[8px] sm:text-[9px] leading-none mb-0.5"
                      style={{
                        color: isPressed ? 'var(--bg)' : 'var(--sub)',
                        opacity: isTarget && needsShift ? 1 : 0.7,
                        fontWeight: isTarget && needsShift ? 'bold' : 'normal',
                      }}
                    >
                      {k.shiftLabel}
                    </span>
                  )}

                  {/* Main label */}
                  <span className="leading-tight">{k.label}</span>

                  {/* Physical Home Row Finger Bumps on F and J */}
                  {k.isHome && (
                    <span
                      className="absolute bottom-1 w-3 h-0.5 rounded-full"
                      style={{
                        background: isPressed ? 'var(--bg)' : 'var(--main)',
                        opacity: 0.85,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Interactive HUD Bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[var(--sub)]/15 text-[10px] font-mono text-[var(--sub)] px-2">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm border"
              style={{
                borderColor: 'var(--main)',
                background: 'color-mix(in srgb, var(--main) 30%, transparent)',
              }}
            />
            <span>Next Key Target</span>
          </span>
          <span className="flex items-center space-x-1">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm"
              style={{ background: 'var(--main)' }}
            />
            <span>Active Keystroke</span>
          </span>
          {assignedFingerName && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-800 text-sky-400 font-bold border border-slate-700">
              Finger: {assignedFingerName} {needsShift ? '(Hold Shift)' : ''}
            </span>
          )}
        </div>
        <div>
          Next:{' '}
          <strong className="text-[var(--main)] font-mono text-xs">
            {nextChar === ' ' ? 'Space' : nextChar || '—'}
          </strong>
        </div>
      </div>
    </div>
  );
};
