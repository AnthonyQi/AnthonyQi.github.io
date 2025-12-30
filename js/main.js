document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme system
    window.ThemeManager.initTheme();
    window.ThemeManager.setupThemeToggle();

    // Initialize navigation
    window.Navigation.initNavigation();

    // Initialize scroll animations for project cards and gallery items
    window.Utils.createScrollObserver('.project-card, .gallery-item');
});