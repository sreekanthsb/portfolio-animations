/* ============================================================
   CLOUDINE — Main JS  (Smooth Scroll Fix — No Jerk Version)
   ============================================================ */

/* ================================================================
   1. GSAP PLUGIN REGISTRATION
================================================================ */
gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   2. LENIS SMOOTH SCROLL — properly integrated with GSAP ticker
================================================================ */
let lenis = null;

try {
  lenis = new Lenis({
    duration: 1.4,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false,
    normalizeWheel: true,
    wheelMultiplier: 0.9,
  });

  /* Single RAF via GSAP ticker — no double loop */
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* Sync ScrollTrigger with Lenis virtual scroll position */
  lenis.on('scroll', ScrollTrigger.update);

  /* CRITICAL: Tell ScrollTrigger to use Lenis's scrollTop */
  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0, left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
  });

  ScrollTrigger.defaults({ scroller: document.documentElement });

} catch (err) {
  console.warn('Lenis unavailable, using native scroll.', err);
}

/* ================================================================
   3. THREE.JS HERO — camera parallax on mouse move
================================================================ */
function initThreeJS() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'low-power',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const COUNT     = 750;
  const positions = new Float32Array(COUNT * 3);
  const colors    = new Float32Array(COUNT * 3);
  const palette   = [
    new THREE.Color('#4CB051'),
    new THREE.Color('#C8E542'),
    new THREE.Color('#FFFFFF'),
    new THREE.Color('#2d7a30'),
    new THREE.Color('#193B1B'),
  ];

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 22;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.048,
    vertexColors: true,
    transparent: true,
    opacity: 0.72,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  let targetCamX = 0, targetCamY = 0;
  let currCamX   = 0, currCamY   = 0;

  window.addEventListener('mousemove', e => {
    targetCamX =  (e.clientX / window.innerWidth  - 0.5) * 3.0;
    targetCamY = -(e.clientY / window.innerHeight - 0.5) * 2.2;
  });
  document.addEventListener('mouseleave', () => { targetCamX = 0; targetCamY = 0; });

  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', e => {
      if (e.gamma == null) return;
      targetCamX = (e.gamma / 45) * 1.5;
      targetCamY = (e.beta  / 90) * 1.0;
    });
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock  = new THREE.Clock();
  const origin = new THREE.Vector3(0, 0, 0);
  let animId;

  function animate() {
    animId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    particles.rotation.y = t * 0.022;
    particles.rotation.x = Math.sin(t * 0.014) * 0.09;
    currCamX += (targetCamX - currCamX) * 0.045;
    currCamY += (targetCamY - currCamY) * 0.045;
    camera.position.x = currCamX;
    camera.position.y = currCamY;
    camera.lookAt(origin);
    renderer.render(scene, camera);
  }
  animate();

  const heroEl = document.getElementById('hero');
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) animate();
    else cancelAnimationFrame(animId);
  }, { threshold: 0 }).observe(heroEl);
}

/* ================================================================
   4. SCROLL PROGRESS BAR
================================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  gsap.set(bar, { scaleX: 0 });
  ScrollTrigger.create({
    start: 'top top',
    end: 'max',
    scrub: 0,
    onUpdate: self => gsap.set(bar, { scaleX: self.progress }),
  });
}

/* ================================================================
   5. HEADER — TRANSPARENT → SOLID
================================================================ */
function initHeader() {
  const header = document.getElementById('header');
  ScrollTrigger.create({
    start: 'top -60',
    end: 99999,
    onUpdate(self) {
      header.classList.toggle('scrolled', self.progress > 0);
    },
  });
}

