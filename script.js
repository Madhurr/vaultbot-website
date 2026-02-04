// ============================================
// VaultBot - Three.js Premium Experience
// ============================================

// Initialize Three.js
let scene, camera, renderer, particles, vault, iphone;
const canvas = document.getElementById('webgl-canvas');

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    camera.position.z = 5;
    
    createParticles();
    createHeroOrbs();
    animate();
}

function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const primaryColor = new THREE.Color(0x7C3AED);
    const secondaryColor = new THREE.Color(0x06B6D4);
    
    for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;
        
        const mixRatio = Math.random();
        const color = primaryColor.clone().lerp(secondaryColor, mixRatio);
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function createHeroOrbs() {
    // Main orb
    const geometry = new THREE.SphereGeometry(1.5, 64, 64);
    const material = new THREE.MeshBasicMaterial({
        color: 0x7C3AED,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    
    const orb = new THREE.Mesh(geometry, material);
    orb.position.set(3, 0, -2);
    scene.add(orb);
    
    // Inner orb
    const innerGeometry = new THREE.SphereGeometry(1, 32, 32);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0x06B6D4,
        transparent: true,
        opacity: 0.15,
        wireframe: true
    });
    
    const innerOrb = new THREE.Mesh(innerGeometry, innerMaterial);
    innerOrb.position.set(3, 0, -2);
    scene.add(innerOrb);
    
    // Rotating rings
    const ringGeometry = new THREE.TorusGeometry(2, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x7C3AED,
        transparent: true,
        opacity: 0.3
    });
    
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.position.set(3, 0, -2);
    ring1.rotation.x = Math.PI / 4;
    scene.add(ring1);
    
    const ring2 = ring1.clone();
    ring2.rotation.x = -Math.PI / 4;
    ring2.material = new THREE.MeshBasicMaterial({
        color: 0x06B6D4,
        transparent: true,
        opacity: 0.3
    });
    scene.add(ring2);
    
    gsap.to(ring1.rotation, {
        z: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: 'none'
    });
    
    gsap.to(ring2.rotation, {
        z: -Math.PI * 2,
        duration: 15,
        repeat: -1,
        ease: 'none'
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    if (particles) {
        particles.rotation.y += 0.0003;
        particles.rotation.x += 0.0001;
    }
    
    renderer.render(scene, camera);
}

// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    gsap.to(cursor, {
        x: mouseX - 6,
        y: mouseY - 6,
        duration: 0.1
    });
});

function updateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    if (cursorFollower) {
        cursorFollower.style.left = followerX - 20 + 'px';
        cursorFollower.style.top = followerY - 20 + 'px';
    }
    
    requestAnimationFrame(updateFollower);
}
updateFollower();

// Magnetic buttons
document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)'
        });
    });
});

// Cursor hover effect
document.querySelectorAll('a, button, .bento-card, .skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursorFollower.style.width = '60px';
        cursorFollower.style.height = '60px';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.width = '40px';
        cursorFollower.style.height = '40px';
    });
});

// Navigation
const nav = document.getElementById('nav');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// Smooth scroll
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

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero animations
gsap.from('.hero-badge', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    delay: 0.2
});

gsap.from('.hero-title .line', {
    opacity: 0,
    y: 100,
    duration: 1,
    stagger: 0.2,
    ease: 'power4.out',
    delay: 0.4
});

gsap.from('.hero-subtitle', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.8
});

gsap.from('.hero-cta', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
    delay: 1
});

gsap.from('.hero-stats', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
    delay: 1.2
});

// Scroll animations
gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse'
        }
    });
});

gsap.utils.toArray('.bento-card').forEach((card, i) => {
    gsap.from(card, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: i * 0.1,
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });
});

