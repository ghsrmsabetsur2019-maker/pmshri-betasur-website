/* School assistant: a free FAQ chatbot for PM Shri Karnataka Public School Betasur.
   - Works offline in the browser; nothing the visitor types is sent or stored anywhere.
   - Every answer comes from the TOPICS list below. To change an answer, edit it here.
   - Answers follow the site language (Kannada / English). */
(function () {
  'use strict';

  var WHATSAPP = 'https://wa.me/919480597247';

  var UI = {
    en: {
      title: 'Ask the school', sub: 'Quick answers to common questions', ph: 'Type your question\u2026', send: 'Send',
      open: 'Ask a question', close: 'Close',
      hello: 'Hello! I can answer common questions about admissions, documents, fees, timings and more. Tap a topic below or type your question.',
      fallback: "Sorry, I'm not sure about that. Please message the school office on WhatsApp, or see the Contact page.",
      thanks: "You're welcome! Is there anything else you'd like to know?",
      note: 'Automated answers. Please confirm important details with the school office.',
      wa: 'Message on WhatsApp'
    },
    kn: {
      title: 'ಶಾಲೆಯನ್ನು ಕೇಳಿ', sub: 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳಿಗೆ ತ್ವರಿತ ಉತ್ತರ',
      ph: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ\u2026', send: 'ಕಳುಹಿಸಿ',
      open: 'ಪ್ರಶ್ನೆ ಕೇಳಿ', close: 'ಮುಚ್ಚಿ',
      hello: 'ನಮಸ್ಕಾರ! ಪ್ರವೇಶ, ದಾಖಲೆಗಳು, ಶುಲ್ಕ, ಸಮಯ ಮುಂತಾದ ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳಿಗೆ ನಾನು ಉತ್ತರಿಸಬಲ್ಲೆ. ಕೆಳಗಿನ ವಿಷಯ ಆರಿಸಿ ಅಥವಾ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ.',
      fallback: 'ಕ್ಷಮಿಸಿ, ಈ ಬಗ್ಗೆ ನನಗೆ ಖಚಿತವಿಲ್ಲ. ದಯವಿಟ್ಟು ಶಾಲಾ ಕಚೇರಿಗೆ ವಾಟ್ಸ್\u200Cಆ್ಯಪ್ ಮಾಡಿ ಅಥವಾ ಸಂಪರ್ಕ ಪುಟ ನೋಡಿ.',
      thanks: 'ಸ್ವಾಗತ! ಇನ್ನೇನಾದರೂ ಕೇಳಬೇಕೇ?',
      note: 'ಇವು ಸ್ವಯಂಚಾಲಿತ ಉತ್ತರಗಳು. ಮುಖ್ಯ ವಿವರಗಳನ್ನು ಶಾಲಾ ಕಚೇರಿಯಲ್ಲಿ ದೃಢೀಕರಿಸಿಕೊಳ್ಳಿ.',
      wa: 'ವಾಟ್ಸ್\u200Cಆ್ಯಪ್ನಲ್ಲಿ ಸಂದೇಶ ಕಳುಹಿಸಿ'
    }
  };

  // Order matters: if two topics match equally, the earlier one wins. Keep specific topics above general ones.
  var TOPICS = [
    { id: 'status', chip: { en: 'Application status', kn: 'ಅರ್ಜಿ ಸ್ಥಿತಿ' },
      kw: ['status', 'track', 'approved', 'accepted', 'ಸ್ಥಿತಿ'],
      a: { en: 'You can check your application status on the Application Status page, using the phone number you gave on the form.',
           kn: 'ಫಾರ್ಮ್\u200Cನಲ್ಲಿ ನೀಡಿದ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ಬಳಸಿ ಅರ್ಜಿ ಸ್ಥಿತಿ ಪುಟದಲ್ಲಿ ನಿಮ್ಮ ಅರ್ಜಿಯ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಬಹುದು.' },
      link: { href: 'application-status.html', en: 'Open Application Status', kn: 'ಅರ್ಜಿ ಸ್ಥಿತಿ ತೆರೆಯಿರಿ' } },

    { id: 'documents', chip: { en: 'Documents needed', kn: 'ಬೇಕಾದ ದಾಖಲೆಗಳು' },
      kw: ['document', 'documents', 'birth certificate', 'caste certificate', 'aadhaar', 'aadhar', 'papers', 'required', 'bring', 'ದಾಖಲೆ', 'ಜನನ ಪ್ರಮಾಣ', 'ಜಾತಿ ಪ್ರಮಾಣ', 'ಆಧಾರ್'],
      a: { en: "Birth certificate, the student's Aadhaar card, caste certificate (if applicable), address proof, passport-size photographs, and a transfer certificate (TC) from the previous school if applying beyond LKG.",
           kn: 'ಜನನ ಪ್ರಮಾಣಪತ್ರ, ವಿದ್ಯಾರ್ಥಿಯ ಆಧಾರ್ ಕಾರ್ಡ್, ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ (ಅನ್ವಯಿಸಿದರೆ), ವಿಳಾಸ ಪುರಾವೆ, ಪಾಸ್\u200Cಪೋರ್ಟ್ ಅಳತೆಯ ಭಾವಚಿತ್ರಗಳು, ಮತ್ತು LKG ಮೀರಿ ಅರ್ಜಿ ಸಲ್ಲಿಸುವಾಗ ಹಿಂದಿನ ಶಾಲೆಯಿಂದ ವರ್ಗಾವಣೆ ಪ್ರಮಾಣಪತ್ರ (TC).' },
      link: { href: 'admissions.html', en: 'Open Admissions page', kn: 'ಪ್ರವೇಶ ಪುಟ ತೆರೆಯಿರಿ' } },

    { id: 'schemes', chip: { en: 'Scholarships & free items', kn: 'ವಿದ್ಯಾರ್ಥಿವೇತನ' },
      kw: ['scholarship', 'scholarships', 'uniform', 'uniforms', 'textbook', 'textbooks', 'books', 'shoes', 'benefits', 'ವಿದ್ಯಾರ್ಥಿವೇತನ', 'ಸಮವಸ್ತ್ರ', 'ಪುಸ್ತಕ', 'ಶೂ'],
      a: { en: 'Free schemes and government scholarships are listed on the Admissions page. For current-year details, please confirm with the school office.',
           kn: 'ಉಚಿತ ಯೋಜನೆಗಳು ಮತ್ತು ಸರ್ಕಾರಿ ವಿದ್ಯಾರ್ಥಿವೇತನಗಳನ್ನು ಪ್ರವೇಶ ಪುಟದಲ್ಲಿ ಪಟ್ಟಿ ಮಾಡಲಾಗಿದೆ. ಪ್ರಸ್ತುತ ವರ್ಷದ ವಿವರಗಳಿಗೆ ಶಾಲಾ ಕಚೇರಿಯಲ್ಲಿ ದೃಢೀಕರಿಸಿಕೊಳ್ಳಿ.' },
      link: { href: 'admissions.html', en: 'Open Admissions page', kn: 'ಪ್ರವೇಶ ಪುಟ ತೆರೆಯಿರಿ' } },

    { id: 'fees', chip: { en: 'Fees', kn: 'ಶುಲ್ಕ' },
      kw: ['fee', 'fees', 'free', 'cost', 'charge', 'charges', 'payment', 'price', 'ಶುಲ್ಕ', 'ಉಚಿತ', 'ಫೀಸ್', 'ಹಣ'],
      a: { en: 'Admission is free. As a Government of Karnataka school, no admission fee is charged for LKG to 10th grade.',
           kn: 'ಪ್ರವೇಶ ಉಚಿತ. ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಶಾಲೆಯಾಗಿರುವುದರಿಂದ LKG ಯಿಂದ 10ನೇ ತರಗತಿಯವರೆಗೆ ಯಾವುದೇ ಪ್ರವೇಶ ಶುಲ್ಕ ವಿಧಿಸಲಾಗುವುದಿಲ್ಲ.' },
      link: { href: 'admissions.html', en: 'Open Admissions page', kn: 'ಪ್ರವೇಶ ಪುಟ ತೆರೆಯಿರಿ' } },

    { id: 'forms', chip: { en: 'TC & forms', kn: 'TC ಮತ್ತು ಅರ್ಜಿಗಳು' },
      kw: ['tc', 'transfer', 'bonafide', 'form', 'forms', 'download', 'pdf', 'ಡೌನ್ಲೋಡ್', 'ಬೋನಫೈಡ್', 'ವರ್ಗಾವಣೆ', 'ನಮೂನೆ'],
      a: { en: 'The Transfer Certificate request, Bonafide certificate request and the admission form can be downloaded from the Downloads page.',
           kn: 'ವರ್ಗಾವಣೆ ಪ್ರಮಾಣಪತ್ರ ವಿನಂತಿ, ಬೋನಫೈಡ್ ಪ್ರಮಾಣಪತ್ರ ವಿನಂತಿ ಮತ್ತು ಪ್ರವೇಶ ಅರ್ಜಿಯನ್ನು ಡೌನ್ಲೋಡ್ ಪುಟದಿಂದ ಡೌನ್ಲೋಡ್ ಮಾಡಬಹುದು.' },
      link: { href: 'downloads.html', en: 'Open Downloads page', kn: 'ಡೌನ್ಲೋಡ್ ಪುಟ ತೆರೆಯಿರಿ' } },

    { id: 'timings', chip: { en: 'School timings', kn: 'ಶಾಲಾ ಸಮಯ' },
      kw: ['time', 'timing', 'timings', 'hours', 'schedule', 'ಸಮಯ', 'ಗಂಟೆ'],
      a: { en: 'Monday to Friday: 10:15 AM \u2013 4:30 PM. Saturday: 8:00 AM \u2013 12:00 PM (shorter day).',
           kn: 'ಸೋಮವಾರದಿಂದ ಶುಕ್ರವಾರ: ಬೆಳಿಗ್ಗೆ 10:15 \u2013 ಸಂಜೆ 4:30. ಶನಿವಾರ: ಬೆಳಿಗ್ಗೆ 8:00 \u2013 ಮಧ್ಯಾಹ್ನ 12:00.' },
      link: { href: 'academics.html', en: 'Open Academics page', kn: 'ಶೈಕ್ಷಣಿಕ ಪುಟ ತೆರೆಯಿರಿ' } },

    { id: 'meals', chip: { en: 'Mid-day meal & milk', kn: 'ಬಿಸಿಯೂಟ ಮತ್ತು ಹಾಲು' },
      kw: ['meal', 'meals', 'lunch', 'food', 'milk', 'midday', 'mid-day', 'ಊಟ', 'ಬಿಸಿಯೂಟ', 'ಹಾಲು'],
      a: { en: 'A free Mid-Day Meal (PM POSHAN) is provided to all students, and children also get 150 ml of hot milk under the Ksheera Bhagya scheme, five days a week.',
           kn: 'ಪಿಎಂ ಪೋಷಣ್ ಯೋಜನೆಯಡಿ ಎಲ್ಲಾ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಉಚಿತ ಬಿಸಿಯೂಟ ನೀಡಲಾಗುತ್ತದೆ, ಮತ್ತು ಕ್ಷೀರಭಾಗ್ಯ ಯೋಜನೆಯಡಿ ವಾರದಲ್ಲಿ ಐದು ದಿನ 150 ಮಿ.ಲೀ. ಬಿಸಿ ಹಾಲು ಸಿಗುತ್ತದೆ.' },
      link: { href: 'facilities.html', en: 'Open Facilities page', kn: 'ಸೌಲಭ್ಯಗಳ ಪುಟ ತೆರೆಯಿರಿ' } },

    { id: 'hostel', chip: { en: 'Girls hostel', kn: 'ಹುಡುಗಿಯರ ಹಾಸ್ಟೆಲ್' },
      kw: ['hostel', 'residential', 'kgbv', 'boarding', 'ಹಾಸ್ಟೆಲ್', 'ವಸತಿ'],
      a: { en: 'A residential hostel facility for girl students (KGBV Type-4) is available. See the Facilities page for details.',
           kn: 'ವಿದ್ಯಾರ್ಥಿನಿಯರಿಗಾಗಿ ವಸತಿ ಹಾಸ್ಟೆಲ್ (KGBV ಟೈಪ್-4) ಸೌಲಭ್ಯ ಇದೆ. ವಿವರಗಳಿಗೆ ಸೌಲಭ್ಯಗಳ ಪುಟ ನೋಡಿ.' },
      link: { href: 'facilities.html', en: 'Open Facilities page', kn: 'ಸೌಲಭ್ಯಗಳ ಪುಟ ತೆರೆಯಿರಿ' } },

    { id: 'classes', chip: { en: 'Classes & medium', kn: 'ತರಗತಿ ಮತ್ತು ಮಾಧ್ಯಮ' },
      kw: ['class', 'classes', 'grade', 'grades', 'medium', 'kannada medium', 'syllabus', 'standard', 'primary', 'secondary', 'high school', 'ತರಗತಿ', 'ಮಾಧ್ಯಮ', 'ಪಠ್ಯಕ್ರಮ'],
      a: { en: 'The school teaches LKG to 10th in Kannada medium. The primary section (LKG\u20138th) and the secondary section (9th\u201310th) are on one campus.',
           kn: 'ಶಾಲೆಯಲ್ಲಿ LKG ಯಿಂದ 10ನೇ ತರಗತಿಯವರೆಗೆ ಕನ್ನಡ ಮಾಧ್ಯಮದಲ್ಲಿ ಕಲಿಸಲಾಗುತ್ತದೆ. ಪ್ರಾಥಮಿಕ ವಿಭಾಗ (LKG\u20138) ಮತ್ತು ಪ್ರೌಢ ವಿಭಾಗ (9\u201310) ಒಂದೇ ಆವರಣದಲ್ಲಿವೆ.' },
      link: { href: 'academics.html', en: 'Open Academics page', kn: 'ಶೈಕ್ಷಣಿಕ ಪುಟ ತೆರೆಯಿರಿ' } },

    { id: 'facilities', chip: { en: 'Facilities', kn: 'ಸೌಲಭ್ಯಗಳು' },
      kw: ['facility', 'facilities', 'lab', 'labs', 'library', 'playground', 'toilet', 'computer', 'smart class', 'ಸೌಲಭ್ಯ', 'ಗ್ರಂಥಾಲಯ', 'ಪ್ರಯೋಗಾಲಯ'],
      a: { en: 'The Facilities page lists what is available on campus.',
           kn: 'ಆವರಣದಲ್ಲಿ ಲಭ್ಯವಿರುವ ಸೌಲಭ್ಯಗಳನ್ನು ಸೌಲಭ್ಯಗಳ ಪುಟದಲ್ಲಿ ಪಟ್ಟಿ ಮಾಡಲಾಗಿದೆ.' },
      link: { href: 'facilities.html', en: 'Open Facilities page', kn: 'ಸೌಲಭ್ಯಗಳ ಪುಟ ತೆರೆಯಿರಿ' } },

    { id: 'contact', chip: { en: 'Contact & address', kn: 'ಸಂಪರ್ಕ ಮತ್ತು ವಿಳಾಸ' },
      kw: ['contact', 'phone', 'call', 'number', 'whatsapp', 'address', 'location', 'where', 'map', 'reach', 'email', 'ಸಂಪರ್ಕ', 'ಫೋನ್', 'ವಿಳಾಸ', 'ಎಲ್ಲಿ', 'ನಂಬರ್'],
      a: { en: 'WhatsApp: +91 94805 97247. The school is in Betasur, Savadatti Taluk, Belagavi District. The Contact page has the map and a message form.',
           kn: 'ವಾಟ್ಸ್\u200Cಆ್ಯಪ್: +91 94805 97247. ಶಾಲೆ ಬೆಳಗಾವಿ ಜಿಲ್ಲೆ, ಸವದತ್ತಿ ತಾಲ್ಲೂಕಿನ ಬೆಟಸೂರದಲ್ಲಿದೆ. ಸಂಪರ್ಕ ಪುಟದಲ್ಲಿ ನಕ್ಷೆ ಮತ್ತು ಸಂದೇಶ ಫಾರ್ಮ್ ಇದೆ.' },
      link: { href: 'contact.html', en: 'Open Contact page', kn: 'ಸಂಪರ್ಕ ಪುಟ ತೆರೆಯಿರಿ' }, whatsapp: true },

    { id: 'notices', chip: { en: 'Notices & results', kn: 'ಸೂಚನೆಗಳು ಮತ್ತು ಫಲಿತಾಂಶ' },
      kw: ['notice', 'notices', 'news', 'announcement', 'circular', 'result', 'results', 'exam', 'exams', 'calendar', 'holiday', 'holidays', 'ಸೂಚನೆ', 'ಫಲಿತಾಂಶ', 'ರಜೆ', 'ಪರೀಕ್ಷೆ'],
      a: { en: 'Latest announcements are on the Notices page. For exam results, see the Academics page or ask the school office.',
           kn: 'ಇತ್ತೀಚಿನ ಪ್ರಕಟಣೆಗಳು ಸೂಚನೆಗಳ ಪುಟದಲ್ಲಿವೆ. ಪರೀಕ್ಷಾ ಫಲಿತಾಂಶಗಳಿಗೆ ಶೈಕ್ಷಣಿಕ ಪುಟ ನೋಡಿ ಅಥವಾ ಶಾಲಾ ಕಚೇರಿಯನ್ನು ಕೇಳಿ.' },
      link: { href: 'notices.html', en: 'Open Notices page', kn: 'ಸೂಚನೆಗಳ ಪುಟ ತೆರೆಯಿರಿ' } },

    { id: 'about', chip: { en: 'About the school', kn: 'ಶಾಲೆಯ ಬಗ್ಗೆ' },
      kw: ['history', 'founded', 'established', 'pm shri', 'ಇತಿಹಾಸ', 'ಸ್ಥಾಪನೆ'],
      a: { en: 'The primary school dates back to 1871 and the high school section began in 2019-20. It is a PM Shri school of the Government of Karnataka.',
           kn: 'ಪ್ರಾಥಮಿಕ ಶಾಲೆ 1871ರಷ್ಟು ಹಳೆಯದು, ಪ್ರೌಢಶಾಲಾ ವಿಭಾಗ 2019-20ರಲ್ಲಿ ಆರಂಭವಾಯಿತು. ಇದು ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಪಿ.ಎಂ.ಶ್ರೀ ಶಾಲೆ.' },
      link: { href: 'about.html', en: 'Open About page', kn: 'ನಮ್ಮ ಬಗ್ಗೆ ಪುಟ ತೆರೆಯಿರಿ' } },

    // General "how do I apply" goes last so more specific admission questions (documents, fees, status) win first.
    { id: 'admission', chip: { en: 'How to apply', kn: 'ಹೇಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬೇಕು' },
      kw: ['admission', 'admissions', 'admit', 'apply', 'application', 'enroll', 'enrol', 'join', 'seat', 'seats', 'new student', 'eligibility', 'eligible', 'age', 'ಪ್ರವೇಶ', 'ಅರ್ಜಿ', 'ದಾಖಲಾತಿ', 'ಸೇರಿಸ', 'ವಯಸ್ಸ'],
      a: { en: 'To apply, fill in the online admission form on the Admissions page. The school office will contact you to complete admission with the original documents. Age rules change most years, so please confirm them with the school office.',
           kn: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಪ್ರವೇಶ ಪುಟದಲ್ಲಿರುವ ಆನ್\u200Cಲೈನ್ ಅರ್ಜಿಯನ್ನು ತುಂಬಿ. ಮೂಲ ದಾಖಲೆಗಳೊಂದಿಗೆ ಪ್ರವೇಶ ಪೂರ್ಣಗೊಳಿಸಲು ಶಾಲಾ ಕಚೇರಿ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ. ವಯಸ್ಸಿನ ನಿಯಮಗಳು ಬಹುತೇಕ ವರ್ಷಗಳಲ್ಲಿ ಬದಲಾಗುತ್ತವೆ, ಆದ್ದರಿಂದ ಶಾಲಾ ಕಚೇರಿಯಲ್ಲಿ ದೃಢೀಕರಿಸಿಕೊಳ್ಳಿ.' },
      link: { href: 'admissions.html', en: 'Open Admissions page', kn: 'ಪ್ರವೇಶ ಪುಟ ತೆರೆಯಿರಿ' } }
  ];

  var GREET = ['hi', 'hello', 'hey', 'namaste', 'namaskara', 'ನಮಸ್ಕಾರ'];
  var THANKS = ['thanks', 'thank', 'thankyou', 'ಧನ್ಯವಾದ'];

  function norm(s) {
    return String(s || '').toLowerCase().replace(/[\u200C\u200D]/g, '').replace(/[^ಀ-೿a-z0-9\s\-]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function esc(s) { return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); }
  // English keywords match whole words (plural 's'/'es' allowed); Kannada keywords match as substrings.
  function hit(q, kw) {
    if (/^[a-z0-9\- ]+$/.test(kw)) return new RegExp('(^|\\s)' + esc(kw) + '(s|es)?(\\s|$)').test(q);
    return q.indexOf(kw) !== -1;
  }
  function findTopic(text) {
    var q = norm(text);
    if (!q) return null;
    var best = null, bestScore = 0;
    TOPICS.forEach(function (t) {
      var score = 0;
      t.kw.forEach(function (k) { if (hit(q, k)) score++; });
      if (score > bestScore) { best = t; bestScore = score; }
    });
    return best;
  }
  function isAny(text, list) { var q = norm(text); return list.some(function (k) { return hit(q, k); }); }

  // Lets you test the matching in a plain Node session (no effect in the browser).
  if (typeof window !== 'undefined') window.__schoolBotTest = { findTopic: findTopic, isAny: isAny, GREET: GREET, THANKS: THANKS, TOPICS: TOPICS };

  function lang() { return document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'kn'; }
  function h(tag, props, kids) {
    var e = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      if (k === 'class') e.className = props[k]; else if (k === 'text') e.textContent = props[k]; else e.setAttribute(k, props[k]);
    });
    (kids || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }

  function injectStyle() {
    var css = [
      '#sb-launch{position:fixed;right:22px;bottom:92px;z-index:950;width:54px;height:54px;border-radius:50%;border:none;cursor:pointer;background:var(--brick,#C4523C);color:#fff;font-size:24px;line-height:1;box-shadow:0 10px 26px rgba(9,46,39,.32);display:flex;align-items:center;justify-content:center}',
      '#sb-launch:hover{transform:scale(1.07)}',
      '#sb-panel{position:fixed;right:22px;bottom:92px;z-index:951;width:360px;max-width:calc(100vw - 24px);height:min(72vh,560px);display:none;flex-direction:column;background:var(--bg-panel,#fff);color:var(--ink,#20241F);border:1px solid var(--line,#DCD3B8);border-radius:18px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.28);font-family:inherit}',
      '#sb-panel.open{display:flex}',
      '.sb-head{background:var(--green,#17634F);color:#fff;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px}',
      '.sb-head strong{display:block;font-size:1rem}',
      '.sb-head small{display:block;opacity:.85;font-size:.76rem}',
      '.sb-x{background:none;border:none;color:#fff;font-size:26px;line-height:1;cursor:pointer;padding:0 4px}',
      '.sb-log{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px;background:var(--bg,#F7F2E6)}',
      '.sb-msg{max-width:88%;padding:9px 12px;border-radius:14px;font-size:.9rem;line-height:1.5;word-wrap:break-word}',
      '.sb-bot{align-self:flex-start;background:var(--bg-panel,#fff);border:1px solid var(--line,#DCD3B8);border-top-left-radius:4px}',
      '.sb-user{align-self:flex-end;background:var(--green,#17634F);color:#fff;border-top-right-radius:4px}',
      '.sb-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}',
      '.sb-link{display:inline-block;padding:6px 11px;border-radius:999px;font-size:.8rem;font-weight:600;text-decoration:none;background:var(--green,#17634F);color:#fff}',
      '.sb-link.wa{background:#25D366;color:#073b1d}',
      '.sb-chips{display:flex;gap:6px;overflow-x:auto;padding:8px 10px;border-top:1px solid var(--line,#DCD3B8);background:var(--bg-panel,#fff);flex-shrink:0}',
      '.sb-chip{flex-shrink:0;white-space:nowrap;border:1px solid var(--green,#17634F);background:none;color:var(--green,#17634F);border-radius:999px;padding:6px 12px;font-size:.8rem;font-weight:600;cursor:pointer;font-family:inherit}',
      '.sb-chip:hover{background:var(--green,#17634F);color:#fff}',
      '.sb-form{display:flex;gap:6px;padding:8px 10px;border-top:1px solid var(--line,#DCD3B8);background:var(--bg-panel,#fff);flex-shrink:0}',
      '.sb-form input{flex:1;min-width:0;padding:9px 12px;border-radius:999px;border:1px solid var(--line,#DCD3B8);background:var(--bg,#F7F2E6);color:var(--ink,#20241F);font-family:inherit;font-size:.9rem}',
      '.sb-form button{border:none;border-radius:999px;padding:0 16px;background:var(--green,#17634F);color:#fff;font-weight:600;cursor:pointer;font-family:inherit}',
      '.sb-note{font-size:.7rem;color:var(--ink-soft,#5B625A);text-align:center;padding:0 10px 8px;background:var(--bg-panel,#fff);flex-shrink:0}',
      '@media (max-width:520px){#sb-panel{right:8px;left:8px;bottom:8px;width:auto;max-width:none;height:min(82vh,600px)}#sb-launch.hide{display:none}}',
      '@media print{#sb-launch,#sb-panel{display:none!important}}'
    ].join('\n');
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  function init() {
    injectStyle();
    var launch = h('button', { id: 'sb-launch', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'sb-panel' });
    launch.textContent = '\uD83D\uDCAC';
    var title = h('strong'), sub = h('small');
    var closeBtn = h('button', { class: 'sb-x', type: 'button' });
    closeBtn.textContent = '\u00D7';
    var head = h('div', { class: 'sb-head' }, [h('div', {}, [title, sub]), closeBtn]);
    var log = h('div', { class: 'sb-log', 'aria-live': 'polite' });
    var chips = h('div', { class: 'sb-chips' });
    var input = h('input', { type: 'text', autocomplete: 'off', maxlength: '200' });
    var send = h('button', { type: 'submit' });
    var form = h('form', { class: 'sb-form' }, [input, send]);
    var note = h('div', { class: 'sb-note' });
    var panel = h('div', { id: 'sb-panel', role: 'dialog' }, [head, log, chips, form, note]);
    document.body.appendChild(launch);
    document.body.appendChild(panel);

    var greeted = false;

    function addMsg(who, text, extras) {
      var m = h('div', { class: 'sb-msg ' + (who === 'user' ? 'sb-user' : 'sb-bot') });
      m.textContent = text;
      if (extras && extras.length) {
        var box = h('div', { class: 'sb-actions' });
        extras.forEach(function (x) { box.appendChild(x); });
        m.appendChild(box);
      }
      log.appendChild(m);
      log.scrollTop = log.scrollHeight;
    }
    function linkEl(href, label, cls, external) {
      var a = h('a', { class: 'sb-link' + (cls ? ' ' + cls : ''), href: href });
      a.textContent = label;
      if (external) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); }
      return a;
    }
    function reply(topic) {
      var L = lang(), ui = UI[L], extras = [];
      if (topic.link) extras.push(linkEl(topic.link.href, topic.link[L], '', false));
      if (topic.whatsapp) extras.push(linkEl(WHATSAPP, ui.wa, 'wa', true));
      setTimeout(function () { addMsg('bot', topic.a[L], extras); }, 220);
    }
    function ask(text) {
      text = (text || '').trim();
      if (!text) return;
      addMsg('user', text);
      var L = lang(), ui = UI[L];
      var topic = findTopic(text);
      if (topic) { reply(topic); return; }
      if (isAny(text, THANKS)) { setTimeout(function () { addMsg('bot', ui.thanks); }, 220); return; }
      if (isAny(text, GREET)) { setTimeout(function () { addMsg('bot', ui.hello); }, 220); return; }
      setTimeout(function () { addMsg('bot', ui.fallback, [linkEl(WHATSAPP, ui.wa, 'wa', true), linkEl('contact.html', L === 'en' ? 'Contact page' : 'ಸಂಪರ್ಕ ಪುಟ', '', false)]); }, 220);
    }

    function renderLabels() {
      var L = lang(), ui = UI[L];
      title.textContent = ui.title; sub.textContent = ui.sub;
      input.setAttribute('placeholder', ui.ph); input.setAttribute('aria-label', ui.ph);
      send.textContent = ui.send; note.textContent = ui.note;
      launch.setAttribute('aria-label', ui.open); closeBtn.setAttribute('aria-label', ui.close);
      panel.setAttribute('aria-label', ui.title);
      chips.innerHTML = '';
      TOPICS.forEach(function (t) {
        var c = h('button', { class: 'sb-chip', type: 'button' });
        c.textContent = t.chip[L];
        c.addEventListener('click', function () { addMsg('user', t.chip[L]); reply(t); });
        chips.appendChild(c);
      });
    }

    function openPanel() {
      panel.classList.add('open'); launch.classList.add('hide'); launch.setAttribute('aria-expanded', 'true');
      if (!greeted) { greeted = true; addMsg('bot', UI[lang()].hello); }
      setTimeout(function () { input.focus(); }, 50);
    }
    function closePanel() {
      panel.classList.remove('open'); launch.classList.remove('hide'); launch.setAttribute('aria-expanded', 'false'); launch.focus();
    }

    launch.addEventListener('click', openPanel);
    closeBtn.addEventListener('click', closePanel);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) closePanel(); });
    form.addEventListener('submit', function (e) { e.preventDefault(); var v = input.value; input.value = ''; ask(v); });
    new MutationObserver(renderLabels).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    renderLabels();
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  }
})();