/* ================================================================
   6. MOBILE MENU
================================================================ */
function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  let open   = false;

  function openMenu() {
    open = true;
    btn.classList.add('open');
    menu.classList.remove('hidden');
    gsap.fromTo(menu,
      { opacity: 0, y: -14 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
    );
    gsap.from('.mobile-nav-item, .btn-primary-sm', {
      opacity: 0, x: -22,
      duration: 0.4, stagger: 0.07, ease: 'power3.out', delay: 0.05,
    });
  }

  function closeMenu() {
    open = false;
    btn.classList.remove('open');
    gsap.to(menu, {
      opacity: 0, y: -14, duration: 0.25, ease: 'power3.in',
      onComplete: () => menu.classList.add('hidden'),
    });
  }

  btn.addEventListener('click', () => (open ? closeMenu() : openMenu()));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

/* ================================================================
   7. HERO ENTRANCE ANIMATIONS
   FIX: Set initial states BEFORE animations run — no flash/jerk
================================================================ */
function initHeroAnimations() {
  /* Pre-hide all animated elements IMMEDIATELY (before render) */
  gsap.set('.hero-badge',    { opacity: 0, y: 32 });
  gsap.set('.hero-line',     { opacity: 0, y: 80, skewY: 3 });
  gsap.set('.hero-subtitle', { opacity: 0, y: 28 });
  gsap.set('.hero-actions',  { opacity: 0, y: 22 });
  gsap.set('.scroll-indicator', { opacity: 0, y: 10 });

  const tl = gsap.timeline({ delay: 0.25 });

  tl.to('.hero-badge', {
    opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
  });
  tl.to('.hero-line', {
    opacity: 1, y: 0, skewY: 0,
    duration: 1.1, stagger: 0.15, ease: 'power4.out',
  }, '-=0.4');
  tl.to('.hero-subtitle', {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
  }, '-=0.55');
  tl.to('.hero-actions', {
    opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
  }, '-=0.5');
  tl.to('.scroll-indicator', {
    opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
  }, '-=0.3');
}

/* ================================================================
   8. SCROLL ANIMATIONS — NO JERK VERSION
   KEY FIXES:
   • Always use gsap.set() to pre-hide elements BEFORE ScrollTrigger fires
   • Use toggleActions correctly
   • Avoid from() causing flash — use fromTo() always
   • Start triggers at 80-85% (not 88%) for earlier, smoother entry
================================================================ */
function initScrollAnimations() {

  /* ── Pre-hide ALL scroll-animated elements upfront ─────── */
  const toHide = [
    '.section-label',
    '.section-title',
    '.section-subtitle',
    '.menu-card',
    '.about-img-wrapper',
    '.about-main-img',
    '.about-heading',
    '.about-para',
    '.about-features li',
    '.about-content .btn-primary',
    '.stat-float',
    '.about-banner-overlay h2',
    '.logo-item',
    '.menu-tab',
    '.event-card',
    '.tcard',
    '.blog-card',
    '.contact-info-col',
    '.contact-form',
    '.contact-row',
    '.footer-brand',
    '.footer-col',
    '.footer-bottom',
  ];
  gsap.set(toHide.join(','), { opacity: 0 });

  /* ── Helper: clean fromTo wrapper ── */
  function reveal(selector, trigger, fromVars, toVars = {}, extra = {}) {
    const elements = typeof selector === 'string'
      ? document.querySelectorAll(selector)
      : selector;
    if (!elements || (elements.length !== undefined && elements.length === 0)) return;

    gsap.fromTo(
      elements,
      { opacity: 0, ...fromVars },
      {
        opacity: 1,
        duration: 0.75,
        ease: 'power3.out',
        ...toVars,
        scrollTrigger: {
          trigger,
          start: 'top 82%',
          toggleActions: 'play none none none',
          ...extra,
        },
      }
    );
  }

  /* ── Section labels ── */
  gsap.utils.toArray('.section-label').forEach(el => {
    reveal(el, el, { x: -30 }, { x: 0, duration: 0.6 });
  });

  /* ── Section titles ── */
  gsap.utils.toArray('.section-title').forEach(el => {
    reveal(el, el, { y: 40 }, { y: 0, duration: 0.8 });
  });

  /* ── Section subtitles ── */
  gsap.utils.toArray('.section-subtitle').forEach(el => {
    reveal(el, el, { y: 24 }, { y: 0, duration: 0.8 });
  });

  /* ── Menu cards — staggered left → right ── */
  const menuCards = gsap.utils.toArray('.menu-card');
  if (menuCards.length) {
    gsap.fromTo(menuCards,
      { opacity: 0, x: -50, y: 20 },
      {
        opacity: 1, x: 0, y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#top-menu',
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  /* ── About image wrapper ── */
  gsap.fromTo('.about-img-wrapper',
    { opacity: 0, x: -70 },
    {
      opacity: 1, x: 0, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: '#about', start: 'top 75%', toggleActions: 'play none none none' },
    }
  );

  /* ── About image clip-path reveal ── */
  gsap.fromTo('.about-main-img',
    { clipPath: 'inset(0 100% 0 0)' },
    {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.2, ease: 'power4.out',
      scrollTrigger: { trigger: '#about', start: 'top 75%', toggleActions: 'play none none none' },
    }
  );

  /* ── About image slow parallax on scroll ── */
  gsap.to('.about-main-img', {
    y: -60, ease: 'none',
    scrollTrigger: {
      trigger: '#about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
    },
  });

  /* ── About heading ── */
  reveal('.about-heading', '.about-heading', { x: 50 }, { x: 0, duration: 0.9 });

  /* ── About paragraphs ── */
  gsap.fromTo('.about-para',
    { opacity: 0, y: 28 },
    {
      opacity: 1, y: 0, duration: 0.75, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-para', start: 'top 85%', toggleActions: 'play none none none' },
    }
  );

  /* ── About features list ── */
  gsap.fromTo('.about-features li',
    { opacity: 0, x: -24 },
    {
      opacity: 1, x: 0, duration: 0.5, stagger: 0.09, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-features', start: 'top 82%', toggleActions: 'play none none none' },
    }
  );

  /* ── About CTA button ── */
  gsap.fromTo('.about-content .btn-primary',
    { opacity: 0, scale: 0.88 },
    {
      opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)',
      scrollTrigger: { trigger: '.about-content .btn-primary', start: 'top 88%', toggleActions: 'play none none none' },
    }
  );

  /* ── Stat float cards pop in ── */
  gsap.fromTo('.stat-float',
    { opacity: 0, scale: 0.72, y: 20 },
    {
      opacity: 1, scale: 1, y: 0, duration: 0.7, stagger: 0.2, ease: 'back.out(1.8)',
      scrollTrigger: { trigger: '.about-img-wrapper', start: 'top 72%', toggleActions: 'play none none none' },
    }
  );

  /* ── About banner parallax ── */
  gsap.to('.about-banner img', {
    y: '28%', ease: 'none',
    scrollTrigger: {
      trigger: '.about-banner', start: 'top bottom', end: 'bottom top', scrub: true,
    },
  });

  /* ── About banner heading ── */
  reveal('.about-banner-overlay h2', '.about-banner', { y: 40 }, { y: 0, duration: 1.0 });

  /* ── Logos ── */
  gsap.fromTo('.logo-item',
    { opacity: 0, y: 18, scale: 0.88 },
    {
      opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.09, ease: 'back.out(1.5)',
      scrollTrigger: { trigger: '.logos-row', start: 'top 88%', toggleActions: 'play none none none' },
    }
  );

  /* ── Featured menu tabs ── */
  gsap.fromTo('.menu-tab',
    { opacity: 0, y: 18, scale: 0.9 },
    {
      opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)',
      scrollTrigger: { trigger: '.menu-tabs', start: 'top 88%', toggleActions: 'play none none none' },
    }
  );

  /* ── Event cards ── */
  gsap.fromTo('.event-card',
    { opacity: 0, y: 55 },
    {
      opacity: 1, y: 0, duration: 0.75, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '#events', start: 'top 78%', toggleActions: 'play none none none' },
    }
  );

  /* ── Testimonial cards ── */
  gsap.fromTo('.tcard',
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0, duration: 0.75, stagger: 0.14, ease: 'power3.out',
      scrollTrigger: { trigger: '#testimonials', start: 'top 78%', toggleActions: 'play none none none' },
    }
  );

  /* ── Blog cards ── */
  gsap.fromTo('.blog-card',
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.13, ease: 'power3.out',
      scrollTrigger: { trigger: '#blog', start: 'top 78%', toggleActions: 'play none none none' },
    }
  );

  /* ── Contact info + form ── */
  gsap.fromTo('.contact-info-col',
    { opacity: 0, x: -65 },
    {
      opacity: 1, x: 0, duration: 0.95, ease: 'power3.out',
      scrollTrigger: { trigger: '#contact', start: 'top 78%', toggleActions: 'play none none none' },
    }
  );
  gsap.fromTo('.contact-form',
    { opacity: 0, x: 65 },
    {
      opacity: 1, x: 0, duration: 0.95, ease: 'power3.out',
      scrollTrigger: { trigger: '#contact', start: 'top 78%', toggleActions: 'play none none none' },
    }
  );
  gsap.fromTo('.contact-row',
    { opacity: 0, x: -36 },
    {
      opacity: 1, x: 0, duration: 0.6, stagger: 0.13, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-details', start: 'top 82%', toggleActions: 'play none none none' },
    }
  );

  /* ── Footer ── */
  gsap.fromTo('.footer-brand, .footer-col',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '#footer', start: 'top 90%', toggleActions: 'play none none none' },
    }
  );
  gsap.fromTo('.footer-bottom',
    { opacity: 0, y: 14 },
    {
      opacity: 1, y: 0, duration: 0.55, ease: 'power3.out',
      scrollTrigger: { trigger: '.footer-bottom', start: 'top 96%', toggleActions: 'play none none none' },
    }
  );

  /* Refresh all triggers after setup (important with Lenis proxy) */
  ScrollTrigger.refresh();
}

