/**
 * OVERSEAS TRADING - SOBRE NÓS JAVASCRIPT
 * Arquivo: assets/js/sobre.js
 */

(function() {
    'use strict';

    // Configurações da página
    const pageConfig = {
        debug: false,
        animationDelay: 100,
        counterSpeed: 2000,
        observerThreshold: 0.1
    };

    // Estado da aplicação
    const appState = {
        animated: new Set(),
        countersAnimated: false,
        scrollY: 0,
        isLoaded: false
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

        // Animar número
        animateCounter: function(element, start, end, duration) {
            const startTime = performance.now();
            const range = end - start;

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function (easeOutCubic)
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(start + (range * easeOutCubic));
                
                if (element.dataset.suffix) {
                    element.textContent = current + element.dataset.suffix;
                } else {
                    element.textContent = current.toLocaleString('pt-BR');
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }

            requestAnimationFrame(updateCounter);
        },

        // Log de debug
        log: function(message, data = null) {
            if (pageConfig.debug) {
                console.log(`[Sobre] ${message}`, data || '');
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

    // Animações de Counter
    const CounterAnimations = {
        init: function() {
            this.setupCounterObserver();
            utils.log('Counter Animations iniciado');
        },

        setupCounterObserver: function() {
            const counters = document.querySelectorAll('.stat-number, .metric-value');
            
            if (!window.IntersectionObserver) {
                this.animateAllCounters();
                return;
            }

            this.counterObserver = new IntersectionObserver(
                this.handleCounterIntersection.bind(this),
                { threshold: 0.5 }
            );

            counters.forEach(counter => {
                this.counterObserver.observe(counter);
            });
        },

        handleCounterIntersection: function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !appState.countersAnimated) {
                    this.animateCounters();
                    appState.countersAnimated = true;
                }
            });
        },

        animateCounters: function() {
            const counters = [
                { selector: '.stat-number', configs: [
                    { end: 25, suffix: '+' },
                    { end: 1000, suffix: '+' },
                    { end: 50, suffix: '+' }
                ]},
                { selector: '.metric-value', configs: [
                    { end: 387, suffix: 'M' },
                    { end: 99, suffix: '%' }
                ]}
            ];

            counters.forEach(counterGroup => {
                const elements = document.querySelectorAll(counterGroup.selector);
                elements.forEach((el, index) => {
                    if (counterGroup.configs[index]) {
                        const config = counterGroup.configs[index];
                        el.dataset.suffix = config.suffix;
                        
                        setTimeout(() => {
                            utils.animateCounter(el, 0, config.end, pageConfig.counterSpeed);
                        }, index * 200);
                    }
                });
            });

            utils.log('Counters animados');
        },

        animateAllCounters: function() {
            // Fallback para navegadores sem IntersectionObserver
            setTimeout(() => {
                this.animateCounters();
            }, 1000);
        }
    };

    // Efeitos de Scroll
    const ScrollEffects = {
        init: function() {
            this.bindEvents();
            utils.log('Scroll Effects iniciado');
        },

        bindEvents: function() {
            window.addEventListener('scroll', utils.throttle(this.handleScroll.bind(this), 16));
        },

        handleScroll: function() {
            appState.scrollY = window.pageYOffset;
            this.updateParallaxElements();
            this.updateFloatingCards();
        },

        updateParallaxElements: function() {
            // Remover parallax dos cards flutuantes para evitar movimento excessivo
            const heroSection = document.querySelector('.hero-section');
            if (heroSection && utils.isElementInViewport(heroSection, 0.3)) {
                const speed = 0.02; // Muito sutil
                const yPos = -(appState.scrollY * speed);
                
                const heroVisual = document.querySelector('.hero-visual');
                if (heroVisual) {
                    heroVisual.style.transform = `translateY(${yPos}px)`;
                }
            }
        },

        updateFloatingCards: function() {
            // Movimento muito sutil apenas quando os cards estão visíveis
            const cards = document.querySelectorAll('.floating-card');
            if (cards.length === 0) return;
            
            const heroSection = document.querySelector('.hero-section');
            if (!heroSection || !utils.isElementInViewport(heroSection, 0.5)) {
                // Reset position quando não está visível
                cards.forEach(card => {
                    card.style.setProperty('--scroll-offset', '0px');
                });
                return;
            }
            
            // Movimento muito sutil baseado no scroll (máximo 2px)
            const scrollProgress = Math.min(appState.scrollY / (window.innerHeight * 0.3), 1);
            
            cards.forEach((card, index) => {
                // Movimento mínimo e suave
                const intensity = 1 + (index * 0.3); // Máximo 1.6px
                const direction = index % 2 === 0 ? 1 : -1;
                
                let yOffset = Math.sin(scrollProgress * Math.PI * 0.5 + (index * 0.8)) * intensity * direction;
                
                // Aplicar o movimento usando CSS custom property
                card.style.setProperty('--scroll-offset', `${yOffset}px`);
            });
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
            const cards = document.querySelectorAll('.mvv-card, .team-member, .achievement-card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', this.handleCardHover.bind(this));
                card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
            });
        },

        setupClickEffects: function() {
            const achievementCards = document.querySelectorAll('.achievement-card');
            
            achievementCards.forEach(card => {
                card.addEventListener('click', this.handleAchievementClick.bind(this));
            });
        },

        handleCardHover: function(e) {
            const card = e.currentTarget;
            
            // Adicionar efeito de brilho
            this.addGlowEffect(card);
            
            // Animar elementos filhos
            const icon = card.querySelector('.mvv-icon, .achievement-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotateY(180deg)';
            }
        },

        handleCardLeave: function(e) {
            const card = e.currentTarget;
            
            // Remover efeito de brilho
            this.removeGlowEffect(card);
            
            // Resetar animações
            const icon = card.querySelector('.mvv-icon, .achievement-icon');
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

        handleAchievementClick: function(e) {
            const card = e.currentTarget;
            
            // Efeito de pulso
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
            
            // Efeito de partículas (opcional)
            this.createParticleEffect(card);
        },

        createParticleEffect: function(card) {
            const rect = card.getBoundingClientRect();
            const particles = 8;
            
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
                const velocity = 100;
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

    // Inicialização da página
    const PageInitializer = {
        init: function() {
            this.loadOverseasComponents();
            this.initializeModules();
            this.handlePageLoad();
            utils.log('Página Sobre Nós inicializada');
        },

        loadOverseasComponents: function() {
            if (typeof OverseasComponents !== 'undefined') {
                OverseasComponents.init({
                    activePage: 'sobre',
                    title: 'Sobre Nós - Líderes em Comércio Exterior',
                    description: 'Conheça a Overseas Trading, empresa líder em comércio exterior com mais de 25 anos de experiência.',
                    whatsappMessage: 'Olá! Gostaria de conhecer melhor a Overseas Trading e seus serviços.',
                    canonical: 'https://www.overseastrading.com.br/sobre',
                    debug: pageConfig.debug,
                    onReady: this.onOverseasReady.bind(this)
                });
            } else {
                utils.log('OverseasComponents não encontrado');
            }
        },

        onOverseasReady: function() {
            utils.log('Overseas Components carregado');
            // Aguardar um pouco para garantir que o DOM está pronto
            setTimeout(() => {
                this.initializeModules();
            }, 100);
        },

        initializeModules: function() {
            // Verificar se a página já foi inicializada
            if (appState.isLoaded) return;
            
            try {
                AOSAnimations.init();
                CounterAnimations.init();
                ScrollEffects.init();
                CardEffects.init();
                SmoothScroll.init();
                
                appState.isLoaded = true;
                utils.log('Todos os módulos inicializados com sucesso');
                
            } catch (error) {
                console.error('Erro ao inicializar módulos:', error);
            }
        },

        handlePageLoad: function() {
            // Aguardar carregamento completo
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.onDOMReady.bind(this));
            } else {
                this.onDOMReady();
            }
            
            window.addEventListener('load', this.onWindowLoad.bind(this));
        },

        onDOMReady: function() {
            utils.log('DOM carregado');
            
            // Adicionar classe ao body
            document.body.classList.add('sobre-loaded');
            
            // Preload de imagens críticas
            this.preloadImages();
            
            // Configurar lazy loading
            this.setupLazyLoading();
        },

        onWindowLoad: function() {
            utils.log('Página completamente carregada');
            
            // Remover loading states se existirem
            this.removeLoadingStates();
            
            // Otimizações pós-carregamento
            this.postLoadOptimizations();
        },

        preloadImages: function() {
            const criticalImages = [
                'assets/images/logo.png',
                'assets/images/hero-bg.jpg'
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
            // Otimizar animações para dispositivos com baixa performance
            if (this.isLowPerformanceDevice()) {
                this.reducedMotionMode();
            }
            
            // Analytics ou tracking (se necessário)
            this.trackPageView();
        },

        isLowPerformanceDevice: function() {
            // Detectar dispositivos com baixa performance
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
            const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
            
            return isSlowConnection || isLowEndDevice || window.devicePixelRatio < 1.5;
        },

        reducedMotionMode: function() {
            utils.log('Modo de movimento reduzido ativado');
            
            // Reduzir animações complexas
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.3s !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.3s !important;
                }
                .floating-card {
                    animation: none !important;
                }
            `;
            document.head.appendChild(style);
        },

        trackPageView: function() {
            // Placeholder para analytics
            if (typeof gtag !== 'undefined') {
                gtag('config', 'GA_MEASUREMENT_ID', {
                    page_title: 'Sobre Nós',
                    page_location: window.location.href
                });
            }
            
            utils.log('Page view tracked');
        }
    };

    // Performance Monitor
    const PerformanceMonitor = {
        init: function() {
            if (pageConfig.debug) {
                this.measurePerformance();
                this.monitorMemory();
            }
        },

        measurePerformance: function() {
            if ('performance' in window) {
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        const perfData = performance.getEntriesByType('navigation')[0];
                        
                        utils.log('Performance Metrics:', {
                            'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                            'Load Complete': perfData.loadEventEnd - perfData.loadEventStart,
                            'Total Load Time': perfData.loadEventEnd - perfData.fetchStart,
                            'DNS Lookup': perfData.domainLookupEnd - perfData.domainLookupStart,
                            'TCP Connection': perfData.connectEnd - perfData.connectStart
                        });
                    }, 1000);
                });
            }
        },

        monitorMemory: function() {
            if ('memory' in performance) {
                setInterval(() => {
                    const memory = performance.memory;
                    utils.log('Memory Usage:', {
                        'Used': Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
                        'Total': Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
                        'Limit': Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
                    });
                }, 30000); // A cada 30 segundos
            }
        }
    };

    // Accessibility Features
    const AccessibilityFeatures = {
        init: function() {
            this.setupKeyboardNavigation();
            this.setupFocusManagement();
            this.setupScreenReaderSupport();
            this.respectReducedMotion();
            utils.log('Accessibility Features inicializados');
        },

        setupKeyboardNavigation: function() {
            // Navegação por teclado para cards interativos
            const interactiveCards = document.querySelectorAll('.achievement-card, .team-member, .mvv-card');
            
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
            // Melhorar visibilidade do foco
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

        setupScreenReaderSupport: function() {
            // Adicionar labels para screen readers
            const counters = document.querySelectorAll('.stat-number, .metric-value');
            counters.forEach(counter => {
                const label = counter.nextElementSibling;
                if (label) {
                    counter.setAttribute('aria-label', `${counter.textContent} ${label.textContent}`);
                }
            });
            
            // Adicionar descrições para elementos visuais
            const charts = document.querySelectorAll('.chart-container');
            charts.forEach(chart => {
                chart.setAttribute('aria-label', 'Gráfico de crescimento da empresa');
                chart.setAttribute('role', 'img');
            });
        },

        respectReducedMotion: function() {
            // Respeitar preferência de movimento reduzido
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
            
            // Tentar recuperação graceful
            this.attemptRecovery();
        },

        handlePromiseRejection: function(e) {
            console.error('Promise Rejection:', e.reason);
            e.preventDefault(); // Prevenir erro no console
        },

        attemptRecovery: function() {
            // Tentativas básicas de recuperação
            if (!appState.isLoaded) {
                setTimeout(() => {
                    PageInitializer.initializeModules();
                }, 1000);
            }
        }
    };

    // Exposição pública da API
    window.SobrePageAPI = {
        // Métodos públicos para uso externo
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
        // Inicializar error handler primeiro
        ErrorHandler.init();
        
        // Inicializar página
        PageInitializer.init();
        
        // Inicializar features de acessibilidade
        AccessibilityFeatures.init();
        
        // Inicializar monitor de performance (se debug estiver ativo)
        PerformanceMonitor.init();
        
        // Log de inicialização
        console.log('🌊 Página Sobre Nós da Overseas Trading carregada com sucesso!');
        
        if (pageConfig.debug) {
            console.log('🔧 API disponível em: window.SobrePageAPI');
            console.log('📊 Estado da aplicação:', appState);
        }
    });

    // Cleanup ao sair da página
    window.addEventListener('beforeunload', function() {
        // Limpar observers
        if (AOSAnimations.observer) {
            AOSAnimations.observer.disconnect();
        }
        
        if (CounterAnimations.counterObserver) {
            CounterAnimations.counterObserver.disconnect();
        }
        
        utils.log('Página desmontada, observers limpos');
    });

})();