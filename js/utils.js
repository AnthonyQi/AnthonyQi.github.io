/**
 * Creates an Intersection Observer for scroll animations
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

/**
 * Calculate age based on birthday
 * @param {string} birthDate - Birthday in format "YYYY-MM-DD"
 * @returns {number} Current age
 */
function calculateAge() {
    const bd = '2005-10-02';
    const tdy = new Date();
    const b = new Date(bd);
    let age = tdy.getFullYear() - b.getFullYear();
    const diff = tdy.getMonth() - b.getMonth();
    
    if (diff < 0 || (diff === 0 && tdy.getDate() < b.getDate())) {
        age--;
    }
    
    return age;
}

// Set the age immediately
document.getElementById('age').textContent = calculateAge();

// Export at the very end
window.Utils = { 
    createScrollObserver,
    calculateAge 
};