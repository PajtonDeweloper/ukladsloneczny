// Optimized page initialization
(function() {
    'use strict';
    
    // Force scroll to top on page load
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    
    // Loading Screen
    window.addEventListener('load', function() {
        const loader = document.querySelector('.loader-wrapper');
    
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            // Initialize scroll animations after loading
            initScrollAnimations();
            enhanceFloatingShapes();
            // Set initial active section
            updateActiveSection();
        }, 500);
    }, 2000);
});

// Mobile Navigation - Optimized
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        this.blur();
    }, { passive: false });
}

// Navigation links handler - Optimized
function initNavigationLinks() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navLinks.length) return;
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Close mobile menu
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            this.blur();
        });
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Skip smooth scrolling for privacy policy link
        if (this.id === 'privacy-link') {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Update active state for footer links too
            if (this.closest('.footer-links')) {
                document.querySelectorAll('.footer-links a').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
            
            // Remove focus to prevent outline
            this.blur();
        }
    });
});

// Navbar Background on Scroll (with throttling)
let ticking = false;

function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    ticking = false;
}

// Active Section Tracking
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const footerLinks = document.querySelectorAll('.footer-links a[href^="#"]');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 100; // Offset for navbar height
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Update nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
    
    // Update footer links
    footerLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function handleScroll() {
    updateNavbar();
    updateActiveSection();
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
    }
});

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation classes and observe elements
    const animateElements = [
        { selector: '.about-content .about-image', class: 'slide-in-left' },
        { selector: '.about-content .about-text', class: 'slide-in-right' },
        { selector: '.service-card', class: 'fade-in' },
        { selector: '.approach-content .approach-text', class: 'slide-in-left' },
        { selector: '.approach-content .approach-visual', class: 'slide-in-right' },
        { selector: '.testimonial-card', class: 'fade-in' },
        { selector: '.faq-intro', class: 'slide-in-left' },
        { selector: '.faq-list', class: 'slide-in-right' },
        { selector: '.pricing-card', class: 'fade-in' },
        { selector: '.contact-info-column', class: 'slide-in-left' },
        { selector: '.contact-form-container', class: 'slide-in-right' },
        { selector: '.principle', class: 'fade-in' }
    ];

    animateElements.forEach(({ selector, class: className }) => {
        document.querySelectorAll(selector).forEach((element, index) => {
            element.classList.add(className);
            element.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(element);
        });
    });
}

// Floating Shapes Animation Enhancement (optimized) - DISABLED MOUSE INTERACTION
function enhanceFloatingShapes() {
    const shapes = document.querySelectorAll('.floating-shape');
    
    // Remove any mouse interaction - shapes will only use CSS animation
    shapes.forEach((shape) => {
        shape.style.transform = 'none';
        shape.style.transition = 'none';
    });
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    if (!data.name || !data.email || !data.message || !data.privacy) {
        showNotification('Proszę wypełnić wszystkie wymagane pola.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Proszę podać prawidłowy adres email.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Wysyłanie...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        showNotification('Dziękuję za wiadomość! Odpowiem w ciągu 24 godzin.', 'success');
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? '#8fbc8f' : type === 'error' ? '#d2691e' : '#8b7d6b'};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: auto;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Breathing Animation for Hero Elements
function initBreathingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    if (heroTitle && heroSubtitle) {
        let breathePhase = 0;
        
        setInterval(() => {
            breathePhase += 0.02;
            const scale = 1 + Math.sin(breathePhase) * 0.005;
            const opacity = 0.8 + Math.sin(breathePhase * 0.7) * 0.2;
            
            heroTitle.style.transform = `scale(${scale})`;
            heroSubtitle.style.opacity = opacity;
        }, 50);
    }
}

// Parallax Effect for Hero Section - DISABLED
function initParallaxEffect() {
    const heroImage = document.querySelector('.hero-img');
    
    if (heroImage) {
        // Completely disable parallax - keep image static
        heroImage.style.transform = 'none';
        heroImage.style.position = 'static';
    }
}

// Form Field Animation Enhancement
function enhanceFormFields() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');
        
        if (input && label) {
            // Check if field has value on page load
            if (input.value) {
                label.style.top = '-10px';
                label.style.fontSize = '12px';
                label.style.background = 'white';
                label.style.padding = '0 8px';
                label.style.color = '#8fbc8f';
            }
            
            input.addEventListener('input', () => {
                if (input.value) {
                    label.style.top = '-10px';
                    label.style.fontSize = '12px';
                    label.style.background = 'white';
                    label.style.padding = '0 8px';
                    label.style.color = '#8fbc8f';
                } else {
                    label.style.top = '12px';
                    label.style.fontSize = '14px';
                    label.style.background = 'transparent';
                    label.style.padding = '0';
                    label.style.color = '#8a8a8a';
                }
            });
        }
    });
}

