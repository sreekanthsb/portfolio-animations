// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    const imageFallbackUrl = 'https://via.placeholder.com/800x600?text=Image+Unavailable';

    const applyImageFallback = (img) => {
        if (!img) return;
        img.addEventListener('error', () => {
            if (img.src !== imageFallbackUrl) {
                img.src = imageFallbackUrl;
            }
        }, { once: true });
    };

    const applyAllImageFallbacks = () => {
        document.querySelectorAll('img').forEach(applyImageFallback);
    };

    // Apply fallback for static and dynamic images
    applyAllImageFallbacks();

    // ==========================================
    // 1. SMOOTH SCROLLING (LENIS)
    // ==========================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000) });
    gsap.ticker.lagSmoothing(0);

    // ==========================================
    // 2. HEADER SCROLL EFFECT
    // ==========================================
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('glass-dark', 'py-3', 'shadow-2xl');
            header.classList.remove('py-5', 'bg-transparent');
        } else {
            header.classList.remove('glass-dark', 'py-3', 'shadow-2xl');
            header.classList.add('py-5', 'bg-transparent');
        }
    });

    // ==========================================
    // 3. THREE.JS BACKGROUND (Subtle Particles)
    // ==========================================
    const initThreeJS = () => {
        const canvas = document.getElementById('three-canvas');
        if (!canvas) return;
        
        const scene = new THREE.Scene();
        // Set camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Set renderer
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create particles
        const particlesCount = 200;
        const positions = new Float32Array(particlesCount * 3);
        const sizes = new Float32Array(particlesCount);
        
        for (let i = 0; i < particlesCount; i++) {
            // position
            positions[i * 3] = (Math.random() - 0.5) * 20; // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
            
            // size
            sizes[i] = Math.random() * 1.5;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        
        // Simple circle texture
        const texCanvas = document.createElement('canvas');
        texCanvas.width = 16;
        texCanvas.height = 16;
        const ctx = texCanvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(8, 8, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#8dc59e';
        ctx.fill();
        const texture = new THREE.CanvasTexture(texCanvas);

        const material = new THREE.PointsMaterial({
            size: 0.15,
            map: texture,
            transparent: true,
            opacity: 0.3,
            alphaTest: 0.01,
            sizeAttenuation: true,
            color: '#8dc59e'
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        let clock = new THREE.Clock();

        // Mouse interact
        let mouseX = 0;
        let mouseY = 0;
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        const animate = () => {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Animate particles floating slowly
            const positionsArr = particles.geometry.attributes.position.array;
            for(let i = 0; i < particlesCount; i++) {
                const i3 = i * 3;
                // slow sine wave on y and x
                positionsArr[i3 + 1] += Math.sin(elapsedTime * 0.5 + positionsArr[i3]) * 0.002;
                positionsArr[i3] += Math.cos(elapsedTime * 0.3 + positionsArr[i3+1]) * 0.001;
            }
            particles.geometry.attributes.position.needsUpdate = true;
            
            // Slow rotation
            particles.rotation.y = elapsedTime * 0.02;

            // Mouse parallax effect
            camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };

        animate();

        // Handle Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    };
    initThreeJS();

    // ==========================================
    // 4. GSAP ANIMATIONS
    // ==========================================
    gsap.registerPlugin(ScrollTrigger);
    
    // Default animation config
    const defaultReveal = {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
    };

    // --- Hero Section ---
    const heroTl = gsap.timeline({delay: 0.2});
    heroTl.from('.hero-elem', {
        ...defaultReveal,
        stagger: 0.15
    })
    .from('.hero-image-wrap', {
        opacity: 0,
        scale: 0.8,
        duration: 1.2,
        ease: 'expo.out'
    }, "-=0.5")
    .from('.hero-floating-1', {
        opacity: 0,
        x: 50,
        duration: 0.8,
        ease: 'back.out(1.5)'
    }, "-=0.6")
    .from('.hero-floating-2', {
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: 'back.out(1.5)'
    }, "-=0.6");

    // ==========================================
    // --- CATEGORIES SECTION (Advanced) ---
    // ==========================================

    // --- 1. Heading Blur + Jump Reveal ---
    const catHeadingLines = document.querySelectorAll('.cat-heading-line');
    if (catHeadingLines.length) {
        // Set initial state: invisible, blurred, shifted down
        gsap.set(catHeadingLines, { opacity: 0, y: 40, filter: 'blur(10px)' });

        ScrollTrigger.create({
            trigger: '#categories',
            start: 'top 80%',
            once: true,
            onEnter: () => {
                // Step 1: fade+slide+blur-in with a jump overshoot
                gsap.to(catHeadingLines, {
                    opacity: 1,
                    y: -5,                     // small overshoot upward
                    filter: 'blur(0px)',
                    duration: 1,
                    stagger: 0.15,
                    ease: 'power3.out',
                    onComplete: () => {
                        // Step 2: settle back to y:0 for the subtle bounce feel
                        gsap.to(catHeadingLines, {
                            y: 0,
                            duration: 0.35,
                            ease: 'power2.inOut'
                        });
                    }
                });
            }
        });
    }

    // --- 2. Category Cards: one-by-one entry with back.out ---
    const categoryCards = document.querySelectorAll('.category-card');
    if (categoryCards.length) {
        // Hide cards and their inner elements from the start
        gsap.set(categoryCards, { scale: 0, opacity: 0, y: 60 });
        categoryCards.forEach(card => {
            const innerEls = [
                card.querySelector('.card-title'),
                card.querySelector('.card-desc'),
                card.querySelector('.card-img-wrap'),
                card.querySelector('.card-btn')
            ].filter(Boolean);
            gsap.set(innerEls, { opacity: 0, y: 20 });
        });

        ScrollTrigger.create({
            trigger: '#categories .grid',
            start: 'top 82%',
            once: true,
            onEnter: () => {
                // Animate each card in one-by-one
                categoryCards.forEach((card, idx) => {
                    const cardDelay = idx * 0.2;   // stagger offset between cards
                    
                    gsap.to(card, {
                        scale: 1,
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        delay: cardDelay,
                        ease: 'back.out(1.7)',
                        onComplete: () => {
                            // After this card pops in, reveal its inner content: Title → Desc → Image → Btn
                            const title   = card.querySelector('.card-title');
                            const desc    = card.querySelector('.card-desc');
                            const imgWrap = card.querySelector('.card-img-wrap');
                            const btn     = card.querySelector('.card-btn');
                            const innerEls = [title, desc, imgWrap, btn].filter(Boolean);

                            gsap.to(innerEls, {
                                opacity: 1,
                                y: 0,
                                duration: 0.45,
                                stagger: 0.1,
                                ease: 'power2.out'
                            });
                        }
                    });
                });
            }
        });
    }

    // --- 3. Button Hover Effect (GSAP) ---
    document.querySelectorAll('.cat-arrow-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                x: 5,
                boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // ==========================================
    // --- OUR STORE / FEATURED DISHES (Kinetic Typography) ---
    // ==========================================
    const storeHeading = document.getElementById('store-heading');
    const storeLabel   = document.querySelector('.store-label');
    const isMobile     = window.innerWidth < 768;

    if (storeHeading && !isMobile) {
        // --- Manual character split (no SplitText plugin needed) ---
        const originalText = storeHeading.textContent.trim();
        storeHeading.innerHTML = ''; // clear
        storeHeading.setAttribute('aria-label', originalText);

        const chars = [];
        originalText.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.willChange = 'transform, opacity';
            storeHeading.appendChild(span);
            chars.push(span);
        });

        // Set initial state
        gsap.set(chars, { opacity: 0, y: 50, rotation: 5, scale: 0.9 });

        // Store label fade-up
        if (storeLabel) {
            gsap.set(storeLabel, { opacity: 0, y: 20 });
        }

        ScrollTrigger.create({
            trigger: '#menu',
            start: 'top 80%',
            once: true,
            onEnter: () => {
                // Label animates in first
                if (storeLabel) {
                    gsap.to(storeLabel, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power3.out'
                    });
                }

                // Kinetic character animation - organic random delay per char
                chars.forEach((char, i) => {
                    const organicDelay = 0.2 + (i * 0.04) + (Math.random() * 0.035);
                    gsap.to(char, {
                        opacity: 1,
                        y: 0,
                        rotation: 0,
                        scale: 1,
                        duration: 0.75,
                        ease: 'power3.out',
                        delay: organicDelay,
                        onComplete: i === chars.length - 1 ? () => {
                            // --- Wave/float loop after the last char reveals ---
                            chars.forEach((c, ci) => {
                                gsap.to(c, {
                                    y: -6,
                                    duration: 1.4 + (Math.random() * 0.2),
                                    ease: 'sine.inOut',
                                    repeat: -1,
                                    yoyo: true,
                                    delay: ci * 0.05   // cascading wave
                                });
                            });
                        } : undefined
                    });
                });
            }
        });
    } else if (storeHeading && isMobile) {
        // Mobile: simple fade reveal (no heavy DOM split)
        gsap.set(storeHeading, { opacity: 0, y: 30 });
        if (storeLabel) gsap.set(storeLabel, { opacity: 0, y: 20 });

        ScrollTrigger.create({
            trigger: '#menu',
            start: 'top 80%',
            once: true,
            onEnter: () => {
                if (storeLabel) gsap.to(storeLabel, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
                gsap.to(storeHeading, { opacity: 1, y: 0, duration: 0.8, delay: 0.15, ease: 'power3.out' });
            }
        });
    }

    // ==========================================
    // --- ABOUT / OUR STORY (Advanced Animations) ---
    // ==========================================

    // --- 1. IMAGE: Clip-path Reveal + Scale ---
    // The image container starts clipped from bottom (inset(100% 0 0 0)) and
    // slides up to reveal, while the photo inside scales 1.2 → 1 for parallax feel
    const aboutImgInner = document.querySelector('.about-img-inner');
    const aboutImgPhoto = document.querySelector('.about-img-photo');

    if (aboutImgInner) {
        gsap.set(aboutImgInner, { clipPath: 'inset(100% 0 0 0)', opacity: 1 });
        if (aboutImgPhoto) gsap.set(aboutImgPhoto, { scale: 1.2 });

        ScrollTrigger.create({
            trigger: '#about',
            start: 'top 75%',
            once: true,
            onEnter: () => {
                // Reveal the container with clip-path wipe upward
                gsap.to(aboutImgInner, {
                    clipPath: 'inset(0% 0 0 0)',
                    duration: 1.2,
                    ease: 'power4.out'
                });
                // Simultaneously de-zoom the photo inside
                if (aboutImgPhoto) {
                    gsap.to(aboutImgPhoto, {
                        scale: 1,
                        duration: 1.4,
                        ease: 'power3.out'
                    });
                }
                // Badge pops in after image is partially revealed
                const badge = document.querySelector('.about-badge-anim');
                if (badge) {
                    gsap.fromTo(badge,
                        { opacity: 0, scale: 0, y: 20 },
                        { opacity: 1, scale: 1, y: 0, duration: 0.6, delay: 0.9, ease: 'back.out(1.7)' }
                    );
                }
            }
        });
    }

    // --- 2. TEXT: Blur Reveal + Stagger ---
    // Each .about-text-line animates in: opacity 0→1, y 40→0, blur 10px→0
    const aboutTextLines = document.querySelectorAll('.about-text-line');
    if (aboutTextLines.length) {
        gsap.set(aboutTextLines, { opacity: 0, y: 40, filter: 'blur(10px)' });

        ScrollTrigger.create({
            trigger: '.about-content',
            start: 'top 78%',
            once: true,
            onEnter: () => {
                gsap.to(aboutTextLines, {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 1,
                    stagger: 0.15,
                    ease: 'power3.out'
                });
            }
        });
    }

    // --- 3. CARDS/LIST ITEMS: Stagger with back.out(1.7) ---
    const aboutListItems = document.querySelectorAll('.about-list-item');
    if (aboutListItems.length) {
        gsap.set(aboutListItems, { opacity: 0, scale: 0, y: 20 });

        ScrollTrigger.create({
            trigger: '.about-content ul',
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(aboutListItems, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.65,
                    stagger: 0.15,
                    ease: 'back.out(1.7)'
                });
            }
        });
    }

    // Partner logos fade-up stagger
    gsap.from('.partner-logos img', {
        scrollTrigger: {
            trigger: '.partner-logos',
            start: 'top 90%'
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
    });

    // Banner Parallax
    gsap.to('.parallax-img', {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: ".banner-img-wrap",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // --- Testimonials (Horizontal Scroll) ---
    const track = document.getElementById('testimonial-track');
    const slider = document.getElementById('testimonial-slider');
    
    // We only create the horizontal scroll if the user is on desktop mostly, 
    // or just calculate the width dynamically.
    setTimeout(() => {
        let maxScroll = slider.scrollWidth - track.offsetWidth;
        
        gsap.to(slider, {
            x: () => -maxScroll - 50, // scroll left
            ease: "none",
            scrollTrigger: {
                trigger: "#testimonials-sec",
                pin: true,
                start: "top top",
                end: () => "+=" + maxScroll,
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });
    }, 500);

    // ==========================================
    // 5. DYNAMIC MENU GENERATION & FILTERING
    // ==========================================
    const menuData = [
        {
            id: 1,
            title: "Truffle Mushroom Pasta",
            price: "$22.00",
            category: "veg special",
            image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            desc: "Handmade fettuccine tossed in a rich, creamy truffle mushroom sauce, topped with aged parmesan and fresh parsley.",
            tags: ["Veg", "Chef's Special", "Creamy"]
        },
        {
            id: 2,
            title: "Spicy Beef Steak",
            price: "$34.00",
            category: "non-veg special",
            image: "https://images.pexels.com/photos/32810338/pexels-photo-32810338.jpeg?_gl=1*cz5j7z*_ga*OTEwNTA3OTUzLjE3NDQxMTExNDM.*_ga_8JE65Q40S6*czE3NzQ4NTQ1MjgkbzM3JGcxJHQxNzc0ODU0NzkyJGo1OSRsMCRoMA..",
            desc: "Prime cut ribeye steak rubbed with our signature spicy blend, char-grilled to perfection, served with asparagus.",
            tags: ["Non-Veg", "Spicy", "High Protein"]
        },
        {
            id: 3,
            title: "Quinoa Power Bowl",
            price: "$16.00",
            category: "veg",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            desc: "A healthy bowl packed with organic quinoa, fresh avocado, roasted chickpeas, cherry tomatoes, and a light citrus vinaigrette.",
            tags: ["Veg", "Healthy", "Gluten-Free"]
        },
        {
            id: 4,
            title: "Classic Pepperoni Pizza",
            price: "$19.00",
            category: "non-veg",
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            desc: "Artisanal dough layered with rich marinara, loaded with mozzarella and premium cup-and-char pepperoni chunks.",
            tags: ["Non-Veg", "Popular", "Spicy"]
        },
        {
            id: 5,
            title: "Fresh Salmon Sashimi",
            price: "$28.00",
            category: "non-veg special",
            image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            desc: "Melt-in-your-mouth fresh Atlantic salmon, carefully sliced and served with wasabi, pickled ginger, and premium soy.",
            tags: ["Non-Veg", "Fresh", "Keto"]
        },
        {
            id: 6,
            title: "Vegan Buddha Wrap",
            price: "$14.00",
            category: "veg",
            image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            desc: "A nutrient-dense tortilla filled with hummus, roasted sweet potato, kale, and a house-made tahini dressing.",
            tags: ["Vegan", "Nutritious", "Light"]
        }
    ];

    const menuGrid = document.getElementById('menu-grid');
    
    const renderCards = (filter) => {
        // Clear grid
        menuGrid.innerHTML = '';
        
        let filteredData = menuData;
        if (filter !== 'all') {
            filteredData = menuData.filter(item => item.category.includes(filter));
        }

        filteredData.forEach(item => {
            const card = document.createElement('div');
            card.className = "bg-white rounded-[28px] overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 border border-border menu-item relative group flex flex-col h-full";
            
            // Generate tags
            let tagsHtml = '';
            if (item.category.includes('veg') && !item.category.includes('non-veg')) {
                tagsHtml = `<div class="absolute top-4 left-4 z-10 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md tracking-wider">VEG</div>`;
            } else {
                tagsHtml = `<div class="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md tracking-wider">NON-VEG</div>`;
            }
            if (item.category.includes('special')) {
                tagsHtml += `<div class="absolute top-4 ${item.category.includes('veg') && !item.category.includes('non-veg') ? 'left-[70px]' : 'left-[95px]'} z-10 bg-yellow-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md tracking-wider">SPECIAL</div>`;
            }

            card.innerHTML = `
                ${tagsHtml}
                <div class="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm w-10 h-10 flex items-center justify-center rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors cursor-pointer hover:scale-110">
                    <i class="fa-regular fa-heart"></i>
                </div>
                
                <div class="h-64 overflow-hidden w-full relative">
                    <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
                    <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                </div>
                
                <div class="p-8 flex flex-col flex-grow">
                    <div class="flex justify-between items-start mb-3 gap-2">
                        <h3 class="text-xl font-bold text-primary group-hover:text-secondary-hover transition-colors leading-tight">${item.title}</h3>
                        <span class="text-xl font-bold text-secondary-hover flex-shrink-0">${item.price}</span>
                    </div>
                    <p class="text-secondary-light text-sm mb-8 line-clamp-2 leading-relaxed font-light">${item.desc}</p>
                    <button class="w-full mt-auto py-3.5 border border-primary rounded-xl font-bold text-primary hover:bg-primary hover:text-white transition-all duration-300 view-details-btn group-hover:shadow-lg shadow-sm" data-id="${item.id}">
                        View Details
                    </button>
                </div>
            `;
            menuGrid.appendChild(card);
        });

        // Ensure dynamically injected images also get fallback handling
        applyAllImageFallbacks();

        // Add event listeners to new buttons
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => openModal(e.target.dataset.id));
        });

        // Trigger GSAP animation for new items
        gsap.from('.menu-item', {
            opacity: 0,
            y: 30,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        });
        
        // Refresh scroll trigger to account for height change
        ScrollTrigger.refresh();
    };

    // Initial render
    renderCards('all');

    // Filter Controls
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active style from all
            filterBtns.forEach(b => {
                b.classList.remove('active', 'bg-primary', 'text-white', 'shadow-md');
                b.classList.add('text-secondary-light', 'hover:bg-gray-50', 'hover:text-primary');
            });
            // Add to current
            const target = e.target;
            target.classList.add('active', 'bg-primary', 'text-white', 'shadow-md');
            target.classList.remove('text-secondary-light', 'hover:bg-gray-50', 'hover:text-primary');
            
            renderCards(target.dataset.filter);
        });
    });

    // ==========================================
    // 6. MODAL LOGIC (Menu Popup)
    // ==========================================
    const modal = document.getElementById('food-modal');
    const modalContent = document.getElementById('modal-content');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const closeBtn = document.getElementById('close-modal');

    // Modal elements
    const mImg = document.getElementById('modal-img');
    const mTitle = document.getElementById('modal-title');
    const mPrice = document.getElementById('modal-price');
    const mDesc = document.getElementById('modal-desc');
    const mTags = document.getElementById('modal-tags');

    const openModal = (id) => {
        const item = menuData.find(d => d.id == id);
        if(!item) return;

        // Populate
        mImg.src = item.image;
        mTitle.textContent = item.title;
        mPrice.textContent = item.price;
        mDesc.textContent = item.desc;
        
        mTags.innerHTML = item.tags.map(tag => {
            let color = 'bg-gray-100 text-gray-700';
            if(tag.toLowerCase() === 'veg' || tag.toLowerCase() === 'healthy' || tag.toLowerCase() === 'vegan') color = 'bg-green-100 text-green-700';
            if(tag.toLowerCase() === 'spicy' || tag.toLowerCase() === 'non-veg') color = 'bg-red-100 text-red-700';
            if(tag.toLowerCase().includes('special')) color = 'bg-yellow-100 text-yellow-700';
            
            return `<span class="text-xs font-bold px-3 py-1 ${color} rounded-md tracking-wide">${tag}</span>`;
        }).join('');

        // Show Modal
        modal.classList.remove('pointer-events-none');
        gsap.to(modal, { opacity: 1, duration: 0.3 });
        gsap.to(modalContent, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.2)", delay: 0.1 });
        
        // Stop Lenis Scrolling temporarily
        lenis.stop();
    };

    const closeModal = () => {
        gsap.to(modalContent, { opacity: 0, scale: 0.95, duration: 0.3, ease: "power2.in" });
        gsap.to(modal, { opacity: 0, duration: 0.3, delay: 0.1, onComplete: () => {
            modal.classList.add('pointer-events-none');
            // Resume Lenis Scrolling
            lenis.start();
        }});
    };

    closeBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);

    // ==========================================
    // 7. Testimonials Initialization
    // ==========================================
    const testimonials = [
        {
            text: "Absolutely phenomenal! The truffle pasta arrived perfectly hot, and the flavors were out of this world. Definitely ordering again.",
            name: "Sarah Jenkins",
            role: "Food Blogger",
            img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
        },
        {
            text: "The UI of the app is top-notch, placing orders is a breeze, and the packaging kept the food completely fresh. Highly recommended.",
            name: "Michael Chen",
            role: "Tech Entrepreneur",
            img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
        },
        {
            text: "I've tried many cloud kitchens, but this one stands out. The ingredients are genuinely premium, and you can really taste the difference.",
            name: "Emily Rodriguez",
            role: "Marketing Director",
            img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
        },
        {
            text: "Exceptional service! Their spicy chicken wings and peri-peri fries are my weekly go-to meal now. Fast delivery every single time.",
            name: "David Smith",
            role: "Fitness Coach",
            img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
        },
        {
            text: "The vegan options here are actually flavorful instead of just being an afterthought. A true paradise for plant-based eaters.",
            name: "Jessica Taylor",
            role: "Nutritionist",
            img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
        }
    ];

    const testSlider = document.getElementById('testimonial-slider');
    
    testimonials.forEach(test => {
        const card = document.createElement('div');
        card.className = "w-[350px] md:w-[450px] flex-shrink-0 bg-white/5 backdrop-blur-xl p-10 rounded-[40px] test-card transform perspective-1000 border border-[rgba(255,255,255,0.1)] hover:bg-white/10 transition-colors duration-300";
        card.innerHTML = `
            <div class="flex gap-1 text-yellow-400 text-sm mb-8">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
            </div>
            <p class="text-lg md:text-xl font-light leading-relaxed mb-10 text-gray-200">"${test.text}"</p>
            <div class="flex items-center gap-5 mt-auto">
                <img src="${test.img}" alt="${test.name}" class="w-14 h-14 rounded-full object-cover border-2 border-secondary-hover shadow-lg">
                <div>
                    <h4 class="font-bold text-lg">${test.name}</h4>
                    <p class="text-xs text-gray-400 font-medium tracking-wide uppercase">${test.role}</p>
                </div>
            </div>
        `;
        testSlider.appendChild(card);
    });
});
