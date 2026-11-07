// Arabic interface and right-to-left layout (owner request, 2026-11-08). One button in the top bar switches the page between
// English and Arabic; the choice is remembered. Interface text is translated by looking up each piece of text in the table
// below, so text the map builds later is translated too. Event and place texts (summaries, sources, notes) are not translated
// here: they stay in English, with Arabic place names already shown beside the English ones. Text missing from the table
// stays in English. The timeline and the map keep their left-to-right direction.

type Lang = 'en' | 'ar';
const KEY = 'lang';

const AR: Readonly<Record<string, string>> = {
  'Share as image': 'مشاركة كصورة',
  'Picture saved': 'تم حفظ الصورة',
  'Compare two years': 'قارن بين سنتين',
  Compare: 'قارن',
  'Exit compare': 'إنهاء المقارنة',
  'Left year': 'السنة اليسرى',
  'Right year': 'السنة اليمنى',
  'Add a missing village': 'إضافة قرية ناقصة',
  "What's new": 'ما الجديد',
  'Join the discussion': 'انضم إلى النقاش',
  'Copy embed code': 'نسخ رمز التضمين',
  'Embed code copied': 'تم نسخ رمز التضمين',
  'Open the full map': 'افتح الخريطة الكاملة',
  'Send report': 'إرسال البلاغ',
  'Name in English letters': 'الاسم بالحروف اللاتينية',
  'Name in Arabic': 'الاسم بالعربية',
  Where: 'الموقع',
  'What we should know': 'ما يجب أن نعرفه',
  'Source link': 'رابط المصدر',
  'Nothing to show yet.': 'لا شيء لعرضه بعد.',
  // top bar and common
  Follow: 'تتبّع',
  Story: 'قصة',
  Filters: 'التصفية',
  'Night mode': 'الوضع الليلي',
  'Day mode': 'الوضع النهاري',
  Share: 'مشاركة',
  About: 'حول',
  Close: 'إغلاق',
  Done: 'تم',
  Play: 'تشغيل',
  Pause: 'إيقاف مؤقت',
  Back: 'السابق',
  Next: 'التالي',
  Start: 'ابدأ',
  Exit: 'خروج',
  Finish: 'إنهاء',
  Previous: 'السابق',
  Introduction: 'مقدمة',
  'Full card': 'البطاقة الكاملة',
  'Open full card': 'فتح البطاقة الكاملة',
  'Copy link': 'نسخ الرابط',
  'Link copied': 'تم نسخ الرابط',
  'Copy failed': 'تعذّر النسخ',
  'Report a mistake': 'الإبلاغ عن خطأ',
  'Under review': 'قيد المراجعة',
  'On the map now': 'على الخريطة الآن',
  Places: 'الأماكن',
  People: 'الأشخاص',
  Themes: 'المواضيع',
  Year: 'السنة',
  'Show all places': 'إظهار كل الأماكن',
  'Search places and events (press /)': 'ابحث عن الأماكن والأحداث (اضغط /)',
  'Search places and events': 'ابحث عن الأماكن والأحداث',
  'Jump to an era': 'انتقل إلى حقبة',
  'Play timeline': 'تشغيل الخط الزمني',
  'Pause timeline playback': 'إيقاف تشغيل الخط الزمني',
  'Playback speed': 'سرعة التشغيل',
  Timeline: 'الخط الزمني',
  'Map of Palestine': 'خريطة فلسطين',
  'Copy a link to this view': 'نسخ رابط لهذا العرض',
  // eras
  Ancient: 'القديم',
  Classical: 'الكلاسيكي',
  'Early Islamic': 'الإسلامي المبكر',
  Crusader: 'الصليبي',
  'Ayyubid-Mamluk': 'الأيوبي المملوكي',
  Ottoman: 'العثماني',
  'British Mandate': 'الانتداب البريطاني',
  '1948-1967': '١٩٤٨–١٩٦٧',
  '1967-1993': '١٩٦٧–١٩٩٣',
  '1993-present': '١٩٩٣–الحاضر',
  // filters
  Categories: 'الفئات',
  'Select all': 'تحديد الكل',
  'Select none': 'إلغاء التحديد',
  Political: 'سياسي',
  Conflict: 'نزاع',
  Cultural: 'ثقافي',
  Demographic: 'سكاني',
  'Religious sites': 'مواقع دينية',
  Displacement: 'تهجير',
  'Economy and daily life': 'الاقتصاد والحياة اليومية',
  'Land and settlement': 'الأرض والاستيطان',
  'Tick a category to show its events on the map; none are shown until you do. Counts show events active in the year on the timeline.':
    'ضع علامة على فئة لإظهار أحداثها على الخريطة؛ لا يظهر شيء حتى تفعل ذلك. الأعداد تبيّن الأحداث الجارية في السنة المختارة.',
  Settlements: 'المستوطنات',
  'Israeli settlements, localities and districts': 'المستوطنات والمواقع والمناطق الإسرائيلية',
  'Map picture': 'صورة الخريطة',
  'Illustrated base': 'خريطة مرسومة',
  'District areas': 'مناطق الأقضية',
  'Colour blocks': 'كتل ملوّنة',
  'Dashed lines': 'خطوط متقطعة',
  'Occupation of Palestine since 1948': 'احتلال فلسطين منذ ١٩٤٨',
  'Occupation of Palestine since 1948 (colours by year)': 'احتلال فلسطين منذ ١٩٤٨',
  'Geography over time': 'الجغرافيا عبر الزمن',
  'Lake Hula and the Dead Sea as printed in 1946': 'بحيرة الحولة والبحر الميت كما طُبعا عام ١٩٤٦',
  'Who held the land, by year': 'احتلال فلسطين منذ ١٩٤٨',
  // cards
  Sources: 'المصادر',
  'Names through time': 'الأسماء عبر الزمن',
  'The village in 1948': 'القرية عام ١٩٤٨',
  Facts: 'معلومات',
  'Mandate sub-district': 'قضاء الانتداب',
  Occupied: 'احتلّت',
  City: 'مدينة',
  Town: 'بلدة',
  Village: 'قرية',
  Site: 'موقع',
  Region: 'منطقة',
  Water: 'مسطح مائي',
  Mountain: 'جبل',
  'Palestine Remembered': 'فلسطين في الذاكرة',
  // about
  'About this map': 'حول هذه الخريطة',
  'An interactive timeline of Palestinian history. Scrub through the years, see where events happened, and open a card to read what the sources say.':
    'خط زمني تفاعلي لتاريخ فلسطين. تنقّل بين السنوات، وانظر أين وقعت الأحداث، وافتح البطاقة لتقرأ ما تقوله المصادر.',
  'This is a work in progress. Every event is still marked "needs review", and a card lists the sources it relies on. Where accounts differ, the card shows each view with its source.':
    'هذا العمل قيد التطوير. كل حدث ما زال موسوماً «قيد المراجعة»، وتذكر كل بطاقة المصادر التي تعتمد عليها. وحيث تختلف الروايات تعرض البطاقة كل رأي مع مصدره.',
  'The background map shows present-day names and boundaries. Locations for older events are approximate, and country-wide events are drawn as soft circles.':
    'تُظهر الخريطة الخلفية الأسماء والحدود الحالية. مواقع الأحداث القديمة تقريبية، والأحداث التي تشمل البلاد كلها تُرسم دوائر ناعمة.',
  'Colour theme: follow my device': 'نمط الألوان: حسب جهازي',
  'Event and place texts are in English for now; Arabic place names are shown beside the English ones.':
    'نصوص الأحداث والأماكن بالإنجليزية حالياً؛ وتظهر أسماء الأماكن بالعربية بجانب الإنجليزية.',
};

