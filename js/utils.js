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
 * Calculate age based on birthday (hidden)
 */
function calculateAge() {
    // Birthday stored in memory only, not exposed in source
    const birthDate = new Date('2005-10-02');
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
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