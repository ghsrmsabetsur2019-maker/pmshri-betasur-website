// Mobile nav: toggles the collapsing menu on small screens.
function toggleNav() {
  const menu = document.getElementById('mainNav');
  const btn = document.querySelector('.nav-toggle');
  if (!menu || !btn) return;
  const isOpen = menu.classList.toggle('open');
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

// Register the service worker so the site can be installed to the home
// screen ("app" mode) and still open on a poor connection. Safe to skip
// silently on browsers/hosts that don't support it (e.g. file:// preview).
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => { /* no-op */ });
  });
}

// ---------------------------------------------------------------------
// Forms -> Google Sheet (one Apps Script deployment handles both forms;
// see DEPLOYMENT_GUIDE.md, "Connect the forms to your Google Sheet").
// ---------------------------------------------------------------------
const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwyh7PN0D7RMQxi5d9qzbr0KH2mUzHz4_1kKoDzUqQtWlxlMBA2gh2Zviyt2YY9vHE8eg/exec';

function submitApplication(e) {
  e.preventDefault();
  const statusEl = document.getElementById('apply-status');
  const btn = document.getElementById('apply-submit-btn');

  if (FORM_ENDPOINT.indexOf('PASTE_YOUR') === 0) {
    if (statusEl) {
      statusEl.textContent = 'Form is not connected yet. See DEPLOYMENT_GUIDE.md to link it to your Google Sheet.';
      statusEl.className = 'apply-status apply-status-error';
    }
    return false;
  }

  // Honeypot: real visitors never see or fill this field (see CSS). If a
  // bot filled it, quietly act like it worked without sending anything.
  const hp = document.getElementById('af-hp');
  if (hp && hp.value.trim() !== '') {
    if (statusEl) {
      statusEl.textContent = 'Application submitted. We will contact you soon. / ಅರ್ಜಿ ಸಲ್ಲಿಸಲಾಗಿದೆ. ನಾವು ಶೀಘ್ರದಲ್ಲೇ ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.';
      statusEl.className = 'apply-status apply-status-ok';
    }
    return false;
  }

  const data = {
    formType: 'application',
    studentName: document.getElementById('af-student-name').value,
    dob: document.getElementById('af-dob').value,
    gender: document.getElementById('af-gender').value,
    gradeApplying: document.getElementById('af-grade').value,
    parentName: document.getElementById('af-parent-name').value,
    contactNumber: document.getElementById('af-contact').value,
    email: document.getElementById('af-email').value,
    address: document.getElementById('af-address').value,
    previousSchool: document.getElementById('af-previous-school').value,
    academicYear: document.getElementById('af-academic-year').value,
    hp: ''
  };

  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="btn-spinner"></span>Submitting…'; }
  if (statusEl) { statusEl.textContent = ''; statusEl.className = 'apply-status'; }

  fetch(FORM_ENDPOINT, {
    method: 'POST',
    body: new URLSearchParams(data)
  })
    .then((res) => res.json())
    .then((json) => {
      if (json && json.result === 'success') {
        document.getElementById('admission-apply-form').reset();
        if (statusEl) {
          statusEl.textContent = 'Application submitted. We will contact you soon. / ಅರ್ಜಿ ಸಲ್ಲಿಸಲಾಗಿದೆ. ನಾವು ಶೀಘ್ರದಲ್ಲೇ ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.';
          statusEl.className = 'apply-status apply-status-ok';
        }
      } else {
        throw new Error('Unexpected response');
      }
    })
    .catch(() => {
      if (statusEl) {
        statusEl.textContent = 'Something went wrong. Please try again, or call/WhatsApp the school directly.';
        statusEl.className = 'apply-status apply-status-error';
      }
    })
    .finally(() => {
      if (btn) { btn.disabled = false; btn.innerHTML = '<span class="t-en">Submit application</span><span class="t-kn">ಅರ್ಜಿ ಸಲ್ಲಿಸಿ</span>'; }
    });

  return false;
}

