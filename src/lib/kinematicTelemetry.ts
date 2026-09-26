// ═══════════════════════════════════════════════════════════════════════════════
// ProTypist / TypePulse - Kinematic & Biomechanical Telemetry Engine
// Sub-millisecond IKI, Same-Finger Bigrams (SFB), Roll Profiling, Workload & Fatigue
// ═══════════════════════════════════════════════════════════════════════════════

export type FingerName =
  | 'LP' // Left Pinky
  | 'LR' // Left Ring
  | 'LM' // Left Middle
  | 'LI' // Left Index
  | 'LT' // Left Thumb
  | 'RT' // Right Thumb
  | 'RI' // Right Index
  | 'RM' // Right Middle
  | 'RR' // Right Ring
  | 'RP'; // Right Pinky

export type Hand = 'left' | 'right' | 'thumb';

export type BigramTransitionType =
  | 'ALTERNATION' // Opposite hands (e.g., F -> J)
  | 'ROLL_INWARD' // Same hand, outside to inside (e.g., S -> D)
  | 'ROLL_OUTWARD' // Same hand, inside to outside (e.g., D -> S)
  | 'SAME_FINGER_BIGRAM' // Same finger, row jump (e.g., E -> D, U -> N, C -> E)
  | 'SAME_KEY_REPEAT' // Double letters (e.g., L -> L)
  | 'CENTER_COLUMN_REACH'; // T, G, B, Y, H, N stretch

export interface KeyStrokeSample {
  char: string;
  code: string;
  timestamp: number;
  finger: FingerName;
  hand: Hand;
  row: number; // 0 = Number, 1 = QWERTY, 2 = Home, 3 = Bottom, 4 = Space
  isError: boolean;
}

export interface BigramMetric {
  bigram: string;
  firstChar: string;
  secondChar: string;
  ikiMs: number; // Inter-key interval in milliseconds
  transitionType: BigramTransitionType;
  finger: FingerName;
  hand: Hand;
}

export interface ErgonomicWorkloadReport {
  totalKeystrokes: number;
  leftHandCount: number;
  rightHandCount: number;
  leftHandPercent: number;
  rightHandPercent: number;
  fingerCounts: Record<FingerName, number>;
  fingerPercents: Record<FingerName, number>;
}

export interface FatigueReport {
  isFatigued: boolean;
  baselineJitterPercent: number;
  currentJitterPercent: number;
  jitterIncreasePercent: number;
  rollingAvgIkiMs: number;
}

export interface KinematicAnalysisSummary {
  totalKeystrokes: number;
  avgIkiMs: number;
  consistencyScore: number; // 0 - 100%
  sfbs: {
    count: number;
    percentOfBigrams: number;
    avgIkiMs: number;
    worstSfbs: Array<{ bigram: string; avgIkiMs: number; count: number }>;
  };
  rolls: {
    inwardCount: number;
    outwardCount: number;
    inwardAvgIkiMs: number;
    outwardAvgIkiMs: number;
  };
  alternations: {
    count: number;
    avgIkiMs: number;
  };
  centerColumnReaches: {
    count: number;
    avgIkiMs: number;
  };
  ergonomics: ErgonomicWorkloadReport;
  fatigue: FatigueReport;
  altFingeringAdvice: string[];
}

// ─── QWERTY Key Anatomy Mapping ──────────────────────────────────────────────
export const QWERTY_FINGER_MAP: Record<
  string,
  { finger: FingerName; hand: Hand; row: number; isCenterColumn?: boolean }
