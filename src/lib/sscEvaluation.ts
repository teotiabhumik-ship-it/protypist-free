// ═══════════════════════════════════════════════════════════════════════════════
// SSC CGL DEST Official Error Evaluation Engine
//
// Uses a 2D Dynamic-Programming Minimum-Penalty Alignment Matrix with Lookahead
// to evaluate candidate typing against master text strictly per the Staff
// Selection Commission's published Full (1.0) and Half (0.5) mistake taxonomy.
// ═══════════════════════════════════════════════════════════════════════════════

export type SscCategory = 'UR' | 'OBC' | 'EWS' | 'SC' | 'ST' | 'PwD';

export type MistakeCategory =
  | 'CORRECT'
  | 'OMISSION'            // Full: 1.0
  | 'ADDITION'            // Full: 1.0
  | 'SUBSTITUTION'        // Full: 1.0
  | 'SPELLING'            // Full: 1.0
  | 'INCOMPLETE'          // Full: 1.0
  | 'SPACING'             // Half: 0.5 (Merged or Split)
  | 'CAPITALIZATION'      // Half: 0.5
  | 'PUNCTUATION'         // Half: 0.5
  | 'TRANSPOSITION';      // Half: 0.5

export interface MistakeDetail {
  type: 'FULL' | 'HALF' | 'NONE';
  category: MistakeCategory;
  penalty: number;
  expected?: string;
  actual?: string;
  description: string;
}

export interface SscResult {
  totalMasterWords: number;
  totalMasterKeystrokes: number;
  typedKeystrokes: number;
  typedWordCount: number;
  fullMistakes: number;
  halfMistakes: number;
  totalErrors: number;
  errorPercent: number;
  cutoffPercent: number;
  qualified: boolean;
  category: SscCategory;
  grossWpm: number;
  netWpm: number;
  kdph: number; // Key Depressions Per Hour (Target: 8,000 KDPH / 2,000 per 15 min)
  accuracyPercent: number;
  mistakes: MistakeDetail[];
}

export const CUTOFFS: Record<SscCategory, number> = {
  UR: 20,
  OBC: 25,
  EWS: 25,
  SC: 30,
  ST: 30,
  PwD: 30,
};

// ── String & Token Utilities ────────────────────────────────────────────────