/** Texts with numbers or names in them. */
const PATTERNS: readonly (readonly [RegExp, (m: RegExpMatchArray) => string])[] = [
  [/^Names through time \((\d+)\)$/, (m) => `الأسماء عبر الزمن (${m[1]})`],
  [/^Nearby events \((\d+)\)$/, (m) => `أحداث قريبة (${m[1]})`],
  [/^Events here \((\d+)\)$/, (m) => `أحداث هنا (${m[1]})`],
  [/^Places named in (.+): (\d+)$/, (m) => `أماكن مسمّاة في ${m[1]}: ${m[2]}`],
  [/^Showing (\d+) places: (.+)$/, (m) => `عرض ${m[1]} مكاناً: ${m[2]}`],
  [/^Show all (\d+) matching places on the map$/, (m) => `إظهار كل الأماكن المطابقة (${m[1]}) على الخريطة`],
  [/^Population in (.+)$/, (m) => `السكان عام ${m[1]}`],
  [/^Step (\d+) of (\d+)$/, (m) => `الخطوة ${m[1]} من ${m[2]}`],
  [/^(\d+) of (\d+)$/, (m) => `${m[1]} من ${m[2]}`],
];

function translate(text: string): string | null {
  const key = text.trim();
  if (key === '') return null;
  const direct = AR[key];
  if (direct !== undefined) return text.replace(key, direct);
  for (const [re, make] of PATTERNS) {
    const m = key.match(re);
    if (m) return text.replace(key, make(m));
  }
  return null;
}