function submitContactMessage(e) {
  e.preventDefault();
  const statusEl = document.getElementById('contact-status');
  const btn = document.getElementById('contact-submit-btn');

  if (FORM_ENDPOINT.indexOf('PASTE_YOUR') === 0) {
    if (statusEl) {
      statusEl.textContent = 'Form is not connected yet. See DEPLOYMENT_GUIDE.md to link it to your Google Sheet.';
      statusEl.className = 'apply-status apply-status-error';
    }
    return false;
  }

  const hp = document.getElementById('cf-hp');
  if (hp && hp.value.trim() !== '') {
    if (statusEl) {
      statusEl.textContent = 'Message sent. / ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ.';
      statusEl.className = 'apply-status apply-status-ok';
    }
    return false;
  }

  const data = {
    formType: 'message',
    name: document.getElementById('cf-name').value,
    contact: document.getElementById('cf-contact').value,
    message: document.getElementById('cf-message').value,
    hp: ''
  };

if (btn) { btn.disabled = true; btn.innerHTML = '<span class="btn-spinner"></span>Sending…'; }
  if (statusEl) { statusEl.textContent = ''; statusEl.className = 'apply-status'; }

  fetch(FORM_ENDPOINT, {
    method: 'POST',
    body: new URLSearchParams(data)
  })
    .then((res) => res.json())
    .then((json) => {
      if (json && json.result === 'success') {
        document.getElementById('contact-message-form').reset();
        if (statusEl) {
          statusEl.textContent = 'Message sent. We will get back to you soon. / ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ. ನಾವು ಶೀಘ್ರದಲ್ಲೇ ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.';
          statusEl.className = 'apply-status apply-status-ok';
        }
      } else {
        throw new Error('Unexpected response');
      }
    })
    .catch(() => {
      if (statusEl) {
        statusEl.textContent = 'Something went wrong. Please try again, or call/WhatsApp the school directly.';
        statusEl.className = 'apply-status apply-status-error';
      }
    })
    .finally(() => {
      if (btn) { btn.disabled = false; btn.innerHTML = '<span class="t-en">Send</span><span class="t-kn">ಕಳುಹಿಸಿ</span>'; }
    });

  return false;
}

// ---------------------------------------------------------------------
// Notices: reads a "published to web" Google Sheet (CSV) so whoever runs
// the office can add/edit notices directly in Sheets, with no code
// changes or redeploy needed. Falls back to whatever's already written
// in the HTML if this isn't configured yet, or if the fetch fails.
// Expected columns: Date, Text (English), Text (Kannada), Show(yes/no, optional)
// ---------------------------------------------------------------------
const NOTICES_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQwVHxWjsXG9_PEKat5V1LVEgYNtzUIjmdAiL71fwWCtUL4-poIuAHE2_zUKJxhY2Uphv7jmHvCuSOf/pub?gid=1700599320&single=true&output=csv';

function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], next = text[i + 1];
    if (inQuotes) {
      if (c === '"' && next === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { field += c; }
    } else if (c === '"') { inQuotes = true; }
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\r') { /* skip */ }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else { field += c; }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function loadNotices() {
  if (NOTICES_CSV_URL.indexOf('PASTE_YOUR') === 0) return;
  const fullList = document.getElementById('notices-list-full');
  const miniLists = document.querySelectorAll('#notices-mini');
  if (!fullList && miniLists.length === 0) return;

  fetch(NOTICES_CSV_URL)
    .then((res) => res.text())
    .then((text) => {
      const rows = parseCSV(text).slice(1) // drop header row
        .filter((r) => r[0] && r[0].trim() !== '')
        .filter((r) => !r[3] || r[3].trim().toLowerCase() !== 'no')
        .sort((a, b) => new Date(b[0]) - new Date(a[0]));

      if (fullList && rows.length) {
        fullList.innerHTML = rows.map((r) =>
          '<li><span class="notice-date">' + escapeHtml(r[0]) + '</span>' +
          '<span class="t-en">' + escapeHtml(r[1] || '') + '</span>' +
          '<span class="t-kn">' + escapeHtml(r[2] || r[1] || '') + '</span></li>'
        ).join('');
      }

      const miniRows = rows.slice(0, 2);
      miniLists.forEach((ul) => {
        const viewAllLi = ul.querySelector('.notices-view-all');
        ul.querySelectorAll('li:not(.notices-view-all)').forEach((li) => li.remove());
        miniRows.forEach((r) => {
          const li = document.createElement('li');
          li.innerHTML = '<span class="mini-date">' + escapeHtml(r[0]) + '</span>' +
            '<span class="t-en">' + escapeHtml(r[1] || '') + '</span>' +
            '<span class="t-kn">' + escapeHtml(r[2] || r[1] || '') + '</span>';
          if (viewAllLi) ul.insertBefore(li, viewAllLi);
          else ul.appendChild(li);
        });
      });
    })
    .catch(() => { /* keep whatever's already in the HTML */ });
}

window.addEventListener('DOMContentLoaded', loadNotices);

