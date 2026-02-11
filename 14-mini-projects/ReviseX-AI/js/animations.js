/**
 * Homepage Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    animateStats();
    setupScrollAnimations();
});

// Animate stats counters
function animateStats() {
    const statElements = document.querySelectorAll('.stats-card div[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.dataset.count);
                animateCounter(element, target);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    statElements.forEach(el => observer.observe(el));
}

function animateCounter(element, target) {
    let current = 0;
    const suffix = element.textContent.match(/[+h]/)?.[0] || '';
    const increment = target / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 30);
}

// Setup scroll animations
function setupScrollAnimations() {
    const elements = document.querySelectorAll('.feature-card, .interview-question');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}
