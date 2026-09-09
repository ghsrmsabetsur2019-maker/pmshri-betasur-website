// ---------------------------------------------------------------------
// Staff Portal — username/password login with roles, backed by the same
// Apps Script (Code.gs) that already handles the Admissions/Contact forms.
//
// Roles:
//   Principal — sees everything: applications, messages, can change an
//               application's Status, can delete applications/messages.
//   Teacher   — sees applications and messages in full, but the Status
//               dropdown and Delete buttons are hidden/disabled — and
//               even if someone tampered with this file in their own
//               browser, Code.gs rejects those actions for non-Principal
//               accounts on the server, so the limit is real, not cosmetic.
//
// SETUP: see DEPLOYMENT_GUIDE.md, "Set up the Staff Portal". You need to:
//   1. Paste your Apps Script Web app URL below (STAFF_FORM_ENDPOINT) —
//      same URL as FORM_ENDPOINT in script.js.
//   2. Use the "Staff Portal Admin" menu inside the Google Sheet (Code.gs
//      adds it automatically) to create a login for the Principal and
//      each Teacher — no code editing needed for that part.
// ---------------------------------------------------------------------
const STAFF_FORM_ENDPOINT = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
const STAFF_SESSION_KEY = 'pmshri_staff_session';

let staffSession = null; // { token, role, fullName, expiresAt }

function staffNotConfigured_() {
  return STAFF_FORM_ENDPOINT.indexOf('PASTE_YOUR') === 0;
}

function initStaffPortal() {
  if (staffNotConfigured_()) {
    const msg = document.getElementById('sp-not-configured');
    if (msg) msg.classList.remove('sp-hidden');
    return;
  }

  const form = document.getElementById('sp-login-form');
  if (form) form.addEventListener('submit', onLoginSubmit_);

  const saved = loadSavedSession_();
  if (saved) {
    staffSession = saved;
    showApp_();
    loadStaffData_();
  }
}

function loadSavedSession_() {
  try {
    const raw = localStorage.getItem(STAFF_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.token || !parsed.expiresAt) return null;
    if (new Date(parsed.expiresAt) < new Date()) {
      localStorage.removeItem(STAFF_SESSION_KEY);
      return null;
    }
    return parsed;
  } catch (err) {
    return null;
  }
}

