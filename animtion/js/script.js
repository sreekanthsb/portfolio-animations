// logo animation
gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);
gsap.fromTo(
  ".logo img",
  { y: -180, opacity: 0, duration: 1, scale: 0 },
  { y: 0, opacity: 1, duration: 1, scale: 1 },
);
// logo animation end
// nav animation

const navItems = gsap.utils.toArray(".main-nav li");

navItems.forEach((item, index) => {
  gsap.fromTo(
    item,
    { y: -180, opacity: 0, duration: 1, scale: 0 },
    { y: 0, opacity: 1, duration: 1, scale: 1, delay: 0.5 + index * 0.5 },
  );
});
// nav animation end
// nav obile animation start
// Mobile menu animation
const ham = document.querySelector(".ham");
const mobileMenu = document.querySelector(".mobile-menu ul"); 
const mobileLinks = mobileMenu.querySelectorAll("li");

var tlMobile = gsap.timeline({ paused: true });

tlMobile.to(mobileMenu, {
  duration: 1,
  opacity: 1,
  height: "80vh",
  zIndex: 99, 
  pointerEvents: "auto",
  ease: "expo.inOut",
});

tlMobile.from(
  mobileLinks,
  {
    duration: 1,
    opacity: 0,
    y: 20,
    stagger: 0.1,
    ease: "expo.inOut",
  },
  "-=0.5"
);

tlMobile.reverse();

ham.addEventListener("click", () => {
  tlMobile.reversed(!tlMobile.reversed());
});
// nav mobile animation end
// header text
// Header Content Animation (h1 and p)
const headerH1 = document.querySelector(".header-content h1");
const headerP = document.querySelector(".header-content p");
const headerBtn = document.querySelector(".header-content button");

const splitH1 = new SplitText(headerH1, { type: "words, chars" });
const splitP = new SplitText(headerP, { type: "words" }); 

const headerTL = gsap.timeline({ delay: 2 });

headerTL.from(splitH1.chars, {
  opacity: 0,
  x: 50,
  stagger: 0.05,
  duration: 0.8,
  ease: "power2.out",
});

headerTL.from(splitP.words, {
  opacity: 0,
  y: 20,
  stagger: 0.02,
  duration: 0.8,
  ease: "power2.out",
}, "-=0.4"); 

headerTL.from(headerBtn, {
  opacity: 0,
  scale: 0.8,
  duration: 0.5,
  ease: "back.out(1.7)"
}, "-=0.2");
// header text end
gsap.to(".features", {
  x: 0,
  scale: 1,
  opacity: 1,
  duration: 4,
  ease: "power2.inOut",
  scrollTrigger: {
    trigger: ".features",
    start: "top",
    end: "800",
    scrub: 1,
    pin: true,
    // markers: true,
  },
});

gsap.registerPlugin(ScrollTrigger);

const featurestl = gsap.timeline({
  scrollTrigger: {
    trigger: ".features",
    start: "top top",      
    end: "+=1500",         
    scrub: 1,              
    // pin: true,             
  }
});

featurestl.to(".features-title", {
  scale: 0.8,
  opacity: 1,
  duration: 2
}, 0);

featurestl.from(".img-1", { x: "-200%", y: "-150%", opacity: 0 }, 0)
  .from(".img-2", { x: "0%", y: "-200%", opacity: 0 }, 0)
  .from(".img-3", { x: "200%", y: "-150%", opacity: 0 }, 0)
  .from(".img-4", { x: "-150%", y: "150%", opacity: 0 }, 0)
  .from(".img-5", { x: "150%", y: "150%", opacity: 0 }, 0);


const StackingEffect = gsap.timeline({
  scrollTrigger: {
    trigger: ".services-list",
    start: "top top",
    end: "+=1200",
    scrub: 1,
    pin: true,
    // markers: true,
  },
});

gsap.utils.toArray(".services-list h4").forEach((item, i) => {
  if (i === 0) {
    StackingEffect.from(
      item,
      {
        y: 50,
        duration: 1.2,
        ease: "power2.out",
      },
      0,
    );
  } else {
    StackingEffect.from(
      item,
      {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
      },
      i * 1.5,
    );
  }
});

gsap.to(".container", {
  opacity: 1,
  y: 0,
  duration: 1,
  ease: "power2.out",
});

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".clients",
    start: "top top",
    end: "+=2000", // Scroll length
    scrub: 1,
    pin: true,
  },
});

const cards = gsap.utils.toArray(".client-item");

cards.forEach((card, i) => {
  if (i > 0) {
    tl.fromTo(
      card,
      {
        yPercent: 150,
        opacity: 0,
      },
      {
        yPercent: i * 15,
        opacity: 1,
        duration: 1,
        ease: "none",
      },
      i * 1, // Timing gap
    );
  }
});

const ClientTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".clients2",
    start: "top top",
    end: "+=2500",
    scrub: 1,
    pin: true,
  },
});

const items = gsap.utils.toArray(".client-item2");

items.forEach((item, i) => {
  gsap.set(item, {
    y: i * -5,
    scale: 1 - i * 0.03,
    opacity: i === 0 ? 1 : 0.8,
    zIndex: items.length - i,
  });
});

items.forEach((item, i) => {
  if (i !== 0) {
    ClientTimeline.to(
      item,
      {
        y: i * 230,
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
      },
      i * 0.8,
    );
  }
});

// const ClientTimeline = gsap.timeline({
//   scrollTrigger: {
//     trigger: ".clients2",
//     start: "top top",
//     end: "+=2000",
//     scrub: 1,
//     pin: true,
//     markers: true,
//   },
// });

// const items = gsap.utils.toArray(".client-item2");

// items.forEach((item, i) => {
//   if (i !== 0) {
//     ClientTimeline.fromTo(item,
//       {
//         y: 0,
//         opacity: 0
//       },
//       {
//         y: i * 220,
//         opacity: 1,
//         duration: 1.5,
//         ease: "power2.out"
//       },
//       i * 0.8
//     );
//   }
// });

// Change background color on hover
// const body = document.body;

// body.addEventListener("mouseover", () => {
//   gsap.to(body, {
//     background: "linear-gradient(45deg, #ff6a00, #ee0979)",
//     duration: 0.5,
//     ease: "power2.inOut",
//   });
// });

// body.addEventListener("mouseout", () => {
//   gsap.to(body, {
//     background: "linear-gradient(45deg, #6a11cb, #2575fc)",
//     duration: 0.5,
//     ease: "power2.inOut",
//   });
// });
