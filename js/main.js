// Dynamic Date
document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }


    // Load DEV.to Articles
    const articlesWrapper = document.getElementById('articles-wrapper');
    const viewMoreContainer = document.getElementById('view-more-container');

    if (articlesWrapper) {
        // Timeout utility to prevent server hanging
        const fetchWithTimeout = (url, ms) => {
            const controller = new AbortController();
            const promise = fetch(url, { signal: controller.signal });
            const timeout = new Promise((_, reject) => {
                setTimeout(() => {
                    controller.abort();
                    reject(new Error('Request timed out'));
                }, ms);
            });
            return Promise.race([promise, timeout]);
        };

        fetchWithTimeout('https://dev.to/api/articles?username=dallington256&per_page=6', 5000)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(articles => {
                articlesWrapper.innerHTML = ''; // Clear loading spinner

                if (articles.length === 0) {
                    // Handle case where user exists but has no articles
                    articlesWrapper.innerHTML = `
                        <div class="text-center" style="grid-column: 1 / -1; color: var(--text-muted);">
                            <p>No articles found.</p>
                        </div>
                    `;
                } else {
                    articles.forEach(article => {
                        const articleLink = document.createElement('a');
                        articleLink.href = article.url;
                        articleLink.target = '_blank';
                        articleLink.className = 'article-card';
                        articleLink.innerHTML = `
                            <i class="fab fa-dev"></i>
                            <span>${article.title}</span>
                        `;
                        articlesWrapper.appendChild(articleLink);
                    });
                }
                // Show "View More" button on success
                if (viewMoreContainer) viewMoreContainer.style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching articles:', error);
                // Fallback content if API fails
                articlesWrapper.innerHTML = `
                    <div class="text-center" style="grid-column: 1 / -1; color: var(--text-muted);">
                        <p>Unable to load articles directly. You can read them on my DEV.to profile.</p>
                    </div>
                `;
                // Show "View More" button on error so user can still navigate
                if (viewMoreContainer) viewMoreContainer.style.display = 'block';
            });
    }

    // Scroll Animation (IntersectionObserver)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('reveal');
        observer.observe(section);
    });

    // Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const mainNav = document.getElementById('main-nav');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            // Toggle icon between bars and times
            const icon = mobileToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close nav when clicking a link and prevent hash in URL
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Stop URL from changing

            const href = link.getAttribute('href');
            // Only proceed if it is a hash link
            if (href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }

                // Close mobile menu if open
                if (mainNav) {
                    mainNav.classList.remove('active');
                }
                const icon = mobileToggle ? mobileToggle.querySelector('i') : null;
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // Back to Top & Scroll Spy
    const backToTopBtn = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav a');

    window.addEventListener('scroll', () => {
        let current = '';

        // Show/Hide Back to Top
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }

        // Scroll Spy Logic
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Offset for header height (approx 80px)
            if (window.pageYOffset >= (sectionTop - 150)) {
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

    // Back to Top Click
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