// Keep the language button's label in sync with whatever data-lang the
// preference-sync script (in <head>) already applied for this page, so
// it always shows the language you'd switch TO next.
window.addEventListener('DOMContentLoaded', () => {
  const current = document.documentElement.getAttribute('data-lang') || 'kn';
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = current === 'en' ? 'ಕನ್ನಡ' : 'English';

  const darkBtn = document.getElementById('darkModeToggle');
  if (darkBtn) {
    darkBtn.setAttribute('aria-pressed', document.documentElement.classList.contains('dark') ? 'true' : 'false');
  }
});

// Language toggle: flips data-lang on <html>, which CSS uses to show/hide
// .t-en / .t-kn spans. Saved to localStorage so the choice carries over
// to the next page instead of resetting to Kannada every time (the
// small inline script at the top of <head> reads this back on load).
function toggleLang() {
  const html = document.documentElement;
  const current = html.getAttribute('data-lang') || 'kn';
  const next = current === 'en' ? 'kn' : 'en';
  html.setAttribute('data-lang', next);
  try { localStorage.setItem('pmshri-lang', next); } catch (e) { /* private browsing etc. */ }
  const btn = document.getElementById('langToggle');
  // Button always shows the language you'd switch TO next.
  if (btn) btn.textContent = next === 'en' ? 'ಕನ್ನಡ' : 'English';
}

// Accessibility: font-size stepper (govt-site convention). Persisted to
// localStorage (see the inline script in <head>) so it carries across
// pages instead of resetting on every navigation.
let fontStep = 0;
try {
  const saved = parseInt(localStorage.getItem('pmshri-fontstep'), 10);
  if (!Number.isNaN(saved)) fontStep = Math.max(-2, Math.min(3, saved));
} catch (e) { /* private browsing etc. */ }
function changeFontSize(delta) {
  fontStep = Math.max(-2, Math.min(3, fontStep + delta));
  document.documentElement.style.fontSize = (16 + fontStep * 1.5) + 'px';
  try { localStorage.setItem('pmshri-fontstep', String(fontStep)); } catch (e) { /* noop */ }
}
function resetFontSize() {
  fontStep = 0;
  document.documentElement.style.fontSize = '16px';
  try { localStorage.setItem('pmshri-fontstep', '0'); } catch (e) { /* noop */ }
}

// Dark mode toggle. Applied to <html> (see styles.css) and persisted so
// it stays on as staff/parents move between pages. The preference-sync
// script in <head> reads this back before first paint (no flash).
function toggleDarkMode() {
  const on = document.documentElement.classList.toggle('dark');
  try { localStorage.setItem('pmshri-theme', on ? 'dark' : 'light'); } catch (e) { /* noop */ }
  const btn = document.getElementById('darkModeToggle');
  if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
}

// PDF preview modal — used on downloads.html. Pass the file path and a
// display title. If the PDF doesn't exist yet (placeholder), shows a
// friendly message instead of a broken embed.
function openPdfPreview(url, title) {
  const modal = document.getElementById('pdfModal');
  const frame = document.getElementById('pdfFrame');
  const empty = document.getElementById('pdfEmpty');
  const titleEl = document.getElementById('pdfModalTitle');
  if (!modal) return;
  titleEl.textContent = title || 'Preview';
  if (!url || url === '#') {
    frame.style.display = 'none';
    empty.style.display = 'flex';
  } else {
    frame.src = url;
    frame.style.display = 'block';
    empty.style.display = 'none';
  }
  modal.classList.add('open');
}
function closePdfPreview() {
  const modal = document.getElementById('pdfModal');
  const frame = document.getElementById('pdfFrame');
  if (!modal) return;
  modal.classList.remove('open');
  frame.src = '';
}


// Innovation polish: subtle reveal animation for cards/sections. It respects
// reduced-motion preferences and leaves all existing features unchanged.
window.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.card, .sidebar-widget, .signature-item, .timeline-step, .principal-note, .feature-card');
  targets.forEach((el) => el.classList.add('reveal-on-scroll'));
  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach((el, index) => {
    el.style.transitionDelay = Math.min(index % 6, 5) * 55 + 'ms';
    io.observe(el);
  });
});

// Close mobile navigation after a visitor chooses a page.
window.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('mainNav');
  const btn = document.querySelector('.nav-toggle');
  if (!menu || !btn) return;
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }));
});


window.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counters = document.querySelectorAll('.count-up');
  if (!counters.length) return;
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const prefix = el.dataset.prefix || '';
    if (reduceMotion) { el.textContent = prefix + target; return; }
    const duration = 1000;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = prefix + Math.round(progress * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (!('IntersectionObserver' in window)) { counters.forEach(animateCounter); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { animateCounter(entry.target); io.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => io.observe(el));
});