gsap.utils.toArray('.agent-feature').forEach((feature, i) => {
    gsap.from(feature, {
        opacity: 0,
        x: 50,
        duration: 0.8,
        delay: i * 0.1,
        scrollTrigger: {
            trigger: feature,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });
});

gsap.utils.toArray('.ios-feature').forEach((feature, i) => {
    gsap.from(feature, {
        opacity: 0,
        x: 50,
        duration: 0.8,
        delay: i * 0.1,
        scrollTrigger: {
            trigger: feature,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });
});

gsap.utils.toArray('.security-card').forEach((card, i) => {
    gsap.from(card, {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        delay: i * 0.05,
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });
});

gsap.utils.toArray('.testimonial').forEach((card, i) => {
    gsap.from(card, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: i * 0.1,
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });
});

gsap.utils.toArray('.pricing-card').forEach((card, i) => {
    gsap.from(card, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: i * 0.15,
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });
});

gsap.utils.toArray('.case-card').forEach((card, i) => {
    gsap.from(card, {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        delay: i * 0.05,
        scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Counter animation
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = duration / 60;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, stepTime);
}

// Observe counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const count = parseInt(entry.target.dataset.count);
            if (count) {
                animateCounter(entry.target, count);
            }
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
});

// Pricing toggle
const billingToggle = document.getElementById('billing-toggle');
const toggleLabels = document.querySelectorAll('.toggle-label');

if (billingToggle) {
    billingToggle.addEventListener('change', () => {
        const isYearly = billingToggle.checked;
        
        toggleLabels.forEach(label => {
            label.classList.toggle('active', 
                (isYearly && label.textContent.includes('Yearly')) ||
                (!isYearly && !label.textContent.includes('Yearly'))
            );
        });
        
        document.querySelectorAll('.amount[data-monthly]').forEach(el => {
            el.textContent = isYearly ? el.dataset.yearly : el.dataset.monthly;
        });
    });
}

// Copy code
function copyCode(btn) {
    const code = btn.previousElementSibling.textContent;
    navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = 'Copy';
        }, 2000);
    });
}

// Parallax on mouse move
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX - window.innerWidth / 2) / 50;
    const y = (e.clientY - window.innerHeight / 2) / 50;
    
    if (particles) {
        particles.position.x = x * 0.5;
        particles.position.y = -y * 0.5;
    }
    
    if (camera) {
        camera.position.x = x * 0.02;
        camera.position.y = -y * 0.02;
    }
});

