// Solar System Interactive Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initScrollAnimations();
    initNavigation();
    initOrbitMap();
    // initFactsSlider(); // WYŁĄCZONE - slider został zastąpiony kartami
    initParallax();
    initMobileMenu();
    initRealTimePlanets();
    initCTAButton();
    initScrollingFacts();
    initScrollNavigation();
    initEventUpdates();
});

// Simple planet orbits with random start positions
function initRealTimePlanets() {
    // Losowe pozycje startowe dla planet
    document.querySelectorAll(".orbit-planet").forEach(planet => {
        const randomDeg = Math.floor(Math.random() * 360);
        // Ustawiamy losowy delay animacji zamiast transform
        const animationName = window.getComputedStyle(planet).animationName;
        const animationDuration = window.getComputedStyle(planet).animationDuration;
        
        if (animationName !== 'none') {
            // Obliczamy delay na podstawie losowego kąta
            const durationMs = parseFloat(animationDuration) * 1000;
            const randomDelay = -(randomDeg / 360) * durationMs;
            
            planet.style.animationDelay = `${randomDelay}ms`;
        }
    });
    console.log('Planet orbits initialized with random start positions');
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
            }
        });
    }, observerOptions);

    // Observe planet cards
    document.querySelectorAll('.planet-card').forEach(card => {
        observer.observe(card);
    });

    // Observe other elements for fade-in animations
    document.querySelectorAll('.fade-in-up').forEach(element => {
        observer.observe(element);
    });
}

// NOWA NAWIGACJA - przepisana od zera
function initNavigation() {
    console.log('🚀 Inicjalizacja nawigacji...');
    
    // Mapa sekcji z ich offsetami
    const sectionOffsets = {
        '#hero': 0,
        '#sun-section': 120,
        '#planets': 120,
        '#mercury-section': 200,
        '#venus-section': 120,
        '#earth-section': 120,
        '#mars-section': 120,
        '#jupiter-section': 120,
        '#saturn-section': 120,
        '#uranus-section': 120,
        '#neptune-section': 120,
        '#orbit-map': 50,
        '#events': 50,
        '#facts': 50
    };
    
    // Znajdź wszystkie linki nawigacyjne
    const navLinks = document.querySelectorAll('.nav-link');
    console.log(`📍 Znaleziono ${navLinks.length} linków nawigacyjnych`);
    
    // Funkcja do przewijania do sekcji
    function scrollToSection(targetId) {
        const targetElement = document.querySelector(targetId);
        
        if (!targetElement) {
            console.error(`❌ Nie znaleziono sekcji: ${targetId}`);
            return;
        }
        
        let scrollPosition;
        
        if (targetId === '#hero') {
            scrollPosition = 0;
        } else {
            const elementRect = targetElement.getBoundingClientRect();
            const elementTop = elementRect.top + window.pageYOffset;
            const offset = sectionOffsets[targetId] || 100;
            scrollPosition = elementTop - offset;
        }
        
        console.log(`📍 Przewijam do ${targetId}, pozycja: ${scrollPosition}`);
        
        window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
        });
    }
    
    // Funkcja do podświetlania aktywnego linku
    function setActiveLink(activeLink) {
        // Usuń aktywność ze wszystkich linków
        navLinks.forEach(link => {
            link.classList.remove('nav-active');
            link.classList.add('text-gray-300');
        });
        
        // Dodaj aktywność do wybranego linku
        if (activeLink) {
            activeLink.classList.remove('text-gray-300');
            activeLink.classList.add('nav-active');
            console.log(`✨ Podświetlono: ${activeLink.getAttribute('href')}`);
        }
    }
    
    // Dodaj event listenery do wszystkich linków nawigacyjnych
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            console.log(`🖱️ Kliknięto: ${targetId}`);
            
            // Przewiń do sekcji
            scrollToSection(targetId);
            
            // Podświetl aktywny link
            setActiveLink(this);
        });
    });
    
    // Dodaj event listenery do linków w dropdown
    const dropdownLinks = document.querySelectorAll('.group a[href^="#"]');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            console.log(`🖱️ Kliknięto dropdown: ${targetId}`);
            
            // Przewiń do sekcji
            scrollToSection(targetId);
        });
    });
    
    // Automatyczne podświetlanie będzie ustawione przez initScrollNavigation()
    console.log('☀️ Automatyczne podświetlanie nawigacji będzie zarządzane przez scroll');
    
    // Obsługa przycisku strzałki w hero
    const scrollDownBtn = document.getElementById('scroll-down-btn');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', () => {
            scrollToSection('#sun-section');
        });
    }
    
    // Obsługa przycisku "Rozpocznij podróż"
    const startJourneyBtn = document.getElementById('start-journey-btn');
    if (startJourneyBtn) {
        startJourneyBtn.addEventListener('click', () => {
            scrollToSection('#planets');
        });
    }
    
    console.log('✅ Nawigacja zainicjalizowana pomyślnie!');
}

