/* ── FIRMA · entrata hero ────────────────────────────────────────────
   Tutto con gsap.from(): senza GSAP l'hero è già visibile per CSS. ── */
window.bespokeHeroEntrance = function () {
  if (typeof gsap === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero-kicker', { y: 12, opacity: 0, duration: .55 })
    .from('#hero h1',     { y: 28, opacity: 0, duration: .9 }, '-=.3')
    .from('.hero-sub',    { y: 18, opacity: 0, duration: .65 }, '-=.55')
    .from('.hero-meta',   { y: 14, opacity: 0, duration: .55 }, '-=.4');
};

/* PLUMBING_V 2 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'sartoria-sportiva-milano',                 // usato per localStorage lang
    whatsapp: {
      number: '',                     // '39xxxxxxxxxx' — vuoto = niente wiring
      message: 'Ciao! Vorrei informazioni.',
      ids: ['ctaPrenota', 'heroWhatsapp', 'doveWhatsapp', 'barWhatsapp'],
    },
    /* orari: per giorno (0=domenica) un array di finestre [inizio, fine]
       in minuti-stringa 'HH:MM'. Fine oltre '24:00' = scavalca mezzanotte
       (es. ['18:00','24:30'] = apre alle 18, chiude alle 00:30 del giorno
       dopo). Giorno chiuso = []. */
    hours: {
      0: [],
      1: [],
      2: [['09:30', '13:00'], ['15:00', '19:30']],
      3: [['09:30', '13:00'], ['15:00', '19:30']],
      4: [['09:30', '13:00'], ['15:00', '19:30']],
      5: [['09:30', '13:00'], ['15:00', '19:30']],
      6: [['09:30', '13:00'], ['15:00', '19:30']],
    },
    hoursStatusId: 'orarioStato',     // elemento testo stato
    hoursTableSelector: '[data-day]', // righe/li con data-day da evidenziare
    todayClass: 'oggi',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 960,
    /* dizionario EN: SOLO overlay — l'HTML è la versione italiana */
    EN: {
      'skip': 'Skip to content',
      'brand.aria': 'Sartoria Sportiva Milano, back to top',
      'burger.aria': 'Open the menu',
      'nav.mestiere': 'The craft', 'nav.come': 'How to order',
      'nav.bottega': 'The workshop', 'nav.dove': 'Find us',
      'lang.aria': 'Passa all’italiano', 'lang.txt': 'IT',
      'nav.cta': 'Call',

      'hero.kicker': 'Bovisa, Milan · since 2010',
      'hero.h': 'Dreams sewn<br>by hand.',
      'hero.sub': 'That is not a line we wrote: <strong>it is what is painted on his shop window</strong>. Vintage football shirts, sewn one at a time in Via Ciaia.',
      'hero.rating': 'from 41 Google reviews',
      'hero.cap': 'One letter at a time, sewn in the workshop.',

      'me.eyebrow': 'The craft',
      'me.h': 'A shirt is not<br>printed.',
      'me.p1': 'The shirts that leave this place are not replicas pulled from a catalogue: they are <strong>sewn by hand, one at a time</strong>. Letters and numbers are pieces of cloth appliquéd and stitched down, the way it was done when a shirt lasted a whole career.',
      'me.p2': 'In the reviews, the word that comes back most often after “football” and “shirts” is <strong>craftsman</strong>. One customer puts it better: «a real tailor’s shop, full of gems from every era».',
      'me.cit': '«The great Paolo <strong>made a dream come true for me</strong>… the legendary Monza shirt, with the patches made specially. A special tailor.»',
      'me.cit.c': 'Dario Di Stefano, Google review',
      'me.cap': 'The line is painted on the glass, next to the badge: “since 2010”.',

      'co.eyebrow': 'How to order',
      'co.h': 'Just the club<br>and roughly the year.',
      'co.p1': 'You do not need to be an expert. You need to say <strong>which club</strong> and <strong>which years</strong>: the cut, the colours, the crest and the number are his job.',
      'co.cit': '«I ordered a gift here for a football fan, a 1990s Sampdoria shirt. <strong>I know absolutely nothing about football</strong> and Mr Paolo could not have been kinder.»',
      'co.cit.c': 'Laura Podini, Google review',
      'co.p2': 'And you can step outside the history books too: among his work there are <strong>invented shirts</strong> and commemorative ones, like the shirt for the two hundredth anniversary of Argentine independence.',
      'co.cta': 'Call the workshop',

      'bo.eyebrow': 'The workshop',
      'bo.h': 'One room,<br>in Via Ciaia.',
      'bo.p1': 'A terrazzo floor, shirts hanging along the walls, old photographs in frames, and <strong>the sewing machine in the middle of the room</strong>, on the work table. There is no back room: the workshop is the shop.',
      'bo.p2': 'A customer called it «<strong>a sporting wonder in Dergano</strong>». It is a short walk from the Politecnico campus in Bovisa.',

      'voci.eyebrow': 'Google reviews', 'voci.h': '4.8 out of 41.',
      'v1.p': '«I ordered a gift here for a football fan, a 1990s Sampdoria shirt. I know absolutely nothing about football and Mr Paolo could not have been kinder.»',
      'v1.c': 'Laura Podini',
      'v2.p': '«A sporting wonder in Dergano, high-quality handmade shirts. With a great eye for vintage: a real tailor’s shop, full of gems from every era. Perfect for an out-of-the-ordinary gift.»',
      'v2.c': 'fabio ricci',
      'v3.p': '«The great Paolo made a dream come true for me: the legendary Monza shirt, with the patches made specially. A special tailor.»',
      'v3.c': 'Dario Di Stefano',

      'dove.eyebrow': 'Where we are', 'dove.h': 'Via Ciaia 6.',
      'dove.maptitle': 'Map: Sartoria Sportiva Milano, Via Ignazio Ciaia 6, Milan',
      'dove.nota': 'Hours transcribed from the ones handwritten on the shop window. Google shows different ones, edited by third parties: if you are coming from outside the neighbourhood, phone ahead.',
      'd.lun': 'Monday', 'd.mar': 'Tuesday', 'd.mer': 'Wednesday', 'd.gio': 'Thursday',
      'd.ven': 'Friday', 'd.sab': 'Saturday', 'd.dom': 'Sunday',
      'd.chiuso': 'closed', 'd.chiuso2': 'closed',

      'faq.h': 'Questions',
      'f1.q': 'I know nothing about football: can I still order a gift?',
      'f1.a': 'Yes, and it happens often. You just need the club and roughly the years: the rest — cut, colours, crest, number — is Paolo’s job.',
      'f2.q': 'Are the shirts made to measure?',
      'f2.a': 'They are sewn by hand in the workshop, one at a time. The numbers and patches are applied here too.',
      'f3.q': 'Can you make shirts that never existed?',
      'f3.a': 'Yes: among his work there are invented shirts and commemorative ones, like the shirt for the two hundredth anniversary of Argentine independence.',
      'f4.q': 'When is it open?',
      'f4.a': 'Tuesday to Saturday, 9:30am–1pm and 3–7:30pm. Closed Sunday and Monday. These are the hours painted on the window: phoning ahead is still the safest move.',
      'f5.q': 'Where exactly are you?',
      'f5.a': 'Via Ignazio Ciaia 6, in Bovisa, Milan.',

      'foot.o1': 'Tuesday–Saturday 9:30am–1pm · 3–7:30pm',
      'foot.o2': 'Closed Sunday and Monday',
      'foot.o3': 'Calcio Retrò · since 2010',
      'foot.demo': 'Demonstration site built by',
      'me.a1': 'Enlarge: the shop window',
      'bo.a1': 'Enlarge: the workshop',
      'lb.close': 'Close',
      'ab.call': 'Call', 'ab.map': 'Find us',
    },
  };
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  var heroEntrance = window.bespokeHeroEntrance || function () {};
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    heroEntrance();
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('mainNav');
  if (burger && nav) {
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    var en = root.lang === 'en';
    var txt;
    if (st.open) {
      txt = (en ? 'Open now' : 'Aperto ora') + ' · ' + (en ? 'closes at ' : 'chiude alle ') + st.closesAt;
    } else if (st.opensToday) {
      txt = (en ? 'Closed · opens today at ' : 'Chiuso · apre oggi alle ') + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = (en ? 'Closed · opens ' + DAYS_EN[st.opensDay] + ' at ' : 'Chiuso · apre ' + DAYS_IT[st.opensDay] + ' alle ') + st.opensAt;
    } else {
      txt = en ? 'Closed' : 'Chiuso';
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    root.lang = lang === 'en' ? 'en' : 'it';
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = lang === 'en' && SITE.EN[key] !== undefined ? SITE.EN[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      setLang(root.lang === 'en' ? 'it' : 'en');
    });
  }
  try {
    if (localStorage.getItem(SITE.slug + '-lang') === 'en') setLang('en');
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ FINE PLUMBING — sotto, il codice-firma ══════════ */

  var header = document.getElementById('header');
  if (header) {
    var headerScroll = function () { header.classList.toggle('scrolled', window.scrollY > 10); };
    window.addEventListener('scroll', headerScroll, { passive: true });
    headerScroll();
  }

  /* FIRMA 1: l'impuntura dell'intro si cuce da sola. Tratteggio +
     strokeDashoffset: è letteralmente il gesto del suo mestiere. */
  var filo = document.getElementById('introFilo');
  if (filo && hasGsap && !reducedMotion) {
    var len = filo.getTotalLength();
    gsap.fromTo(filo, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' });
  }

  /* FIRMA 2: i segni-filo delle sezioni si cuciono da sinistra.
     Solo scaleX: senza GSAP il tratteggio è già lì, intero. */
  if (hasST && !reducedMotion) {
    document.querySelectorAll('.filo').forEach(function (n) {
      gsap.from(n, {
        scaleX: 0, transformOrigin: 'left center',
        duration: .6, ease: 'power2.out',
        scrollTrigger: { trigger: n, start: 'top 90%', once: true },
      });
    });
  }
})();
