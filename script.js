document.addEventListener('DOMContentLoaded', () => {

    /* --- Scroll-driven Animated Background --- */
    const bgCanvas = document.getElementById('bg-canvas');
    if (bgCanvas) {
        const context = bgCanvas.getContext('2d', { alpha: false }); // alpha: false optimizes rendering for opaque images
        const frameCount = 80;

        const currentFrame = index => (
            `imgs/background/Create_a_seamless_202602240917_0osc5_${index.toString().padStart(3, '0')}.jpg`
        );

        const images = [];
        let canvasStretched = false;

        // Preload all frames
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                // Initialize canvas dimensions based on the native size of the first loaded image
                if (!canvasStretched && img.width > 0) {
                    bgCanvas.width = img.width;
                    bgCanvas.height = img.height;
                    canvasStretched = true;
                    // Pre-render the first loaded image immediately
                    context.drawImage(img, 0, 0);
                }
            };
            images.push(img);
        }

        let targetFrame = 0;
        let currentFrameIndex = 0;

        function updateBackground() {
            // Smoothly interpolate current frame to target frame for fluid transitions
            currentFrameIndex += (targetFrame - currentFrameIndex) * 0.05; // Lower = smoother

            let frame1 = Math.floor(currentFrameIndex);
            let frame2 = Math.min(frameCount - 1, frame1 + 1);
            let fraction = currentFrameIndex - frame1;

            if (images[frame1] && images[frame1].complete && canvasStretched) {
                // Frame Blending for ultra-smooth transition
                context.globalAlpha = 1;
                context.drawImage(images[frame1], 0, 0);

                if (fraction > 0.02 && images[frame2] && images[frame2].complete) {
                    context.globalAlpha = fraction;
                    context.drawImage(images[frame2], 0, 0);
                }
                context.globalAlpha = 1; // restore alpha
            }

            requestAnimationFrame(updateBackground);
        }

        requestAnimationFrame(updateBackground);

        window.addEventListener('scroll', () => {
            const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            if (maxScroll === 0) return;

            let scrollFraction = window.scrollY / maxScroll;
            scrollFraction = Math.max(0, Math.min(1, scrollFraction));

            targetFrame = scrollFraction * (frameCount - 1);
        }, { passive: true });
    }

    /* --- Navigation SCROLL Effect --- */
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* --- Mobile Menu Toggle --- */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.querySelector('.nav-list');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');

            // Toggle icon ph-list / ph-x
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('ph-list');
                icon.classList.add('ph-x');
            } else {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
        });
    }

    /* --- Mobile Dropdown Toggle --- */
    const dropdownToggle = document.querySelector('.dropdown > a');
    if (dropdownToggle && window.innerWidth <= 768) {
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.target.closest('.dropdown').classList.toggle('active');
        });
    }

    /* --- Smooth Scrolling --- */
    const navLinks = document.querySelectorAll('.nav-link, .hero-buttons a, .product-info a, .footer-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {

            const targetId = this.getAttribute('href');

            // Allow default for external or mailto
            if (targetId.startsWith('mailto:') || targetId.startsWith('http')) return;

            if (targetId.startsWith('#')) {
                e.preventDefault();

                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const icon = mobileToggle.querySelector('i');
                    icon.classList.remove('ph-x');
                    icon.classList.add('ph-list');
                }

                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });

    /* --- Form Submission (Mock) --- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;

            btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Enviando...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Mensagem enviada com sucesso! Um de nossos especialistas entrará em contato em breve.');
                contactForm.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }

    /* --- Cookie Banner Logic --- */
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookiesBtn = document.getElementById('acceptCookies');

    // Check localStorage (show banner if not accepted)
    if (!localStorage.getItem('mateus_cookies_accepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    // Accept Cookies Event
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('mateus_cookies_accepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }
});
