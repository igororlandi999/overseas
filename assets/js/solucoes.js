/**
 * OVERSEAS TRADING - SOLUÇÕES JAVASCRIPT
 * Arquivo: assets/js/solucoes.js
 */

(function() {
    'use strict';

    // Configurações da página
    const pageConfig = {
        debug: false,
        animationDelay: 100,
        observerThreshold: 0.1,
        scrollThrottle: 16
    };

    // Estado da aplicação
    const appState = {
        animated: new Set(),
        isLoaded: false,
        scrollY: 0
    };

    // Utilitários
    const utils = {
        // Debounce function
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Throttle function
        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Verificar se elemento está visível
        isElementInViewport: function(el, threshold = 0.1) {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;
            
            return (
                rect.top <= windowHeight * (1 - threshold) &&
                rect.bottom >= windowHeight * threshold &&
                rect.left <= windowWidth * (1 - threshold) &&
                rect.right >= windowWidth * threshold
            );
        },

        // Log de debug
        log: function(message, data = null) {
            if (pageConfig.debug) {
                console.log(`[Soluções] ${message}`, data || '');
            }
        }
    };

    // Animações AOS (Animate On Scroll)
    const AOSAnimations = {
        init: function() {
            this.setupObserver();
            this.checkInitialElements();
            utils.log('AOS Animations iniciado');
        },

        setupObserver: function() {
            if (!window.IntersectionObserver) {
                utils.log('IntersectionObserver não suportado, usando fallback');
                this.fallbackAnimation();
                return;
            }

            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    threshold: pageConfig.observerThreshold,
                    rootMargin: '50px 0px -50px 0px'
                }
            );

            // Observar todos os elementos com data-aos
            const elements = document.querySelectorAll('[data-aos]');
            elements.forEach(el => this.observer.observe(el));
        },

        handleIntersection: function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !appState.animated.has(entry.target)) {
                    const delay = parseInt(entry.target.dataset.aosDelay) || 0;
                    
                    setTimeout(() => {
                        this.animateElement(entry.target);
                    }, delay);
                    
                    appState.animated.add(entry.target);
                }
            });
        },

        animateElement: function(element) {
            element.classList.add('aos-animate');
            utils.log('Elemento animado', element);
        },

        checkInitialElements: function() {
            const elements = document.querySelectorAll('[data-aos]');
            elements.forEach(el => {
                if (utils.isElementInViewport(el, 0.2)) {
                    this.animateElement(el);
                    appState.animated.add(el);
                }
            });
        },

        fallbackAnimation: function() {
            // Fallback para navegadores sem IntersectionObserver
            const elements = document.querySelectorAll('[data-aos]');
            elements.forEach((el, index) => {
                setTimeout(() => {
                    this.animateElement(el);
                }, index * 100);
            });
        }
    };

    // Efeitos de Scroll
    const ScrollEffects = {
        init: function() {
            this.bindEvents();
            utils.log('Scroll Effects iniciado');
        },

        bindEvents: function() {
            window.addEventListener('scroll', utils.throttle(this.handleScroll.bind(this), pageConfig.scrollThrottle));
        },

        handleScroll: function() {
            appState.scrollY = window.pageYOffset;
            this.updateParallaxElements();
        },

        updateParallaxElements: function() {
            // Efeito parallax sutil no hero
            const heroSection = document.querySelector('.hero-section');
            if (heroSection && utils.isElementInViewport(heroSection, 0.3)) {
                const speed = 0.02;
                const yPos = -(appState.scrollY * speed);
                
                const heroContent = document.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = `translateY(${yPos}px)`;
                }
            }
        }
    };

    // Efeitos de hover nos cards
    const CardEffects = {
        init: function() {
            this.setupHoverEffects();
            this.setupClickEffects();
            utils.log('Card Effects iniciado');
        },

        setupHoverEffects: function() {
            const cards = document.querySelectorAll('.solucao-card, .feature-card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', this.handleCardHover.bind(this));
                card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
            });
        },

        setupClickEffects: function() {
            const cards = document.querySelectorAll('.solucao-card');
            
            cards.forEach(card => {
                card.addEventListener('click', this.handleCardClick.bind(this));
            });
        },

        handleCardHover: function(e) {
            const card = e.currentTarget;
            
            // Adicionar efeito de brilho
            this.addGlowEffect(card);
            
            // Animar ícone
            const icon = card.querySelector('.solucao-icon, .feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotateY(180deg)';
            }
        },

        handleCardLeave: function(e) {
            const card = e.currentTarget;
            
            // Remover efeito de brilho
            this.removeGlowEffect(card);
            
            // Resetar animações
            const icon = card.querySelector('.solucao-icon, .feature-icon');
            if (icon) {
                icon.style.transform = '';
            }
        },

        addGlowEffect: function(card) {
            card.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.3)';
            card.style.borderColor = 'var(--accent-cyan)';
        },

        removeGlowEffect: function(card) {
            card.style.boxShadow = '';
            card.style.borderColor = '';
        },

        handleCardClick: function(e) {
            const card = e.currentTarget;
            
            // Efeito de pulso
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
            
            // Efeito de partículas (opcional)
            this.createParticleEffect(card);
        },

        createParticleEffect: function(card) {
            const rect = card.getBoundingClientRect();
            const particles = 6;
            
            for (let i = 0; i < particles; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    background: var(--accent-cyan);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    left: ${rect.left + rect.width / 2}px;
                    top: ${rect.top + rect.height / 2}px;
                `;
                
                document.body.appendChild(particle);
                
                // Animar partícula
                const angle = (i / particles) * Math.PI * 2;
                const velocity = 80;
                const duration = 1000;
                
                particle.animate([
                    { 
                        transform: 'translate(0, 0) scale(1)',
                        opacity: 1
                    },
                    { 
                        transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`,
                        opacity: 0
                    }
                ], {
                    duration: duration,
                    easing: 'ease-out'
                }).onfinish = () => {
                    particle.remove();
                };
            }
        }
    };

    // Smooth Scroll para links internos
    const SmoothScroll = {
        init: function() {
            this.bindEvents();
            utils.log('Smooth Scroll iniciado');
        },

        bindEvents: function() {
            document.addEventListener('click', this.handleClick.bind(this));
        },

        handleClick: function(e) {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                this.scrollToElement(targetElement);
            }
        },

        scrollToElement: function(element) {
            const headerHeight = 80; // Altura do header fixo
            const targetPosition = element.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Button Interactions
    const ButtonInteractions = {
        init: function() {
            this.setupButtonEffects();
            utils.log('Button Interactions iniciado');
        },

        setupButtonEffects: function() {
            const buttons = document.querySelectorAll('.btn');
            
            buttons.forEach(button => {
                this.addButtonListeners(button);
                this.addAdvancedEffects(button);
            });
        },

        addButtonListeners: function(button) {
            const states = {
                default: 'translateY(0) scale(1)',
                hover: 'translateY(-3px) scale(1.02)',
                active: 'translateY(-1px) scale(0.98)'
            };
            
            button.addEventListener('mouseenter', () => {
                button.style.transform = states.hover;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = states.default;
            });
            
            button.addEventListener('mousedown', () => {
                button.style.transform = states.active;
            });
            
            button.addEventListener('mouseup', () => {
                button.style.transform = states.hover;
            });
        },

        addAdvancedEffects: function(button) {
            // Efeito de ripple no clique
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;

                // Adicionar animação de ripple
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `;
                
                if (!document.querySelector('#ripple-animation')) {
                    style.id = 'ripple-animation';
                    document.head.appendChild(style);
                }

                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });

            // Efeito de partículas para o botão secundário
            if (button.classList.contains('btn-secondary')) {
                button.addEventListener('mouseenter', () => {
                    this.createButtonParticles(button);
                });
            }
        },

        createButtonParticles: function(button) {
            const rect = button.getBoundingClientRect();
            const particles = 4;
            
            for (let i = 0; i < particles; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 3px;
                    height: 3px;
                    background: var(--accent-cyan);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    left: ${rect.left + Math.random() * rect.width}px;
                    top: ${rect.top + rect.height / 2}px;
                    opacity: 0.8;
                `;
                
                document.body.appendChild(particle);
                
                // Animar partícula
                const direction = Math.random() > 0.5 ? 1 : -1;
                const distance = 30 + Math.random() * 20;
                
                particle.animate([
                    { 
                        transform: 'translate(0, 0) scale(1)',
                        opacity: 0.8
                    },
                    { 
                        transform: `translate(${direction * distance}px, -${distance}px) scale(0)`,
                        opacity: 0
                    }
                ], {
                    duration: 800,
                    easing: 'ease-out'
                }).onfinish = () => {
                    particle.remove();
                };
            }
        }
    };

    // Inicialização da página
    const PageInitializer = {
        init: function() {
            this.loadOverseasComponents();
            this.handlePageLoad();
            utils.log('Página Soluções inicializada');
        },

        loadOverseasComponents: function() {
            if (typeof OverseasComponents !== 'undefined') {
                OverseasComponents.init({
                    activePage: 'solucoes',
                    title: 'Soluções - Estratégias para Comércio Exterior',
                    description: 'Descubra nossas soluções estratégicas: inteligência tributária, logística integrada, plataforma digital e projetos customizados.',
                    whatsappMessage: 'Olá! Gostaria de conhecer as soluções da Overseas Trading para comércio exterior.',
                    canonical: 'https://www.overseastrading.com.br/solucoes',
                    debug: pageConfig.debug,
                    onReady: this.onOverseasReady.bind(this)
                });
            } else {
                utils.log('OverseasComponents não encontrado');
                setTimeout(() => {
                    this.initializeModules();
                }, 100);
            }
        },

        onOverseasReady: function() {
            utils.log('Overseas Components carregado');
            setTimeout(() => {
                this.initializeModules();
            }, 100);
        },

        initializeModules: function() {
            if (appState.isLoaded) return;
            
            try {
                AOSAnimations.init();
                ScrollEffects.init();
                CardEffects.init();
                SmoothScroll.init();
                ButtonInteractions.init();
                ScrollToTop.init();
                
                appState.isLoaded = true;
                utils.log('Todos os módulos inicializados com sucesso');
                
            } catch (error) {
                console.error('Erro ao inicializar módulos:', error);
            }
        },

        handlePageLoad: function() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.onDOMReady.bind(this));
            } else {
                this.onDOMReady();
            }
            
            window.addEventListener('load', this.onWindowLoad.bind(this));
        },

        onDOMReady: function() {
            utils.log('DOM carregado');
            
            document.body.classList.add('solucoes-loaded');
            this.preloadImages();
            this.setupLazyLoading();
        },

        onWindowLoad: function() {
            utils.log('Página completamente carregada');
            this.removeLoadingStates();
            this.postLoadOptimizations();
        },

        preloadImages: function() {
            const criticalImages = [
                'assets/images/logo.png'
            ];
            
            criticalImages.forEach(src => {
                const img = new Image();
                img.src = src;
            });
        },

        setupLazyLoading: function() {
            if ('IntersectionObserver' in window) {
                const lazyImages = document.querySelectorAll('img[data-src]');
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    });
                });
                
                lazyImages.forEach(img => imageObserver.observe(img));
            }
        },

        removeLoadingStates: function() {
            const loadingElements = document.querySelectorAll('.loading');
            loadingElements.forEach(el => {
                el.classList.remove('loading');
            });
        },

        postLoadOptimizations: function() {
            if (this.isLowPerformanceDevice()) {
                this.reducedMotionMode();
            }
            
            this.trackPageView();
        },

        isLowPerformanceDevice: function() {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
            const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
            
            return isSlowConnection || isLowEndDevice || window.devicePixelRatio < 1.5;
        },

        reducedMotionMode: function() {
            utils.log('Modo de movimento reduzido ativado');
            
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.3s !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.3s !important;
                }
            `;
            document.head.appendChild(style);
        },

        trackPageView: function() {
            if (typeof gtag !== 'undefined') {
                gtag('config', 'GA_MEASUREMENT_ID', {
                    page_title: 'Soluções',
                    page_location: window.location.href
                });
            }
            
            utils.log('Page view tracked');
        }
    };

    // Accessibility Features
    const AccessibilityFeatures = {
        init: function() {
            this.setupKeyboardNavigation();
            this.setupFocusManagement();
            this.respectReducedMotion();
            utils.log('Accessibility Features inicializados');
        },

        setupKeyboardNavigation: function() {
            const interactiveCards = document.querySelectorAll('.solucao-card, .feature-card');
            
            interactiveCards.forEach(card => {
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');
                
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        card.click();
                    }
                });
            });
        },

        setupFocusManagement: function() {
            const style = document.createElement('style');
            style.textContent = `
                *:focus {
                    outline: 2px solid var(--accent-cyan) !important;
                    outline-offset: 2px !important;
                }
                .btn:focus {
                    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.3) !important;
                }
            `;
            document.head.appendChild(style);
        },

        respectReducedMotion: function() {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            if (prefersReducedMotion.matches) {
                PageInitializer.reducedMotionMode();
            }
            
            prefersReducedMotion.addEventListener('change', () => {
                if (prefersReducedMotion.matches) {
                    PageInitializer.reducedMotionMode();
                }
            });
        }
    };

    // Error Handler
    const ErrorHandler = {
        init: function() {
            window.addEventListener('error', this.handleError.bind(this));
            window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
        },

        handleError: function(e) {
            console.error('JavaScript Error:', {
                message: e.message,
                filename: e.filename,
                line: e.lineno,
                column: e.colno,
                stack: e.error?.stack
            });
            
            this.attemptRecovery();
        },

        handlePromiseRejection: function(e) {
            console.error('Promise Rejection:', e.reason);
            e.preventDefault();
        },

        attemptRecovery: function() {
            if (!appState.isLoaded) {
                setTimeout(() => {
                    PageInitializer.initializeModules();
                }, 1000);
            }
        }
    };

    // API Pública
    window.SolucoesPageAPI = {
        animateElement: function(selector) {
            const element = document.querySelector(selector);
            if (element) {
                AOSAnimations.animateElement(element);
            }
        },
        
        scrollToSection: function(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                SmoothScroll.scrollToElement(element);
            }
        },
        
        getState: function() {
            return { ...appState };
        },
        
        enableDebug: function() {
            pageConfig.debug = true;
            utils.log('Debug mode enabled');
        }
    };

    // Auto-inicialização
    document.addEventListener('DOMContentLoaded', function() {
        ErrorHandler.init();
        PageInitializer.init();
        AccessibilityFeatures.init();
        
        console.log('🌊 Página Soluções da Overseas Trading carregada com sucesso!');
        
        if (pageConfig.debug) {
            console.log('🔧 API disponível em: window.SolucoesPageAPI');
            console.log('📊 Estado da aplicação:', appState);
        }
    });

    // Cleanup ao sair da página
    window.addEventListener('beforeunload', function() {
        if (AOSAnimations.observer) {
            AOSAnimations.observer.disconnect();
        }
        
        utils.log('Página desmontada, observers limpos');
    });

})();