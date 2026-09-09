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

  if (btn) { btn.disabled = true; btn.textContent = 'Submitting…'; }
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

  if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
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
const NOTICES_CSV_URL = 'PASTE_YOUR_PUBLISHED_NOTICES_CSV_URL_HERE';

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