// Window resize
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Create 3D vault animation
function createVault() {
    const container = document.getElementById('vault-3d');
    if (!container) return;
    
    const vaultScene = new THREE.Scene();
    const vaultCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const vaultRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    vaultRenderer.setSize(200, 200);
    container.appendChild(vaultRenderer.domElement);
    
    // Rings
    const ringGeometry = new THREE.TorusGeometry(1.2, 0.03, 16, 100);
    const ring1Material = new THREE.MeshBasicMaterial({ color: 0x7C3AED, transparent: true, opacity: 0.5 });
    const ring2Material = new THREE.MeshBasicMaterial({ color: 0x06B6D4, transparent: true, opacity: 0.5 });
    const ring3Material = new THREE.MeshBasicMaterial({ color: 0x7C3AED, transparent: true, opacity: 0.7 });
    
    const ring1 = new THREE.Mesh(ringGeometry, ring1Material);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.03, 16, 100), ring2Material);
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.03, 16, 100), ring3Material);
    
    vaultScene.add(ring1, ring2, ring3);
    
    // Shield
    const shieldGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const shieldMaterial = new THREE.MeshBasicMaterial({
        color: 0x7C3AED,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
    vaultScene.add(shield);
    
    vaultCamera.position.z = 3;
    
    function animateVault() {
        requestAnimationFrame(animateVault);
        ring1.rotation.x += 0.01;
        ring1.rotation.y += 0.005;
        ring2.rotation.x -= 0.008;
        ring2.rotation.z += 0.01;
        ring3.rotation.y += 0.015;
        ring3.rotation.z -= 0.008;
        shield.rotation.y += 0.01;
        vaultRenderer.render(vaultScene, vaultCamera);
    }
    animateVault();
}

// Create 3D iPhone
function createiPhone() {
    const container = document.getElementById('iphone-3d');
    if (!container) return;
    
    const iphoneScene = new THREE.Scene();
    const iphoneCamera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const iphoneRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    iphoneRenderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(iphoneRenderer.domElement);
    
    // iPhone body
    const bodyGeometry = new THREE.BoxGeometry(1.2, 2.5, 0.15);
    const bodyMaterial = new THREE.MeshBasicMaterial({
        color: 0x1a1a1a,
        transparent: true,
        opacity: 0.9
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    iphoneScene.add(body);
    
    // Screen
    const screenGeometry = new THREE.BoxGeometry(1.1, 2.3, 0.01);
    const screenMaterial = new THREE.MeshBasicMaterial({
        color: 0x0a0a0f
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.08;
    iphoneScene.add(screen);
    
    // Screen content (gradient)
    const contentGeometry = new THREE.PlaneGeometry(1, 2.1);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 256, 512);
    gradient.addColorStop(0, '#7C3AED');
    gradient.addColorStop(1, '#06B6D4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 512);
    
    // Add "V" logo
    ctx.fillStyle = 'white';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('V', 128, 200);
    
    ctx.font = '20px Arial';
    ctx.fillText('VaultBot', 128, 280);
    
    const contentTexture = new THREE.CanvasTexture(canvas);
    const contentMaterial = new THREE.MeshBasicMaterial({ map: contentTexture });
    const content = new THREE.Mesh(contentGeometry, contentMaterial);
    content.position.z = 0.085;
    iphoneScene.add(content);
    
    // Floating elements around phone
    const floatGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const floatMaterial = new THREE.MeshBasicMaterial({ color: 0x7C3AED, transparent: true, opacity: 0.5 });
    
    const floats = [];
    for (let i = 0; i < 5; i++) {
        const float = new THREE.Mesh(floatGeometry, floatMaterial);
        float.position.x = (Math.random() - 0.5) * 3;
        float.position.y = (Math.random() - 0.5) * 3;
        float.position.z = (Math.random() - 0.5) * 2;
        iphoneScene.add(float);
        floats.push(float);
    }
    
    iphoneCamera.position.z = 4;
    
    let mouseX = 0, mouseY = 0;
    
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });
    
    function animateiPhone() {
        requestAnimationFrame(animateiPhone);
        
        body.rotation.y = mouseX * 0.3;
        body.rotation.x = mouseY * 0.2;
        screen.rotation.y = mouseX * 0.3;
        screen.rotation.x = mouseY * 0.2;
        content.rotation.y = mouseX * 0.3;
        content.rotation.x = mouseY * 0.2;
        
        floats.forEach((float, i) => {
            float.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
            float.rotation.x += 0.01;
        });
        
        iphoneRenderer.render(iphoneScene, iphoneCamera);
    }
    animateiPhone();
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initThree();
    
    // Delay heavy 3D elements
    setTimeout(() => {
        createVault();
        createiPhone();
    }, 1000);
});

// Console easter egg
console.log(`
%c╔═══════════════════════════════════════════╗
%c║         VAULTBOT - Your AI That           ║
%c║              Never Sleeps                 ║
%c╠═══════════════════════════════════════════╣
%c║  🔐 100% Private      📱 iOS Companion    ║
%c║  🤖 3,800+ Skills     ⚡ Autonomous       ║
%c╚═══════════════════════════════════════════╝
%c
%c🚀 Download: https://vaultbot.ai
%c💼 Careers: https://vaultbot.ai/careers
`, 
'color: #7C3AED; font-weight: bold;',
'color: #8B5CF6;',
'color: #A78BFA;',
'color: #8B5CF6;',
'color: #06B6D4;',
'color: #22D3EE;',
'color: #7C3AED; font-weight: bold;',
'color: #666;',
'color: #7C3AED;',
'color: #06B6D4;'
);