// Service Cards Hover Effect Enhancement
function enhanceServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add subtle rotation and glow
            card.style.transform = 'translateY(-10px) rotate(1deg)';
            card.style.boxShadow = '0 20px 60px rgba(143, 188, 143, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset transform for all cards
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Testimonial Cards Hover Effect Enhancement
function enhanceTestimonialCards() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add subtle rotation and glow
            card.style.transform = 'translateY(-10px) rotate(1deg)';
            card.style.boxShadow = '0 20px 60px rgba(143, 188, 143, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset transform
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Pricing Cards Hover Effect Enhancement
function enhancePricingCards() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add subtle rotation and glow
            card.style.transform = 'translateY(-10px) rotate(1deg)';
            card.style.boxShadow = '0 20px 60px rgba(143, 188, 143, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset transform
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
        });
    });
}

// ===== OPTIMIZED CODE STRUCTURE =====
// All initialization functions are now consolidated into a single DOMContentLoaded event
// Removed duplicate event listeners and unused code

// Accessibility improvements
function improveAccessibility() {
    // Add focus indicators
    const focusableElements = document.querySelectorAll('a, button, input, textarea, [tabindex]');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid #8fbc8f';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = 'none';
        });
    });
    
    // Add ARIA labels where needed
    const hamburgerBtn = document.querySelector('.hamburger');
    if (hamburgerBtn) {
        hamburgerBtn.setAttribute('aria-label', 'Toggle navigation menu');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        
        hamburgerBtn.addEventListener('click', () => {
            const isExpanded = hamburgerBtn.classList.contains('active');
            hamburgerBtn.setAttribute('aria-expanded', isExpanded);
        });
    }
}

// FAQ Functionality - Optimized for all devices with scroll detection
function initFAQFunctionality() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        // Variables to track touch/scroll behavior
        let touchStartY = 0;
        let touchStartTime = 0;
        let isScrolling = false;
        
        // Touch start - record initial position
        question.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            isScrolling = false;
        }, { passive: true });
        
        // Touch move - detect if user is scrolling
        question.addEventListener('touchmove', function(e) {
            const touchY = e.touches[0].clientY;
            const deltaY = Math.abs(touchY - touchStartY);
            
            // If moved more than 10px vertically, consider it scrolling
            if (deltaY > 10) {
                isScrolling = true;
            }
        }, { passive: true });
        
        // Touch end - only trigger if not scrolling
        question.addEventListener('touchend', function(e) {
            const touchDuration = Date.now() - touchStartTime;
            
            // Only trigger if:
            // 1. Not scrolling
            // 2. Touch duration less than 300ms (quick tap)
            // 3. Not currently animating
            if (!isScrolling && touchDuration < 300 && item.dataset.animating !== 'true') {
                e.preventDefault();
                toggleFAQ(item);
            }
        }, { passive: false });
        
        // Click event for desktop and as fallback
        question.addEventListener('click', function(e) {
            // Prevent if this was triggered by touch (avoid double trigger)
            if (e.detail === 0) return; // detail === 0 means triggered by touch
            
            e.preventDefault();
            toggleFAQ(item);
        });
        
        // Keyboard support
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(item);
            }
        });
        
        // FAQ toggle function
        function toggleFAQ(faqItem) {
            // Debounce - prevent rapid clicks during animation
            if (faqItem.dataset.animating === 'true') return;
            faqItem.dataset.animating = 'true';
            
            // Toggle active state
            faqItem.classList.toggle('active');
            
            // Reset debounce after animation completes (300ms)
            setTimeout(() => {
                faqItem.dataset.animating = 'false';
            }, 300);
            
            // Remove focus to prevent outline
            question.blur();
        }
        
        // Accessibility attributes
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        
        // Update aria-expanded when toggled
        const observer = new MutationObserver(() => {
            const isExpanded = item.classList.contains('active');
            question.setAttribute('aria-expanded', isExpanded);
        });
        
        observer.observe(item, { attributes: true, attributeFilter: ['class'] });
    });
}

