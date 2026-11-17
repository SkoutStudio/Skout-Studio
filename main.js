(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const body = document.body, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= Ισομετρική σκηνή γραφείου (SVG) ================= */
  const C = .866, S = .5;
  const P = (x, y, z) => [((x - y) * C).toFixed(1), ((x + y) * S - z).toFixed(1)];
  const pts = a => a.map(p => P(...p).join(',')).join(' ');
  const T = '#f6f3ec', L = '#cfc5b6', D = '#8c8275', INK = '#0b0a09', PAPER = '#e9e5d9';
  const poly = (a, fill, cls = 'o', extra = '') => `<polygon class="${cls}" points="${pts(a)}" fill="${fill}" ${extra}/>`;
  const box = (x, y, z, w, d, h, c = [T, L, D]) =>
    poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], c[1]) +
    poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], c[2]) +
    poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], c[0]);
  const front = (x1, x2, z1, z2, y, fill, cls = 'o') => poly([[x1, y, z1], [x2, y, z1], [x2, y, z2], [x1, y, z2]], fill, cls);
  const line = (a, w = 2, col = INK) => `<polyline points="${pts(a)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const drawers = (px, y) => [0, 1, 2, 3].map(i => {
    const z1 = 6 + i * 23.5, z2 = z1 + 19;
    return front(px + 5, px + 65, z1, z2, y, T) + front(px + 27, px + 43, z2 - 9, z2 - 5, y, L);
  }).join('');

  let s = '';
  // πάτωμα + σκιές
  const [fx, fy] = P(140, 90, 0);
  s += `<ellipse cx="${fx}" cy="${+fy + 175}" rx="640" ry="300" fill="${PAPER}"/>`;
  s += poly([[0, 124, 0], [266, 124, 0], [400, 60, 0], [400, -70, 0], [130, -70, 0], [0, 0, 0]], INK, '', 'opacity=".8"');
  s += poly([[95, 213, 0], [150, 213, 0], [250, 160, 0], [250, 120, 0], [150, 160, 0]], INK, '', 'opacity=".8"');
  // γραφείο
  s += box(70, 6, 45, 120, 4, 55, [T, D, D]);
  s += box(0, 6, 0, 70, 108, 100) + drawers(0, 114);
  s += box(190, 6, 0, 70, 108, 100) + drawers(190, 114);
  s += box(-6, 0, 100, 272, 124, 8);
  // φωτιστικό
  s += box(22, 16, 108, 22, 22, 3);
  s += line([[33, 27, 111], [28, 27, 168], [50, 36, 190]], 2.4);
  s += poly([[50, 36, 186], [18, 62, 108], [60, 100, 108], [104, 66, 108]], '#fff', '', 'opacity=".28"');
  s += poly([[42, 30, 196], [60, 30, 190], [62, 46, 180], [44, 46, 184]], T);
  // κορνίζα
  s += box(104, 30, 108, 34, 4, 30, [T, T, D]) + front(109, 133, 113, 133, 34, L);
  // χαρτί + στυλό + κινητό (όπως στο logo)
  s += poly([[14, 64, 108.4], [78, 64, 108.4], [78, 112, 108.4], [14, 112, 108.4]], '#fff');
  s += [72, 80, 88, 96, 104].map(y => line([[22, y, 108.5], [70, y, 108.5]], .8, D)).join('');
  s += line([[86, 74, 109], [86, 108, 109]], 2.2);
  s += poly([[96, 78, 109], [116, 78, 109], [116, 114, 109], [96, 114, 109]], INK, 'o', `stroke="${PAPER}"`);
  // υπολογιστής (κλικ)
  let pc = box(150, 18, 108, 78, 70, 18);
  pc += front(158, 188, 112, 121, 88, T) + front(194, 220, 112, 121, 88, T) + front(200, 214, 115, 117, 88, D);
  pc += box(152, 26, 126, 74, 56, 72);
  pc += front(159, 219, 134, 191, 82, '#0b0a09', 'o scr" id="scr');
  const [sx, sy] = P(159, 82, 191);
  pc += `<g transform="matrix(${C},${S},0,1,${sx},${sy})" pointer-events="none">
      <image href="logo-screen.webp" x="1" y="1" width="58" height="55" preserveAspectRatio="xMidYMid meet"/>
      <rect class="glow" x="-3" y="-3" width="66" height="63" fill="none" stroke="#dac1a7" stroke-width="2.5"/></g>`;
  s += `<g id="pc" tabindex="0" role="button" aria-label="Άνοιξε τον υπολογιστή">${pc}</g>`;
  // φυτό
  s += box(240, 20, 108, 22, 22, 20);
  s += line([[251, 31, 128], [250, 31, 176]], 1.6);
  [[150, -1], [158, 1], [166, -1], [174, 1]].forEach(([z, k]) => {
    const [ax, ay] = P(251, 31, z);
    s += `<ellipse class="o" cx="${+ax + k * 9}" cy="${+ay - 5}" rx="9" ry="4.5" fill="${k > 0 ? T : L}" transform="rotate(${k * -28} ${+ax + k * 9} ${+ay - 5})"/>`;
  });
  // πληκτρολόγιο + κούπα + ποντίκι
  s += box(118, 94, 108, 76, 24, 4);
  s += [99, 105, 111].map(y => line([[122, y, 112.2], [190, y, 112.2]], .8, D)).join('');
  s += box(204, 100, 108, 10, 14, 4);
  s += box(224, 92, 108, 15, 15, 18) + poly([[226, 94, 126.2], [237, 94, 126.2], [237, 105, 126.2], [226, 105, 126.2]], INK);
  // καρέκλα
  [[95, 162], [147, 162], [95, 210], [147, 210]].forEach(([x, y]) => s += box(x, y, 0, 3, 3, 50, [T, L, D]));
  s += box(93, 160, 50, 59, 55, 7);
  s += box(95, 210, 57, 3, 3, 56) + box(147, 210, 57, 3, 3, 56);
  s += box(93, 208, 74, 59, 6, 42, [T, L, D]);
  const scene = $('#scene');
  scene.innerHTML = s;
  const fit = () => {
    // το viewBox ακολουθεί τις αναλογίες του παραθύρου, ώστε το πάτωμα να μην κόβεται
    const W = innerWidth, H = innerHeight, portrait = W / H < .9;
    const bw = portrait ? 470 : 800, bh = portrait ? 600 : 500, k = Math.min(W / bw, H / bh);
    const w = W / k, h = H / k, cx = 25, cy = portrait ? 65 : 65;
    scene.setAttribute('viewBox', `${(cx - w / 2).toFixed(1)} ${(cy - h / 2).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);
  };
  fit(); addEventListener('resize', fit);

  /* ================= Είσοδος με scroll (progress) / έξοδος ================= */
  const os = $('#os'), desk = $('#desk'), room = $('#room');
  const ui = $$('.room__head, .room__hint, .room__foot');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  let inOS = false, cur = 0, target = 0, pending = '', shown = -1;
  const setOrigin = () => {
    if (cur > .001) return;
    desk.style.transform = '';
    const r = $('#scr').getBoundingClientRect();
    desk.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
  };
  setOrigin(); addEventListener('resize', setOrigin);
  const showOS = () => {
    inOS = true; os.hidden = false; os.classList.remove('is-off'); body.classList.add('is-os');
    const w = pending; pending = '';
    if (w) setTimeout(() => open(w), reduce ? 0 : 420);
  };
  const frame = () => {
    requestAnimationFrame(frame);
    if (inOS) return;
    cur += (target - cur) * (reduce ? 1 : .1);
    if (Math.abs(target - cur) < .0008) cur = target;
    if (cur === shown) return;
    shown = cur;
    desk.style.transform = cur ? `scale(${Math.pow(20, cur).toFixed(4)})` : '';
    const o = clamp(1 - cur * 5);
    ui.forEach(e => { e.style.opacity = o; e.style.pointerEvents = o < .5 ? 'none' : ''; });
    room.style.opacity = cur > .82 ? clamp(1 - (cur - .82) / .18) : 1;
    if (cur >= 1) showOS();
  };
  requestAnimationFrame(frame);
  const enter = (win = '') => {
    if (inOS) return open(win);
    pending = win; target = 1;
  };
  const leave = () => {
    if (!inOS) return;
    os.classList.add('is-off');
    setTimeout(() => { os.hidden = true; body.classList.remove('is-os'); cur = 1; target = 0; shown = -1; inOS = false; }, reduce ? 0 : 340);
  };
  const pcEl = $('#pc');
  pcEl.addEventListener('click', () => enter());
  pcEl.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), enter()));
  $$('[data-enter]').forEach(b => b.addEventListener('click', () => enter(b.dataset.enter)));
  room.addEventListener('wheel', e => { if (!inOS) { pending = ''; target = clamp(target + e.deltaY / 1600); } }, { passive: true });
  let ty = null;
  room.addEventListener('touchstart', e => ty = e.touches[0].clientY, { passive: true });
  room.addEventListener('touchmove', e => {
    if (inOS || ty === null) return;
    const y = e.touches[0].clientY; target = clamp(target + (ty - y) / 480); ty = y; pending = '';
  }, { passive: true });
  addEventListener('keydown', e => {
    if (inOS) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') target = clamp(target + .2);
    if (e.key === 'ArrowUp' || e.key === 'PageUp') target = clamp(target - .2);
  });
  $('#back').addEventListener('click', leave);

  /* ================= Παράθυρα ================= */
  const wins = $('#wins'), tabs = $('#tabs');
  let z = 10, n = 0;
  const mobile = () => innerWidth <= 760;
  $$('.win').forEach(w => {
    const bar = document.createElement('div'); bar.className = 'win__bar';
    bar.innerHTML = `<span class="win__title">${w.dataset.title}</span><button class="win__x" type="button" aria-label="Κλείσιμο">×</button>`;
    const bodyEl = document.createElement('div'); bodyEl.className = 'win__body';
    while (w.firstChild) bodyEl.appendChild(w.firstChild);
    w.append(bar, bodyEl);
    w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', w.dataset.title);
    $('.win__x', w).addEventListener('click', e => { e.stopPropagation(); close(w); });
    w.addEventListener('pointerdown', () => focus(w));
    // σύρσιμο
    bar.addEventListener('pointerdown', e => {
      if (mobile() || e.target.closest('.win__x')) return;
      const r = w.getBoundingClientRect(), pr = wins.getBoundingClientRect(), ox = e.clientX - r.left, oy = e.clientY - r.top;
      bar.setPointerCapture(e.pointerId);
      const move = ev => {
        w.style.left = Math.min(pr.width - 60, Math.max(60 - r.width, ev.clientX - pr.left - ox)) + 'px';
        w.style.top = Math.min(pr.height - 36, Math.max(0, ev.clientY - pr.top - oy)) + 'px';
      };
      const up = () => { bar.removeEventListener('pointermove', move); bar.removeEventListener('pointerup', up); };
      bar.addEventListener('pointermove', move); bar.addEventListener('pointerup', up);
    });
  });
  const renderTabs = () => {
    tabs.innerHTML = '';
    $$('.win:not([hidden])').forEach(w => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = w.dataset.title;
      b.className = w.classList.contains('is-top') ? 'is-top' : '';
      b.addEventListener('click', () => focus(w)); tabs.appendChild(b);
    });
  };
  const focus = w => {
    $$('.win.is-top').forEach(o => o.classList.remove('is-top'));
    w.classList.add('is-top'); w.style.zIndex = ++z; renderTabs();
  };
  const open = id => {
    const w = $('#win-' + id); if (!w) return;
    if (w.hidden) {
      w.hidden = false;
      const pr = wins.getBoundingClientRect(), width = Math.min(+w.dataset.w || 560, pr.width - 20);
      w.style.width = width + 'px';
      const k = n++ % 6, base = Math.max(10, Math.min(130, pr.width - width - 10));
      w.style.left = Math.min(pr.width - width - 10, base + k * 30) + 'px';
      w.style.top = 16 + k * 26 + 'px';
      requestAnimationFrame(() => {
        const h = w.getBoundingClientRect().height, top = parseFloat(w.style.top);
        if (top + h > pr.height - 10) w.style.top = Math.max(10, pr.height - h - 10) + 'px';
      });
    }
    focus(w);
    if (id === 'projects') pvCur ? runAuto() : pick(pvTabs[0]);
  };
  const close = w => {
    w.hidden = true; w.classList.remove('is-top');
    const rest = $$('.win:not([hidden])').sort((a, b) => b.style.zIndex - a.style.zIndex)[0];
    rest ? focus(rest) : renderTabs();
  };
  $$('[data-win]').forEach(b => b.addEventListener('click', () => open(b.dataset.win)));
  addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !inOS) return;
    const top = $('.win.is-top'); top ? close(top) : leave();
  });

  /* ================= Διαδραστική προεπισκόπηση projects ================= */
  const pvTabs = $$('#pvTabs button'), pvStage = $('#pvStage'), pvScreen = $('#pvScreen'), pvImg = $('#pvImg');
  const pvProg = $('#pvProg'), pvHint = $('#pvHint'), devBtns = $$('.pv__dev button');
  let pvCur = null, dev = mobile() ? 'm' : 'd', auto = 0, autoOn = false, lastT = 0, autoTO = 0;
  const stopAuto = () => { autoOn = false; cancelAnimationFrame(auto); clearTimeout(autoTO); };
  const runAuto = () => {
    stopAuto(); if (reduce) return; autoOn = true; lastT = 0;
    const step = t => {
      if (!autoOn) return;
      if (lastT) {
        const max = pvScreen.scrollHeight - pvScreen.clientHeight;
        pvScreen.scrollTop = Math.min(max, pvScreen.scrollTop + (t - lastT) * (dev === 'd' ? .09 : .07));
        if (pvScreen.scrollTop >= max - 1) return stopAuto();
      }
      lastT = t; auto = requestAnimationFrame(step);
    };
    autoTO = setTimeout(() => { if (autoOn) auto = requestAnimationFrame(step); }, 900);
  };
  const show = () => {
    if (!pvCur) return;
    stopAuto();
    pvStage.dataset.dev = dev;
    devBtns.forEach(b => b.setAttribute('aria-pressed', b.dataset.dev === dev));
    pvStage.classList.add('is-loading');
    pvScreen.scrollTop = 0; pvProg.style.transform = 'scaleY(0)';
    pvImg.onload = () => { pvStage.classList.remove('is-loading'); runAuto(); };
    pvImg.alt = `Η ιστοσελίδα ${$('b', pvCur).textContent} σε ${dev === 'd' ? 'υπολογιστή' : 'κινητό'}`;
    pvImg.src = `projects/${pvCur.dataset.img}-${dev}.jpg`;
    if (pvImg.complete && pvImg.naturalWidth) pvImg.onload();
  };
  const pick = t => {
    pvCur = t;
    pvTabs.forEach(o => o.classList.toggle('is-on', o === t));
    $('#pvUrl').textContent = t.dataset.url.replace(/^https?:\/\/|\/$/g, '');
    $('#pvOpen').href = t.dataset.url;
    pvHint.classList.remove('is-off');
    show();
  };
  pvTabs.forEach(t => t.addEventListener('click', () => pick(t)));
  devBtns.forEach(b => b.addEventListener('click', () => { dev = b.dataset.dev; show(); }));
  const userScroll = () => { stopAuto(); pvHint.classList.add('is-off'); };
  ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(ev => pvScreen.addEventListener(ev, userScroll, { passive: true }));
  pvScreen.addEventListener('scroll', () => {
    const max = pvScreen.scrollHeight - pvScreen.clientHeight;
    pvProg.style.transform = `scaleY(${max > 0 ? pvScreen.scrollTop / max : 0})`;
  }, { passive: true });
  // σύρσιμο με το ποντίκι (drag-to-scroll)
  let dragY = null, dragTop = 0;
  pvScreen.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; dragY = e.clientY; dragTop = pvScreen.scrollTop; pvScreen.classList.add('is-drag'); });
  addEventListener('pointermove', e => { if (dragY !== null) pvScreen.scrollTop = dragTop - (e.clientY - dragY) * 1.6; });
  addEventListener('pointerup', () => { dragY = null; pvScreen.classList.remove('is-drag'); });

  /* ================= Διαδραστικό πλάνο ================= */
  const BIZ = {
    food:   { n: 'Εστίαση / Καφέ', site: ['Online μενού που ανοίγει γρήγορα στο κινητό', 'Κρατήσεις ή παραγγελίες από το site', 'Σωστή εμφάνιση στο Google & στους χάρτες'], social: ['Καθημερινά stories με τα πιάτα της ημέρας', 'Reels από την κουζίνα και το σέρβις'], video: 'Promo βίντεο του μαγαζιού για διαφήμιση' },
    beauty: { n: 'Κομμωτήριο / Beauty', site: ['Παρουσίαση υπηρεσιών και δουλειών (gallery)', 'Κρατήσεις ραντεβού από το site', 'Mobile first σχεδιασμός'], social: ['Πριν / μετά από πραγματικές δουλειές', 'Stories με διαθέσιμα ραντεβού'], video: 'Reels με μεταμορφώσεις πελατών' },
    stay:   { n: 'Διαμονή / Τουρισμός', site: ['Παρουσίαση δωματίων με φωτογραφίες και παροχές', 'Κρατήσεις απευθείας από το site', 'SEO & Google για να σε βρίσκουν οι ταξιδιώτες'], social: ['Εικόνες από το κατάλυμα και την περιοχή', 'Stories με διαθεσιμότητα και προσφορές'], video: 'Promo βίντεο του καταλύματος' },
    shop:   { n: 'Κατάστημα', site: ['Παρουσίαση προϊόντων με καθαρή εικόνα', 'Παραγγελίες από το site', 'Γρήγορη φόρτωση κάτω από 1,5 δευτ.'], social: ['Νέες παραλαβές και προσφορές', 'Meta & TikTok ads για την περιοχή σου'], video: 'Reels με τα προϊόντα σου' },
    pro:    { n: 'Επαγγελματίας / Υπηρεσίες', site: ['Καθαρή παρουσίαση των υπηρεσιών σου', 'Εύκολη επικοινωνία από το κινητό', 'SEO & Google για την περιοχή σου'], social: ['Παρουσίαση της δουλειάς σου με συνέπεια', 'Google Business Profile & αξιολογήσεις'], video: 'Σύντομο βίντεο γνωριμίας' },
    other:  { n: 'Η επιχείρησή σου', site: ['Custom σχεδιασμός στα μέτρα σου', 'Mobile first, φόρτωση κάτω από 1,5 δευτ.', 'SEO & Google'], social: ['Δημιουργία περιεχομένου με υλικό σου ή δικά μας γυρίσματα', 'Πρόγραμμα δημοσιεύσεων'], video: 'Promo βίντεο & reels' }
  };
  const GOAL = {
    orders: { n: 'Περισσότερες κρατήσεις / παραγγελίες', first: 'Ξεκινάμε από το site με κρατήσεις/παραγγελίες και το στηρίζουμε με Meta & TikTok ads.', pack: 'Πλήρες' },
    google: { n: 'Να με βρίσκουν στο Google', first: 'Ξεκινάμε από SEO & Google και στήνουμε σωστά το Google Business Profile σου.', pack: 'Παρουσία + Google Business Profile' },
    social: { n: 'Να μεγαλώσω στα social', first: 'Ξεκινάμε με πρόγραμμα δημοσιεύσεων και reels, και μετράμε με μηνιαία αναφορά.', pack: 'Ανάπτυξη' },
    image:  { n: 'Πιο επαγγελματική εικόνα', first: 'Ξεκινάμε από custom σχεδιασμό του site και ενιαίο ύφος στα social.', pack: 'Ανάπτυξη' },
    all:    { n: 'Όλα τα παραπάνω', first: 'Τα στήνουμε όλα μαζί: site με κρατήσεις/παραγγελίες και SEO, Google Business Profile, πρόγραμμα δημοσιεύσεων με reels και Meta & TikTok ads.', pack: 'Πλήρες' }
  };
  const steps = $$('#plan .plan2__step'); let biz = '', goal = '';
  const go = i => steps.forEach((s, k) => s.hidden = k !== i);
  const li = a => a.map(x => `<li>${x}</li>`).join('');
  $$('#planBiz button').forEach(b => b.addEventListener('click', () => { biz = b.dataset.v; go(1); }));
  $$('#planGoal button').forEach(b => b.addEventListener('click', () => {
    goal = b.dataset.v; const B = BIZ[biz], G = GOAL[goal];
    $('#planFor').textContent = `${B.n} · ${G.n}`;
    $('#planOut').innerHTML = `
      <div class="plan2__first"><b>Πρώτο βήμα</b>${G.first}</div>
      <div class="plan2__cols">
        <div><h3>Ιστοσελίδα</h3><ul class="ticks">${li(B.site)}</ul></div>
        <div><h3>Social Media</h3><ul class="ticks">${li(B.social)}</ul></div>
        <div><h3>Βίντεο</h3><ul class="ticks">${li([B.video])}</ul></div>
      </div>
      <div class="plan2__meta"><span><b>Προτεινόμενο πακέτο</b>${G.pack}</span><span><b>Παράδοση site</b>5–14 ημέρες</span></div>`;
    setMail();
    go(2);
  }));
  const more = $('#planMore');
  const setMail = () => {};

  /* ================= Φόρμες (αποστολή στο email) ================= */
  // Υπηρεσία αποστολής: FormSubmit — στέλνει κάθε μήνυμα στο info@skoutstudio.gr.
  // Την πρώτη φορά έρχεται email ενεργοποίησης στο info@skoutstudio.gr (πάτα «Activate»).
  const FORM_TO = 'info@skoutstudio.gr';
  const FORM_ENDPOINT = `https://formsubmit.co/ajax/${FORM_TO}`;
  const planText = () => {
    if (!biz || !goal) return '';
    const B = BIZ[biz], G = GOAL[goal];
    return `Επιχείρηση: ${B.n}\nΣτόχος: ${G.n}\nΠροτεινόμενο πακέτο: ${G.pack}`;
  };
  const sendForm = async (form, extra = {}) => {
    const msg = $('.sform__msg', form), btn = $('button[type="submit"]', form);
    const fields = $$('input:not(.sform__hp), textarea', form);
    const bad = fields.find(f => f.required && !f.value.trim());
    if (bad) { msg.className = 'sform__msg is-err'; msg.textContent = 'Συμπλήρωσε όλα τα πεδία.'; bad.focus(); return; }
    if ($('.sform__hp', form).value) return;
    const data = { _subject: form.dataset.subject, _template: 'table', _captcha: 'false' };
    fields.forEach(f => data[f.name] = f.value.trim());
    Object.assign(data, extra);
    btn.disabled = true; msg.className = 'sform__msg'; msg.textContent = 'Αποστολή…';
    try {
      const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
      const out = await r.json().catch(() => ({}));
      if (!r.ok || String(out.success) !== 'true') throw new Error(out.message || r.status);
      form.reset(); msg.className = 'sform__msg is-ok'; msg.textContent = 'Το μήνυμα στάλθηκε! Θα σου απαντήσουμε σύντομα.';
    } catch (e) {
      msg.className = 'sform__msg is-err';
      msg.innerHTML = `Δεν στάλθηκε. Στείλε μας στο <a href="mailto:${FORM_TO}">${FORM_TO}</a>.`;
    } finally { btn.disabled = false; }
  };
  $('#contactForm').addEventListener('submit', e => { e.preventDefault(); sendForm(e.currentTarget); });
  $('#planForm').addEventListener('submit', e => {
    e.preventDefault();
    sendForm(e.currentTarget, { 'Πλάνο': planText(), 'Για την επιχείρηση': more.value.trim() || '—' });
  });
  $('#planBack1').addEventListener('click', () => go(0));
  $('#planReset').addEventListener('click', () => go(0));

  /* ================= Ρολόι ================= */
  const clock = $('#clock');
  const tick = () => clock.textContent = new Date().toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit', hour12: false });
  tick(); setInterval(tick, 15000);
})();
