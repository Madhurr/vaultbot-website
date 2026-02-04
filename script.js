// ============================================
// VaultBot Website - Interactive JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initTypingAnimation();
    initPricingToggle();
    initScrollAnimations();
    initParallax();
    initCounters();
});

// Navigation scroll effect
function initNavigation() {
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Typing animation in hero
function initTypingAnimation() {
    const texts = [
        'Deploy my app to production overnight...',
        'Write unit tests for the UserService...',
        'Refactor this code to use async/await...',
        'Create a PR with these changes...',
        'Search for security vulnerabilities...'
    ];
    
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isPaused) {
            setTimeout(type, 2000);
            isPaused = false;
            isDeleting = true;
            return;
        }
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentText.length) {
                isPaused = true;
            }
        }
        
        const speed = isDeleting ? 30 : 50;
        setTimeout(type, speed);
    }
    
    setTimeout(type, 1000);
}

// Pricing toggle (monthly/yearly)
function initPricingToggle() {
    const toggle = document.getElementById('billing-toggle');
    const priceElements = document.querySelectorAll('.price-amount[data-monthly]');
    const monthlyLabel = document.querySelector('.toggle-label:first-of-type');
    const yearlyLabel = document.querySelector('.toggle-label:last-of-type');
    
    if (!toggle) return;
    
    toggle.addEventListener('change', () => {
        const isYearly = toggle.checked;
        
        priceElements.forEach(el => {
            el.textContent = isYearly ? el.dataset.yearly : el.dataset.monthly;
        });
        
        monthlyLabel.classList.toggle('active', !isYearly);
        yearlyLabel.classList.toggle('active', isYearly);
    });
}

// Scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card, .security-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Parallax effect on hero
function initParallax() {
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            heroVisual.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
    });
}

// Animated counters
function initCounters() {
    const counters = document.querySelectorAll('.stat-value');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const isInfinity = text.includes('∞');
    
    if (isInfinity) return;
    
    const target = parseInt(text.replace(/[^0-9]/g, ''));
    if (isNaN(target)) return;
    
    let current = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let display = Math.floor(current).toLocaleString();
        if (hasPlus) display += '+';
        if (hasPercent) display += '%';
        
        element.textContent = display;
    }, stepDuration);
}

// Interactive keyboard
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('mousedown', () => {
        key.style.transform = 'translateY(4px)';
        key.style.boxShadow = '0 0 0 var(--bg-primary)';
    });
    
    key.addEventListener('mouseup', () => {
        key.style.transform = 'translateY(0)';
        key.style.boxShadow = '0 4px 0 var(--bg-primary)';
    });
});

// Mobile menu toggle (if needed)
function initMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuButton || !navLinks) return;
    
    menuButton.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
}

// Progress bar animation for floating card
function animateProgress() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;
    
    let progress = 67;
    let direction = 1;
    
    setInterval(() => {
        progress += direction * 0.5;
        if (progress >= 95) direction = -1;
        if (progress <= 40) direction = 1;
        
        progressBar.style.setProperty('--progress', `${progress}%`);
    }, 100);
}

animateProgress();

// Add hover effect to comparison rows
document.querySelectorAll('.comparison-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
        row.style.background = 'rgba(124, 58, 237, 0.05)';
    });
    row.addEventListener('mouseleave', () => {
        if (!row.classList.contains('highlight')) {
            row.style.background = 'transparent';
        }
    });
});

// Smooth reveal for sections
const sections = document.querySelectorAll('section');
const revealSection = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
        }
    });
};

const sectionObserver = new IntersectionObserver(revealSection, {
    threshold: 0.15
});

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Console easter egg
console.log(`
%c██╗   ██╗ █████╗ ██╗   ██╗██╗  ████████╗██████╗  ██████╗ ████████╗
%c██║   ██║██╔══██╗██║   ██║██║  ╚══██╔══╝██╔══██╗██╔═══██╗╚══██╔══╝
%c██║   ██║███████║██║   ██║██║     ██║   ██████╔╝██║   ██║   ██║   
%c╚██╗ ██╔╝██╔══██║██║   ██║██║     ██║   ██╔══██╗██║   ██║   ██║   
%c ╚████╔╝ ██║  ██║╚██████╔╝███████╗██║   ██████╔╝╚██████╔╝   ██║   
%c  ╚═══╝  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝   ╚═════╝  ╚═════╝    ╚═╝   

%c🔐 Your AI. Your Rules. Your Vault.

%cWant to work on something cool? We're hiring!
%chttps://vaultbot.ai/careers
`, 
'color: #7C3AED',
'color: #8B5CF6',
'color: #A78BFA',
'color: #06B6D4',
'color: #22D3EE',
'color: #67E8F9',
'color: #888; font-size: 14px;',
'color: #666; font-size: 12px;',
'color: #7C3AED; font-size: 12px;'
);