// Removed - consolidated into main DOMContentLoaded

// Contact Icons Functionality
function initContactIcons() {
    const clickableIcons = document.querySelectorAll('.clickable-icon');
    
    clickableIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            
            const action = icon.dataset.action;
            const value = icon.dataset.value;
            
            switch(action) {
                case 'phone':
                    // Otwórz aplikację telefonu
                    window.location.href = `tel:${value}`;
                    showNotification('Otwieranie aplikacji telefonu...', 'info');
                    break;
                    
                case 'email':
                    // Otwórz aplikację email z predefiniowanym tematem
                    const subject = 'Zapytanie o terapię psychologiczną';
                    const body = 'Dzień dobry,%0D%0A%0D%0AChciałbym/Chciałabym zapytać o możliwość umówienia wizyty.%0D%0A%0D%0APozdrawiam';
                    window.location.href = `mailto:${value}?subject=${encodeURIComponent(subject)}&body=${body}`;
                    showNotification('Otwieranie aplikacji email...', 'info');
                    break;
                    
                case 'maps':
                    // Otwórz Google Maps z adresem
                    const encodedAddress = encodeURIComponent(value);
                    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
                    window.open(mapsUrl, '_blank');
                    showNotification('Otwieranie Google Maps...', 'success');
                    break;
                    
                default:
                    console.log('Nieznana akcja:', action);
            }
            
            // Dodaj efekt kliknięcia
            icon.style.transform = 'scale(0.9)';
            setTimeout(() => {
                icon.style.transform = '';
            }, 150);
        });
        
        // Dodaj efekt hover na touch devices
        icon.addEventListener('touchstart', () => {
            icon.style.transform = 'scale(1.05)';
        });
        
        icon.addEventListener('touchend', () => {
            setTimeout(() => {
                icon.style.transform = '';
            }, 100);
        });
        
        // Dodaj accessibility
        icon.setAttribute('role', 'button');
        icon.setAttribute('tabindex', '0');
        
        // Keyboard support
        icon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                icon.click();
            }
        });
    });
}

// Removed - consolidated into main DOMContentLoaded

// Modal Functionality (Privacy Policy & Regulations)
function initModalFunctionality() {
    const privacyModal = document.getElementById('privacy-modal');
    const regulationsModal = document.getElementById('regulations-modal');
    const privacyLink = document.getElementById('privacy-link');
    const regulationsLink = document.getElementById('regulations-link');
    const closeBtns = document.querySelectorAll('.close');

    // Open privacy modal
    privacyLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        privacyModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Show close button with smooth animation
        const closeBtn = privacyModal.querySelector('.close');
        if (closeBtn) {
            setTimeout(() => {
                closeBtn.classList.add('show');
            }, 100);
        }
        return false;
    });

    // Open regulations modal
    regulationsLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        regulationsModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Show close button with smooth animation
        const closeBtn = regulationsModal.querySelector('.close');
        if (closeBtn) {
            setTimeout(() => {
                closeBtn.classList.add('show');
            }, 100);
        }
        return false;
    });

    // Function to close modals
    function closeModals() {
        privacyModal.style.display = 'none';
        regulationsModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Hide all close buttons with smooth animation
        closeBtns.forEach(btn => {
            btn.classList.remove('show');
        });
    }

    // Close modals when X is clicked
    closeBtns.forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            closeModals();
        });
        
        // Initially hide close buttons (already hidden by CSS)
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === privacyModal || e.target === regulationsModal) {
            closeModals();
        }
    });

    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (privacyModal.style.display === 'block' || regulationsModal.style.display === 'block') {
                closeModals();
            }
        }
    });
}

// Initialize all functions when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Force scroll to top
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Initialize all components
    initMobileNavigation();
    initNavigationLinks();
    initFAQFunctionality();
    initContactIcons();
    initModalFunctionality();
    improveAccessibility();
    
    // Initialize enhancements
    enhanceFloatingShapes();
    initBreathingAnimation();
    initParallaxEffect();
    enhanceFormFields();
    enhanceServiceCards();
    enhanceTestimonialCards();
    enhancePricingCards();
});

})(); // End of IIFE
