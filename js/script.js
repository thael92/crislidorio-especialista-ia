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
    initializeBackToTopButton();
    
    // ===== INICIALIZAR AOS (ANIMATE ON SCROLL) =====
    // Inicializa a biblioteca de animação ao rolar a página
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
    // Cria um fundo animado com partículas
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
        
        // Classe para as partículas animadas
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
                    'rgba(139, 92, 246, 0.6)',  // Roxo
                    'rgba(245, 158, 11, 0.6)',  // Dourado
                    'rgba(236, 72, 153, 0.6)',  // Rosa
                    'rgba(6, 182, 212, 0.6)'    // Ciano
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
        
        // Gerencia as partículas
        let particles = [];
        const particleCount = Math.min(80, Math.floor(canvas.width * canvas.height / 15000));
        
        function createParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        // Conecta as partículas próximas com linhas
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
        
        // Inicialização
        resizeCanvas();
        createParticles();
        animate();
        
        // Event listeners para redimensionar e pausar a animação
        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });
    }

    // ===== EFEITOS DE SCROLL AVANÇADOS =====
    // Adiciona efeitos visuais durante a rolagem da página
    function initializeScrollEffects() {
        const header = document.querySelector('.header');
        let ticking = false;
        
        function updateScrollEffects() {
            const scrollY = window.pageYOffset;
            
            // Efeito de encolhimento do header
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Efeito de parallax para elementos específicos
            const parallaxElements = document.querySelectorAll('.hero-video-bg');
            parallaxElements.forEach(element => {
                const speed = 0.3;
                const yPos = scrollY * speed;
                element.style.transform = `translateY(${yPos}px)`;
            });
            
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
    // Controla a exibição e o comportamento do menu em dispositivos móveis
    function initializeMobileMenu() {
        const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
        const navList = document.querySelector('.nav-list');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!mobileMenuIcon || !navList) return;
        
        mobileMenuIcon.addEventListener('click', () => {
            // Alterna a classe 'active' para mostrar/esconder o menu
            const isActive = navList.classList.toggle('active');
            mobileMenuIcon.classList.toggle('active', isActive);
            
            // Animação do ícone do menu (hambúrguer para X)
            const bars = mobileMenuIcon.querySelectorAll('.bar');
            if (isActive) {
                bars[0].style.transform = 'translateY(7px) rotate(45deg)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
            } else {
                bars[0].style.transform = '';
                bars[1].style.opacity = '';
                bars[2].style.transform = '';
            }
        });
        
        // Fecha o menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    mobileMenuIcon.classList.remove('active');
                    const bars = mobileMenuIcon.querySelectorAll('.bar');
                    bars.forEach(bar => {
                        bar.style.transform = '';
                        bar.style.opacity = '';
                    });
                }
            });
        });
    }

    // ===== EFEITOS DE VÍDEO PREMIUM =====
    // Controla a reprodução e otimização do vídeo de fundo
    function initializeVideoEffects() {
        const video = document.querySelector('.hero-video-bg');
        if (!video) return;
        
        // Pausar/reproduzir com base na visibilidade da aba
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                video.pause();
            } else {
                video.play().catch(e => console.log('Autoplay do vídeo foi impedido pelo navegador.'));
            }
        });
    }

    // ===== GALERIA INTERATIVA =====
    // Adiciona efeitos 3D e modal de visualização na galeria
    function initializeGalleryEffects() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            // Efeito 3D ao mover o mouse
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15; // Reduzido para um efeito mais sutil
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15; // Reduzido e invertido
                
                item.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) scale(1.05)`;
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
            });
            
            // Abrir imagem em um modal ao clicar
            item.addEventListener('click', () => {
                createImageModal(item.querySelector('img'));
            });
        });
    }
    
    // Cria e gerencia o modal de visualização de imagem
    function createImageModal(img) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'image-modal-content';
        
        const modalImg = document.createElement('img');
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'image-modal-close';
        closeBtn.setAttribute('aria-label', 'Fechar imagem');
        
        modalContent.appendChild(modalImg);
        modal.appendChild(modalContent);
        modal.appendChild(closeBtn);
        document.body.appendChild(modal);
        
        // Anima a entrada do modal
        setTimeout(() => modal.classList.add('visible'), 10);
        
        // Funções para fechar o modal
        const closeModal = () => {
            modal.classList.remove('visible');
            setTimeout(() => modal.remove(), 300);
            document.removeEventListener('keydown', onKeyDown);
        };
        
        const onKeyDown = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', onKeyDown);
    }

    // ===== SMOOTH SCROLLING (ROLAGEM SUAVE) =====
    // Cria uma rolagem suave para links de âncora
    function initializeSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                
                // Ignora o botão de voltar ao topo que já tem seu próprio tratamento
                if (this.classList.contains('back-to-top')) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== BOTÃO VOLTAR AO TOPO =====
    // Controla a visibilidade do botão de voltar ao topo
    function initializeBackToTopButton() {
        const backToTopButton = document.querySelector('.back-to-top');
        if (!backToTopButton) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }, { passive: true });
    }
    
    // ===== ANIMAÇÃO DOS CONTADORES =====
    // Anima os números da seção de estatísticas
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const targetText = counter.textContent.replace(/[^0-9]/g, '');
                    const target = parseInt(targetText, 10);
                    
                    if (isNaN(target)) return;

                    let current = 0;
                    const increment = target / 100; // Controla a velocidade da animação
                    
                    const updateCounter = () => {
                        if (current < target) {
                            current += increment;
                            counter.textContent = Math.ceil(current) + 'anos+'; // Adiciona o sufixo
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target + 'anos+';
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.8 });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    // Inicializa os contadores
    animateCounters();
    
    // ===== FINALIZAÇÃO =====
    // Adiciona a classe 'loaded' ao corpo quando a página estiver totalmente carregada
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // ===== CARROSSEL DE EXPERTISE =====
    // Inicializa o carrossel da seção de expertise com Swiper.js
    function initializeExpertiseCarousel() {
        const expertiseCarousel = new Swiper('.expertise-carousel', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                // Quando a largura da tela for >= 768px
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                // Quando a largura da tela for >= 1024px
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            }
        });
    }

    // ===== CARROSSEL DA GALERIA =====
    // Inicializa o carrossel da galeria com Swiper.js
    function initializeGalleryCarousel() {
        const galleryCarousel = new Swiper('.gallery-carousel', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            navigation: {
                nextEl: '.gallery-carousel .swiper-button-next',
                prevEl: '.gallery-carousel .swiper-button-prev',
            },
            breakpoints: {
                // Quando a largura da tela for >= 768px
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                // Quando a largura da tela for >= 1024px
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            }
        });
    }

    // ===== CARROSSEL DA GALERIA =====
    // Inicializa o carrossel da galeria com Swiper.js
    function initializeGalleryCarousel() {
        const galleryCarousel = new Swiper('.gallery-carousel', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            navigation: {
                nextEl: '.gallery-carousel .swiper-button-next',
                prevEl: '.gallery-carousel .swiper-button-prev',
            },
            breakpoints: {
                // Quando a largura da tela for >= 768px
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                // Quando a largura da tela for >= 1024px
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            }
        });
    }
});
