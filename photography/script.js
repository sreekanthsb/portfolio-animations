// ─── LENIS SMOOTH SCROLL ───────────────────────────────────────────
const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 0.9,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Sync Lenis with GSAP ticker
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// Sync ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update);

gsap.registerPlugin(ScrollTrigger);

// ─── SCROLL PROGRESS BAR ───────────────────────────────────────────
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.appendChild(progressBar);

lenis.on('scroll', ({ progress }) => {
    progressBar.style.transform = `scaleX(${progress})`;
});

// ─── VELOCITY SKEW EFFECT ──────────────────────────────────────────
// All images and section titles subtly skew based on scroll velocity
const skewSetter = gsap.quickTo('.section-title, .hscroll-card', 'skewY', { duration: 0.4, ease: 'power3' });
const clamp = gsap.utils.clamp(-5, 5);

lenis.on('scroll', ({ velocity }) => {
    skewSetter(clamp(velocity * 0.4));
});


const initTextAnimations = () => {
    // ── 1. HERO — CINEMATIC ENTRANCE ───────────────────────────
    const heroTitle = new SplitType('#heroTitle', { types: 'lines, words, chars' });

    // Set initial state: each char fallen back, blurred, rotated
    gsap.set(heroTitle.chars, {
        opacity: 0,
        y: 100,
        rotateX: 90,
        filter: 'blur(10px)',
        transformOrigin: '50% 100%',
        transformPerspective: 600
    });
    gsap.set('#heroEyebrow', { opacity: 0, y: 20 });
    gsap.set('#heroBtn',     { opacity: 0, scale: 0.82 });

    const heroTl = gsap.timeline({ delay: 0.3 });

    // Eyebrow first
    heroTl.to('#heroEyebrow', {
        opacity: 1, y: 0,
        duration: 1, ease: 'power3.out'
    })
    // Chars cascade: rotate up, blur out
    .to(heroTitle.chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: 'blur(0px)',
        duration: 1.4,
        stagger: 0.03,
        ease: 'power4.out'
    }, '-=0.6')
    // Subtext
    .to('#heroSub', {
        opacity: 1, y: 0,
        duration: 1.1, ease: 'power3.out'
    }, '-=0.9')
    // CTA
    .to('#heroBtn', {
        opacity: 1, scale: 1,
        duration: 0.9, ease: 'back.out(1.5)'
    }, '-=0.7')
    // Side label + scroll hint
    .to(['#heroScrollHint', '.hero-side-label'], {
        opacity: 1,
        duration: 1.2, ease: 'power2.out'
    }, '-=0.4');

    // ── 2. BREATHING loop after entrance ───────────────────────
    heroTl.call(() => {
        gsap.to('#heroTitle', {
            scale: 1.03,
            duration: 3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });
    });

    // ── 3. FILM GRAIN — Canvas noise animation ──────────────────
    const canvas  = document.getElementById('noiseCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let animId;
        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const drawGrain = () => {
            const w = canvas.width, h = canvas.height;
            const imgData = ctx.createImageData(w, h);
            const buf = imgData.data;
            for (let i = 0; i < buf.length; i += 4) {
                const val = (Math.random() * 255) | 0;
                buf[i] = buf[i+1] = buf[i+2] = val;
                buf[i+3] = 18; // very subtle alpha
            }
            ctx.putImageData(imgData, 0, 0);
            animId = requestAnimationFrame(drawGrain);
        };
        drawGrain();
    }

    // ── 4. MAGNETIC CTA ──────────────────────────────────────────
    const magWrap = document.getElementById('magneticWrap');
    const heroBtn = document.getElementById('heroBtn');
    if (magWrap && heroBtn) {
        magWrap.addEventListener('mousemove', (e) => {
            const r = magWrap.getBoundingClientRect();
            const cx = r.left + r.width  / 2;
            const cy = r.top  + r.height / 2;
            const dx = (e.clientX - cx) * 0.35;
            const dy = (e.clientY - cy) * 0.35;
            gsap.to(heroBtn, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
        });
        magWrap.addEventListener('mouseleave', () => {
            gsap.to(heroBtn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        });
    }

    // ── 5. SCROLL — video zoom push-in ──────────────────────────
    gsap.to('#heroVideo', {
        scale: 1.25,
        ease: 'none',
        scrollTrigger: {
            trigger: '#heroSection',
            start: 'top top',
            end:   'bottom top',
            scrub: 1.5
        }
    });

    // ── 6. SCROLL — overlay darkens gradually ───────────────────
    gsap.to('#heroOverlay', {
        opacity: 1.6,          // CSS will cap at 1 naturally
        ease: 'none',
        scrollTrigger: {
            trigger: '#heroSection',
            start: 'top top',
            end:   '80% top',
            scrub: true
        }
    });

    // ── 7. SCROLL EXIT — content floats up and fades ────────────
    gsap.to('#heroContent', {
        y: -120,
        opacity: 0,
        ease: 'power2.inOut',
        scrollTrigger: {
            trigger: '#heroSection',
            start: 'top top',
            end:   '50% top',
            scrub: 1
        }
    });



    // 2. Global Section Titles Split
    const animateTitles = document.querySelectorAll('.animate-title');
    animateTitles.forEach(title => {
        const splitTitle = new SplitType(title, { types: 'words, chars' });

        gsap.set(splitTitle.chars, {
            opacity: 0,
            y: 40,
            filter: "blur(8px)"
        });

        gsap.to(splitTitle.chars, {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
            },
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.03,
            ease: "power3.out"
        });
    });

    // 3. Intro Paragraph Reading Reveal
    const introText = new SplitType('.animate-text-reveal', { types: 'words' });

    gsap.set(introText.words, { opacity: 0.1 });

    gsap.to(introText.words, {
        scrollTrigger: {
            trigger: '.intro-section',
            start: "top 70%",
            end: "bottom 60%",
            scrub: true
        },
        opacity: 1,
        stagger: 0.1,
        ease: "none"
    });
};

