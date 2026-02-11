/**
 * Theme Manager
 * Handles dark mode toggle
 */

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupThemeToggle();
});

function initializeTheme() {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('revisex_theme');
    
    // Check system preference if no saved theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    applyTheme(theme);
}

function setupThemeToggle() {
    const toggleBtn = document.getElementById('darkModeToggle');
    if (!toggleBtn) return;
    
    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('revisex_theme', newTheme);
    });
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        updateThemeIcon('sun');
    } else {
        document.documentElement.classList.remove('dark');
        updateThemeIcon('moon');
    }
}

function updateThemeIcon(icon) {
    const toggleBtn = document.getElementById('darkModeToggle');
    if (!toggleBtn) return;
    
    const iconElement = toggleBtn.querySelector('i');
    if (iconElement) {
        iconElement.className = `fas fa-${icon} text-gray-700 dark:text-yellow-400`;
    }
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const savedTheme = localStorage.getItem('revisex_theme');
    if (!savedTheme) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});