// Funkcja inicjalizacji przewijających się ciekawostek
function initScrollingFacts() {
    const scrollTrack = document.querySelector('.facts-scroll-track');
    
    if (scrollTrack) {
        // Losowy start - używamy CSS animation-delay
        const randomDelay = Math.random() * 60; // 0-60 sekund
        
        // Ustaw losowy delay i włącz animację
        scrollTrack.style.animationDelay = `-${randomDelay}s`;
        scrollTrack.classList.add('animate-scroll-left');
        
        console.log(`🎲 Ciekawostki startują z losowego momentu: ${randomDelay.toFixed(1)}s`);
    }
}

// Funkcja rozpraszania ciekawostek - USUNIĘTA
// Powodowała problemy z losowym wyświetlaniem

// Funkcja automatycznego podświetlania nawigacji podczas scrollowania
function initScrollNavigation() {
    let ticking = false;
    let lastScrollTime = 0;
    
    function updateActiveNavOnScroll() {
        const scrollPosition = window.pageYOffset + 150; // offset dla navbar
        let currentSection = '#hero'; // domyślnie
        
        // Funkcja do obliczania rzeczywistej pozycji elementu w dokumencie
        function getElementTop(element) {
            let top = 0;
            while (element) {
                top += element.offsetTop;
                element = element.offsetParent;
            }
            return top;
        }
        
        // Lista sekcji w kolejności od góry do dołu
        const sections = [
            { id: '#hero', element: document.querySelector('#hero') },
            { id: '#sun-section', element: document.querySelector('#sun-section') },
            { id: '#planets', element: document.querySelector('#planets') },
            { id: '#mercury-section', element: document.querySelector('#mercury-section') },
            { id: '#venus-section', element: document.querySelector('#venus-section') },
            { id: '#earth-section', element: document.querySelector('#earth-section') },
            { id: '#mars-section', element: document.querySelector('#mars-section') },
            { id: '#jupiter-section', element: document.querySelector('#jupiter-section') },
            { id: '#saturn-section', element: document.querySelector('#saturn-section') },
            { id: '#uranus-section', element: document.querySelector('#uranus-section') },
            { id: '#neptune-section', element: document.querySelector('#neptune-section') },
            { id: '#orbit-map', element: document.querySelector('#orbit-map') },
            { id: '#events', element: document.querySelector('#events') },
            { id: '#facts', element: document.querySelector('#facts') }
        ];
        
        // Znajdź aktualną sekcję - sprawdzaj od końca do początku
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section.element) {
                const sectionTop = getElementTop(section.element);
                
                if (scrollPosition >= sectionTop - 100) {
                    currentSection = section.id;
                    break;
                }
            }
        }
        
        // console.log(`📍 Scroll: ${scrollPosition}, Aktywna sekcja: ${currentSection}`);
        
        // Podświetl odpowiedni link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('nav-active');
            link.classList.add('text-gray-300');
            
            if (link.getAttribute('href') === currentSection) {
                link.classList.remove('text-gray-300');
                link.classList.add('nav-active');
            }
        });
        
        ticking = false;
    }
    
    function requestTick() {
        const now = Date.now();
        if (!ticking && now - lastScrollTime > 50) { // throttle do 20fps
            requestAnimationFrame(() => {
                updateActiveNavOnScroll();
                lastScrollTime = now;
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Dodaj event listener na scroll
    window.addEventListener('scroll', requestTick);
    
    // Uruchom raz na starcie
    updateActiveNavOnScroll();
    
    console.log('📍 Automatyczne podświetlanie nawigacji włączone');
}

// Funkcja automatycznej aktualizacji wydarzeń
function initEventUpdates() {
    console.log('📅 Inicjalizacja automatycznych aktualizacji wydarzeń...');
    
    // Funkcja do obliczania dni do wydarzenia
    function getDaysUntilEvent(dateString) {
        if (dateString === 'daily') return 0;
        
        const eventDate = new Date(dateString);
        const today = new Date();
        const diffTime = eventDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays;
    }
    
    // Funkcja do formatowania daty
    function formatEventDate(dateString, daysUntil) {
        if (dateString === 'daily') return 'Codziennie o różnych godzinach';
        
        const eventDate = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        const formattedDate = eventDate.toLocaleDateString('pl-PL', options);
        
        if (daysUntil < 0) {
            return `${formattedDate} (minęło)`;
        } else if (daysUntil === 0) {
            return `${formattedDate} (dziś!)`;
        } else if (daysUntil === 1) {
            return `${formattedDate} (jutro!)`;
        } else if (daysUntil <= 7) {
            return `${formattedDate} (za ${daysUntil} dni)`;
        } else if (daysUntil <= 30) {
            return `${formattedDate} (za ${daysUntil} dni)`;
        } else {
            return formattedDate;
        }
    }
    
    // Funkcja do aktualizacji statusu wydarzenia
    function updateEventStatus() {
        const eventCards = document.querySelectorAll('.event-card[data-date]');
        
        eventCards.forEach(card => {
            const dateString = card.getAttribute('data-date');
            const daysUntil = getDaysUntilEvent(dateString);
            const dateElement = card.querySelector('.text-cosmic-blue');
            
            if (dateElement) {
                dateElement.textContent = formatEventDate(dateString, daysUntil);
                
                // Dodaj specjalne style dla nadchodzących wydarzeń
                card.classList.remove('event-soon', 'event-today', 'event-past');
                
                if (daysUntil < 0) {
                    card.classList.add('event-past');
                    card.style.opacity = '0.6';
                } else if (daysUntil === 0) {
                    card.classList.add('event-today');
                    card.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.5)';
                } else if (daysUntil <= 7 && daysUntil > 0) {
                    card.classList.add('event-soon');
                    card.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.4)';
                } else {
                    card.style.opacity = '1';
                    card.style.boxShadow = '';
                }
            }
        });
        
        console.log('📅 Wydarzenia zaktualizowane');
    }
    
    // Aktualizuj wydarzenia na starcie
    updateEventStatus();
    
    // Aktualizuj wydarzenia co godzinę
    setInterval(updateEventStatus, 3600000); // 1 godzina = 3600000ms
    
    // Aktualizuj wydarzenia o północy
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
        updateEventStatus();
        // Następnie aktualizuj codziennie o północy
        setInterval(updateEventStatus, 24 * 60 * 60 * 1000); // 24 godziny
    }, msUntilMidnight);
    
    console.log('✅ Automatyczne aktualizacje wydarzeń włączone');
}