const initImageBlocks = () => {
    const galleryBlocks = document.querySelectorAll('.expand-item');

    gsap.to(galleryBlocks, {
        scrollTrigger: {
            trigger: '.expand-gallery',
            start: "top 75%",
        },
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15, // Slide up stagger effect
        ease: "power4.out"
    });
};
gsap.from(".expand-item", {
    scale: 0.85,
    opacity: 0,
    y: 100,
    duration: 1.2,
    stagger: 0.15,
    ease: "power4.out",
    scrollTrigger: {
        trigger: ".expand-gallery",
        start: "top 80%"
    }
});
const initTimelinePin = () => {
    // Only apply complex timeline pinning logic on desktop using matchMedia
    let mm = gsap.matchMedia();

    mm.add("(min-width: 993px)", () => {
        const tlSection = document.getElementById('timelinePinned');
        const tcItems = document.querySelectorAll('.tc-item');
        const tiItems = document.querySelectorAll('.ti-item');

        // Ensure proper clean layout before run
        gsap.set(tlSection, { height: "100vh" });

        gsap.set(tcItems, { opacity: 0, y: 30, visibility: 'hidden' });
        gsap.set(tcItems[0], { opacity: 1, y: 0, visibility: 'visible' });

        gsap.set(tiItems, { opacity: 0, y: 100, scale: 0.95 });
        gsap.set(tiItems[0], { opacity: 1, y: 0, scale: 1 });

        const pinTl = gsap.timeline({
            scrollTrigger: {
                trigger: tlSection,
                start: "top top",
                end: "+=3000",
                pin: true,
                scrub: 1
            }
        });

        // Transition 1 to 2
        pinTl.to(tcItems[0], { opacity: 0, y: -30, duration: 1 })
            .to(tiItems[0], { opacity: 0, scale: 1.05, duration: 1 }, "<")
            .set(tcItems[0], { visibility: 'hidden' })
            .set(tcItems[1], { visibility: 'visible' })
            .to(tcItems[1], { opacity: 1, y: 0, duration: 1 })
            .to(tiItems[1], { opacity: 1, y: 0, scale: 1, duration: 1 }, "<");

        pinTl.addLabel("step2");
        pinTl.to({}, { duration: 0.5 });

        // Transition 2 to 3
        pinTl.to(tcItems[1], { opacity: 0, y: -30, duration: 1 })
            .to(tiItems[1], { opacity: 0, scale: 1.05, duration: 1 }, "<")
            .set(tcItems[1], { visibility: 'hidden' })
            .set(tcItems[2], { visibility: 'visible' })
            .to(tcItems[2], { opacity: 1, y: 0, duration: 1 })
            .to(tiItems[2], { opacity: 1, y: 0, scale: 1, duration: 1 }, "<");

        pinTl.addLabel("step3");
        pinTl.to({}, { duration: 0.5 });
    });
};
gsap.to(".hero-video", {
    scale: 1.2,
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});
const initAdvancedBlogScroll = () => {
    const blogRows = document.querySelectorAll('.blog-row');
    let mm = gsap.matchMedia();

    mm.add("(min-width: 993px)", () => {
        blogRows.forEach(row => {
            const textCol = row.querySelector('.blog-text-col');
            const imgInner = row.querySelector('.b-img-wrapper img');

            // Text moves down relative to scroll
            gsap.fromTo(textCol,
                { y: -30 },
                {
                    y: 30,
                    scrollTrigger: {
                        trigger: row,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                }
            );

            // Image scroll parallax
            gsap.fromTo(imgInner,
                { yPercent: -10 },
                {
                    yPercent: 10,
                    scrollTrigger: {
                        trigger: row,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                }
            );
        });
    });
};

const initHorizontalScroll = () => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 993px)", () => {
        const track = document.getElementById('hscrollTrack');
        const section = document.getElementById('hscrollSection');

        gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${track.scrollWidth - window.innerWidth}`,
                pin: true,
                pinSpacing: true,
                scrub: 1,
                invalidateOnRefresh: true,
                anticipatePin: 1
            }
        });
    });
};

const initTestimonials = () => {
    gsap.to('.test-card', {
        scrollTrigger: {
            trigger: '.testimonial-section',
            start: "top 75%",
        },
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out"
    });
};

const initTestimonialHover = () => {
    // Disable hover 3D tilt on mobile explicitly
    if (window.innerWidth < 992) return;

    const cards = document.querySelectorAll('.test-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xPercent = (x / rect.width - 0.5) * 2;
            const yPercent = (y / rect.height - 0.5) * 2;

            const maxRotate = 15;

            gsap.to(card, {
                duration: 0.5,
                rotateX: -yPercent * maxRotate,
                rotateY: xPercent * maxRotate,
                ease: "power2.out",
                transformPerspective: 1000
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 1.2,
                rotateX: 0,
                rotateY: 0,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
};

const initHeaderScroll = () => {
    ScrollTrigger.create({
        start: "top -100",
        end: 99999,
        toggleClass: { className: 'header-scrolled', targets: '.header' }
    });
};

document.addEventListener("DOMContentLoaded", () => {
    gsap.set('body', { autoAlpha: 1 });

    initHeaderScroll();
    initTextAnimations();
    initImageBlocks();
    initAdvancedBlogScroll();
    initTimelinePin();
    initHorizontalScroll();
    initTestimonials();
    initTestimonialHover();
});
