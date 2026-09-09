# Deployment Guide — PM Shri Karnataka Public School Betasur website

This covers everything to go from these files to: a live website, an
application form and a contact form that both save into a Google Sheet you
control (with email notifications), an editable Notices feed, a secure
Staff Portal login for the principal and teachers, an installable "app"
version, and (later) a real Play Store listing.

Do the parts in order — each one depends on the previous.

---

## Part A — Connect the forms to your Google Sheet

This is your "database." Every application and every contact message becomes
a row you can open, sort, filter, or export like any spreadsheet — and you
get an email the moment either one comes in.

1. Go to [sheets.google.com](https://sheets.google.com) and create a new
   blank sheet. Name it something like **"Website submissions"**.
2. In the sheet, go to **Extensions → Apps Script**. This opens a code editor.
3. Delete the placeholder `function myFunction() {}` code that's there.
4. Open `google-apps-script/Code.gs` from this package, copy everything, and
   paste it into the Apps Script editor. Save (Ctrl+S / Cmd+S).
5. Near the top of the file, `SCHOOL_EMAIL` is already set to
   `ghrmsabetsur2019@gmail.com` — change it if you want notifications to go
   somewhere else.
6. Click **Deploy → New deployment**.
   - Click the gear icon next to "Select type" → choose **Web app**.
   - Description: anything, e.g. "Forms v1".
   - **Execute as:** Me (your Google account).
   - **Who has access:** Anyone.
   - Click **Deploy**. Google may ask you to authorize the script — click
     through your own account (you'll see an "unverified app" warning since
     it's your personal script; click **Advanced → Go to (project name)** to
     continue — this is expected for scripts you write yourself). It will
     also ask for permission to send email on your behalf — that's the
     notification emails, approve it.
7. Copy the **Web app URL** it gives you (ends in `/exec`).
8. Open `script.js` in this package, find this line near the top:
   ```js
   const FORM_ENDPOINT = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
   Replace the placeholder text with the URL you copied, keeping the quotes.
   Both the admissions form and the contact form use this same line.
9. Test: open the `/exec` URL directly in a browser tab — you should see a
   small line of JSON, not an error. Then, once the site is live (Part B),
   submit each form and confirm: a new row appears in the right tab (the
   grade you chose for an application, e.g. **"LKG"** or **"6th"** — or
   **"Messages"** for the contact form), and an email arrives at
   `SCHOOL_EMAIL`.

**What you get automatically:**
- A separate tab per grade — **LKG**, **UKG**, **1st** through **10th** —
  is created the first time someone applies for that grade, plus a
  **Messages** tab for the contact form. Each has a bold header row, and
  applications are split this way so the school office can open just the
  class they're working on instead of one long combined list. (A rare
  application with an unrecognized grade value falls into an
  **"Applications - Other"** tab instead of being lost.)
- Applications get a **Status** column with a dropdown: Pending / Contacted
  / Enrolled / Not proceeding — update it as you work through your list, so
  the sheet doubles as a simple admissions tracker.
- An email to `SCHOOL_EMAIL` on every submission, with the key details.
- If an applicant filled in the optional email field, they get an automatic
  confirmation email too.
- A basic spam trap (a hidden field bots tend to fill in but people never
  see) — anything caught this way is silently dropped, so junk shouldn't
  clutter your sheet. If you ever do see obvious spam rows, let me know and
  I can tighten the filtering further.

**Whenever you change `Code.gs` later**, you must create a **new deployment**
(Deploy → Manage deployments → Edit the pencil icon → New version → Deploy)
for changes to take effect — editing the script alone doesn't update the
live URL.

**A privacy note, since these forms collect children's personal
information:** keep the sheet private (don't turn on link-sharing), share
edit access only with staff who need it, and periodically archive/clear old
applications once a given year's admissions are settled.

---

## Part B — Put the website online (GitHub Pages, free)

1. Create a free account at [github.com](https://github.com) if you don't
   have one.
2. Click **New repository**. Name it anything, e.g. `pmshri-betasur-website`.
   Keep it **Public** (required for free GitHub Pages). Don't add a README.
3. On the new repo's page, click **uploading an existing file**, then drag in
   *all* the files and folders from this package **except** the
   `google-apps-script` folder (that one stays on your computer — it's only
   for pasting into Apps Script, not part of the live site).
   - Make sure `.nojekyll` gets uploaded too — it may be hidden in your file
     browser; if your OS hides dot-files, use "Upload files" and select-all
     including hidden files, or use GitHub Desktop instead.
4. Commit the upload.
5. Go to **Settings → Pages** in the repo. Under "Build and deployment",
   set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
   Save.
6. After a minute or two, the same page shows your live URL — something like
   `https://yourusername.github.io/pmshri-betasur-website/`.

**If you already own a domain name**, add it under Settings → Pages →
Custom domain, then create a CNAME record at your domain registrar pointing
to `yourusername.github.io`. Not required to go live — this is optional, and
mostly worth it for a more professional/trustworthy address for a government
school site.

**Before or after going live**, do a find-and-replace of
`REPLACE-WITH-YOUR-DOMAIN` across the `.html` files, `sitemap.xml`, and
`robots.txt` with your real GitHub Pages URL (or custom domain) — this fixes
the social-media preview links and search-engine sitemap.

---

## Part C — Make Notices editable without touching code

Right now Notices shows the same three lines everywhere until you edit the
HTML. This makes it a live feed instead: whoever runs the office types a
new line into a Google Sheet, and it appears on the site — no code, no
redeploy.

1. In the *same* "Website submissions" sheet from Part A (or a new one —
   your choice), add a new tab named **Notices**.
2. Give it 4 columns, in this order, with a header row:
   `Date | Text (English) | Text (Kannada) | Show`
   Example rows:
   | Date | Text (English) | Text (Kannada) | Show |
   |---|---|---|---|
   | 2026-06-01 | Admissions open for academic year 2026-27 | 2026-27ನೇ ಶೈಕ್ಷಣಿಕ ವರ್ಷಕ್ಕೆ ಪ್ರವೇಶ ಪ್ರಾರಂಭ | yes |
   The `Show` column is optional — type `no` in any row to hide it without
   deleting it.
3. **File → Share → Publish to web.** In the dropdown, select the
   **Notices** sheet specifically (not "Entire document"), set format to
   **Comma-separated values (.csv)**, click **Publish**, confirm. Copy the
   URL it gives you.
4. Open `script.js`, find this line:
   ```js
   const NOTICES_CSV_URL = 'PASTE_YOUR_PUBLISHED_NOTICES_CSV_URL_HERE';
   ```
   Paste your published CSV URL in, keeping the quotes.
5. Re-upload `script.js` to GitHub (Part B, step 3) to update the live site.

From now on, editing that Notices tab and waiting a minute (Google's publish
cache) updates the Notices page and the "Latest notices" box on every other
page automatically. If the URL isn't set yet, or the fetch fails for any
reason, the site quietly falls back to the notices already written in the
HTML — nothing breaks.

---

## Part C.5 — Set up the Staff Portal (Principal + Teacher login)

This gives the Principal and Teachers a `staff-portal.html` page — like the
VTU results-style login most staff already know — where each person signs
in with their own username and password (no Google account needed) and
sees admission applications and contact messages in a table on the website
itself, no spreadsheet needed.

Two roles, enforced by the script itself (not just hidden in the page):
- **Principal** — sees everything, can change an application's Status, and
  can delete applications or messages.
- **Teacher** — sees applications and messages in full, but cannot change
  Status and cannot delete anything; those controls don't even appear for
  a Teacher account, and the script would refuse the action even if
  someone tried to force it from the browser.

You need Part A done first (same Apps Script project/Sheet).

1. **Point the portal at your Apps Script URL.** In `staff-portal.js`, set
   `STAFF_FORM_ENDPOINT` to the same `/exec` URL you used for
   `FORM_ENDPOINT` in `script.js` (Part A, step 8).
2. **Redeploy the script.** Back in the Apps Script editor (Extensions →
   Apps Script from the Sheet): **Deploy → Manage deployments → pencil icon
   → New version → Deploy.** This is required any time `Code.gs` changes,
   including pasting in this update.
3. **Re-upload** `staff-portal.html`, `staff-portal.js`, and any other
   changed files to GitHub (Part B, step 3).
4. **Create logins for the Principal and each Teacher.** Open the Google
   Sheet itself (not the Apps Script editor) and **reload the page** so the
   new menu appears. You'll see a **"Staff Portal Admin"** menu next to
   File/Edit/View:
   - Click **Staff Portal Admin → Add / update a staff login**.
   - It'll ask, one prompt at a time: a **username** (e.g. `principal`,
     `teacher1` — whatever's easy to remember, no spaces), a **full name**
     to display in the portal, a **role** (type exactly `Principal` or
     `Teacher`), and a **password** (at least 6 characters).
   - Repeat once per staff member. Running it again with the same username
     updates that person's password/role/name instead of creating a
     duplicate.
   - Tell each person their username and password directly (phone call, in
     person, etc.) — there's no "forgot password" email flow, so if
     someone forgets, just run **Add / update a staff login** again for
     them with a new password.
   - To remove someone (e.g. a teacher who's left), use **Staff Portal
     Admin → Remove a staff login**.
   - The first time you use this menu, it quietly creates two extra sheet
     tabs — **StaffAccounts** and **Sessions** — and hides them, since one
     holds password hashes and the other holds temporary sign-in tokens.
     You don't need to open or edit either one; manage everything through
     the menu.
5. Test: open `staff-portal.html` on the live site, sign in as the
   Principal — you should see both tables with working Status dropdowns
   and Delete buttons. Sign out, sign in as a Teacher account — the Status
   column should show as plain text and there should be no Delete button.

**How the security works, in plain terms:** passwords are never stored as
plain text — only a scrambled (hashed) version that can't be reversed back
into the original password, so even opening the hidden sheet wouldn't
reveal anyone's password. Every sign-in gets a temporary token that expires
after 12 hours. And critically, the Teacher/Principal permission check
happens inside the script running on Google's servers, not in the page's
own JavaScript — so a Teacher can't grant themselves Principal powers by
tinkering with the page in their browser.

---

## Part D — The "installable app" (works today, free)

Once the site is live (Part B), open it on an Android phone in Chrome:
tap the **⋮** menu → **Add to Home screen** / **Install app**. On iPhone,
open it in Safari → Share icon → **Add to Home Screen**. It now behaves like
an app: its own icon, opens full-screen without browser address bars, and
still opens (from cache) with no signal.

Before packaging for the Play Store (Part E), it's worth running a
**Lighthouse PWA audit**: open the live site in Chrome, DevTools (F12) →
Lighthouse tab → check "Progressive Web App" → Analyze. Google's packaging
tool wants a score of 80+; Lighthouse tells you exactly what (if anything)
to fix first.

This already satisfies "app on the phone" for almost everyone. Part E below
is only needed if you specifically want a Play Store listing.

---

## Part E — A real Google Play Store app

This wraps the *same* live website into an Android app package using
**PWABuilder**, Google's own supported tool for this (technology: Trusted Web
Activity). Realistic expectations first:

- **Cost:** a one-time $25 Google Play Console registration fee.
- **Time:** Google requires new personal developer accounts to run a
  **closed test with 12 real testers, each using the app for 14 days
  straight**, before it can go public. Budget 3–4 weeks total, not a
  same-day process. (Colleagues, family, or students' parents can be your
  12 testers — they just install a test link and open the app a few times.)
- **Identity verification:** Google will ask for a government ID matching
  your Play Console name.

Steps, once the site is live:

1. Go to [pwabuilder.com](https://www.pwabuilder.com), enter your live site
   URL, and let it scan the site (it reads your `manifest.json`).
2. Click **Package for stores → Android**. Download the generated package
   (it produces both a `.apk` for testing on your own phone and a `.aab` for
   the Play Store).
3. Create a [Google Play Console](https://play.google.com/console) account
   (personal account is fine for a school site), pay the $25 fee, complete
   identity verification.
4. Create a new app, fill in the store listing (title, short/full
   description, screenshots — take a few phone screenshots of the site once
   it's live), upload the `.aab` file.
5. Set up the closed test (12 testers, 14 days) as Google's console walks
   you through, then request production release once it's complete.

If this feels like more than you need right now, Part D's installable web app
covers the same "tap an icon, opens like an app" experience for families,
today, for free — Play Store is worth doing later once the site content is
fully finished.

---

## Ongoing maintenance worth doing

- **Back up the sheet regularly.** File → Download → Comma Separated
  Values, once a month or so, especially during admission season. Sheets
  are reliable, but for admissions records a local backup is cheap
  insurance.
- **Review the "Not proceeding" / "Enrolled" applications occasionally**
  and consider deleting the oldest, fully-settled rows once a year's
  admissions are done, since the sheet holds children's personal data.
- **Custom domain** — worth getting a cheap `.in` domain once the site
  content is finished, mainly for a more official-looking address on
  circulars/notices than the long GitHub Pages URL.

## What else is still a placeholder

Separate from today's work — whenever you're ready, these still need real
content: student/staff counts and eligibility details on the homepage and
admissions page (search each `.html` file for `[FILL`), and real photos on
`gallery.html` (currently empty placeholder boxes since only one building
photo exists in `images/`). Happy to help fill these in.