function updateActiveNavLink() {
    // Funkcja wyłączona - używamy tylko ręcznego podświetlania po kliknięciu
    // Automatyczne podświetlanie podczas scrollowania jest wyłączone
    return;
}

// Interactive orbit map
function initOrbitMap() {
    const orbitPlanets = document.querySelectorAll('.orbit-planet');
    const infoPanel = document.getElementById('planet-info-panel');
    const panelTitle = document.getElementById('panel-title');
    const panelDescription = document.getElementById('panel-description');
    
    const planetInfo = {
        mercury: {
            title: 'Merkury ☿️',
            description: 'Najbliższa Słońcu planeta. Dzień na Merkurym trwa 176 dni ziemskich, podczas gdy rok to tylko 88 dni! Temperatura waha się od -173°C w nocy do 427°C w dzień.'
        },
        venus: {
            title: 'Wenus ♀️',
            description: 'Najgorętsza planeta w Układzie Słonecznym z temperaturą powierzchni 462°C. Gęsta atmosfera CO₂ tworzy ekstremalny efekt cieplarniany. Obraca się w przeciwnym kierunku niż większość planet.'
        },
        earth: {
            title: 'Ziemia 🌍',
            description: 'Jedyna znana planeta z życiem! 71% powierzchni pokrywa woda. Atmosfera chroni nas przed szkodliwym promieniowaniem kosmicznym. Ma jeden naturalny satelitę - Księżyc.'
        },
        mars: {
            title: 'Mars ♂️',
            description: 'Czerwona planeta z największą górą w Układzie Słonecznym - Olympus Mons (21 km wysokości). Ma dwa małe księżyce: Phobos i Deimos. Naukowcy szukają śladów dawnego życia.'
        },
        jupiter: {
            title: 'Jowisz 🪐',
            description: 'Największa planeta Układu Słonecznego! Gazowy gigant z Wielką Czerwoną Plamą - burzą większą od Ziemi, trwającą już ponad 400 lat. Ma ponad 80 księżyców, w tym 4 galileuszowe: Io, Europa, Ganimedes i Kallisto.'
        },
        saturn: {
            title: 'Saturn 🪐',
            description: 'Planeta z najspektakularniejszymi pierścieniami w Układzie Słonecznym! Tak lekka, że mogłaby pływać w wodzie. Ma ponad 80 księżyców, w tym Tytan z gęstą atmosferą i jeziorami metanu.'
        },
        uranus: {
            title: 'Uran 🔵',
            description: 'Lodowy gigant obracający się "na boku" z nachyleniem osi 98°! Ma słabe pierścienie i 27 księżyców. Pory roku trwają po 21 lat ziemskich. Temperatura może spaść do -224°C.'
        },
        neptune: {
            title: 'Neptun 🔷',
            description: 'Najdalej od Słońca i najwętrniejsza planeta! Wiatry osiągają prędkość do 2100 km/h - najszybsze w Układzie Słonecznym. Ma 14 księżyców, w tym Tryton krążący wstecz.'
        }
    };
    
    orbitPlanets.forEach(planet => {
        planet.addEventListener('click', function() {
            const planetType = this.getAttribute('data-info');
            const info = planetInfo[planetType];
            
            if (info) {
                panelTitle.textContent = info.title;
                panelDescription.textContent = info.description;
                infoPanel.classList.remove('hidden');
                
                // Smooth scroll to panel
                infoPanel.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
                
                // Add highlight effect
                this.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 300);
            }
        });
        
        // Hover effects
        planet.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
            this.style.filter = 'brightness(1.3)';
        });
        
        planet.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.filter = 'brightness(1)';
        });
    });
}

