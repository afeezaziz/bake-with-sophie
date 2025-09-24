// JavaScript for Bake With Sophie

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('[data-mobile-menu-button]');
    const nav = document.querySelector('nav');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            const isHidden = mobileMenu.classList.toggle('hidden');
            mobileMenuButton.setAttribute('aria-expanded', String(!isHidden));
        });

        // Close mobile menu when a link is clicked
        mobileMenu.querySelectorAll('a[href]').forEach(link => {
            link.addEventListener('click', () => {
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Active nav link highlighting
    if (nav) {
        const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
        const links = nav.querySelectorAll('a[href]');
        links.forEach(a => {
            const href = a.getAttribute('href');
            if (!href) return;
            const normalized = href.replace(/\/$/, '') || '/';
            if (normalized === currentPath) {
                a.classList.add('active');
            }
        });
    }

    // Theme toggle (DaisyUI themes)
    const htmlEl = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const THEMES = ['cupcake', 'valentine'];
    const updateToggleIcon = (theme) => {
        const icon = theme === 'cupcake' ? '🌞' : '🌙';
        if (themeToggle) themeToggle.textContent = icon;
        if (themeToggleMobile) themeToggleMobile.textContent = `Toggle Theme ${icon}`;
    };
    const applyTheme = (theme) => {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateToggleIcon(theme);
    };
    const savedTheme = localStorage.getItem('theme') || htmlEl.getAttribute('data-theme') || THEMES[0];
    applyTheme(savedTheme);
    const toggleTheme = () => {
        const current = htmlEl.getAttribute('data-theme') || THEMES[0];
        const next = current === THEMES[0] ? THEMES[1] : THEMES[0];
        applyTheme(next);
    };
    themeToggle && themeToggle.addEventListener('click', toggleTheme);
    themeToggleMobile && themeToggleMobile.addEventListener('click', toggleTheme);

    // Back-to-top button
    const backToTop = document.getElementById('back-to-top');
    const onScroll = () => {
        if (!backToTop) return;
        if (window.scrollY > 300) backToTop.classList.remove('hidden');
        else backToTop.classList.add('hidden');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    backToTop && backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add fade-in animation to cards when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });

    // Add click handlers for recipe links (for analytics/logging)
    document.querySelectorAll('.card-actions a').forEach(link => {
        link.addEventListener('click', function() {
            console.log('View recipe clicked for:', this.closest('.card').querySelector('.card-title').textContent);
        });
    });

    // Add hover effect to the main CTA button
    const mainButton = document.querySelector('.btn-primary');
    if (mainButton) {
        mainButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });

        mainButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // Testimonials simple auto-rotate
    const testimonialSlides = Array.from(document.querySelectorAll('[data-testimonial]'));
    if (testimonialSlides.length > 1) {
        let active = 0;
        let paused = false;
        const show = (i) => {
            testimonialSlides.forEach((el, idx) => el.classList.toggle('hidden', idx !== i));
        };
        show(active);
        const container = document.getElementById('testimonials');
        container && container.addEventListener('mouseenter', () => paused = true);
        container && container.addEventListener('mouseleave', () => paused = false);
        setInterval(() => {
            if (paused) return;
            active = (active + 1) % testimonialSlides.length;
            show(active);
        }, 4000);
    }

    // Newsletter confetti on submit
    function spawnConfetti(x, y) {
        const colors = ['#f9a8d4', '#f472b6', '#fb7185', '#facc15', '#60a5fa', '#34d399'];
        const pieces = 60;
        for (let i = 0; i < pieces; i++) {
            const el = document.createElement('span');
            el.className = 'confetti-piece';
            const size = 6 + Math.random() * 6;
            el.style.width = `${size}px`;
            el.style.height = `${size * 1.6}px`;
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            el.style.setProperty('--tx', `${(Math.random() - 0.5) * 2 * 160}px`);
            el.style.setProperty('--ty', `${200 + Math.random() * 300}px`);
            el.style.setProperty('--rot', `${(Math.random() - 0.5) * 720}deg`);
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 2500);
        }
    }
    document.querySelectorAll('form[data-confetti]').forEach(form => {
        form.addEventListener('submit', (e) => {
            try {
                const rect = form.getBoundingClientRect();
                const x = rect.left + rect.width - 30;
                const y = rect.top + window.scrollY + 10;
                spawnConfetti(x, y);
            } catch {}
        });
    });

    // Recipes page: search & category filtering
    const searchInput = document.getElementById('recipe-search');
    const chipContainer = document.getElementById('category-chips');
    const recipeCards = Array.from(document.querySelectorAll('[data-title][data-cats]'));
    let activeCat = 'all';
    const applyFilters = () => {
        const q = (searchInput?.value || '').trim().toLowerCase();
        recipeCards.forEach(card => {
            const title = card.getAttribute('data-title') || '';
            const cats = (card.getAttribute('data-cats') || '').split(',');
            const matchText = !q || title.includes(q);
            const matchCat = activeCat === 'all' || cats.includes(activeCat);
            card.classList.toggle('hidden', !(matchText && matchCat));
        });
    };
    searchInput && searchInput.addEventListener('input', applyFilters);
    chipContainer && chipContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-cat]');
        if (!btn) return;
        activeCat = btn.getAttribute('data-cat');
        chipContainer.querySelectorAll('[data-cat]').forEach(b => b.classList.remove('btn-active'));
        btn.classList.add('btn-active');
        applyFilters();
    });
    if (recipeCards.length) applyFilters();

    // Favorites feature (localStorage)
    const FAVORITES_KEY = 'bws:favorites';
    function getFavoritesSet() {
        try {
            const raw = localStorage.getItem(FAVORITES_KEY) || '[]';
            const arr = JSON.parse(raw);
            return new Set(Array.isArray(arr) ? arr : []);
        } catch {
            return new Set();
        }
    }
    function saveFavorites(set) {
        try {
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(set)));
        } catch {}
    }
    function updateFavButtons(favs) {
        document.querySelectorAll('[data-fav-toggle]').forEach(btn => {
            const slug = btn.getAttribute('data-slug');
            if (!slug) return;
            const on = favs.has(slug);
            btn.setAttribute('aria-pressed', String(on));
            btn.textContent = on ? '♥' : '♡';
            btn.classList.toggle('btn-primary', on);
        });
    }
    function syncFavoritesPageVisibility(favs) {
        const favSection = document.querySelector('[data-favorites-page]');
        if (!favSection) return;
        const cards = Array.from(favSection.querySelectorAll('[data-slug]'));
        let visible = 0;
        cards.forEach(card => {
            const slug = card.getAttribute('data-slug');
            const show = favs.has(slug);
            card.classList.toggle('hidden', !show);
            if (show) visible++;
        });
        const empty = document.getElementById('favorites-empty');
        if (empty) empty.classList.toggle('hidden', visible > 0);
    }

    let favorites = getFavoritesSet();
    updateFavButtons(favorites);
    syncFavoritesPageVisibility(favorites);

    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-fav-toggle]');
        if (!btn) return;
        e.preventDefault();
        const slug = btn.getAttribute('data-slug');
        if (!slug) return;
        if (favorites.has(slug)) favorites.delete(slug); else favorites.add(slug);
        saveFavorites(favorites);
        updateFavButtons(favorites);
        syncFavoritesPageVisibility(favorites);
    });
});