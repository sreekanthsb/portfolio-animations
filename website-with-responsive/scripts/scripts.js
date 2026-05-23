$(document).ready(function () {
  gsap.registerPlugin(ScrollTrigger);

  // banner text animation starts

  const words = ["Design.", "Develop.", "Brand."];
  const wordEl = document.querySelector(".word");

  let wordIndex = 0;

  function typeWord(word) {
    return gsap.to(
      {},
      {
        duration: word.length * 0.2,
        onUpdate() {
          const chars = Math.floor(this.progress() * word.length);
          wordEl.textContent = word.slice(0, chars);
        },
      },
    );
  }

  function deleteWord(word) {
    return gsap.to(
      {},
      {
        duration: word.length * 0.05,
        onUpdate() {
          const chars = Math.floor((1 - this.progress()) * word.length);
          wordEl.textContent = word.slice(0, chars);
        },
      },
    );
  }

  function animateText() {
    const word = words[wordIndex];

    gsap
      .timeline({
        onComplete() {
          wordIndex = (wordIndex + 1) % words.length;
          animateText();
        },
      })
      .add(typeWord(word))
      .to({}, { duration: 0.6 })
      .add(deleteWord(word));
  }

  animateText();
  // banner text animation ends

  // banner button starts

  (() => {
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!canHover) return;

    const container = document.querySelector(".banner");
    const target = document.querySelector(".start-project-btn");

    gsap.set(target, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(target, "x", {
      duration: 0.6,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(target, "y", {
      duration: 0.6,
      ease: "power3.out",
    });

    container.addEventListener("mouseenter", () => {
      target.classList.add("is-active");
    });

    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const halfW = targetRect.width / 2;
      const halfH = targetRect.height / 2;

      // Clamp position inside container
      const x = gsap.utils.clamp(halfW, rect.width - halfW, mouseX);

      const y = gsap.utils.clamp(halfH, rect.height - halfH, mouseY);

      xTo(x);
      yTo(y);
    });

    container.addEventListener("mouseleave", () => {
      target.classList.remove("is-active");
      gsap.to(target, { x: rect.width / 2, y: rect.height / 2, duration: 0.4 });
    });
  })();

  // banner button ends

  // text color change starts

  (() => {
    const scrollText = document.querySelector(".scroll-text");
    if (!scrollText) return;

    const words = scrollText.textContent.trim().split(" ");

    scrollText.innerHTML = words
      .map((word) => `<span class="word">${word}</span>`)
      .join(" ");
  })();

  gsap.to(".scroll-text .word", {
    color: "#022F8E",
    stagger: {
      each: 0.05,
      from: "start",
    },
    scrollTrigger: {
      trigger: ".about-us p",
      start: "top center",
      end: "bottom center",
      scrub: true,
    },
  });
  // text color change ends

  // shape video animation starts

  const shape = document.querySelector(".shape-video");
  const about = document.querySelector(".about-us");

  gsap.to(shape, {
    scrollTrigger: {
      trigger: ".about-us",
      start: "top bottom",
      end: "center center ",
      invalidateOnRefresh: true,
      scrub: true,
    },

    y: () => {
      const shapeRect = shape.getBoundingClientRect();
      const aboutRect = about.getBoundingClientRect();

      const shapeCenter = shapeRect.top + shapeRect.height / 2;
      const aboutCenter = aboutRect.top + aboutRect.height / 2;

      return aboutCenter - shapeCenter;
    },

    scale: 0.3,
    opacity: 0.1,
    ease: "none",
  });

  // shape video animation ends

  // Get the video element
  var video = document.getElementById("shapeVideo");
  if (video) {
    video.playbackRate = 0.3; //
  }


  // video scroll animation
  gsap.to(".scroll-video", {
    width: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: ".video-section",
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
    },
  });
  // What We Do animtion

  gsap.from(".fade-up", {
    scrollTrigger: {
      trigger: ".fade-up",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: "power2.out",
    stagger: 0.3,
  });


  gsap.from(".fade-left", {
    scrollTrigger: {
      trigger: ".fade-left",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    x: -100,
    opacity: 0,
    duration: 1.5,
    ease: "power2.out",
    stagger: 0.4,
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

  let mm = gsap.matchMedia();

  mm.add("(min-width: 1025px)", () => {
    gsap.set(".img-card:not(.card-1)", { yPercent: 100 });

    gsap.set(".text-block:not(:first-child)", {
      opacity: 0,
      y: 30,
      autoAlpha: 0,
    });

    let tl = gsap.timeline({
      scrollTrigger: {
        start: "top top",
        end: "+=3000",
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        trigger: ".content-wrapper",
      },
    });

    // Animation for Card 2 & Text 2
    tl.to({}, { duration: 0.5 }); // small delay before starting next card animation
    tl.to(".card-2", { yPercent: 0, duration: 2 })
      .to(
        ".text-block:nth-child(1)",
        { opacity: 0, y: -30, autoAlpha: 0, duration: 1 },
        "<",
      )
      .to(
        ".text-block:nth-child(2)",
        { opacity: 1, y: 0, autoAlpha: 1, duration: 1 },
        "-=1",
      );

    // Animation for Card 3 & Text 3
    tl.to(".card-3", { yPercent: 0, duration: 2 })
      .to(
        ".text-block:nth-child(2)",
        { opacity: 0, y: -30, autoAlpha: 0, duration: 1 },
        "<",
      )
      .to(
        ".text-block:nth-child(3)",
        { opacity: 1, y: 0, autoAlpha: 1, duration: 1 },
        "-=1",
      );

    // Hover Effect
    document.querySelectorAll(".text-block").forEach((block, index) => {
      const h1 = block.querySelector("h1");
      const icon = h1.querySelector("img");
      const mainImg = document.querySelectorAll(".img-card img")[index];

      h1.addEventListener("mouseenter", () => {
        gsap.to(icon, { opacity: 1, x: 10, y: -10, duration: 0.4 });
        gsap.to(h1, { color: "#022f8e", duration: 0.3 });
        gsap.to(mainImg, { filter: "grayscale(0%)", scale: 1.05, duration: 0.4 });
      });

      h1.addEventListener("mouseleave", () => {
        gsap.to(icon, { opacity: 0, x: -10, y: 0, duration: 0.4 });
        gsap.to(h1, { color: "#000", duration: 0.3 });
        gsap.to(mainImg, { filter: "grayscale(100%)", scale: 1, duration: 0.4 });
      });
    });
  });


  //   testimonials section

  const data = [
    {
      img: "img/te-1.png",
      quote: "The quality of work is second to none.",
      name: "Tim Bowden",
      role: "Managing Director",
    },
    {
      img: "img/te-2.png",
      quote: "Outstanding service and great support.",
      name: "Sarah Lee",
      role: "Product Manager",
    },
    {
      img: "img/te-3.png",
      quote: "Professional team with amazing results.",
      name: "Alex Smith",
      role: "CEO",
    },
  ];

  const mainImg = document.getElementById("mainImg");
  const quote = document.getElementById("quote");
  const nameEl = document.getElementById("name");
  const roleEl = document.getElementById("role");
  const thumbs = document.querySelectorAll(".thumb");

  let currentIndex = 0;
  let interval;

  function showTestimonial(index) {
    gsap.to([mainImg, quote, nameEl, roleEl], {
      opacity: 0,
      y: 20,
      duration: 0.25,
      onComplete: () => {
        mainImg.src = data[index].img;
        quote.innerText = data[index].quote;
        nameEl.innerText = data[index].name;
        roleEl.innerText = data[index].role;

        gsap.to([mainImg, quote, nameEl, roleEl], {
          opacity: 1,
          y: 0,
          duration: 0.35,
        });
      },
    });

    thumbs.forEach((t) => t.classList.remove("active"));
    thumbs[index].classList.add("active");

    currentIndex = index;
  }

  // 🖱️ thumb click
  thumbs.forEach((thumb, i) => {
    thumb.addEventListener("click", () => {
      clearInterval(interval); // manual click cheythal autoplay reset
      showTestimonial(i);
      startAutoPlay();
    });
  });

  // ⏱️ autoplay every 5 seconds
  function startAutoPlay() {
    interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % data.length;
      showTestimonial(nextIndex);
    }, 5000);
  }

  // 🚀 start autoplay
  startAutoPlay();

  // whychoose us section animation starts

  /* ACCORDION ANIMATION */


  document.querySelectorAll(".accordion-collapse").forEach((collapse) => {

    collapse.addEventListener("show.bs.collapse", () => {
      const text = collapse.querySelector(".acc-text");

      // Prepare state
      gsap.set(text, {
        opacity: 0,
        filter: "blur(8px)"
      });
    });

    collapse.addEventListener("shown.bs.collapse", () => {
      const text = collapse.querySelector(".acc-text");

      // Fade + sharpen
      gsap.to(text, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.5,
        ease: "power2.out"
      });
    });

  });


  // accordion image swap
  const featureImage = document.getElementById("featureImage");
  const accordionItems = document.querySelectorAll("#whyUsAccordion .accordion-item");

  accordionItems.forEach((item) => {
    const collapseEl = item.querySelector(".accordion-collapse");

    collapseEl.addEventListener("show.bs.collapse", () => {
      const newImage = item.getAttribute("data-image");

      if (featureImage.src.includes(newImage)) return;

      gsap.to(featureImage, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          featureImage.src = newImage;

          gsap.to(featureImage, {
            opacity: 1,
            duration: 0.25,   // 👈 reduced from 0.5 to 0.25
            ease: "power3.out",
          });
        },
      });
    });
  });



  /* animate accordion items */
  gsap.from(".whycoose-us-accordion .accordion-item", {
    scrollTrigger: {
      trigger: ".whycoose-us-accordion",
      start: "top 80%",
    },
    y: 40,
    opacity: 0,
    stagger: 0.2,
    duration: 0.8,
    ease: "power3.out",
  });

  // brands section animation
  document.querySelectorAll(".brands__item").forEach((column, index) => {
    const logos = column.querySelectorAll("img");
    const isEven = index % 2 === 0;
    const randomOffset = gsap.utils.random(["-200%", "200%"]);

    const tl = gsap.timeline({
      repeat: -1,
      delay: -index * 0.5,
    });

    logos.forEach((logo) => {
      tl.to(logo, {
        keyframes: [
          {
            x: isEven ? 0 : randomOffset,
            y: isEven ? randomOffset : 0,
            duration: 0.3,
          },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          {
            delay: 2.5,
            x: isEven ? randomOffset : 0,
            y: isEven ? 0 : randomOffset,
            duration: 0.3,
            ease: "power2.in",
          },
        ],
      }).set(logo, { autoAlpha: 0 });
    });
  });
  // book section animation
  const section = document.querySelector(".interactive-section");
  const cursor = document.querySelector(".custom-cursor");

  section.addEventListener("mouseenter", () => {
    gsap.to(cursor, { opacity: 1, duration: 0.2 });
  });

  section.addEventListener("mouseleave", () => {
    gsap.to(cursor, { opacity: 0, duration: 0.2 });
  });

  section.addEventListener("mousemove", (e) => {
    const rect = section.getBoundingClientRect();

    gsap.to(cursor, {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      duration: 0.15,
      ease: "power3.out",
    });
  });

  // end book now animations
  // footer animation
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".footer", {
    y: 20,
    opacity: 0,
    duration: 1.3,
    ease: "back.out(1.15)",
    scrollTrigger: {
      trigger: ".footer",
      start: "top 90%",
      once: true,
    },
  });

  // end footer animation

});

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});

