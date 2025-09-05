// ===== CRISTIANE LIDÓRIO - JAVASCRIPT PREMIUM =====
// Animações Cinematográficas e Interações Avançadas

document.addEventListener('DOMContentLoaded', function() {
    // ===== INICIALIZAÇÃO GERAL =====
    initializeAOS();
    initializeBackgroundCanvas();
    initializeScrollEffects();
    initializeMobileMenu();
    initializeVideoEffects();
    initializeGalleryEffects();
    initializeSmoothScrolling();
    initializePerformanceOptimizations();
    
    // ===== INICIALIZAR AOS (ANIMATE ON SCROLL) =====
    function initializeAOS() {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            delay: 100,
            disable: 'mobile'
        });
    }

    // ===== CANVAS ANIMADO DE FUNDO =====
    function initializeBackgroundCanvas() {
        const canvas = document.getElementById('backgroundCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;
        
        // Configuração responsiva do canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        // Partículas animadas
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.8 + 0.2;
                this.pulseSpeed = Math.random() * 0.02 + 0.01;
                this.pulse = 0;
                this.color = this.getRandomColor();
            }
            
            getRandomColor() {
                const colors = [
                    'rgba(139, 92, 246, 0.6)',  // purple
                    'rgba(245, 158, 11, 0.6)',  // gold
                    'rgba(236, 72, 153, 0.6)',  // pink
                    'rgba(6, 182, 212, 0.6)'    // cyan
                ];
                return colors[Math.floor(Math.random() * colors.length)];
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.pulse += this.pulseSpeed;
                
                // Efeito de pulsação
                this.currentOpacity = this.opacity + Math.sin(this.pulse) * 0.3;
                this.currentSize = this.size + Math.sin(this.pulse) * 0.5;
                
                // Reposicionar partículas que saem da tela
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            
            draw() {
                ctx.save();
                ctx.globalAlpha = this.currentOpacity;
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 20;
                ctx.shadowColor = this.color;
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
        
        // Gerenciar partículas
        let particles = [];
        const particleCount = Math.min(80, Math.floor(canvas.width * canvas.height / 15000));
        
        function createParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        // Conectar partículas próximas
        function connectParticles() {
            const maxDistance = 120;
            
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < maxDistance) {
                        const opacity = (1 - distance / maxDistance) * 0.3;
                        
                        ctx.save();
                        ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = 'rgba(139, 92, 246, 0.5)';
                        
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }
        }
        
        // Loop de animação
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            connectParticles();
            
            animationId = requestAnimationFrame(animate);
        }
        
        // Inicializar
        resizeCanvas();
        createParticles();
        animate();
        
        // Event listeners
        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });
        
        // Pausar quando não está visível
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });
    }

    // ===== EFEITOS DE SCROLL AVANÇADOS =====
    function initializeScrollEffects() {
        const header = document.querySelector('.header');
        let lastScrollY = window.pageYOffset;
        let ticking = false;
        
        function updateScrollEffects() {
            const scrollY = window.pageYOffset;
            
            // Header scroll effect
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Parallax para elementos específicos
            const parallaxElements = document.querySelectorAll('.hero-image-glow, .hero-video-bg');
            parallaxElements.forEach((element, index) => {
                const speed = 0.3 + (index * 0.1);
                const yPos = scrollY * speed;
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            // Efeito de profundidade nas seções
            const sections = document.querySelectorAll('section');
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible) {
                    const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
                    const transform = Math.max(0, (1 - scrollPercent) * 30);
                    section.style.transform = `translateY(${transform}px)`;
                }
            });
            
            lastScrollY = scrollY;
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // ===== MENU MOBILE INTERATIVO =====
    function initializeMobileMenu() {
        const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
        const navList = document.querySelector('.nav-list');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!mobileMenuIcon || !navList) return;
        
        mobileMenuIcon.addEventListener('click', () => {
            navList.classList.toggle('active');
            mobileMenuIcon.classList.toggle('active');
            
            // Animar barras do menu
            const bars = mobileMenuIcon.querySelectorAll('.bar');
            if (mobileMenuIcon.classList.contains('active')) {
                bars[0].style.transform = 'translateY(7px) rotate(45deg)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
            } else {
                bars[0].style.transform = '';
                bars[1].style.opacity = '';
                bars[2].style.transform = '';
            }
        });
        
        // Fechar menu ao clicar em links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                mobileMenuIcon.classList.remove('active');
                
                const bars = mobileMenuIcon.querySelectorAll('.bar');
                bars.forEach(bar => {
                    bar.style.transform = '';
                    bar.style.opacity = '';
                });
            });
        });
    }

    // ===== EFEITOS DE VÍDEO PREMIUM =====
    function initializeVideoEffects() {
        const video = document.querySelector('.hero-video-bg');
        if (!video) return;
        
        // Lazy loading do vídeo
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(e => console.log('Autoplay prevented:', e));
                    observer.unobserve(video);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(video);
        
        // Pause/play baseado na visibilidade
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                video.pause();
            } else {
                video.play().catch(e => console.log('Play prevented:', e));
            }
        });
        
        // Controle de qualidade baseado na performance
        let fps = 60;
        let lastTime = performance.now();
        
        function checkPerformance() {
            const now = performance.now();
            fps = 1000 / (now - lastTime);
            lastTime = now;
            
            if (fps < 30) {
                video.style.filter = 'blur(1px)';
            } else {
                video.style.filter = '';
            }
            
            requestAnimationFrame(checkPerformance);
        }
        
        checkPerformance();
    }

    // ===== GALERIA INTERATIVA =====
    function initializeGalleryEffects() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach((item, index) => {
            // Efeito de mouse move 3D
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
                
                item.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale(1.05)`;
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
            });
            
            // Click para expandir (modal simples)
            item.addEventListener('click', () => {
                createImageModal(item.querySelector('img'));
            });
        });
    }
    
    // Modal de imagem
    function createImageModal(img) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            backdrop-filter: blur(20px);
        `;
        
        const modalImg = document.createElement('img');
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 15px;
            box-shadow: 0 30px 80px rgba(0,0,0,0.5);
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 2rem;
            right: 2rem;
            background: rgba(255,255,255,0.1);
            border: none;
            color: white;
            font-size: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 25px;
            cursor: pointer;
            transition: background 0.3s ease;
            backdrop-filter: blur(20px);
        `;
        
        modal.appendChild(modalImg);
        modal.appendChild(closeBtn);
        document.body.appendChild(modal);
        
        // Animar entrada
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modalImg.style.transform = 'scale(1)';
        });
        
        // Event listeners
        const closeModal = () => {
            modal.style.opacity = '0';
            modalImg.style.transform = 'scale(0.8)';
            setTimeout(() => modal.remove(), 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    // ===== SMOOTH SCROLLING AVANÇADO =====
    function initializeSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    // Smooth scroll com easing customizado
                    scrollToTarget(targetPosition, 1000);
                }
            });
        });
    }
    
    function scrollToTarget(target, duration) {
        const start = window.pageYOffset;
        const distance = target - start;
        const startTime = performance.now();
        
        function animation(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out-cubic)
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            window.scrollTo(0, start + (distance * easeProgress));
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }

    // ===== OTIMIZAÇÕES DE PERFORMANCE =====
    function initializePerformanceOptimizations() {
        // Lazy loading de imagens
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });
        
        images.forEach(img => imageObserver.observe(img));
        
        // Preload de recursos críticos
        preloadCriticalResources();
        
        // Otimização de scroll
        let isScrolling = false;
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    // Scroll optimizations aqui
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }, { passive: true });
    }
    
    function preloadCriticalResources() {
        // Preload de imagens críticas
        const criticalImages = [
            'img/Cristiane-01.png',
            'img/Logo EBEM-Roxo.png'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // ===== INTERAÇÕES AVANÇADAS =====
    
    // Animação de contador para estatísticas
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.textContent);
                    const duration = 2000;
                    const start = performance.now();
                    
                    function updateCounter(currentTime) {
                        const elapsed = currentTime - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const current = Math.floor(progress * target);
                        
                        counter.textContent = current + '+';
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target + '+';
                        }
                    }
                    
                    requestAnimationFrame(updateCounter);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    // Inicializar contadores
    animateCounters();
    
    // Efeitos de hover avançados para cards
    const cards = document.querySelectorAll('.expertise-card, .event-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 60px rgba(139, 92, 246, 0.4)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });
    
    // Animação de texto typewriter para títulos especiais
    function typewriterEffect(element, text, speed = 100) {
        element.textContent = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Aplicar efeito typewriter em elementos específicos quando visíveis
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    const typewriterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.dataset.typewriter || element.textContent;
                typewriterEffect(element, text);
                typewriterObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    typewriterElements.forEach(el => typewriterObserver.observe(el));
    
    // ===== LOADING SCREEN =====
    function initializeLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'loading-screen';
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <div class="loading-logo">
                    <img src="img/Logo EBEM-Roxo.png" alt="EBEM">
                </div>
                <div class="loading-bar">
                    <div class="loading-progress"></div>
                </div>
                <p>Carregando experiência premium...</p>
            </div>
        `;
        
        loadingScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0A0A0A 0%, #8B5CF6 50%, #EC4899 100%);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
            transition: opacity 0.5s ease;
        `;
        
        document.body.appendChild(loadingScreen);
        
        // Simular carregamento
        const progress = loadingScreen.querySelector('.loading-progress');
        let width = 0;
        
        const loading = setInterval(() => {
            width += Math.random() * 10;
            progress.style.width = Math.min(width, 100) + '%';
            
            if (width >= 100) {
                clearInterval(loading);
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => loadingScreen.remove(), 500);
                }, 500);
            }
        }, 100);
    }
    
    // Inicializar loading apenas na primeira visita
    if (sessionStorage.getItem('visited') !== 'true') {
        initializeLoadingScreen();
        sessionStorage.setItem('visited', 'true');
    }
    
    // ===== EASTER EGGS E DETALHES ESPECIAIS =====
    
    // Konami code para modo especial
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateSpecialMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    function activateSpecialMode() {
        document.body.classList.add('special-mode');
        
        // Adicionar efeitos especiais
        const style = document.createElement('style');
        style.textContent = `
            .special-mode .hero-image {
                animation: rainbow-glow 2s infinite;
            }
            
            @keyframes rainbow-glow {
                0% { filter: hue-rotate(0deg) brightness(1.2); }
                25% { filter: hue-rotate(90deg) brightness(1.2); }
                50% { filter: hue-rotate(180deg) brightness(1.2); }
                75% { filter: hue-rotate(270deg) brightness(1.2); }
                100% { filter: hue-rotate(360deg) brightness(1.2); }
            }
        `;
        document.head.appendChild(style);
        
        // Mostrar mensagem especial
        const message = document.createElement('div');
        message.textContent = '✨ Modo especial ativado! ✨';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #8B5CF6, #EC4899);
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(139, 92, 246, 0.5);
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
    
    // Log de desenvolvedor
    console.log('%c🚀 Site Cristiane Lidório - Especialista em IA', 
        'color: #8B5CF6; font-size: 20px; font-weight: bold;');
    console.log('%c⚡ Desenvolvido com tecnologias premium', 
        'color: #F59E0B; font-size: 14px;');
    console.log('%c💜 EBEM - Escola Brasileira de Empreendedorismo Feminino', 
        'color: #EC4899; font-size: 12px;');
        
    // ===== FINALIZAÇÃO =====
    
    // Marcar página como totalmente carregada
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Inicializar funcionalidades que dependem do carregamento completo
        setTimeout(() => {
            // Triggers para animações especiais
            document.dispatchEvent(new CustomEvent('siteReady'));
        }, 100);
    });
    
    // Cleanup em caso de saída da página
    window.addEventListener('beforeunload', () => {
        // Pausar animações
        if (typeof animationId !== 'undefined') {
            cancelAnimationFrame(animationId);
        }
        
        // Limpar observers
        // (Os observers serão automaticamente limpos)
    });
});

// ===== UTILITÁRIOS GLOBAIS =====

// Função para debounce de eventos
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Função para throttle de eventos
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Detecção de dispositivo
const deviceInfo = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTablet: /iPad|Android(?!.*Mobile)|Kindle/i.test(navigator.userAgent),
    isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
};

// Adicionar classes CSS baseadas no dispositivo
document.documentElement.classList.add(
    deviceInfo.isMobile ? 'is-mobile' : 
    deviceInfo.isTablet ? 'is-tablet' : 'is-desktop'
);

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}