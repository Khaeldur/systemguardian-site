/* ============================================================
   System Guardian — Website JavaScript
   Nav toggle, scroll animations, FAQ accordion, FAQ search
   ============================================================ */

(function () {
    'use strict';

    // --- Mobile Hamburger Nav ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // --- Scroll Animations (IntersectionObserver) ---
    const animateEls = document.querySelectorAll('.animate-in');
    if (animateEls.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        animateEls.forEach(el => observer.observe(el));
    } else {
        // Fallback: show everything immediately
        animateEls.forEach(el => el.classList.add('visible'));
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- FAQ Search Filter ---
    const faqSearch = document.querySelector('.faq-search');
    if (faqSearch) {
        const sections = document.querySelectorAll('.faq-section');
        const items = document.querySelectorAll('.faq-item');

        faqSearch.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();

            if (!query) {
                // Show everything, collapse all
                sections.forEach(s => s.style.display = '');
                items.forEach(item => {
                    item.style.display = '';
                    item.removeAttribute('open');
                });
                return;
            }

            sections.forEach(section => {
                const sectionItems = section.querySelectorAll('.faq-item');
                let hasVisible = false;

                sectionItems.forEach(item => {
                    const summary = item.querySelector('summary');
                    const answer = item.querySelector('.faq-answer');
                    const text = (summary ? summary.textContent : '') + ' ' + (answer ? answer.textContent : '');

                    if (text.toLowerCase().includes(query)) {
                        item.style.display = '';
                        item.setAttribute('open', '');
                        hasVisible = true;
                    } else {
                        item.style.display = 'none';
                        item.removeAttribute('open');
                    }
                });

                section.style.display = hasVisible ? '' : 'none';
            });
        });
    }

    // --- Active Nav Link Highlight ---
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    if (navAnchors.length > 0) {
        const sectionIds = [];
        navAnchors.forEach(a => {
            const id = a.getAttribute('href');
            if (id && id !== '#') sectionIds.push(id);
        });

        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + 100;

            for (let i = sectionIds.length - 1; i >= 0; i--) {
                const section = document.querySelector(sectionIds[i]);
                if (section && section.offsetTop <= scrollPos) {
                    navAnchors.forEach(a => a.classList.remove('active'));
                    const active = document.querySelector('.nav-links a[href="' + sectionIds[i] + '"]');
                    if (active) active.classList.add('active');
                    break;
                }
            }
        }, { passive: true });
    }

})();
