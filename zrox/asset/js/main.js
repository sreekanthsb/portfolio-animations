gsap.registerPlugin(ScrollTrigger);

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".banner-section",
    start: "top top",
    end: "+=150%",
    scrub: true,
    pin: true,
  },
});

tl.to(".banner-section h1", {
  opacity: 0,
  y: -30,
  stagger: 0.05,
  duration: 1,
});

tl.to(
  ".video-section",
  {
    gap: 0,
    duration: 0.5,
  },
  "<",
);

tl.to(
  ".video-wrapper",
  {
    position: "absolute",
    left: "50%",
    top: "50%",
    xPercent: -50,
    yPercent: -50,
    width: "100vw",
    height: "100vh",
    borderRadius: 0,
    duration: 1.5,
    ease: "power2.inOut",
  },
  "-=0.5",
);

tl.to(
  ".video-wrapper video",
  {
    borderRadius: 0,
    scale: 1,
    duration: 1.5,
  },
  "<",
);

// why choose us animation


// why choose us paragraph animation

const textElement = document.querySelector("#reveal-text");
const textContent = textElement.textContent.trim();
textElement.innerHTML = "";

// Words split cheyyunnu
const words = textContent.split(/\s+/);

words.forEach((word) => {
  // Oro word-ineyum oru span-il aakkunnu
  const wordSpan = document.createElement("span");
  wordSpan.style.whiteSpace = "nowrap";
  wordSpan.style.display = "inline";

  // Word-ile letters-ine span aakkunnu
  word.split("").forEach((char) => {
    const charSpan = document.createElement("span");
    charSpan.textContent = char;
    charSpan.className = "char";
    wordSpan.appendChild(charSpan);
  });

  textElement.appendChild(wordSpan);

  // Word kazhinju oru normal space add cheyyunnu
  textElement.appendChild(document.createTextNode(" "));
});

// GSAP Animation
gsap.to(".char", {
  color: "#000", // Final color black
  stagger: 0.02,
  scrollTrigger: {
    trigger: "#reveal-text",
    start: "top 85%",
    end: "top 5%",
    scrub: true,
  },
});

// get-to-know
gsap.utils.toArray(".fade-in-text").forEach((element) => {
  gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      toggleActions: "play none none reverse",
      markers: false,
    },
    opacity: 0,
    y: 30,
    duration: 1,
    ease: "power2.out"
  });
});

gsap.utils.toArray(".fade-left").forEach((element) => {
  gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      toggleActions: "play none none reverse",
      markers: false,
    },
    x: -100,
    opacity: 0,
    duration: 1.5,
    ease: "power2.out"
  })
});


gsap.from(".fade-right", {
  scrollTrigger: {
    trigger: ".fade-right",
    start: "top 80%",
    toggleActions: "play none none reverse",
  },
  x: 100,
  opacity: 0,
  duration: 1.5,
  ease: "power2.out",
  stagger: 0.4,
});

gsap.to(".get-to-know-img-section img", {
  y: -200,
  ease: "none",
  scrollTrigger: {
    trigger: ".get-to-know-img-section",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  },
});

tl.to(".get-to-know-img-section img", {
  yPercent: 10,
  duration: 2,
});

gsap.registerPlugin(ScrollTrigger);

gsap.to(".reveal-img", {
  height: "100%",
  ease: "none",
  scrollTrigger: {
    trigger: ".image-wrapper",
    start: "top 80%",
    end: "top 20%",
    scrub: true,
    markers: false,
  },
});

const imgtl = gsap.timeline({
  scrollTrigger: {
    trigger: ".full-img",
    start: "top-=800 top",
    end: "+=300",
    // pin: true,
    scrub: 1,
    stagger: 0.1,
    // markers: true,
  },
});

imgtl
  .to(".part-1", {
    clipPath: "inset(0 66.66% 0 0)",
    ease: "none",
  })
  .to(".part-1", {
    clipPath: "inset(0 33.33% 0 0)",
    ease: "none",
  })
  .to(".part-1", {
    clipPath: "inset(0 0% 0 0)",
    ease: "none",
  });

gsap.from(".logo-circle", {
  y: -300,
  opacity: 0,
  duration: 1.2, // Animation time
  stagger: 0.15,
  ease: "bounce.out",
  scrollTrigger: {
    trigger: ".tech-logos",
    start: "top 75%",
    // markers: true
    // scrub: 1,
    stagger: 0.3,
  },
});
gsap.registerPlugin(ScrollTrigger);

// Oro card-ineyum loop cheythu animate cheyyaam
gsap.utils.toArray(".card").forEach((card) => {
  const overlay = card.querySelector(".black-overlay");
  const image = card.querySelector("img");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: card,
      start: "top 80%", // Scroll cheythu card 80% ethumbol thudangan
      toggleActions: "play none none none",
      // scrub: 1,
      stagger: 0.3,
    },
  });

  tl.to(overlay, {
    width: "100%",
    duration: 0.4,
    ease: "power2.inOut",
  })
    .set(image, { opacity: 1 }) // Black box full aayappol image show cheyyunnu
    .to(overlay, {
      xPercent: 101, // Box valathottu neengi image thurannu varunnu
      duration: 0.4,
      ease: "power2.inOut",
    });
});
// gsap.registerPlugin(ScrollTrigger);

// let sections = gsap.utils.toArray(".icon-bx-wraper");
// let circle = document.querySelector(".rotating-circle");

// sections.forEach((section, i) => {
//   ScrollTrigger.create({
//     trigger: section,
//     start: "top center",
//     end: "+=200%",
//     scrub: true,
//     onEnter: () => {
//       gsap.to(circle, { rotation: i * -90, duration: 0.6, ease: "power2.inOut" });
//       updateActiveState(i + 1);
//     },
//     onEnterBack: () => {
//       gsap.to(circle, { rotation: i * -90, duration: 0.6, ease: "power2.inOut" });
//       updateActiveState(i + 1);
//     }
//   });
// });

// function updateActiveState(index) {
//   console.log("Active Section:", index);
// }
