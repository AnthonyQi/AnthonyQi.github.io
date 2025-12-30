/* Creates an Intersection Observer for scroll animations
 * @param {string} selector - CSS selector for elements to observe
 * @param {Object} options - Observer options (threshold, rootMargin)
 */
function createScrollObserver(selector, options = {}) {
    const defaultOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
        ...options
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, defaultOptions);

    document.querySelectorAll(selector).forEach(el => observer.observe(el));
}

window.Utils = { createScrollObserver };