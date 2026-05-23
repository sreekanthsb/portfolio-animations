// ── Header scroll ──
const hdr = document.getElementById('site-header');
window.addEventListener('scroll', () => {
    hdr.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Hamburger / Mobile Nav ──
function toggleNav() {
    const nav = document.getElementById('nav-links');
    const overlay = document.getElementById('mobile-nav-overlay');
    const btn = document.getElementById('hamburger');
    const isOpen = nav.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    overlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeNav() {
    const nav = document.getElementById('nav-links');
    const overlay = document.getElementById('mobile-nav-overlay');
    const btn = document.getElementById('hamburger');
    nav.classList.remove('open');
    btn.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Close nav on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
});

// ── Hero Canvas Frame Scrubber ──
(function () {
    const TOTAL_FRAMES = 240;
    const BASE_PATH = 'images/herosection/';

    // Build frame filename: ezgif-frame-001.png … ezgif-frame-240.png
    function framePath(n) {
        return BASE_PATH + 'ezgif-frame-' + String(n).padStart(3, '0') + '.jpg';
    }

    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    const loader = document.getElementById('hero-loader');
    const progressFill = document.getElementById('hero-progress-fill');
    const scrollHint = document.getElementById('hero-scroll-hint');

    // Size canvas to viewport
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (images[currentFrame - 1] && images[currentFrame - 1].complete) {
            drawFrame(images[currentFrame - 1]);
        }
    }
    window.addEventListener('resize', resizeCanvas);

    // Draw a single image centered / cover
    function drawFrame(img) {
        if (!img || !img.complete || img.naturalWidth === 0) return;
        const cw = canvas.width, ch = canvas.height;
        const iw = img.naturalWidth, ih = img.naturalHeight;
        const scale = Math.max(cw / iw, ch / ih);
        const sw = iw * scale, sh = ih * scale;
        const dx = (cw - sw) / 2, dy = (ch - sh) / 2;
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, dx, dy, sw, sh);
    }

    // Preload all frames
    const images = new Array(TOTAL_FRAMES);
    let loadedCount = 0;
    let currentFrame = 1;
    let animationReady = false;

    // Show first frame as soon as it arrives
    function onImageLoad(i) {
        loadedCount++;
        if (i === 0 && !animationReady) {
            resizeCanvas();
            drawFrame(images[0]);
        }
        // Update loader progress text
        const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
        const loaderText = loader.querySelector('.loader-text');
        if (loaderText) loaderText.textContent = 'Loading ' + pct + '%';

        if (loadedCount >= TOTAL_FRAMES) {
            animationReady = true;
            loader.classList.add('hidden');
            // Reveal scroll hint
            setTimeout(() => {
                scrollHint.style.transition = 'opacity 0.8s ease';
                scrollHint.style.opacity = '1';
            }, 300);
            // Force-render current frame
            updateFrame();
        }
    }

    for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = framePath(i + 1);
        img.onload = (function (idx) { return function () { onImageLoad(idx); }; })(i);
        img.onerror = function () { loadedCount++; if (loadedCount >= TOTAL_FRAMES && !animationReady) { animationReady = true; loader.classList.add('hidden'); } };
        images[i] = img;
    }

    // ── Panel definitions: [startFrame, endFrame] ──
    const panels = [
        { el: document.getElementById('hp-1'), start: 1, end: 55 },
        { el: document.getElementById('hp-2'), start: 65, end: 115 },
        { el: document.getElementById('hp-3'), start: 125, end: 175 },
        { el: document.getElementById('hp-4'), start: 185, end: 240 },
    ];

    function updatePanels(frame) {
        panels.forEach(p => {
            const show = frame >= p.start && frame <= p.end;
            p.el.classList.toggle('visible', show);
        });
    }

    // ── Scroll → frame ──
    function updateFrame() {
        const seq = document.getElementById('hero-sequence');
        const seqTop = seq.getBoundingClientRect().top;
        const seqH = seq.offsetHeight - window.innerHeight;
        // scrolled = how far we've scrolled into the sequence
        const scrolled = Math.max(0, -seqTop);
        const progress = Math.min(1, scrolled / seqH);

        const frameIdx = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * (TOTAL_FRAMES - 1)));
        const frameNum = frameIdx + 1;
        currentFrame = frameNum;

        // Draw
        if (animationReady && images[frameIdx] && images[frameIdx].complete) {
            drawFrame(images[frameIdx]);
        }

        // Update text panels
        updatePanels(frameNum);

        // Update progress bar
        progressFill.style.width = (progress * 100) + '%';

        // Hide scroll hint once we start scrolling
        if (scrolled > 20) {
            scrollHint.style.opacity = '0';
        } else if (animationReady) {
            scrollHint.style.opacity = '1';
        }
    }

    window.addEventListener('scroll', updateFrame, { passive: true });
    resizeCanvas();
    updateFrame(); // initial render
})();

// ── Scroll motion observer ──
const motionEls = document.querySelectorAll('[data-motion]');
const mo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const delay = parseInt(e.target.dataset.delay || 0);
            setTimeout(() => e.target.classList.add('animated'), delay);
            mo.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });
motionEls.forEach(el => mo.observe(el));

// ── Cart / Toast ──
let cartCount = 1;
function handleCart() {
    cartCount++;
    document.getElementById('cart-badge').textContent = cartCount;
    const toast = document.getElementById('toast');
    toast.style.display = 'block';
    toast.style.animation = 'none';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// ── Countdown ──
(function () {
    const end = new Date();
    end.setHours(end.getHours() + 5, end.getMinutes() + 44, end.getSeconds() + 12);
    function pad(n) { return String(n).padStart(2, '0'); }
    function tick() {
        const diff = Math.max(0, Math.floor((end - new Date()) / 1000));
        document.getElementById('cd-h').textContent = pad(Math.floor(diff / 3600));
        document.getElementById('cd-m').textContent = pad(Math.floor((diff % 3600) / 60));
        document.getElementById('cd-s').textContent = pad(diff % 60);
        if (diff > 0) setTimeout(tick, 1000);
    }
    tick();
})();