/* ================================================================
   9. STAT COUNTERS (scroll-triggered)
================================================================ */
function initCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target  = parseFloat(el.dataset.target);
    const decimal = el.dataset.decimal ? parseInt(el.dataset.decimal) : 0;

    ScrollTrigger.create({
      trigger: el, start: 'top 82%', once: true,
      onEnter() {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 2.2, ease: 'power2.out',
          onUpdate() {
            el.textContent = decimal
              ? obj.v.toFixed(decimal)
              : Math.floor(obj.v).toLocaleString();
          },
          onComplete() {
            el.textContent = decimal
              ? target.toFixed(decimal)
              : target >= 1000 ? target.toLocaleString() : target;
          },
        });
      },
    });
  });
}

/* ================================================================
   10. FEATURED MENU TABS + FILTER
================================================================ */
function initFeaturedMenu() {
  const tabs  = document.querySelectorAll('.menu-tab');
  const items = document.querySelectorAll('.feat-item');

  ScrollTrigger.create({
    trigger: '#featured-menu', start: 'top 72%', once: true,
    onEnter() {
      const visible = [...items].filter(i => !i.classList.contains('feat-hidden'));
      gsap.fromTo(visible,
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.09, ease: 'power3.out' }
      );
    },
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter  = tab.dataset.filter;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const allItems = [...items];
      const toShow   = allItems.filter(i => i.dataset.cat === filter);
      const current  = allItems.filter(i => !i.classList.contains('feat-hidden'));

      gsap.to(current, {
        opacity: 0, y: 18, scale: 0.95, duration: 0.22, ease: 'power2.in',
        onComplete() {
          allItems.forEach(i => i.classList.add('feat-hidden'));
          toShow.forEach(i => i.classList.remove('feat-hidden'));
          gsap.fromTo(toShow,
            { opacity: 0, y: 30, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.48, stagger: 0.08, ease: 'power3.out' }
          );
        },
      });
    });
  });

  items.forEach(item => {
    item.addEventListener('click', () => {
      openModal({
        title: item.dataset.title,
        desc:  item.dataset.desc,
        price: item.dataset.price,
        img:   item.dataset.img,
        cat:   item.dataset.cat,
      });
    });
  });
}

