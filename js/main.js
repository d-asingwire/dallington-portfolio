// Main JS - Interactions & Animations

document.addEventListener('DOMContentLoaded', () => {

    // 1. Scroll Reveal Animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '0px 0px -50px 0px' // Slightly offset bottom
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add visible class
                entry.target.classList.add('visible');

                // Add cascading delay if multiple items appear at once (optional refinement)
                // observer.unobserve(entry.target); // Keep observing? Or run once? Let's run once.
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Targets to animate
    const animateTargets = document.querySelectorAll('.section-title, .profile-grid, .timeline-item, .exp-item, .skill-category, .project-item');

    // Add base class and observe
    animateTargets.forEach((target, index) => {
        target.classList.add('fade-in-up');
        // Add random slight delays for staggered feel if they are siblings
        // (Simplified logic here, relying on CSS transitions mostly)
        revealObserver.observe(target);
    });


    // 2. Active Link Highlighting & Sticky Header Shadow
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav a');
    const header = document.querySelector('.main-header');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        // Header Shadow
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Link Logic
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Offset for sticky header
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 3. Smooth Scroll Fallback (Optional, but CSS handles it mostly)
    // Adding click listeners to nav links just to update active state immediately
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Allow default behavior for scrolling, but maybe close mobile menu if we had one
            setTimeout(() => {
                header.classList.add('scrolled'); // Ensure header looks active on jump
            }, 100);
        });
    });

    console.log("Aesthetics Loaded ✨");
});
