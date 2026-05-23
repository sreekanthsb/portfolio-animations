document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initAnimations();
    initCursor();
    initTilt();
    initParallax();
    initScrollReveal();
    initFAQ();
    initMobileMenu();
});

/* --- Particle System --- */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            this.color = 'rgba(255, 255, 255, 0.3)';
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                this.x += directionX;
                this.y += directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 20;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 20;
                }
            }
        }
    }

    function init() {
        particles = [];
        const numberOfParticles = (canvas.width * canvas.height) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
            particles[i].update();
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();
}

/* --- GSAP Animations --- */
function initAnimations() {
    // Preserve span tags but split other text into words
    const heroTitle = document.getElementById('hero-title');
    const nodes = Array.from(heroTitle.childNodes);
    let newContent = '';

    nodes.forEach(node => {
        if (node.nodeType === 3) { // Text node
            const words = node.textContent.trim().split(/\s+/);
            if (words[0] !== "") {
                newContent += words.map(word => 
                    `<span class="word"><span class="word-inner">${word}</span></span>`
                ).join(' ');
            }
        } else if (node.nodeType === 1) { // Element node (the highlight span)
            const word = node.innerText;
            newContent += ` <span class="word highlight"><span class="word-inner">${word}</span></span> `;
        }
    });
    heroTitle.innerHTML = newContent;

    const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 2 } });

    tl.from('.word-inner', {
        y: 100,
        rotate: 10,
        stagger: 0.1,
        opacity: 0,
        filter: "blur(15px)",
    }, 0.5);

    tl.from('.highlight', {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1.5,
        ease: "power4.inOut"
    }, 1.2);

    tl.from('.hero-description', {
        y: 30,
        opacity: 0,
        duration: 1.5,
        filter: "blur(5px)"
    }, 1.5);

    tl.from('.hero-cta .btn', {
        y: 20,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2
    }, 1.8);

    tl.from('.food-layer', {
        scale: 0.8,
        opacity: 0,
        stagger: 0.3,
        duration: 2.5,
        ease: "elastic.out(1, 0.75)"
    }, 1);

    // Header reveal
    tl.from('.header', {
        y: -100,
        opacity: 0,
        duration: 1.5
    }, 0.2);

    // Background glows animation
    gsap.to('.glow-1', {
        x: '20%',
        y: '10%',
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    gsap.to('.glow-2', {
        x: '-15%',
        y: '-20%',
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    gsap.to('.glow-3', {
        x: '10%',
        y: '-10%',
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
}

/* --- Custom Cursor --- */
function initCursor() {
    const dot = document.getElementById('cursor-dot');
    const follower = document.getElementById('cursor-follower');
    
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let followerX = 0, followerY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function render() {
        dotX += (mouseX - dotX) * 0.2;
        dotY += (mouseY - dotY) * 0.2;
        
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        dot.style.transform = `translate(${dotX}px, ${dotY}px)`;
        follower.style.transform = `translate(${followerX}px, ${followerY}px)`;

        requestAnimationFrame(render);
    }
    render();

    // Hover effects
    const interactiveElements = document.querySelectorAll('button, a, .food-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.style.width = '80px';
            follower.style.height = '80px';
            follower.style.backgroundColor = 'rgba(255, 77, 0, 0.1)';
            follower.style.borderColor = 'var(--accent)';
        });
        el.addEventListener('mouseleave', () => {
            follower.style.width = '40px';
            follower.style.height = '40px';
            follower.style.backgroundColor = 'transparent';
            follower.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        });
    });
}

/* --- 3D Tilt Effect --- */
function initTilt() {
    const cards = document.querySelectorAll('.food-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            const img = card.querySelector('.food-img');
            img.style.transform = `translateZ(50px) translateX(${(x - centerX) / 15}px) translateY(${(y - centerY) / 15}px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            const img = card.querySelector('.food-img');
            img.style.transform = `translateZ(50px) translateX(0) translateY(0)`;
        });
    });
}

/* --- Parallax & Floating --- */
function initParallax() {
    const layers = document.querySelectorAll('.food-layer');
    let mouseX = 0, mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) / 100;
        mouseY = (e.clientY - window.innerHeight / 2) / 100;
    });

    function animate() {
        layers.forEach((layer, index) => {
            const depth = parseFloat(layer.getAttribute('data-depth'));
            const moveX = mouseX * depth * 50;
            const moveY = mouseY * depth * 50;
            
            // Add subtle floating oscillation
            const time = Date.now() * 0.001;
            const floatX = Math.sin(time + index) * 10;
            const floatY = Math.cos(time + index) * 10;
            const rotation = Math.sin(time * 0.5 + index) * 5;

            layer.style.transform = `translate3d(${moveX + floatX}px, ${moveY + floatY}px, 0) rotate(${rotation}deg)`;
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* --- Scroll Reveal Animations --- */
function initScrollReveal() {
    gsap.registerPlugin(ScrollTrigger);

    const revealElements = document.querySelectorAll('[data-scroll-reveal]');
    
    revealElements.forEach((el) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out"
        });
    });

    // Staggered reveal for services
    gsap.to('.service-card', {
        scrollTrigger: {
            trigger: '.services-grid',
            start: "top 80%",
        },
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "power4.out"
    });
}

/* --- FAQ Logic --- */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}
