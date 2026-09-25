/* ReliefPack stores drafts only in this browser. No requests are made by the app. */
const FIELDS = ['kind', 'language', 'headline', 'location', 'details', 'source', 'confirmed', 'verification'];
const KINDS = ['shelter', 'water', 'medical', 'update'];
const COPY = {
  en: { kinds: { shelter: 'SHELTER', water: 'WATER POINT', medical: 'MEDICAL SERVICE', update: 'COMMUNITY UPDATE' }, location: 'Location / directions', details: 'Information', source: 'Source', confirmed: 'Confirmed at', verified: 'Confirmed by named source', unverified: 'Not independently verified', caution: 'Check the source and time before relying on this notice.', empty: 'Your headline appears here', missing: 'Not provided' },
  ur: { kinds: { shelter: 'پناہ گاہ', water: 'پینے کا پانی', medical: 'طبی سہولت', update: 'علاقائی اطلاع' }, location: 'مقام / راستہ', details: 'معلومات', source: 'ذریعہ', confirmed: 'تصدیق کا وقت', verified: 'نامزد ذریعے سے تصدیق شدہ', unverified: 'آزادانہ تصدیق نہیں ہوئی', caution: 'اس اطلاع پر عمل کرنے سے پہلے ذریعے اور وقت کی تصدیق کریں۔', empty: 'آپ کی سرخی یہاں نظر آئے گی', missing: 'فراہم نہیں کیا گیا' }
};
const $ = id => document.getElementById(id);
const defaults = () => ({ kind: 'shelter', language: 'en', headline: '', location: '', details: '', source: '', confirmed: '', verification: 'unverified' });
function sanitize(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Expected a notice object.');
  const result = defaults();
  for (const key of FIELDS) {
    if (data[key] !== undefined && typeof data[key] !== 'string') throw new Error(`Invalid ${key}.`);
    if (data[key] !== undefined) result[key] = data[key].slice(0, {headline:100,location:180,details:800,source:120}[key] || 40);
  }
  if (!KINDS.includes(result.kind) || !COPY[result.language] || !['confirmed','unverified'].includes(result.verification)) throw new Error('Unknown notice option.');
  if (result.confirmed && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(result.confirmed)) throw new Error('Invalid confirmation time.');
  return result;
}
function getDraft() { return sanitize(Object.fromEntries(FIELDS.map(key => [key, $(key).value]))); }
function setText(id, value) { $(id).textContent = value; }
function render() {
  const data = getDraft(), words = COPY[data.language];
  $('card').dir = data.language === 'ur' ? 'rtl' : 'ltr';
  setText('card-kind', words.kinds[data.kind]);
  setText('card-status', words[data.verification]);
  $('card-status').classList.toggle('verified', data.verification === 'confirmed');
  setText('card-headline', data.headline || words.empty);
  for (const field of ['location', 'details', 'source', 'confirmed']) {
    setText(`label-${field}`, words[field]);
    setText(`card-${field}`, (field === 'confirmed' ? data[field].replace('T',' ') : data[field]) || words.missing);
  }
  setText('card-caution', words.caution);
  try { localStorage.setItem('reliefpack-draft-v1', JSON.stringify(data)); } catch (_) { /* Storage may be disabled. */ }
}
function apply(data) { for (const key of FIELDS) $(key).value = data[key]; render(); }
function report(message) { setText('feedback', message); }
function download() {
  const data = getDraft();
  const url = URL.createObjectURL(new Blob([JSON.stringify({ format: 'reliefpack-v1', ...data }, null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'reliefpack-notice.json'; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  report('Notice downloaded.');
}
async function importFile(file) {
  if (!file) return;
  if (file.size > 20_000) { report('File is too large (20 KB limit).'); return; }
  try {
    const raw = JSON.parse(await file.text());
    if (raw.format !== 'reliefpack-v1') throw new Error('Unsupported file format.');
    apply(sanitize(raw)); report('Notice imported.');
  } catch (error) { report(`Could not import: ${error.message}`); }
}
for (const id of FIELDS) $(id).addEventListener('input', render);
$('print').addEventListener('click', () => window.print());
$('download').addEventListener('click', download);
$('import').addEventListener('click', () => $('file').click());
$('file').addEventListener('change', event => { importFile(event.target.files[0]); event.target.value = ''; });
try { apply(sanitize(JSON.parse(localStorage.getItem('reliefpack-draft-v1')) || defaults())); }
catch (_) { apply(defaults()); }
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('./sw.js').catch(() => {});