// Facts slider functionality
function initFactsSlider() {
    const slides = document.querySelectorAll('.fact-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Update total slides count for new facts
    console.log(`Total slides: ${totalSlides}`);
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active state from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto-advance slides every 8 seconds (more time for reading longer facts)
    let autoSlideInterval = setInterval(nextSlide, 8000);
    
    // Pause auto-advance on hover
    const sliderContainer = document.querySelector('.facts-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 8000);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
}

// Parallax scrolling effect
function initParallax() {
    const starsLayers = document.querySelectorAll('[class^="stars-layer"]');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        starsLayers.forEach((layer, index) => {
            const speed = (index + 1) * 0.2;
            layer.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            // Toggle mobile menu (you can expand this functionality)
            console.log('Mobile menu clicked');
        });
    }
}

// Hero CTA button functionality
function initCTAButton() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            // Smooth scroll to planets section
            const planetsSection = document.getElementById('planets');
            if (planetsSection) {
                const offsetTop = planetsSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Planet hover effects enhancement
function enhancePlanetEffects() {
    const planets = document.querySelectorAll('.planet');
    
    planets.forEach(planet => {
        planet.addEventListener('mouseenter', function() {
            // Add glow effect
            this.style.boxShadow = '0 0 40px rgba(139, 92, 246, 0.8)';
            this.style.transform = 'scale(1.1) rotate(10deg)';
        });
        
        planet.addEventListener('mouseleave', function() {
            // Remove glow effect
            this.style.boxShadow = '';
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Initialize enhanced effects after DOM load
document.addEventListener('DOMContentLoaded', enhancePlanetEffects);


// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loading');
});

// Performance optimization: Throttle scroll events - USUNIĘTE
// Automatyczne podświetlanie nawigacji przy scrollowaniu jest wyłączone

// Add intersection observer for performance
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

// Lazy loading for heavy animations
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements that need animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });
});

// Easter egg: Konami code for special effect
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Special cosmic effect
        document.body.style.animation = 'cosmic-explosion 2s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
        
        konamiCode = [];
    }
});

// Add cosmic explosion animation
const style = document.createElement('style');
style.textContent = `
    @keyframes cosmic-explosion {
        0% { filter: hue-rotate(0deg) brightness(1); }
        25% { filter: hue-rotate(90deg) brightness(1.5); }
        50% { filter: hue-rotate(180deg) brightness(2); }
        75% { filter: hue-rotate(270deg) brightness(1.5); }
        100% { filter: hue-rotate(360deg) brightness(1); }
    }
`;
document.head.appendChild(style);