> = {
  // Row 0 - Number row
  '`': { finger: 'LP', hand: 'left', row: 0 },
  '1': { finger: 'LP', hand: 'left', row: 0 },
  '2': { finger: 'LR', hand: 'left', row: 0 },
  '3': { finger: 'LM', hand: 'left', row: 0 },
  '4': { finger: 'LI', hand: 'left', row: 0 },
  '5': { finger: 'LI', hand: 'left', row: 0, isCenterColumn: true },
  '6': { finger: 'RI', hand: 'right', row: 0, isCenterColumn: true },
  '7': { finger: 'RI', hand: 'right', row: 0 },
  '8': { finger: 'RM', hand: 'right', row: 0 },
  '9': { finger: 'RR', hand: 'right', row: 0 },
  '0': { finger: 'RP', hand: 'right', row: 0 },
  '-': { finger: 'RP', hand: 'right', row: 0 },
  '=': { finger: 'RP', hand: 'right', row: 0 },

  // Row 1 - Top / QWERTY row
  q: { finger: 'LP', hand: 'left', row: 1 },
  w: { finger: 'LR', hand: 'left', row: 1 },
  e: { finger: 'LM', hand: 'left', row: 1 },
  r: { finger: 'LI', hand: 'left', row: 1 },
  t: { finger: 'LI', hand: 'left', row: 1, isCenterColumn: true },
  y: { finger: 'RI', hand: 'right', row: 1, isCenterColumn: true },
  u: { finger: 'RI', hand: 'right', row: 1 },
  i: { finger: 'RM', hand: 'right', row: 1 },
  o: { finger: 'RR', hand: 'right', row: 1 },
  p: { finger: 'RP', hand: 'right', row: 1 },
  '[': { finger: 'RP', hand: 'right', row: 1 },
  ']': { finger: 'RP', hand: 'right', row: 1 },
  '\\': { finger: 'RP', hand: 'right', row: 1 },

  // Row 2 - Home row
  a: { finger: 'LP', hand: 'left', row: 2 },
  s: { finger: 'LR', hand: 'left', row: 2 },
  d: { finger: 'LM', hand: 'left', row: 2 },
  f: { finger: 'LI', hand: 'left', row: 2 },
  g: { finger: 'LI', hand: 'left', row: 2, isCenterColumn: true },
  h: { finger: 'RI', hand: 'right', row: 2, isCenterColumn: true },
  j: { finger: 'RI', hand: 'right', row: 2 },
  k: { finger: 'RM', hand: 'right', row: 2 },
  l: { finger: 'RR', hand: 'right', row: 2 },
  ';': { finger: 'RP', hand: 'right', row: 2 },
  "'": { finger: 'RP', hand: 'right', row: 2 },

  // Row 3 - Bottom row
  z: { finger: 'LP', hand: 'left', row: 3 },
  x: { finger: 'LR', hand: 'left', row: 3 },
  c: { finger: 'LM', hand: 'left', row: 3 },
  v: { finger: 'LI', hand: 'left', row: 3 },
  b: { finger: 'LI', hand: 'left', row: 3, isCenterColumn: true },
  n: { finger: 'RI', hand: 'right', row: 3, isCenterColumn: true },
  m: { finger: 'RI', hand: 'right', row: 3 },
  ',': { finger: 'RM', hand: 'right', row: 3 },
  '.': { finger: 'RR', hand: 'right', row: 3 },
  '/': { finger: 'RP', hand: 'right', row: 3 },

  // Space
  ' ': { finger: 'RT', hand: 'thumb', row: 4 },
};

export class KinematicTracker {
  private samples: KeyStrokeSample[] = [];
  private bigrams: BigramMetric[] = [];

  public reset() {
    this.samples = [];
    this.bigrams = [];
  }

  public recordKeystroke(char: string, code: string, isError = false) {
    const timestamp = performance.now();
    const lowerChar = char.toLowerCase();
    const mapping = QWERTY_FINGER_MAP[lowerChar] || {
      finger: 'RT' as FingerName,
      hand: 'right' as Hand,
      row: 2,
    };

    const currentSample: KeyStrokeSample = {
      char,
      code,
      timestamp,
      finger: mapping.finger,
      hand: mapping.hand,
      row: mapping.row,
      isError,
    };

    if (this.samples.length > 0) {
      const prev = this.samples[this.samples.length - 1];
      const ikiMs = Math.max(1, timestamp - prev.timestamp);

      // Only evaluate bigrams if interval is reasonable (< 1500ms)
      if (ikiMs < 1500) {
        let transitionType: BigramTransitionType = 'ALTERNATION';

        if (prev.char.toLowerCase() === lowerChar) {
          transitionType = 'SAME_KEY_REPEAT';
        } else if (prev.hand !== currentSample.hand) {
          transitionType = 'ALTERNATION';
        } else if (prev.finger === currentSample.finger && prev.row !== currentSample.row) {
          transitionType = 'SAME_FINGER_BIGRAM';
        } else if (mapping.isCenterColumn) {
          transitionType = 'CENTER_COLUMN_REACH';
        } else {
          // Compare finger ordering on same hand
          const fingerOrder: Record<FingerName, number> = {
            LP: 0,
            LR: 1,
            LM: 2,
            LI: 3,
            LT: 4,
            RT: 5,
            RI: 6,
            RM: 7,
            RR: 8,
            RP: 9,
          };
          const f1 = fingerOrder[prev.finger];
          const f2 = fingerOrder[currentSample.finger];

          if (currentSample.hand === 'left') {
            transitionType = f2 > f1 ? 'ROLL_INWARD' : 'ROLL_OUTWARD';
          } else {
            transitionType = f2 < f1 ? 'ROLL_INWARD' : 'ROLL_OUTWARD';
          }
        }

        this.bigrams.push({
          bigram: `${prev.char}${char}`,
          firstChar: prev.char,
          secondChar: char,
          ikiMs,
          transitionType,
          finger: currentSample.finger,
          hand: currentSample.hand,
        });
      }
    }

    this.samples.push(currentSample);
  }