/* ================================================================
   11. MODAL
================================================================ */
function openModal({ title, desc, price, img, cat }) {
  const overlay = document.getElementById('modal');
  const box     = document.getElementById('modalBox');

  document.getElementById('modalImg').src           = img;
  document.getElementById('modalImg').alt           = title;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalDesc').textContent  = desc;
  document.getElementById('modalPrice').textContent = price;

  const catMap = { veg: '🌿 Vegetarian', 'non-veg': '🍗 Non-Vegetarian', specials: '⭐ Special' };
  document.getElementById('modalCat').textContent = catMap[cat] || '';

  overlay.classList.remove('modal-hidden');
  document.body.style.overflow = 'hidden';

  gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
  gsap.fromTo(box,
    { scale: 0.86, opacity: 0, y: 44 },
    { scale: 1, opacity: 1, y: 0, duration: 0.46, ease: 'back.out(1.6)' }
  );
}

function closeModal() {
  const overlay = document.getElementById('modal');
  const box     = document.getElementById('modalBox');
  gsap.to(box,     { scale: 0.91, opacity: 0, y: 20, duration: 0.24, ease: 'power2.in' });
  gsap.to(overlay, {
    opacity: 0, duration: 0.3, delay: 0.1, ease: 'power2.in',
    onComplete() {
      overlay.classList.add('modal-hidden');
      document.body.style.overflow = '';
    },
  });
}

function initModal() {
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalCloseAlt').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('modal').classList.contains('modal-hidden'))
      closeModal();
  });
}

