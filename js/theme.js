/**
 * Detects if system prefers dark mode
 * @returns {boolean} True if dark mode is preferred
 */
function detectSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Applies theme to document and saves preference
 * @param {boolean} isDark - True for dark theme, false for light
 */
function applyTheme(isDark) {
    if (isDark) {
        document.body.classList.add('dark-theme');
        document.querySelector('#theme-toggle').textContent = '☀️';
    } else {
        document.body.classList.remove('dark-theme');
        document.querySelector('#theme-toggle').textContent = '🌙';
    }
    localStorage.setItem('theme-preference', isDark ? 'dark' : 'light');
}

/**
 * Initializes theme on page load
 * Checks localStorage first, then system preference
 */
function initTheme() {
    const saved = localStorage.getItem('theme-preference');
    if (saved) {
        applyTheme(saved === 'dark');
    } else {
        applyTheme(detectSystemTheme());
    }
}

/**
 * Sets up theme toggle button event listener
 */
function setupThemeToggle() {
    const themeToggle = document.querySelector('#theme-toggle');
    
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        applyTheme(isDark);
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme-preference')) {
            applyTheme(e.matches);
        }
    });
}

window.ThemeManager = { detectSystemTheme, applyTheme, initTheme, setupThemeToggle };