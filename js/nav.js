/**
 * Sets up smooth scrolling for anchor links
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
}

/**
 * Handles navigation link clicks with smooth scroll
 * @param {Event} e - Click event
 */
function handleNavClick(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

window.Navigation = { initNavigation };