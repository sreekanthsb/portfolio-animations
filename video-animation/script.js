// ============================================================
// AirPods Pro — GSAP Animation Controller
// Cross-browser · Responsive · Post-video sequenced
// ============================================================

// 1. Register Plugins
gsap.registerPlugin(ScrollTrigger);

// Safe SplitText registration (available after SplitText CDN loads)
if (typeof SplitText !== "undefined") {
  gsap.registerPlugin(SplitText);
}

// ============================================================
// Utility: Reduced-motion check (accessibility)
// ============================================================
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// ============================================================
// 1. Navbar Load Animation
// ============================================================
if (!prefersReducedMotion) {
  const navTl = gsap.timeline({
    defaults: { ease: "power4.out", duration: 1.2 },
  });

  navTl
    .from(".logo", { opacity: 0, x: -20, delay: 0.3 })
    .from(
      "nav ul li",
      { opacity: 0, y: 20, stagger: 0.1, duration: 0.8 },
      "-=0.8"
    );
}

// ============================================================
// 2. Video Scroll Scrub  +  Post-video Text Sequence
// ============================================================
const coolVideo = document.querySelector(".video-src");

// Detect touch/mobile for video fallback
function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0)
  );
}

// Video timeline (scrub)
let vidtl = gsap.timeline({
  scrollTrigger: {
    trigger: ".vid",
    start: "top top",
    end: "5000 bottom",
    scrub: true,
    pin: true,
    anticipatePin: 1,
  },
});

coolVideo.addEventListener("loadedmetadata", function () {
  vidtl.to(coolVideo, { currentTime: coolVideo.duration });
});

// Touch devices: kick-start video so it's decodable
if (isTouchDevice()) {
  coolVideo.play();
  coolVideo.pause();
}

// ============================================================
// Helper: build text animations AFTER video section
// We wait for fonts AND for ScrollTrigger to acknowledge
// the pinned video before creating subsequent pins.
// ============================================================
function buildTextAnimations() {
  if (typeof SplitText === "undefined") {
    console.warn("SplitText not loaded — skipping word/char/line animations.");
    return;
  }

  // --- air-title ---
  const airTitleTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".air-title",
      start: "top center",
      end: "+=800",
      scrub: true,
      pin: true,
    },
  });
  airTitleTL
    .to(".air-title", { opacity: 1, scale: 1.2, duration: 3, ease: "none" })
    .to(".air-title", { opacity: 0, scale: 3, duration: 3, ease: "none" });

  // --- sub-title ---
  const subTitleTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".sub-title",
      start: "top center",
      end: "+=800",
      scrub: true,
      pin: true,
    },
  });
  subTitleTL
    .to(".sub-title", { opacity: 1, scale: 1.2, duration: 3, ease: "none" })
    .to(".sub-title", { opacity: 0, scale: 2.5, duration: 3, ease: "none" });

  // --- .pra  (word split) ---
  const praSplit = SplitText.create(".pra", { type: "words", aria: "hidden" });
  const praTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".pra",
      start: "top center",
      end: "+=900",
      scrub: true,
      pin: true,
    },
  });
  praTL
    .from(praSplit.words, {
      y: -500,
      opacity: 0,
      duration: 2,
      ease: "power2.inOut",
      stagger: 0.1,
    })
    .to(".pra", { y: -500, duration: 1, ease: "power2.inOut" })
    .to(".pra", { y: -100, opacity: 0, duration: 1, ease: "power2.inOut" });

  // --- .newpra  (char split) ---
  const newpraSplit = SplitText.create(".newpra", {
    type: "chars",
    aria: "hidden",
  });
  const newpraTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".newpra",
      start: "top center",
      end: "+=1000",
      scrub: 0.5,
      pin: true,
    },
  });
  newpraTL
    .from(newpraSplit.chars, {
      y: 900,
      opacity: 0,
      duration: 2,
      ease: "power2.inOut",
      stagger: 0.1,
    })
    .to(".newpra", { y: -500, duration: 1, ease: "power2.inOut" })
    .to(".newpra", { y: -800, opacity: 0, duration: 1, ease: "power2.inOut" });

  // --- .Lines  (line split) ---
  const linesSplit = SplitText.create(".Lines", {
    type: "lines",
    aria: "hidden",
  });
  const linesTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".Lines",
      start: "top center",
      end: "+=1000",
      scrub: 0.5,
      pin: true,
    },
  });
  linesTL
    .from(linesSplit.lines, {
      y: 900,
      opacity: 0,
      duration: 2,
      ease: "power2.inOut",
      stagger: 0.1,
    })
    .to(".Lines", { y: -500, duration: 1, ease: "power2.inOut" })
    .to(".Lines", { y: -800, opacity: 0, duration: 1, ease: "power2.inOut" });

  // Final refresh after all pins registered
  ScrollTrigger.refresh();
}

// Wait for fonts → then build text animations
document.fonts.ready.then(buildTextAnimations);

// ============================================================
// 3. Dark Bridge Section
// ============================================================
const bridgeTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#darkBridge",
    start: "top 80%",
    toggleActions: "play none none reverse",
  },
});

bridgeTl
  .to(".dark-bridge__label", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power4.out",
  })
  .to(
    ".dark-bridge__headline",
    { opacity: 1, duration: 0.1, ease: "none" },
    "-=0.4"
  )
  .from(
    ".dark-bridge__headline div",
    {
      opacity: 0,
      y: 50,
      stagger: 0.15,
      duration: 1.2,
      ease: "power4.out",
    },
    "-=0.3"
  )
  .to(
    ".dark-bridge__body",
    { opacity: 1, duration: 1.2, ease: "power4.out" },
    "-=0.8"
  );

// ============================================================
// 4. Feature Section  (image-left / content-right)
// ============================================================
const featureTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".feature",
    start: "top 75%",
    toggleActions: "play none none reverse",
  },
});

featureTl
  .to(".feature__media-inner", {
    opacity: 1,
    x: 0,
    duration: 1.2,
    ease: "power3.out",
  })
  .to(
    ".feature__content",
    { opacity: 1, x: 0, duration: 1.2, ease: "power3.out" },
    "-=0.8"
  );

// ============================================================
// 5. Product Detail Section  (stats counter)
// ============================================================
const detailTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".product-detail",
    start: "top 70%",
    toggleActions: "play none none reverse",
  },
});

detailTl
  .to(".product-detail__label", {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power4.out",
  })
  .to(
    ".product-detail__headline",
    { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" },
    "-=0.3"
  )
  .to(
    ".product-detail__body",
    { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" },
    "-=0.5"
  )
  .to(
    ".product-detail__stat",
    {
      opacity: 1,
      y: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "back.out(1.7)",
    },
    "-=0.4"
  );

// ============================================================
// 6. Stat counter animation
// ============================================================
document.querySelectorAll(".product-detail__stat-value").forEach((el) => {
  const target = parseFloat(el.dataset.target);
  ScrollTrigger.create({
    trigger: el,
    start: "top 85%",
    once: true,
    onEnter() {
      gsap.fromTo(
        el,
        { innerText: 0 },
        {
          innerText: target,
          duration: 1.5,
          ease: "power2.out",
          snap: { innerText: target < 10 ? 0.1 : 1 },
          onUpdate() {
            el.innerText =
              target < 10
                ? parseFloat(el.innerText).toFixed(0)
                : Math.round(el.innerText);
          },
        }
      );
    },
  });
});

// ============================================================
// 7. Responsive: Rebuild on resize (debounced)
// ============================================================
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh(true);
  }, 250);
});