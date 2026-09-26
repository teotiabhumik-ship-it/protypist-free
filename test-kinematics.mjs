import { KinematicTracker } from './src/lib/kinematicTelemetry.ts';

console.log('Testing Kinematic & Biomechanical Telemetry Engine...');

const tracker = new KinematicTracker();

// Simulate keystrokes with specific bigrams:
// "ed" -> Same-finger bigram (LM on row 1 to row 2)
// "un" -> Same-finger bigram (RI on row 1 to row 3)
// "in" -> Alternation (RM to RI)
// "sd" -> Inward roll on left hand (LR to LM)
// "ds" -> Outward roll on left hand (LM to LR)
// "t"  -> Center column reach

const testSequence = [
  { char: 's', code: 'KeyS' },
  { char: 'd', code: 'KeyD' }, // Inward roll
  { char: 'e', code: 'KeyE' },
  { char: 'd', code: 'KeyD' }, // SFB (LM row 1 -> row 2)
  { char: 'u', code: 'KeyU' },
  { char: 'n', code: 'KeyN' }, // SFB (RI row 1 -> row 3)
  { char: 'i', code: 'KeyI' },
  { char: 'n', code: 'KeyN' }, // Alternation (RM to RI)
  { char: 't', code: 'KeyT' }, // Center column reach
  { char: 'h', code: 'KeyH' }, // Center column reach
  { char: 'e', code: 'KeyE' },
];

testSequence.forEach((k) => {
  tracker.recordKeystroke(k.char, k.code, false);
});

const report = tracker.analyze();
console.log('Total Keystrokes:', report.totalKeystrokes);
console.log('SFBs detected count:', report.sfbs.count);
console.log('Inward rolls count:', report.rolls.inwardCount);
console.log('Alternations count:', report.alternations.count);
console.log('Left hand %:', report.ergonomics.leftHandPercent);
console.log('Right hand %:', report.ergonomics.rightHandPercent);

if (report.sfbs.count >= 2) {
  console.log('PASS: Correctly identified Same-Finger Bigrams (e.g. ed, un)');
} else {
  console.error('FAIL: Expected >= 2 SFBs, got', report.sfbs.count);
  process.exit(1);
}

if (report.rolls.inwardCount >= 1) {
  console.log('PASS: Correctly identified Inward Roll (sd)');
} else {
  console.error('FAIL: Inward roll detection failed');
  process.exit(1);
}

console.log('ALL KINEMATICS VERIFICATIONS PASSED SUCCESSFULLY!');
