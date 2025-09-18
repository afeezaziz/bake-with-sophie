// JavaScript for Bake With Sophie

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('nav button');
    const nav = document.querySelector('nav');

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            // Create mobile menu if it doesn't exist
            let mobileMenu = document.querySelector('.mobile-menu');

            if (!mobileMenu) {
                mobileMenu = document.createElement('div');
                mobileMenu.className = 'mobile-menu absolute top-full left-0 w-full bg-pink-100 shadow-lg z-50';
                mobileMenu.innerHTML = `
                    <div class="container mx-auto px-4 py-4">
                        <div class="flex flex-col space-y-4">
                            <a href="#" class="text-pink-700 hover:text-pink-900 font-medium">Home</a>
                            <a href="#" class="text-pink-700 hover:text-pink-900 font-medium">Recipes</a>
                            <a href="#" class="text-pink-700 hover:text-pink-900 font-medium">About</a>
                            <a href="#" class="text-pink-700 hover:text-pink-900 font-medium">Contact</a>
                        </div>
                    </div>
                `;
                nav.appendChild(mobileMenu);
            }

            mobileMenu.classList.toggle('hidden');
        });
    }

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

    // Add click handlers for recipe buttons
    document.querySelectorAll('.card-actions button').forEach(button => {
        button.addEventListener('click', function() {
            // This would typically navigate to a recipe page
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
});