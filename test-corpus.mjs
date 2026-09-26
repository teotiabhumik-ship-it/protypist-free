import { CORPUS_1000_PASSAGES, PassageManager } from './src/lib/corpus1000.ts';

console.log('Testing Corpus 1000 Passages Bank...');
console.log(`Total passages generated: ${CORPUS_1000_PASSAGES.length}`);

if (CORPUS_1000_PASSAGES.length < 1000) {
  console.error(`FAIL: Expected >= 1000 passages, got ${CORPUS_1000_PASSAGES.length}`);
  process.exit(1);
}

// Verify ID uniqueness
const ids = new Set();
for (const p of CORPUS_1000_PASSAGES) {
  if (ids.has(p.id)) {
    console.error(`FAIL: Duplicate ID found: ${p.id}`);
    process.exit(1);
  }
  ids.add(p.id);
  if (!p.text || p.text.length < 100) {
    console.error(`FAIL: Passage text too short for ${p.id}`);
    process.exit(1);
  }
}
console.log(`PASS: All ${ids.size} passages have verified unique IDs and valid text lengths.`);

// Verify categories
const cats = {};
for (const p of CORPUS_1000_PASSAGES) {
  cats[p.category] = (cats[p.category] || 0) + 1;
}
console.log('Category distribution:');
console.table(cats);

console.log('ALL CORPUS VERIFICATIONS PASSED SUCCESSFULLY!');
