// ============================================
// VaultBot Website - Complete Interactive JS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTypingAnimations();
    initPricingToggle();
    initScrollAnimations();
    initSkillsFilter();
    initCopyButtons();
    initHotkeyDemo();
    initCounters();
    initMobileMenu();
});

// Navigation scroll effect
function initNavigation() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

// Multiple typing animations
function initTypingAnimations() {
    // Hero search typing
    const demoText = document.querySelector('.demo-text');
    if (demoText) {
        const phrases = [
            'deploy my app overnight',
            'create a PR with tests',
            'refactor UserService.swift',
            'analyze security vulnerabilities',
            'update all dependencies'
        ];
        
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;
        
        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isPaused) {
                setTimeout(type, 2000);
                isPaused = false;
                isDeleting = true;
                return;
            }
            
            if (isDeleting) {
                demoText.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                
                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                }
            } else {
                demoText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === currentPhrase.length) {
                    isPaused = true;
                }
            }
            
            const speed = isDeleting ? 30 : 60;
            setTimeout(type, speed);
        }
        
        setTimeout(type, 1000);
    }
}

// Pricing toggle (monthly/yearly)
function initPricingToggle() {
    const toggle = document.getElementById('billing-toggle');
    const priceElements = document.querySelectorAll('.price-amount[data-monthly]');
    const labels = document.querySelectorAll('.toggle-label');
    
    if (!toggle) return;
    
    toggle.addEventListener('change', () => {
        const isYearly = toggle.checked;
        
        priceElements.forEach(el => {
            el.textContent = isYearly ? el.dataset.yearly : el.dataset.monthly;
        });
        
        labels.forEach(label => {
            const period = label.dataset.period;
            if (period === 'monthly') {
                label.classList.toggle('active', !isYearly);
            } else if (period === 'yearly') {
                label.classList.toggle('active', isYearly);
            }
        });
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
                entry.target.classList.add('reveal', 'active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe various elements
    const animatedElements = document.querySelectorAll(
        '.feature-card, .agent-feature, .example-card, .skill-card, ' +
        '.security-card, .ios-feature, .testimonial-card, .pricing-card, ' +
        '.workflow-step, .code-feature, .faq-item'
    );
    
    animatedElements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(el);
    });
}

// Skills category filter
function initSkillsFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const skillCards = document.querySelectorAll('.skill-card');
    
    if (!categoryBtns.length) return;
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            
            // Filter cards
            skillCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.3s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Copy buttons
function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const text = btn.dataset.copy;
            
            try {
                await navigator.clipboard.writeText(text);
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                btn.style.background = 'var(--success)';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });
}

// Hotkey demo animation
function initHotkeyDemo() {
    const keys = document.querySelectorAll('.key-large');
    
    // Simulate key press animation
    function pressKeys() {
        keys.forEach((key, index) => {
            setTimeout(() => {
                key.style.transform = 'translateY(3px)';
                key.style.boxShadow = '0 3px 0 var(--bg-primary)';
                
                setTimeout(() => {
                    key.style.transform = '';
                    key.style.boxShadow = '';
                }, 150);
            }, index * 100);
        });
    }
    
    // Press keys periodically
    if (keys.length) {
        pressKeys();
        setInterval(pressKeys, 4000);
    }
}

// Animated counters
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
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
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;
    let current = 0;
    
    const valueEl = element.querySelector('.stat-value');
    if (!valueEl) return;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        valueEl.textContent = Math.floor(current).toLocaleString() + '+';
    }, stepDuration);
}

// Mobile menu
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuBtn || !navLinks) return;
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('mobile-open');
    });
}

// Progress bar animation
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        let width = 67;
        let direction = 1;
        
        setInterval(() => {
            width += direction * 0.5;
            if (width >= 85) direction = -1;
            if (width <= 55) direction = 1;
            bar.style.width = `${width}%`;
        }, 100);
    });
}

animateProgressBars();

// Parallax on floating cards
function initParallax() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    window.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.clientX) / 50;
        const y = (window.innerHeight / 2 - e.clientY) / 50;
        
        floatingCards.forEach((card, index) => {
            const factor = (index + 1) * 0.5;
            card.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    });
}

// Only on desktop
if (window.innerWidth > 1024) {
    initParallax();
}

// Testimonials infinite scroll (duplicate for seamless loop)
function initTestimonialsScroll() {
    const track = document.querySelector('.testimonials-grid');
    if (!track || window.innerWidth <= 768) return;
    
    const cards = track.innerHTML;
    track.innerHTML = cards + cards; // Duplicate for seamless loop
}

initTestimonialsScroll();

// Intersection observer for section headers
const sectionHeaders = document.querySelectorAll('.section-header');
const headerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease forwards';
        }
    });
}, { threshold: 0.3 });

sectionHeaders.forEach(header => headerObserver.observe(header));

// Easter egg console
console.log(`
%c██╗   ██╗ █████╗ ██╗   ██╗██╗  ████████╗██████╗  ██████╗ ████████╗
%c██║   ██║██╔══██╗██║   ██║██║  ╚══██╔══╝██╔══██╗██╔═══██╗╚══██╔══╝
%c██║   ██║███████║██║   ██║██║     ██║   ██████╔╝██║   ██║   ██║   
%c╚██╗ ██╔╝██╔══██║██║   ██║██║     ██║   ██╔══██╗██║   ██║   ██║   
%c ╚████╔╝ ██║  ██║╚██████╔╝███████╗██║   ██████╔╝╚██████╔╝   ██║   
%c  ╚═══╝  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝   ╚═════╝  ╚═════╝    ╚═╝   

%c🔐 Your AI. Your Rules. Your Vault.

%c✨ 65+ Swift files | 27,000+ lines | 3,800+ skills

%c🚀 Built with love for developers who demand privacy.

%c📱 macOS + iOS native apps available now!
`, 
'color: #7C3AED; font-weight: bold',
'color: #8B5CF6; font-weight: bold',
'color: #A78BFA; font-weight: bold',
'color: #06B6D4; font-weight: bold',
'color: #22D3EE; font-weight: bold',
'color: #67E8F9; font-weight: bold',
'color: #888; font-size: 14px; font-weight: bold',
'color: #7C3AED; font-size: 12px',
'color: #666; font-size: 12px',
'color: #06B6D4; font-size: 12px'
);

// Smooth reveal on page load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroContent) {
        heroContent.style.animation = 'fadeIn 0.8s ease forwards';
    }
    if (heroVisual) {
        heroVisual.style.animation = 'fadeIn 1s ease 0.3s forwards';
        heroVisual.style.opacity = '0';
    }
});

// Add loaded styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .nav-links.mobile-open {
        display: flex !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        background: rgba(10, 10, 15, 0.98);
        padding: var(--space-xl);
        border-bottom: 1px solid var(--border-color);
        gap: var(--space-md);
    }
    
    .mobile-menu-btn.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-btn.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-btn.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;
document.head.appendChild(style);
