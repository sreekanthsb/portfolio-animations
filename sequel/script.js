/**
 * L'Horizon Luxury Hotel - Motion System
 * Senior Frontend Motion Engineer Implementation
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 0. CONFIGURATION & TWEAKABLES ---
    const CONFIG = {
        easing: {
            expo: "expo.out",
            expoInOut: "expo.inOut",
            power3: "power3.out",
            power4: "power4.out",
            back: "back.out(1.2)",
            linear: "none"
        },
        duration: {
            slow: 1.8,
            medium: 1.2,
            fast: 0.8
        },
        stagger: {
            text: 0.1,
            words: 0.05,
            cards: 0.2,
            gallery: 0.1
        }
    };

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(".loader", { display: "none" });
        document.body.style.cursor = "auto";
        return;
    }

    // --- 1. INITIALIZATION & UTILITIES ---

    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.1,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // Helper: Split Text into Words
    const splitWords = (selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            const text = el.innerText;
            el.innerHTML = '';
            text.split(' ').forEach(word => {
                const span = document.createElement('span');
                span.innerText = word + '\u00A0';
                span.style.display = 'inline-block';
                span.classList.add('word-reveal');
                el.appendChild(span);
            });
        });
    };

    // --- 2. PREMIUM POLISH (CURSOR & LOADER) ---

    // Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "none"
        });
    });

    document.querySelectorAll('a, button, .btn, .room-card').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });

    // Premium Loader Animation
    const initLoader = () => {
        const tl = gsap.timeline();
        
        tl.to(".loader__progress", {
            width: "100%",
            duration: 1.5,
            ease: "power2.inOut"
        })
        .to(".loader", {
            yPercent: -100,
            duration: 1,
            ease: "expo.inOut",
            onComplete: () => {
                initHero(); // Start hero animation after loader
            }
        })
        .from("#main", {
            y: 100,
            duration: 1,
            ease: "expo.out"
        }, "-=0.8");
    };

    // --- 3. SECTION ANIMATIONS ---

    // S1: Hero Animation
    const initHero = () => {
        const tl = gsap.timeline({ defaults: { ease: CONFIG.easing.expo } });

        tl.from(".hero__bg img", {
            scale: 1.2,
            duration: 2.5,
            ease: "power2.out"
        })
        .from(".hero__title .mask-inner", {
            y: "100%",
            stagger: 0.15,
            duration: CONFIG.duration.slow
        }, "-=2")
        .from(".hero__subtitle .mask-inner", {
            y: "100%",
            duration: CONFIG.duration.medium
        }, "-=1.5")
        .from(".hero__cta .mask-inner", {
            y: "100%",
            duration: CONFIG.duration.medium
        }, "-=1.2");

        // Scroll Parallax for Hero
        gsap.to(".hero__bg img", {
            y: "20%",
            scrollTrigger: {
                trigger: "#hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    };

    // S2: Hotel Introduction (Word Reveal)
    const initIntro = () => {
        splitWords(".reveal-words");
        
        gsap.from(".reveal-words .word-reveal", {
            y: 40,
            opacity: 0,
            stagger: CONFIG.stagger.words,
            duration: CONFIG.duration.medium,
            ease: CONFIG.easing.power3,
            scrollTrigger: {
                trigger: "#intro",
                start: "top 80%",
                end: "top 40%",
                scrub: 1
            }
        });
    };

    // S3: Rooms & Suites
    const initRooms = () => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#rooms",
                start: "top 75%"
            }
        });

        tl.from("#rooms .reveal-text", {
            y: 50,
            opacity: 0,
            stagger: 0.1,
            duration: CONFIG.duration.medium,
            ease: CONFIG.easing.power3
        })
        .from(".room-card", {
            y: 100,
            opacity: 0,
            stagger: CONFIG.stagger.cards,
            duration: CONFIG.duration.slow,
            ease: CONFIG.easing.expo
        }, "-=0.8");

        // Parallax for room images
        document.querySelectorAll(".room-card__img-wrap img").forEach(img => {
            gsap.fromTo(img, { y: "-10%" }, {
                y: "10%",
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    };

    // S4: Experience (Pinned Pacing)
    const initExperience = () => {
        const items = document.querySelectorAll(".experience__item");
        const bgImg = document.querySelector(".exp-bg-img");
        
        const mainTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#experience",
                start: "top top",
                end: "+=300%", // 300vh
                pin: true,
                scrub: 1,
            }
        });

        items.forEach((item, i) => {
            if (i > 0) {
                mainTl.to(items[i-1], { opacity: 0, y: -20, duration: 1 }, `item-${i}`)
                      .to(item, { opacity: 1, visibility: "visible", y: 0, duration: 1 }, `item-${i}`)
                      .to(bgImg, { 
                          attr: { src: item.dataset.bg }, 
                          duration: 0.5,
                          ease: "none"
                      }, `item-${i}`);
            }
        });
    };

    // S5: Gallery (Clip-Path Reveal)
    const initGallery = () => {
        gsap.from(".gallery__item", {
            clipPath: "inset(100% 0% 0% 0%)",
            y: 50,
            stagger: CONFIG.stagger.gallery,
            duration: CONFIG.duration.slow,
            ease: CONFIG.easing.expoInOut,
            scrollTrigger: {
                trigger: "#gallery",
                start: "top 70%"
            }
        });
    };

    // S6: Guest Reviews
    const initReviews = () => {
        gsap.from(".review-card", {
            x: 100,
            opacity: 0,
            stagger: 0.2,
            duration: CONFIG.duration.medium,
            ease: CONFIG.easing.back,
            scrollTrigger: {
                trigger: "#reviews",
                start: "top 75%"
            }
        });
    };

    // S7: Location
    const initLocation = () => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#location",
                start: "top 70%"
            }
        });

        tl.from(".location__map", {
            clipPath: "inset(0% 100% 0% 0%)",
            duration: CONFIG.duration.slow,
            ease: CONFIG.easing.expoInOut
        })
        .from(".location__info .reveal-text", {
            x: 30,
            opacity: 0,
            stagger: 0.1,
            duration: CONFIG.duration.medium,
            ease: CONFIG.easing.power3
        }, "-=1");
    };

    // S8: Booking CTA
    const initBooking = () => {
        gsap.from(".cta-banner", {
            scale: 0.9,
            duration: CONFIG.duration.slow,
            ease: CONFIG.easing.expo,
            scrollTrigger: {
                trigger: "#booking",
                start: "top 90%",
                end: "top 10%",
                scrub: true
            }
        });

        gsap.from(".cta__inner .reveal-text", {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: CONFIG.duration.medium,
            scrollTrigger: {
                trigger: "#booking",
                start: "top 70%"
            }
        });
    };

    // S9: Footer
    const initFooter = () => {
        gsap.from(".footer .reveal-up", {
            y: 30,
            opacity: 0,
            stagger: 0.05,
            duration: CONFIG.duration.medium,
            scrollTrigger: {
                trigger: "footer",
                start: "top 95%"
            }
        });
    };

    // --- 4. EXECUTION ---
    initLoader(); // This will trigger initHero on completion
    initIntro();
    initRooms();
    initExperience();
    initGallery();
    initReviews();
    initLocation();
    initBooking();
    initFooter();

});
