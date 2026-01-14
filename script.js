// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const gridItems = document.querySelectorAll('.project-grid-item, .gallery-item');
const video = document.getElementById('portfolio-video');
const videoOverlay = document.getElementById('video-overlay');
const playButton = document.getElementById('play-button');

// ===== Mobile Navigation =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== Navbar Scroll Effect =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 30px rgba(45, 52, 54, 0.08)';
        navbar.style.background = 'rgba(253, 251, 247, 0.95)';
    } else {
        navbar.style.boxShadow = 'none';
        navbar.style.background = 'rgba(253, 251, 247, 0.85)';
    }

    lastScroll = currentScroll;
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ===== Video Player =====
if (video && videoOverlay && playButton) {
    playButton.addEventListener('click', () => {
        videoOverlay.classList.add('hidden');
        video.play();
    });

    video.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            videoOverlay.classList.add('hidden');
        } else {
            video.pause();
        }
    });

    video.addEventListener('ended', () => {
        videoOverlay.classList.remove('hidden');
    });

    video.addEventListener('pause', () => {
        // Show overlay only if video ended or user paused
        if (video.currentTime === video.duration || video.currentTime === 0) {
            videoOverlay.classList.remove('hidden');
        }
    });
}

// ===== Lightbox Functionality =====
gridItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Also add lightbox for project images
const projectImages = document.querySelectorAll('.project-image img, .gallery-item img');
projectImages.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

function closeLightbox() {
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Scroll Reveal Animation =====
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply reveal animation - faster with no stagger delay for main sections
const revealElements = document.querySelectorAll('.project-showcase, .project-grid-section, .about-left, .about-right');
revealElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    observer.observe(el);
});

// Skill items - minimal stagger
const skillItems = document.querySelectorAll('.skill-item-new');
skillItems.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(15px)';
    el.style.transition = `opacity 0.25s ease ${Math.min(index * 0.03, 0.15)}s, transform 0.25s ease ${Math.min(index * 0.03, 0.15)}s`;
    observer.observe(el);
});

// Grid items - very fast stagger, capped at 0.2s max delay
const gridItemsAll = document.querySelectorAll('.project-grid-item');
gridItemsAll.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = `opacity 0.2s ease ${Math.min(index * 0.02, 0.2)}s, transform 0.2s ease ${Math.min(index * 0.02, 0.2)}s`;
    observer.observe(el);
});

// ===== Parallax Effect on Hero =====
const heroImage = document.querySelector('.hero-image');
const floatingCards = document.querySelectorAll('.floating-card');

if (heroImage) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;

            floatingCards.forEach((card, index) => {
                const speed = 0.05 + (index * 0.02);
                card.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
    });
}

// ===== Mouse Move Effect on Hero =====
const hero = document.querySelector('.hero');
const shapes = document.querySelectorAll('.shape');

if (hero && shapes.length > 0) {
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        shapes.forEach((shape, index) => {
            const speed = 0.02 + (index * 0.01);
            const x = (clientX - centerX) * speed;
            const y = (clientY - centerY) * speed;
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// ===== Console Welcome =====
console.log('%c👋 Welcome to Baldyas Satrio Albani Portfolio!', 'font-size: 18px; font-weight: bold; color: #7C9885;');
console.log('%c🎨 Graphic Designer | Visual Communication Design', 'font-size: 14px; color: #636E72;');
console.log('%c📍 Based in Jakarta, Indonesia', 'font-size: 12px; color: #B2BEC3;');
