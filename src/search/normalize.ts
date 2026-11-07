// Text normalization for search, so "Jérusalem", "القُدس" and "Al-Quds" style variants meet in
// the middle: case, accents, Arabic vowel marks and letter variants, Hebrew vowel points and
// final letters, apostrophes and punctuation are all folded away.

const COMBINING_MARKS = /\p{M}/gu;
const TATWEEL = /ـ/g;
const APOSTROPHES = /['’‘ʻʼʿʾ`]/g;
const NON_WORD = /[^\p{L}\p{N}]+/gu;

/** Arabic letters folded to a base form (alef and hamza variants, ya, ta marbuta). */
const ARABIC_FOLD: Readonly<Record<string, string>> = {
  'أ': 'ا', // alef with hamza above
  'إ': 'ا', // alef with hamza below
  'آ': 'ا', // alef with madda
  'ٱ': 'ا', // alef wasla
  'ى': 'ي', // alef maksura to ya
  'ة': 'ه', // ta marbuta to ha
  'ؤ': 'و', // waw with hamza
  'ئ': 'ي', // ya with hamza
};

/** Hebrew final letters folded to their regular forms. */
const HEBREW_FOLD: Readonly<Record<string, string>> = {
  'ך': 'כ',
  'ם': 'מ',
  'ן': 'נ',
  'ף': 'פ',
  'ץ': 'צ',
};

export function normalize(text: string): string {
  const stripped = text
    .normalize('NFKD')
    .replace(COMBINING_MARKS, '')
    .replace(TATWEEL, '')
    .replace(APOSTROPHES, '')
    .toLowerCase();
  let folded = '';
  for (const ch of stripped) folded += ARABIC_FOLD[ch] ?? HEBREW_FOLD[ch] ?? ch;
  return folded.replace(NON_WORD, ' ').trim();
}

export function tokenize(text: string): string[] {
  const normalized = normalize(text);
  return normalized === '' ? [] : normalized.split(' ');
}