const ATTRS = ['aria-label', 'placeholder', 'title'] as const;
/** What each translated text node said in English, and what we wrote, so we can undo and not loop on our own changes. */
const english = new WeakMap<Node, string>();
const written = new WeakMap<Node, string>();

function applyNode(node: Node): void {
  if (node.nodeType === Node.TEXT_NODE) {
    const value = node.nodeValue ?? '';
    if (written.get(node) === value) return; // our own change
    if (node.parentElement?.closest('[data-no-translate]')) return;
    const out = translate(value);
    if (out !== null && out !== value) {
      english.set(node, value);
      written.set(node, out);
      node.nodeValue = out;
    }
    return;
  }
  if (!(node instanceof Element)) return;
  if (node.closest('[data-no-translate]')) return;
  for (const name of ATTRS) {
    const v = node.getAttribute(name);
    if (v === null) continue;
    const out = translate(v);
    if (out !== null && out !== v) {
      if (!node.hasAttribute(`data-en-${name}`)) node.setAttribute(`data-en-${name}`, v);
      node.setAttribute(name, out);
    }
  }
  node.childNodes.forEach(applyNode);
}

function restore(root: Node): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const original = english.get(n);
    if (original !== undefined && written.get(n) === n.nodeValue) n.nodeValue = original;
  }
  document.querySelectorAll('*').forEach((e) => {
    for (const name of ATTRS) {
      const o = e.getAttribute(`data-en-${name}`);
      if (o !== null) {
        e.setAttribute(name, o);
        e.removeAttribute(`data-en-${name}`);
      }
    }
  });
}

let observer: MutationObserver | null = null;

function setLang(lang: Lang): void {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  observer?.disconnect();
  observer = null;
  if (lang === 'ar') {
    applyNode(document.body);
    observer = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === 'characterData') applyNode(r.target);
        r.addedNodes.forEach(applyNode);
        if (r.type === 'attributes' && r.target instanceof Element) applyNode(r.target);
      }
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: [...ATTRS] });
  } else {
    restore(document.body);
  }
}

export function savedLang(): Lang {
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {
    // Storage can be blocked.
  }
  return 'en';
}

/** Wires the top-bar language button and applies the saved language. */
export function initLanguage(button: HTMLElement): void {
  let lang = savedLang();
  const sync = (): void => {
    button.textContent = lang === 'ar' ? 'English' : 'العربية';
    button.setAttribute('data-no-translate', '');
    button.setAttribute('lang', lang === 'ar' ? 'en' : 'ar');
    setLang(lang);
  };
  button.addEventListener('click', () => {
    lang = lang === 'ar' ? 'en' : 'ar';
    try {
      window.localStorage.setItem(KEY, lang);
    } catch {
      // Storage can be blocked; the choice then lasts for this visit only.
    }
    sync();
  });
  sync();
}
