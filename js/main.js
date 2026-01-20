document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    window.Navigation.initNavigation();
    // Initialize scroll animations for project cards and gallery items
    window.Utils.createScrollObserver('.project-card, .gallery-item');
    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navList = document.getElementById('nav-list');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navList.classList.toggle('active');
    });
    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navList.contains(e.target)) {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
        }
    });
});