function openLightbox(imgEl) {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const item = imgEl.closest('.gallery-item');
  const captionEl = item.querySelector('.gallery-caption.t-en');
  lbImg.src = imgEl.src;
  lbImg.alt = imgEl.alt;
  lbCaption.textContent = captionEl ? captionEl.textContent : '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(e) {
  if (e.target.id !== 'lightbox' && e.target.className !== 'lightbox-close') return;
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
window.addEventListener('DOMContentLoaded', () => {
  const filters = document.querySelectorAll('.gallery-filter');
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;
  function applyFilter(filter) {
    items.forEach((item) => {
      item.style.display = (filter === 'all' || item.dataset.category === filter) ? '' : 'none';
    });
  }
  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });
  applyFilter('all'); // show every photo when the page first opens
});





// "Listen" button: reads the visible text of the page aloud, in the language chosen on the site.
window.addEventListener('DOMContentLoaded', function () {
  if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return;
  var synth = window.speechSynthesis;
  var speaking = false;

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'listen-btn';
  btn.innerHTML = '<span class="listen-icon"></span><span class="listen-text"></span>';
  document.body.appendChild(btn);

  function isKannada() { return document.documentElement.getAttribute('data-lang') !== 'en'; }

  function updateLabel() {
    var kn = isKannada();
    btn.setAttribute('aria-label', kn ? 'ಈ ಪುಟವನ್ನು ಕೇಳಿ' : 'Listen to this page');
    btn.setAttribute('aria-pressed', speaking ? 'true' : 'false');
    btn.querySelector('.listen-icon').textContent = speaking ? '\u23F9' : '\uD83D\uDD0A';
    btn.querySelector('.listen-text').textContent = speaking ? (kn ? 'ನಿಲ್ಲಿಸಿ' : 'Stop') : (kn ? 'ಕೇಳಿ' : 'Listen');
  }

  function pickVoice(lang) {
    var voices = synth.getVoices() || [];
    var base = lang.slice(0, 2).toLowerCase();
    for (var i = 0; i < voices.length; i++) { if (voices[i].lang === lang) return { voice: voices[i], any: voices.length }; }
    for (var j = 0; j < voices.length; j++) { if (voices[j].lang.toLowerCase().indexOf(base) === 0) return { voice: voices[j], any: voices.length }; }
    return { voice: null, any: voices.length };
  }

  // Break long text into short pieces; some browsers stop reading long passages.
  function chunkText(text) {
    var sentences = text.replace(/\s+/g, ' ').trim().match(/[^.!?\u0964]+[.!?\u0964]*/g) || [];
    var chunks = [], cur = '';
    sentences.forEach(function (s) {
      s = s.trim();
      if (!s) return;
      if ((cur + ' ' + s).length > 180 && cur) { chunks.push(cur); cur = s; }
      else { cur = cur ? cur + ' ' + s : s; }
    });
    if (cur) chunks.push(cur);
    return chunks;
  }

  function stop() { synth.cancel(); speaking = false; updateLabel(); }

  function start() {
    var root = document.getElementById('main-content') || document.body;
    var column = root.querySelector('.with-sidebar > div');
    var text = (column || root).innerText || '';
    var chunks = chunkText(text);
    if (!chunks.length) return;
    var lang = isKannada() ? 'kn-IN' : 'en-IN';
    var found = pickVoice(lang);
    if (!found.voice && found.any > 0) {
      alert(isKannada()
        ? 'ಈ ಸಾಧನದಲ್ಲಿ ಕನ್ನಡ ಧ್ವನಿ ಲಭ್ಯವಿಲ್ಲ. / Kannada voice is not available on this device.'
        : 'English voice is not available on this device.');
      return;
    }
    synth.cancel();
    speaking = true;
    updateLabel();
    chunks.forEach(function (chunk, idx) {
      var u = new SpeechSynthesisUtterance(chunk);
      u.lang = lang;
      if (found.voice) u.voice = found.voice;
      u.rate = 0.95;
      if (idx === chunks.length - 1) {
        u.onend = function () { speaking = false; updateLabel(); };
        u.onerror = function () { speaking = false; updateLabel(); };
      }
      synth.speak(u);
    });
  }

  btn.addEventListener('click', function () { if (speaking) stop(); else start(); });
  var langBtn = document.getElementById('langToggle');
  if (langBtn) langBtn.addEventListener('click', function () { stop(); setTimeout(updateLabel, 50); });
  window.addEventListener('beforeunload', function () { synth.cancel(); });
  updateLabel();
});