export function tokenize(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

export function extractCoreLetters(s: string): string {
  return s.replace(/[^\p{L}\p{N}]/gu, '');
}

export function extractPunctuation(s: string): string {
  return s.replace(/[\p{L}\p{N}]/gu, '');
}

export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// ── Single Token Mutation Classifier ────────────────────────────────────────

export interface PreparedToken {
  raw: string;
  clean: string;
  cleanLower: string;
  punct: string;
  len: number;
}

export function prepareToken(raw: string): PreparedToken {
  const clean = extractCoreLetters(raw);
  return {
    raw,
    clean,
    cleanLower: clean.toLowerCase(),
    punct: extractPunctuation(raw),
    len: clean.length,
  };
}

interface TokenComparison {
  category: MistakeCategory;
  penalty: number;
  description: string;
}

function classifyPreparedTokens(m: PreparedToken, t: PreparedToken): TokenComparison {
  if (m.raw === t.raw) {
    return { category: 'CORRECT', penalty: 0.0, description: 'Matched' };
  }

  // Same root word (case-insensitive)
  if (m.len > 0 && m.cleanLower === t.cleanLower) {
    const isCapDiff = m.clean !== t.clean;
    const isPunctDiff = m.punct !== t.punct;

    if (isCapDiff && !isPunctDiff) {
      return {
        category: 'CAPITALIZATION',
        penalty: 0.5,
        description: `Capitalization error: "${t.raw}" (expected "${m.raw}")`,
      };
    }
    if (isPunctDiff && !isCapDiff) {
      return {
        category: 'PUNCTUATION',
        penalty: 0.5,
        description: `Punctuation error: "${t.raw}" (expected "${m.raw}")`,
      };
    }
    // Both capitalization & punctuation on the same word
    return {
      category: 'CAPITALIZATION',
      penalty: 0.5,
      description: `Format error (case & punct): "${t.raw}" (expected "${m.raw}")`,
    };
  }

  // Check Incomplete Word (prefix match where typed is truncated)
  if (
    t.len > 0 &&
    t.len < m.len &&
    m.cleanLower.startsWith(t.cleanLower)
  ) {
    return {
      category: 'INCOMPLETE',
      penalty: 1.0,
      description: `Incomplete word: "${t.raw}" (expected "${m.raw}")`,
    };
  }

  // Spelling Mistake vs Full Substitution (skip Levenshtein if length diff is too large)
  const maxLen = Math.max(m.len, t.len);
  const maxAllowedEdit = Math.max(1, Math.floor(maxLen * 0.45));

  if (Math.abs(m.len - t.len) <= maxAllowedEdit && m.len > 0) {
    const dist = levenshtein(m.cleanLower, t.cleanLower);
    if (dist <= maxAllowedEdit) {
      return {
        category: 'SPELLING',
        penalty: 1.0,
        description: `Spelling error: "${t.raw}" (expected "${m.raw}")`,
      };
    }
  }

  return {
    category: 'SUBSTITUTION',
    penalty: 1.0,
    description: `Substituted word: "${t.raw}" (expected "${m.raw}")`,
  };
}

export function classifySingleToken(master: string, typed: string): TokenComparison {
  return classifyPreparedTokens(prepareToken(master), prepareToken(typed));
}

// ── Step Enums for High-Performance Flat Matrix ─────────────────────────────
const STEP_MATCH_OR_MUTATION = 1;
const STEP_OMISSION = 2;
const STEP_ADDITION = 3;
const STEP_TRANSPOSITION = 4;
const STEP_SPACING_MERGE = 5;
const STEP_SPACING_SPLIT = 6;

export function evaluateSscDest(
  masterText: string,
  typedText: string,
  category: SscCategory = 'UR',
  durationMinutes: number = 15
): SscResult {
  const masterWords = tokenize(masterText);
  const typedWords = tokenize(typedText);

  const U = masterWords.length;
  const V = typedWords.length;

  const masterPrepared = masterWords.map(prepareToken);
  const typedPrepared = typedWords.map(prepareToken);

  const stride = V + 1;
  const totalCells = (U + 1) * stride;
  const cost = new Float32Array(totalCells);
  const step = new Uint8Array(totalCells);

  // Base row (i = 0): all typed words are additions
  for (let j = 1; j <= V; j++) {
    cost[j] = j * 1.0;
    step[j] = STEP_ADDITION;
  }

  // Base col (j = 0): all master words are omissions
  for (let i = 1; i <= U; i++) {
    cost[i * stride] = i * 1.0;
    step[i * stride] = STEP_OMISSION;
  }

  // Fill DP Matrix (Optimized Cache-Friendly Flat Layout)
  for (let i = 1; i <= U; i++) {
    const rowOffset = i * stride;
    const prevRowOffset = (i - 1) * stride;
    const m = masterPrepared[i - 1];

    for (let j = 1; j <= V; j++) {
      const cellIdx = rowOffset + j;
      const t = typedPrepared[j - 1];

      // Option 1: Single Token Match or Mutation
      let bestCost: number;
      let bestStep: number;

      if (m.raw === t.raw) {
        bestCost = cost[prevRowOffset + (j - 1)];
        bestStep = STEP_MATCH_OR_MUTATION;
      } else {
        const comp = classifyPreparedTokens(m, t);
        bestCost = cost[prevRowOffset + (j - 1)] + comp.penalty;
        bestStep = STEP_MATCH_OR_MUTATION;
      }

      // Option 2: Omission of master word (1.0 error)
      const costOmission = cost[prevRowOffset + j] + 1.0;
      if (costOmission < bestCost) {
        bestCost = costOmission;
        bestStep = STEP_OMISSION;
      }

      // Option 3: Addition of extra typed word (1.0 error)
      const costAddition = cost[rowOffset + (j - 1)] + 1.0;
      if (costAddition < bestCost) {
        bestCost = costAddition;
        bestStep = STEP_ADDITION;
      }

      // Option 4: Transposition of adjacent words (0.5 half error)
      // Master: [m1, m2], Typed: [m2, m1]
      if (i >= 2 && j >= 2) {
        const mPrev = masterPrepared[i - 2];
        const tPrev = typedPrepared[j - 2];
        const isTransposedExact = mPrev.raw === t.raw && m.raw === tPrev.raw;
        const isTransposedCase =
          mPrev.cleanLower === t.cleanLower && m.cleanLower === tPrev.cleanLower;

        if (isTransposedExact || isTransposedCase) {
          const costTransposition = cost[(i - 2) * stride + (j - 2)] + 0.5;
          if (costTransposition < bestCost) {
            bestCost = costTransposition;
            bestStep = STEP_TRANSPOSITION;
          }
        }
      }

      // Option 5: Spacing Merge: two master words joined into one typed word
      // Master: ["in", "the"], Typed: "inthe" (0.5 half error)
      if (i >= 2) {
        const mPrev = masterPrepared[i - 2];
        const cleanMergedMaster = mPrev.cleanLower + m.cleanLower;
        if (cleanMergedMaster.length > 0 && cleanMergedMaster === t.cleanLower) {
          const costMerge = cost[(i - 2) * stride + (j - 1)] + 0.5;
          if (costMerge < bestCost) {
            bestCost = costMerge;
            bestStep = STEP_SPACING_MERGE;
          }
        }
      }

      // Option 6: Spacing Split: one master word split into two typed words
      // Master: "infrastructure", Typed: ["infra", "structure"] (0.5 half error)
      if (j >= 2) {
        const tPrev = typedPrepared[j - 2];
        const cleanSplitTyped = tPrev.cleanLower + t.cleanLower;
        if (m.cleanLower.length > 0 && m.cleanLower === cleanSplitTyped) {
          const costSplit = cost[prevRowOffset + (j - 2)] + 0.5;
          if (costSplit < bestCost) {
            bestCost = costSplit;
            bestStep = STEP_SPACING_SPLIT;
          }
        }
      }

      cost[cellIdx] = bestCost;
      step[cellIdx] = bestStep;
    }
  }

  // ── Backtrack to Reconstruct Path ─────────────────────────────────────────
  const mistakes: MistakeDetail[] = [];
  let currI = U;
  let currJ = V;

  while (currI > 0 || currJ > 0) {
    const cellIdx = currI * stride + currJ;
    const s = step[cellIdx];

    if (s === STEP_MATCH_OR_MUTATION) {
      const m = masterPrepared[currI - 1];
      const t = typedPrepared[currJ - 1];

      if (m.raw !== t.raw) {
        const comp = classifyPreparedTokens(m, t);
        if (comp.category !== 'CORRECT') {
          mistakes.unshift({
            type: comp.penalty === 1.0 ? 'FULL' : 'HALF',
            category: comp.category,
            penalty: comp.penalty,
            expected: m.raw,
            actual: t.raw,
            description: comp.description,
          });
        }
      }
      currI--;
      currJ--;
    } else if (s === STEP_TRANSPOSITION) {
      const m1 = masterWords[currI - 2];
      const m2 = masterWords[currI - 1];
      const t1 = typedWords[currJ - 2];
      const t2 = typedWords[currJ - 1];
      mistakes.unshift({
        type: 'HALF',
        category: 'TRANSPOSITION',
        penalty: 0.5,
        expected: `${m1} ${m2}`,
        actual: `${t1} ${t2}`,
        description: `Transposition error: "${m1} ${m2}" → "${t1} ${t2}"`,
      });
      currI -= 2;
      currJ -= 2;
    } else if (s === STEP_SPACING_MERGE) {
      const m1 = masterWords[currI - 2];
      const m2 = masterWords[currI - 1];
      const t = typedWords[currJ - 1];
      mistakes.unshift({
        type: 'HALF',
        category: 'SPACING',
        penalty: 0.5,
        expected: `${m1} ${m2}`,
        actual: t,
        description: `Spacing error (omitted space): "${m1} ${m2}" → "${t}"`,
      });
      currI -= 2;
      currJ -= 1;
    } else if (s === STEP_SPACING_SPLIT) {
      const m = masterWords[currI - 1];
      const t1 = typedWords[currJ - 2];
      const t2 = typedWords[currJ - 1];
      mistakes.unshift({
        type: 'HALF',
        category: 'SPACING',
        penalty: 0.5,
        expected: m,
        actual: `${t1} ${t2}`,
        description: `Spacing error (extra space): "${m}" → "${t1} ${t2}"`,
      });
      currI -= 1;
      currJ -= 2;
    } else if (s === STEP_OMISSION) {
      const omitted = masterWords[currI - 1];
      mistakes.unshift({
        type: 'FULL',
        category: 'OMISSION',
        penalty: 1.0,
        expected: omitted,
        description: `Omitted word: "${omitted}"`,
      });
      currI -= 1;
    } else if (s === STEP_ADDITION) {
      const added = typedWords[currJ - 1];
      mistakes.unshift({
        type: 'FULL',
        category: 'ADDITION',
        penalty: 1.0,
        actual: added,
        description: `Extraneous added word: "${added}"`,
      });
      currJ -= 1;
    }
  }

  // ── Error Calculations ────────────────────────────────────────────────────
  let fullMistakes = 0;
  let halfMistakes = 0;

  for (const m of mistakes) {
    if (m.type === 'FULL') fullMistakes += 1.0;
    else if (m.type === 'HALF') halfMistakes += 1.0;
  }

  const totalErrors = Number((fullMistakes * 1.0 + halfMistakes * 0.5).toFixed(2));
  const totalMasterWords = masterWords.length;
  const errorPercent =
    totalMasterWords > 0
      ? Number(((totalErrors / totalMasterWords) * 100).toFixed(2))
      : 0;

  const cutoffPercent = CUTOFFS[category] ?? 20;
  const qualified = errorPercent <= cutoffPercent;

  const typedKeystrokes = typedText.length;
  const totalMasterKeystrokes = masterText.length;
  const grossWpm = Math.round((typedKeystrokes / 5) / durationMinutes);
  const netWpm = Math.max(
    0,
    Math.round(((typedKeystrokes - totalErrors * 5) / 5) / durationMinutes)
  );
  // KDPH: Key Depressions Per Hour (For 15 mins, multiply by 4)
  const kdph = Math.round(typedKeystrokes * (60 / durationMinutes));
  const accuracyPercent =
    typedKeystrokes > 0
      ? Number(
          Math.max(
            0,
            ((typedKeystrokes - totalErrors * 5) / typedKeystrokes) * 100
          ).toFixed(1)
        )
      : 100;

  return {
    totalMasterWords,
    totalMasterKeystrokes,
    typedKeystrokes,
    typedWordCount: typedWords.length,
    fullMistakes,
    halfMistakes,
    totalErrors,
    errorPercent,
    cutoffPercent,
    qualified,
    category,
    grossWpm,
    netWpm,
    kdph,
    accuracyPercent,
    mistakes,
  };
}
