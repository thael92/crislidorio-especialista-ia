// Funcionalidade do menu mobile
const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
const navList = document.querySelector('.nav-list');

mobileMenuIcon.addEventListener('click', () => {
    navList.classList.toggle('active');
    mobileMenuIcon.classList.toggle('active');
});

document.querySelectorAll('.nav-list a').forEach(navLink => {
    navLink.addEventListener('click', () => {
        navList.classList.remove('active');
        mobileMenuIcon.classList.remove('active');
    });
});

// Inicializar AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1200,
        easing: 'ease-in-out-cubic',
        once: true,
        offset: 100
    });
});

// Carrossel 3D Profissional
document.addEventListener('DOMContentLoaded', function() {
    const scene = document.getElementById('carousel3DScene');
    const slides = document.querySelectorAll('.carousel-3d-slide');
    const prevBtn = document.getElementById('prev3D');
    const nextBtn = document.getElementById('next3D');
    const paginationDots = document.querySelectorAll('.pagination-dot');
    
    let currentSlide = 0;
    let isTransitioning = false;
    const totalSlides = slides.length;
    
    // Configuração inicial dos slides
    function initSlides() {
        slides.forEach((slide, index) => {
            const angle = (360 / totalSlides) * index;
            slide.style.setProperty('--slide-index', index);
            slide.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(600px)`;
            
            if (index === 0) {
                slide.classList.add('active');
            }
        });
        updateScene();
    }
    
    // Atualiza a cena 3D
    function updateScene() {
        const angle = -(360 / totalSlides) * currentSlide;
        scene.style.transform = `rotateY(${angle}deg)`;
        
        // Atualiza slides ativos
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });
        
        // Atualiza indicação
        paginationDots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentSlide) {
                dot.classList.add('active');
            }
        });
    }
    
    // Função para ir para slide específico
    function goToSlide(index) {
        if (isTransitioning || index === currentSlide) return;
        
        isTransitioning = true;
        currentSlide = index;
        updateScene();
        
        // Libera transição após animação
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
    }
    
    // Próximo slide
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        goToSlide(next);
    }
    
    // Slide anterior
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prev);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Event listeners para paginação
    paginationDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Controle por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Auto-play do carrossel
    let autoplayInterval = setInterval(nextSlide, 6000);
    
    // Pausa autoplay na interação
    const carouselSection = document.querySelector('.carousel-3d-section');
    if (carouselSection) {
        carouselSection.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        
        carouselSection.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(nextSlide, 6000);
        });
    }
    
    // Suporte a touch/swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (carouselSection) {
        carouselSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(autoplayInterval);
        });
        
        carouselSection.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            autoplayInterval = setInterval(nextSlide, 6000);
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
    }
    
    // Inicializa o carrossel
    initSlides();
});

// Efeitos de paralaxe e animações tecnológicas
document.addEventListener('DOMContentLoaded', function() {
    // Efeito de paralaxe para elementos flutuantes
    function handleParallax() {
        const scrollY = window.scrollY;
        const techOrbs = document.querySelectorAll('.tech-orb');
        const floatingElements = document.querySelector('.floating-elements');
        
        if (floatingElements) {
            floatingElements.style.transform = `translateY(${scrollY * 0.1}px)`;
        }
        
        techOrbs.forEach((orb, index) => {
            const speed = 0.05 + (index * 0.02);
            const yPos = scrollY * speed;
            orb.style.transform = `translateY(${yPos}px) rotate(${scrollY * 0.1}deg)`;
        });
    }
    
    // Efeito de mouse para elementos interativos
    function handleMouseMove(e) {
        const mouseX = (e.clientX / window.innerWidth) * 100;
        const mouseY = (e.clientY / window.innerHeight) * 100;
        
        const techGrid = document.querySelector('.tech-grid');
        if (techGrid) {
            techGrid.style.transform = `translate(${mouseX * 0.02}px, ${mouseY * 0.02}px)`;
        }
        
        // Efeito nos cartões 3D
        const activeSlide = document.querySelector('.carousel-3d-slide.active');
        if (activeSlide) {
            const rect = activeSlide.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            
            const slideContainer = activeSlide.querySelector('.slide-3d-container');
            if (slideContainer) {
                slideContainer.style.transform = `rotateX(${y * 2}deg) rotateY(${x * 2}deg)`;
            }
        }
    }
    
    // Event listeners para efeitos
    window.addEventListener('scroll', handleParallax, { passive: true });
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Reset do efeito de mouse ao sair
    document.addEventListener('mouseleave', () => {
        const slideContainers = document.querySelectorAll('.slide-3d-container');
        slideContainers.forEach(container => {
            container.style.transform = '';
        });
    });
});

// Animações de entrada para elementos
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Observa elementos para animação
    const elementsToAnimate = document.querySelectorAll(
        '.section-title, .section-subtitle, .card-item-alt, .benefit-item-alt, .step-item-alt'
    );
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
});