/* ================================================================
   12. TESTIMONIALS CAROUSEL
================================================================ */
function initTestimonials() {
  const track   = document.getElementById('testimonialsTrack');
  const cards   = track.querySelectorAll('.tcard');
  const dotsEl  = document.getElementById('tDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let current   = 0;
  let timer;

  function getVisible() {
    const w = window.innerWidth;
    return w >= 1024 ? 3 : w >= 640 ? 2 : 1;
  }
  function maxIdx() { return Math.max(0, cards.length - getVisible()); }

  function buildDots() {
    dotsEl.innerHTML = '';
    const count = Math.ceil(cards.length / getVisible());
    for (let i = 0; i < count; i++) {
      const d = document.createElement('div');
      d.className = 't-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
    }
  }

  function updateDots() {
    dotsEl.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIdx()));
    const gap   = 24;
    const cardW = cards[0].offsetWidth + gap;
    gsap.to(track, { x: -current * cardW, duration: 0.58, ease: 'power3.inOut' });
    updateDots();
  }

  prevBtn.addEventListener('click', () => { clearInterval(timer); goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { clearInterval(timer); goTo(current < maxIdx() ? current + 1 : 0); startAuto(); });

  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      clearInterval(timer);
      goTo(diff > 0 ? current + 1 : current - 1);
      startAuto();
    }
  });

  function startAuto() {
    timer = setInterval(() => goTo(current < maxIdx() ? current + 1 : 0), 4500);
  }

  window.addEventListener('resize', () => { buildDots(); goTo(0); });
  buildDots();
  startAuto();
}

/* ================================================================
   13. 3D TILT ON TESTIMONIAL CARDS
================================================================ */
function init3DTilt() {
  document.querySelectorAll('.tcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const cx = r.width / 2, cy = r.height / 2;
      gsap.to(card, {
        rotationX: ((e.clientY - r.top  - cy) / cy) * -9,
        rotationY: ((e.clientX - r.left - cx) / cx) *  9,
        scale: 1.025,
        duration: 0.3, ease: 'power2.out',
        transformPerspective: 800, transformOrigin: 'center center',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.5, ease: 'power3.out' });
    });
  });
}

/* ================================================================
   14. ACTIVE NAV LINK TRACKING
================================================================ */
function initActiveNav() {
  const links = document.querySelectorAll('.nav-link');
  function setActive(id) {
    links.forEach(l => l.classList.toggle('active-link', l.getAttribute('href') === `#${id}`));
  }
  document.querySelectorAll('section[id]').forEach(sec => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 60%', end: 'bottom 40%',
      onEnter:     () => setActive(sec.id),
      onEnterBack: () => setActive(sec.id),
    });
  });
}

/* ================================================================
   15. DROPDOWN → TAB FILTER BRIDGE
================================================================ */
function initDropdownBridge() {
  document.querySelectorAll('.dropdown-item[data-filter]').forEach(item => {
    item.addEventListener('click', () => {
      const tab = document.querySelector(`.menu-tab[data-filter="${item.dataset.filter}"]`);
      if (tab) setTimeout(() => tab.click(), 400);
    });
  });
}

/* ================================================================
   16. SMOOTH ANCHOR SCROLL
================================================================ */
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -80, duration: 1.3 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ================================================================
   17. FORM HANDLING
================================================================ */
function initForms() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = contactForm.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fa fa-circle-notch fa-spin mr-2"></i>Sending…';
      btn.disabled  = true;
      setTimeout(() => {
        btn.innerHTML = '<i class="fa fa-circle-check mr-2"></i>Message Sent!';
        gsap.fromTo(btn, { scale: 0.95 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' });
        setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; contactForm.reset(); }, 3000);
      }, 1500);
    });
  }

  const nlForm = document.getElementById('nlForm');
  if (nlForm) {
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      const inp = nlForm.querySelector('input');
      const b   = nlForm.querySelector('button');
      gsap.timeline()
        .to(b, { scale: 1.2, duration: 0.12 })
        .to(b, { scale: 1,   duration: 0.12 });
      inp.value = '';
      inp.placeholder = 'Thank you! ✓';
      setTimeout(() => { inp.placeholder = 'Enter your email'; }, 2500);
    });
  }
}

/* ================================================================
   18. BOOT
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  initScrollProgress();
  initHeader();
  initMobileMenu();
  initHeroAnimations();        /* sets gsap.set() first */
  initScrollAnimations();      /* pre-hides all, then animates */
  initCounters();
  initFeaturedMenu();
  initModal();
  initTestimonials();
  init3DTilt();
  initActiveNav();
  initDropdownBridge();
  initSmoothLinks();
  initForms();
});