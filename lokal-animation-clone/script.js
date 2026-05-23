gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function splitWords(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    if (el.dataset.splitReady) return;
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map((word) => `<span class="line"><span class="line-inner">${word}&nbsp;</span></span>`)
      .join("");
    el.dataset.splitReady = "true";
  });
}

function heroAnimation() {
  splitWords(".hero .js-split");

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(".site-header", {
    y: -28,
    opacity: 0,
    duration: 0.7
  })
    .to(".hero .line-inner", {
      y: 0,
      duration: 1,
      stagger: 0.035
    }, "-=0.25")
    .from(".hero .js-reveal", {
      y: 26,
      opacity: 0,
      duration: 0.75,
      stagger: 0.1
    }, "-=0.55")
    .from(".phone-card", {
      y: 60,
      scale: 0.92,
      opacity: 0,
      rotate: -3,
      duration: 1.1,
      stagger: 0.12,
      ease: "expo.out"
    }, "-=0.8");

  gsap.to(".js-hero-media", {
    y: -90,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.6
    }
  });
}

function revealLines() {
  splitWords(".js-split:not(.hero .js-split)");

  document.querySelectorAll(".js-split:not(.hero .js-split)").forEach((el) => {
    gsap.to(el.querySelectorAll(".line-inner"), {
      y: 0,
      duration: 0.95,
      stagger: 0.035,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 78%",
        once: true
      }
    });
  });
}

function revealBasic() {
  gsap.utils.toArray(".js-reveal:not(.hero .js-reveal)").forEach((el) => {
    gsap.fromTo(el,
      { y: 28, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true
        }
      }
    );
  });
}

function staggerCards() {
  gsap.utils.toArray(".js-stagger").forEach((group) => {
    const cards = group.children;

    gsap.fromTo(cards,
      { y: 70, opacity: 0, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: group,
          start: "top 78%",
          once: true
        }
      }
    );

    gsap.fromTo(group.querySelectorAll(".card__media, .news-card__image"),
      { clipPath: "inset(18% 0 18% 0 round 22px)", scale: 1.08 },
      {
        clipPath: "inset(0% 0 0% 0 round 22px)",
        scale: 1,
        duration: 1,
        stagger: 0.09,
        ease: "expo.out",
        scrollTrigger: {
          trigger: group,
          start: "top 78%",
          once: true
        }
      }
    );
  });
}

function splitMotion() {
  gsap.fromTo(".js-from-left",
    { x: -80, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".split-section",
        start: "top 75%",
        once: true
      }
    }
  );

  gsap.fromTo(".js-from-right",
    { x: 80, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.9,
      delay: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".split-section",
        start: "top 75%",
        once: true
      }
    }
  );
}

function counters() {
  document.querySelectorAll(".js-stat").forEach((stat) => {
    const number = stat.querySelector("[data-count]");
    const target = Number(number.dataset.count);

    gsap.fromTo(stat,
      { y: 40, opacity: 0, scale: 0.94 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: stat,
          start: "top 82%",
          once: true,
          onEnter: () => {
            gsap.to(number, {
              innerText: target,
              duration: 1.6,
              ease: "power2.out",
              snap: { innerText: 1 }
            });
          }
        }
      }
    );
  });
}

function footerReveal() {
  gsap.from(".js-footer", {
    opacity: 0,
    y: 30,
    duration: 0.7,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".js-footer",
      start: "top 92%",
      once: true
    }
  });
}

function initAnimations() {
  splitWords(".js-split");

  if (reduceMotion) {
    document.querySelectorAll(".line-inner").forEach((el) => {
      el.style.transform = "none";
    });
    return;
  }

  heroAnimation();
  revealLines();
  revealBasic();
  staggerCards();
  splitMotion();
  counters();
  footerReveal();
  ScrollTrigger.refresh();
}

window.addEventListener("DOMContentLoaded", initAnimations);
