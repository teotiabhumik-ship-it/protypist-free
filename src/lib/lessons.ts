export interface TypingLesson {
  id: string;
  module: string;
  level: number;
  title: string;
  description: string;
  targetKeys: string[];
  text: string;
}

export const TYPING_LESSONS: TypingLesson[] = [
  // ── Module 1: Home Row ────────────────────────────────────────────────────
  {
    id: 'lesson-1-1',
    module: 'Home Row',
    level: 1,
    title: 'Home Row Foundation',
    description: 'Anchor your index fingers on F and J bumps. Practice simple home row alternating key taps.',
    targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    text: 'fff jjj ddd kkk sss lll aaa ;;; fj dk sl a; fff jjj dkd kdk fjf jfj sls lsl a;a ;a; fjkd slad fjkl asdf jkl;',
  },
  {
    id: 'lesson-1-2',
    module: 'Home Row',
    level: 1,
    title: 'Home Row Words',
    description: 'Build confidence typing real English words using only the home row keys.',
    targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
    text: 'all ask dad fall flash glad salad salsa flask lad fall dad asks flask glad all salad flash dad asks lad',
  },
  {
    id: 'lesson-1-3',
    module: 'Home Row',
    level: 1,
    title: 'Home Row Sentences',
    description: 'Fluent flow using only home row combinations with spaces.',
    targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
    text: 'a lad asks a dad a dad asks a lad all glad lads fall a flask had a salad a flash had a fall dad had a flask',
  },

  // ── Module 2: Top Row ─────────────────────────────────────────────────────
  {
    id: 'lesson-2-1',
    module: 'Top Row',
    level: 2,
    title: 'Reach for E and I',
    description: 'The two most frequent vowels in English. Reach up from D to E and from K to I.',
    targetKeys: ['e', 'i', 'd', 'k'],
    text: 'ded kik ded kik ede iki die kid led lie see fee tie lie did kid ide ed die see feed slide file like desk field side',
  },
  {
    id: 'lesson-2-2',
    module: 'Top Row',
    level: 2,
    title: 'Full Top Row Expansion',
    description: 'Incorporate Q, W, R, T, Y, U, O, P reaches into home row vocabulary.',
    targetKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    text: 'tree water quiet quite order power write report yellow tower polite update priority output quote route wipe true',
  },

  // ── Module 3: Bottom Row ──────────────────────────────────────────────────
  {
    id: 'lesson-3-1',
    module: 'Bottom Row',
    level: 3,
    title: 'Bottom Row Reaches',
    description: 'Curl fingers down to reach Z, X, C, V, B, N, M without lifting wrists.',
    targetKeys: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    text: 'can van man box mix zen back calm view zoom move next verb claim climb cabin civic blame brave zero voice',
  },
  {
    id: 'lesson-3-2',
    module: 'Bottom Row',
    level: 3,
    title: 'Full Alphabet Integration',
    description: 'Smooth coordination combining all three key rows in natural prose.',
    targetKeys: ['a-z'],
    text: 'bright morning sunlight warmed the cold mountain valley while swift birds flew across clear blue skies into green trees',
  },

  // ── Module 4: Capitalization & Shift ──────────────────────────────────────
  {
    id: 'lesson-4-1',
    module: 'Shift Keys',
    level: 4,
    title: 'Capital Letters & Proper Nouns',
    description: 'Use the opposite Shift key: Left Shift for right-hand keys, Right Shift for left-hand keys.',
    targetKeys: ['Shift', 'A-Z'],
    text: 'London Paris Tokyo Delhi New York Rome Cairo Berlin Sydney Toronto Madrid Seoul Vienna Stockholm Dublin Oslo',
  },
  {
    id: 'lesson-4-2',
    module: 'Shift Keys',
    level: 4,
    title: 'Punctuation & Flow',
    description: 'Master commas, periods, apostrophes, and question marks.',
    targetKeys: [',', '.', "'", '?', '!'],
    text: "Can you hear the ocean? Yes, it is quiet and calm today! Let's explore the shore, collect smooth stones, and watch the sunset.",
  },

  // ── Module 5: Numbers & Symbols ───────────────────────────────────────────
  {
    id: 'lesson-5-1',
    module: 'Numbers & Symbols',
    level: 5,
    title: 'Number Row Fluency',
    description: 'Reach up to the number keys with precision and return to home row.',
    targetKeys: ['0-9'],
    text: 'room 101 flight 747 year 2026 code 8593 dial 4085 page 329 section 48 item 1590 score 987 total 6420 count 315',
  },
  {
    id: 'lesson-5-2',
    module: 'Numbers & Symbols',
    level: 5,
    title: 'Code & Special Symbols',
    description: 'Symbols commonly found in programming and data entry.',
    targetKeys: ['$', '%', '&', '*', '#', '@', '{', '}', '(', ')'],
    text: 'cost $450 tax 18% id #908 user @alex sum = (a + b) * 10 config { port: 8080, debug: true } ratio 4:5 check & balance',
  },

  // ── Module 6: N-Grams & Digraphs ──────────────────────────────────────────
  {
    id: 'lesson-6-1',
    module: 'Muscle Memory',
    level: 6,
    title: 'High-Frequency Bigrams',
    description: 'Drill the most common two-letter sequences in the English language.',
    targetKeys: ['th', 'he', 'in', 'er', 'an', 're', 'on', 'at', 'en', 'nd'],
    text: 'the then there their that this they them other father mother another either weather leather feather gather together',
  },
  {
    id: 'lesson-6-2',
    module: 'Muscle Memory',
    level: 6,
    title: 'Common Word Endings',
    description: 'Fluid repetition of suffixes: -tion, -ment, -able, -ing.',
    targetKeys: ['tion', 'ment', 'able', 'ing'],
    text: 'action station motion position judgment movement agreement payment capable comfortable running walking thinking glowing',
  },

  // ── Module 7: Speed & Pangrams ────────────────────────────────────────────
  {
    id: 'lesson-7-1',
    module: 'Speed Mastery',
    level: 7,
    title: 'Classic Pangrams',
    description: 'Sentences containing every letter in the alphabet to calibrate overall typing balance.',
    targetKeys: ['all'],
    text: 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!',
  },
  {
    id: 'lesson-7-2',
    module: 'Speed Mastery',
    level: 7,
    title: 'Rhythmic Typing Sprint',
    description: 'A rhythmic flow test designed to cultivate steady, mistake-free tempo.',
    targetKeys: ['rhythm'],
    text: 'Rhythm is the secret to high speed typing. Keep your fingers relaxed and close to the keys. Breathe deeply and let muscle memory guide your hands across every sentence effortlessly.',
  },
];
