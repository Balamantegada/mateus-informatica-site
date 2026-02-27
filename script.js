import { BackgroundSystem } from './js/BackgroundSystem.js';

document.addEventListener('DOMContentLoaded', () => {

    /* --- Procedural Dashboard Background --- */
    const proceduralBgContainer = document.getElementById('procedural-background');
    let bgSystem = null;
    if (proceduralBgContainer) {
        // Initialize with default configuration
        bgSystem = new BackgroundSystem({
            container: proceduralBgContainer
            // Optional: pass custom cardsConfig array here
        });
    }

    /* --- Scroll Reveal Animations --- */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* --- Navigation SCROLL Effect --- */
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Header shadow
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Sync Background Parallax
        if (bgSystem) {
            bgSystem.updateScroll(scrollY);
        }
    }, { passive: true });

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
    if (!localStorage.getItem('site_cookies_accepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    // Accept Cookies Event
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('site_cookies_accepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }
});