function saveSession_(session) {
  try {
    localStorage.setItem(STAFF_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    // Private-browsing mode or storage disabled — the sign-in still works
    // for this page load, it just won't be remembered after a refresh.
  }
}

function onLoginSubmit_(e) {
  e.preventDefault();
  const username = document.getElementById('sp-username').value.trim();
  const password = document.getElementById('sp-password').value;
  const errorEl = document.getElementById('sp-login-error');
  errorEl.classList.add('sp-hidden');

  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;

  fetch(STAFF_FORM_ENDPOINT, {
    method: 'POST',
    body: new URLSearchParams({ formType: 'staffLogin', username: username, password: password })
  })
    .then((res) => res.json())
    .then((json) => {
      if (!json || json.result !== 'success') {
        throw new Error((json && json.message) || 'Sign-in failed.');
      }
      const expiresAt = new Date(Date.now() + (json.expiresInHours || 12) * 60 * 60 * 1000).toISOString();
      staffSession = { token: json.token, role: json.role, fullName: json.fullName, expiresAt: expiresAt };
      saveSession_(staffSession);
      document.getElementById('sp-password').value = '';
      showApp_();
      loadStaffData_();
    })
    .catch((err) => {
      errorEl.textContent = err.message || 'Incorrect username or password.';
      errorEl.classList.remove('sp-hidden');
    })
    .finally(() => { btn.disabled = false; });
}

function showApp_() {
  document.getElementById('sp-signin').classList.add('sp-hidden');
  document.getElementById('sp-app').classList.remove('sp-hidden');
  document.getElementById('sp-user-name').textContent = staffSession.fullName || '';
  document.getElementById('sp-user-name-kn').textContent = staffSession.fullName || '';
  const badge = document.getElementById('sp-role-badge');
  if (badge) badge.textContent = staffSession.role || '';
}

function staffSignOut() {
  const token = staffSession && staffSession.token;
  localStorage.removeItem(STAFF_SESSION_KEY);
  staffSession = null;

  document.getElementById('sp-app').classList.add('sp-hidden');
  document.getElementById('sp-signin').classList.remove('sp-hidden');
  document.getElementById('sp-data').classList.add('sp-hidden');
  document.getElementById('sp-loading').classList.remove('sp-hidden');
  document.getElementById('sp-load-error').classList.add('sp-hidden');
  const form = document.getElementById('sp-login-form');
  if (form) form.reset();

  if (token) {
    fetch(STAFF_FORM_ENDPOINT, {
      method: 'POST',
      body: new URLSearchParams({ formType: 'staffLogout', token: token })
    }).catch(() => { /* sign-out locally regardless */ });
  }
}

function loadStaffData_() {
  const loading = document.getElementById('sp-loading');
  const errorEl = document.getElementById('sp-load-error');
  const dataEl = document.getElementById('sp-data');

  loading.classList.remove('sp-hidden');
  errorEl.classList.add('sp-hidden');
  dataEl.classList.add('sp-hidden');

  fetch(STAFF_FORM_ENDPOINT, {
    method: 'POST',
    body: new URLSearchParams({ formType: 'staffData', token: staffSession.token })
  })
    .then((res) => res.json())
    .then((json) => {
      if (!json || json.result !== 'success') {
        throw new Error((json && json.message) || 'Session expired.');
      }
      renderApplications_(json.applications || [], json.statusOptions || [], json.role);
      renderMessages_(json.messages || [], json.role);
      loading.classList.add('sp-hidden');
      dataEl.classList.remove('sp-hidden');
    })
    .catch((err) => {
      loading.classList.add('sp-hidden');
      errorEl.textContent = err.message || 'Could not load data. Please sign in again.';
      errorEl.classList.remove('sp-hidden');
      if ((err.message || '').toLowerCase().indexOf('session') !== -1) {
        // Token is invalid/expired server-side — clear it so the person
        // sees a fresh login form instead of a stuck error screen.
        staffSignOut();
      }
    });
}

// Same grades in the same order as the website's admission form dropdown
// (see admissions.html) — used to group the table into sections that
// mirror the grade tabs in the Google Sheet.
const APPLICATION_GRADE_ORDER = ['LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];

function renderApplications_(applications, statusOptions, role) {
  const body = document.getElementById('sp-applications-body');
  const empty = document.getElementById('sp-applications-empty');
  const deleteTh = document.getElementById('sp-app-delete-th');
  const isPrincipal = role === 'Principal';
  if (deleteTh) deleteTh.classList.toggle('sp-hidden', !isPrincipal);
  body.innerHTML = '';

  if (!applications.length) {
    empty.classList.remove('sp-hidden');
    return;
  }
  empty.classList.add('sp-hidden');

  // Group into the same sections as the Sheet: one per grade, plus a
  // catch-all "Other" bucket for anything unexpected.
  const groups = {};
  APPLICATION_GRADE_ORDER.forEach((g) => { groups[g] = []; });
  groups.Other = [];
  applications.forEach((a) => {
    const g = (a['Grade applying for'] || '').toString().trim();
    (groups[g] ? groups[g] : groups.Other).push(a);
  });

  const colCount = isPrincipal ? 6 : 5;
  APPLICATION_GRADE_ORDER.concat(['Other']).forEach((g) => {
    const rows = groups[g];
    if (!rows.length) return; // skip empty sections so the table isn't cluttered
    body.appendChild(sectionHeaderRow_(g, rows.length, colCount));
    rows.forEach((a) => body.appendChild(applicationRow_(a, statusOptions, isPrincipal)));
  });
}

function sectionHeaderRow_(label, count, colCount) {
  const tr = document.createElement('tr');
  tr.className = 'sp-grade-header';
  const td = document.createElement('td');
  td.colSpan = colCount;
  td.textContent = label + ' (' + count + ')';
  tr.appendChild(td);
  return tr;
}

function applicationRow_(a, statusOptions, isPrincipal) {
  const tr = document.createElement('tr');

  const submitted = a['Submitted at'] ? new Date(a['Submitted at']).toLocaleDateString() : '';
  tr.appendChild(cell_(submitted));
  tr.appendChild(cell_(a['Student name'] || ''));
  tr.appendChild(cell_(a['Parent/Guardian name'] || ''));

  const contactParts = [a['Contact number'], a['Email']].filter(Boolean);
  tr.appendChild(cell_(contactParts.join(' / ')));

  const statusTd = document.createElement('td');
  if (isPrincipal) {
    const select = document.createElement('select');
    statusOptions.forEach((opt) => {
      const o = document.createElement('option');
      o.value = opt;
      o.textContent = opt;
      if (opt === a['Status']) o.selected = true;
      select.appendChild(o);
    });
    select.addEventListener('change', () => updateApplicationStatus_(a.sheet, a.row, select.value, select));
    statusTd.appendChild(select);
  } else {
    // Teachers can see the status but not change it.
    statusTd.textContent = a['Status'] || '';
  }
  tr.appendChild(statusTd);

  if (isPrincipal) {
    const delTd = document.createElement('td');
    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'sp-delete-btn';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => deleteApplication_(a.sheet, a.row));
    delTd.appendChild(delBtn);
    tr.appendChild(delTd);
  }

  return tr;
}

function updateApplicationStatus_(sheetName, row, newStatus, selectEl) {
  selectEl.disabled = true;
  fetch(STAFF_FORM_ENDPOINT, {
    method: 'POST',
    body: new URLSearchParams({
      formType: 'staffUpdateStatus',
      token: staffSession.token,
      sheet: sheetName,
      row: row,
      status: newStatus
    })
  })
    .then((res) => res.json())
    .then((json) => {
      if (!json || json.result !== 'success') throw new Error(json && json.message);
    })
    .catch((err) => {
      alert(err.message || 'Could not save that status change. Please try again.');
    })
    .finally(() => {
      selectEl.disabled = false;
    });
}

function deleteApplication_(sheetName, row) {
  if (!confirm('Delete this application permanently? This cannot be undone.')) return;
  fetch(STAFF_FORM_ENDPOINT, {
    method: 'POST',
    body: new URLSearchParams({ formType: 'staffDeleteApplication', token: staffSession.token, sheet: sheetName, row: row })
  })
    .then((res) => res.json())
    .then((json) => {
      if (!json || json.result !== 'success') throw new Error(json && json.message);
      loadStaffData_(); // reload so remaining row numbers stay correct
    })
    .catch((err) => {
      alert(err.message || 'Could not delete that application. Please try again.');
    });
}

function renderMessages_(messages, role) {
  const body = document.getElementById('sp-messages-body');
  const empty = document.getElementById('sp-messages-empty');
  const deleteTh = document.getElementById('sp-msg-delete-th');
  const isPrincipal = role === 'Principal';
  if (deleteTh) deleteTh.classList.toggle('sp-hidden', !isPrincipal);
  body.innerHTML = '';

  if (!messages.length) {
    empty.classList.remove('sp-hidden');
    return;
  }
  empty.classList.add('sp-hidden');

  messages.forEach((m) => {
    const tr = document.createElement('tr');
    const submitted = m['Submitted at'] ? new Date(m['Submitted at']).toLocaleDateString() : '';
    tr.appendChild(cell_(submitted));
    tr.appendChild(cell_(m['Name'] || ''));
    tr.appendChild(cell_(m['Phone or email'] || ''));
    const msgTd = cell_(m['Message'] || '');
    msgTd.className = 'sp-msg-body';
    tr.appendChild(msgTd);

    if (isPrincipal) {
      const delTd = document.createElement('td');
      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'sp-delete-btn';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => deleteMessage_(m.row));
      delTd.appendChild(delBtn);
      tr.appendChild(delTd);
    }

    body.appendChild(tr);
  });
}

function deleteMessage_(row) {
  if (!confirm('Delete this message permanently? This cannot be undone.')) return;
  fetch(STAFF_FORM_ENDPOINT, {
    method: 'POST',
    body: new URLSearchParams({ formType: 'staffDeleteMessage', token: staffSession.token, row: row })
  })
    .then((res) => res.json())
    .then((json) => {
      if (!json || json.result !== 'success') throw new Error(json && json.message);
      loadStaffData_();
    })
    .catch((err) => {
      alert(err.message || 'Could not delete that message. Please try again.');
    });
}

function cell_(text) {
  const td = document.createElement('td');
  td.textContent = text;
  return td;
}

window.addEventListener('DOMContentLoaded', initStaffPortal);