  public analyze(): KinematicAnalysisSummary {
    const totalKeystrokes = this.samples.length;
    const totalBigrams = this.bigrams.length;

    // Overall IKI stats
    const ikis = this.bigrams.map((b) => b.ikiMs);
    const avgIkiMs = ikis.length > 0 ? ikis.reduce((a, b) => a + b, 0) / ikis.length : 150;

    // Consistency (100 - CV of IKI)
    let variance = 0;
    ikis.forEach((v) => (variance += Math.pow(v - avgIkiMs, 2)));
    const stdDev = ikis.length > 1 ? Math.sqrt(variance / (ikis.length - 1)) : 0;
    const cvPercent = avgIkiMs > 0 ? (stdDev / avgIkiMs) * 100 : 0;
    const consistencyScore = Math.max(0, Math.min(100, Math.round(100 - cvPercent * 0.7)));

    // SFB Analysis
    const sfbList = this.bigrams.filter((b) => b.transitionType === 'SAME_FINGER_BIGRAM');
    const sfbCount = sfbList.length;
    const sfbPercent = totalBigrams > 0 ? (sfbCount / totalBigrams) * 100 : 0;
    const sfbAvgIki =
      sfbList.length > 0 ? sfbList.reduce((a, b) => a + b.ikiMs, 0) / sfbList.length : 0;

    // Aggregate worst SFBs
    const sfbMap: Record<string, { totalIki: number; count: number }> = {};
    sfbList.forEach((b) => {
      const key = b.bigram.toLowerCase();
      if (!sfbMap[key]) sfbMap[key] = { totalIki: 0, count: 0 };
      sfbMap[key].totalIki += b.ikiMs;
      sfbMap[key].count++;
    });
    const worstSfbs = Object.entries(sfbMap)
      .map(([bigram, data]) => ({
        bigram,
        avgIkiMs: Math.round(data.totalIki / data.count),
        count: data.count,
      }))
      .sort((a, b) => b.avgIkiMs - a.avgIkiMs)
      .slice(0, 5);

    // Rolls
    const inwardRolls = this.bigrams.filter((b) => b.transitionType === 'ROLL_INWARD');
    const outwardRolls = this.bigrams.filter((b) => b.transitionType === 'ROLL_OUTWARD');
    const inwardAvgIki =
      inwardRolls.length > 0
        ? inwardRolls.reduce((a, b) => a + b.ikiMs, 0) / inwardRolls.length
        : 0;
    const outwardAvgIki =
      outwardRolls.length > 0
        ? outwardRolls.reduce((a, b) => a + b.ikiMs, 0) / outwardRolls.length
        : 0;

    // Alternations
    const alternations = this.bigrams.filter((b) => b.transitionType === 'ALTERNATION');
    const alternationsAvgIki =
      alternations.length > 0
        ? alternations.reduce((a, b) => a + b.ikiMs, 0) / alternations.length
        : 0;

    // Center Column Reach
    const centerReaches = this.bigrams.filter((b) => b.transitionType === 'CENTER_COLUMN_REACH');
    const centerAvgIki =
      centerReaches.length > 0
        ? centerReaches.reduce((a, b) => a + b.ikiMs, 0) / centerReaches.length
        : 0;

    // Ergonomic Hand & Finger Workload
    const fingerCounts: Record<FingerName, number> = {
      LP: 0,
      LR: 0,
      LM: 0,
      LI: 0,
      LT: 0,
      RT: 0,
      RI: 0,
      RM: 0,
      RR: 0,
      RP: 0,
    };
    let leftHandCount = 0;
    let rightHandCount = 0;

    this.samples.forEach((s) => {
      fingerCounts[s.finger] = (fingerCounts[s.finger] || 0) + 1;
      if (s.hand === 'left') leftHandCount++;
      else if (s.hand === 'right' || s.hand === 'thumb') rightHandCount++;
    });

    const nonZeroKeystrokes = Math.max(1, totalKeystrokes);
    const leftHandPercent = Math.round((leftHandCount / nonZeroKeystrokes) * 100);
    const rightHandPercent = 100 - leftHandPercent;

    const fingerPercents: Record<FingerName, number> = {} as Record<FingerName, number>;
    (Object.keys(fingerCounts) as FingerName[]).forEach((f) => {
      fingerPercents[f] = Math.round((fingerCounts[f] / nonZeroKeystrokes) * 100);
    });

    // Neuromuscular Fatigue Detection
    // Baseline = first 40 bigrams; Current = last 40 bigrams
    let isFatigued = false;
    let baselineJitter = 0;
    let currentJitter = 0;
    let jitterIncrease = 0;
    let rollingAvgIki = avgIkiMs;

    if (this.bigrams.length >= 60) {
      const baselineSlice = this.bigrams.slice(0, 30).map((b) => b.ikiMs);
      const currentSlice = this.bigrams.slice(-30).map((b) => b.ikiMs);

      const bMean = baselineSlice.reduce((a, b) => a + b, 0) / baselineSlice.length;
      const cMean = currentSlice.reduce((a, b) => a + b, 0) / currentSlice.length;
      rollingAvgIki = Math.round(cMean);

      const bVar =
        baselineSlice.reduce((acc, v) => acc + Math.pow(v - bMean, 2), 0) / baselineSlice.length;
      const cVar =
        currentSlice.reduce((acc, v) => acc + Math.pow(v - cMean, 2), 0) / currentSlice.length;

      baselineJitter = bMean > 0 ? (Math.sqrt(bVar) / bMean) * 100 : 0;
      currentJitter = cMean > 0 ? (Math.sqrt(cVar) / cMean) * 100 : 0;

      if (baselineJitter > 0) {
        jitterIncrease = Math.round(
          ((currentJitter - baselineJitter) / baselineJitter) * 100
        );
      }

      if (jitterIncrease >= 35) {
        isFatigued = true;
      }
    }

    // Dynamic Alt-Fingering & Biomechanical Advice
    const advice: string[] = [];
    if (sfbPercent > 4.5) {
      advice.push(
        `High Same-Finger Bigram rate (${sfbPercent.toFixed(1)}%). Consider alt-fingering common row-hops (e.g. use index finger for 'c' or 'v').`
      );
    }
    if (worstSfbs.length > 0 && worstSfbs[0].avgIkiMs > 250) {
      advice.push(
        `Severe stall on "${worstSfbs[0].bigram}" (${worstSfbs[0].avgIkiMs}ms avg). Practice smooth row-glides without lifting hand off home row.`
      );
    }
    if (Math.abs(leftHandPercent - rightHandPercent) > 24) {
      advice.push(
        `High workload asymmetry (${leftHandPercent}% Left vs ${rightHandPercent}% Right). Try balancing modifier/space keystrokes across thumbs.`
      );
    }
    if (centerAvgIki > avgIkiMs * 1.35) {
      advice.push(
        `Center-column reaches (T, G, B, Y, H, N) create a ${Math.round(
          centerAvgIki - avgIkiMs
        )}ms bottleneck. Avoid lifting entire wrist when reaching for center keys.`
      );
    }
    if (isFatigued) {
      advice.push(
        `Neuromuscular fatigue detected (rhythm jitter increased by ${jitterIncrease}%). Recommended: 60-second wrist roll and finger extension stretch.`
      );
    }

    return {
      totalKeystrokes,
      avgIkiMs: Math.round(avgIkiMs),
      consistencyScore,
      sfbs: {
        count: sfbCount,
        percentOfBigrams: Math.round(sfbPercent * 10) / 10,
        avgIkiMs: Math.round(sfbAvgIki),
        worstSfbs,
      },
      rolls: {
        inwardCount: inwardRolls.length,
        outwardCount: outwardRolls.length,
        inwardAvgIkiMs: Math.round(inwardAvgIki),
        outwardAvgIkiMs: Math.round(outwardAvgIki),
      },
      alternations: {
        count: alternations.length,
        avgIkiMs: Math.round(alternationsAvgIki),
      },
      centerColumnReaches: {
        count: centerReaches.length,
        avgIkiMs: Math.round(centerAvgIki),
      },
      ergonomics: {
        totalKeystrokes,
        leftHandCount,
        rightHandCount,
        leftHandPercent,
        rightHandPercent,
        fingerCounts,
        fingerPercents,
      },
      fatigue: {
        isFatigued,
        baselineJitterPercent: Math.round(baselineJitter),
        currentJitterPercent: Math.round(currentJitter),
        jitterIncreasePercent: jitterIncrease,
        rollingAvgIkiMs: rollingAvgIki,
      },
      altFingeringAdvice: advice,
    };
  }
}
