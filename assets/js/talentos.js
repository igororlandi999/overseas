/**
 * OVERSEAS TRADING - CARREIRAS JAVASCRIPT
 * Arquivo: assets/js/carreiras.js
 */

(function() {
    'use strict';

    // Configurações
    const config = {
        debug: false,
        animationDelay: 100,
        observerThreshold: 0.1
    };

    // Estado da aplicação
    const state = {
        animated: new Set(),
        isLoaded: false,
        metricsAnimated: false
    };

    // Utilitários
    const utils = {
        // Debounce function
        debounce(func, wait) {
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
        throttle(func, limit) {
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
        isElementInViewport(el, threshold = 0.1) {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            return (
                rect.top <= windowHeight * (1 - threshold) &&
                rect.bottom >= windowHeight * threshold
            );
        },

        // Log de debug
        log(message, data = null) {
            if (config.debug) {
                console.log(`[Carreiras] ${message}`, data || '');
            }
        }
    };

    // Animações AOS (Animate On Scroll)
    const AOSAnimations = {
        init() {
            this.setupObserver();
            this.checkInitialElements();
            utils.log('AOS Animations iniciado');
        },

        setupObserver() {
            if (!window.IntersectionObserver) {
                utils.log('IntersectionObserver não suportado, usando fallback');
                this.fallbackAnimation();
                return;
            }

            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    threshold: config.observerThreshold,
                    rootMargin: '50px 0px -50px 0px'
                }
            );

            // Observar todos os elementos com data-aos
            const elements = document.querySelectorAll('[data-aos]');
            elements.forEach(el => this.observer.observe(el));
        },

        handleIntersection(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !state.animated.has(entry.target)) {
                    const delay = parseInt(entry.target.dataset.aosDelay) || 0;
                    
                    setTimeout(() => {
                        this.animateElement(entry.target);
                    }, delay);
                    
                    state.animated.add(entry.target);
                }
            });
        },

        animateElement(element) {
            element.classList.add('aos-animate');
            utils.log('Elemento animado', element);
        },

        checkInitialElements() {
            const elements = document.querySelectorAll('[data-aos]');
            elements.forEach(el => {
                if (utils.isElementInViewport(el, 0.2)) {
                    this.animateElement(el);
                    state.animated.add(el);
                }
            });
        },

        fallbackAnimation() {
            const elements = document.querySelectorAll('[data-aos]');
            elements.forEach((el, index) => {
                setTimeout(() => {
                    this.animateElement(el);
                }, index * 100);
            });
        }
    };

    // Animação das métricas de performance
    const MetricsAnimation = {
        init() {
            this.metricsContainer = document.querySelector('.performance-metrics');
            if (!this.metricsContainer) return;

            this.setupMetricsObserver();
            utils.log('Metrics Animation iniciado');
        },

        setupMetricsObserver() {
            if (!window.IntersectionObserver) {
                this.animateMetrics();
                return;
            }

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !state.metricsAnimated) {
                            this.animateMetrics();
                            state.metricsAnimated = true;
                        }
                    });
                },
                { threshold: 0.3 }
            );

            observer.observe(this.metricsContainer);
        },

        animateMetrics() {
            const metricNumbers = document.querySelectorAll('.metric-number');
            
            metricNumbers.forEach((metric, index) => {
                setTimeout(() => {
                    metric.style.transform = 'scale(1.1)';
                    metric.style.transition = 'transform 0.3s ease';
                    
                    setTimeout(() => {
                        metric.style.transform = 'scale(1)';
                    }, 300);
                }, index * 150);
            });

            utils.log('Métricas animadas');
        }
    };

    // Efeitos nos cards
    const CardEffects = {
        init() {
            this.setupOportunidadeCards();
            this.setupPassoCards();
            utils.log('Card Effects iniciado');
        },

        setupOportunidadeCards() {
            const cards = document.querySelectorAll('.oportunidade-card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', this.handleCardHover.bind(this));
                card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
            });
        },

        setupPassoCards() {
            const cards = document.querySelectorAll('.passo-item');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', this.handlePassoHover.bind(this));
                card.addEventListener('mouseleave', this.handlePassoLeave.bind(this));
            });
        },

        handleCardHover(e) {
            const card = e.currentTarget;
            const icon = card.querySelector('.card-icon');
            
            if (icon) {
                icon.style.transform = 'scale(1.1) rotateY(180deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        },

        handleCardLeave(e) {
            const card = e.currentTarget;
            const icon = card.querySelector('.card-icon');
            
            if (icon) {
                icon.style.transform = '';
            }
        },

        handlePassoHover(e) {
            const card = e.currentTarget;
            const number = card.querySelector('.passo-number');
            
            if (number) {
                number.style.transform = 'scale(1.1) rotateZ(360deg)';
                number.style.transition = 'transform 0.5s ease';
            }
        },

        handlePassoLeave(e) {
            const card = e.currentTarget;
            const number = card.querySelector('.passo-number');
            
            if (number) {
                number.style.transform = '';
            }
        }
    };

    // Smooth Scroll
    const SmoothScroll = {
        init() {
            this.bindEvents();
            utils.log('Smooth Scroll iniciado');
        },

        bindEvents() {
            document.addEventListener('click', this.handleClick.bind(this));
        },

        handleClick(e) {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                this.scrollToElement(targetElement);
            }
        },

        scrollToElement(element) {
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
        init() {
            this.setupButtonEffects();
            utils.log('Button Interactions iniciado');
        },

        setupButtonEffects() {
            const buttons = document.querySelectorAll('.btn, .card-btn');
            
            buttons.forEach(button => {
                this.addButtonListeners(button);
                this.addRippleEffect(button);
            });
        },

        addButtonListeners(button) {
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

        addRippleEffect(button) {
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
                    z-index: 1;
                `;

                // Adicionar animação de ripple se não existir
                if (!document.querySelector('#ripple-animation')) {
                    const style = document.createElement('style');
                    style.id = 'ripple-animation';
                    style.textContent = `
                        @keyframes ripple {
                            to {
                                transform: scale(2);
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }

                button.style.position = 'relative';
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        }
    };

    // Performance Monitor
    const PerformanceMonitor = {
        init() {
            this.measureLoadTime();
            utils.log('Performance Monitor iniciado');
        },

        measureLoadTime() {
            window.addEventListener('load', () => {
                const loadTime = performance.now();
                utils.log(`Página carregada em ${loadTime.toFixed(2)}ms`);
                
                // Tracking de performance (pode ser integrado com analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'page_load_time', {
                        event_category: 'Performance',
                        event_label: 'Carreiras',
                        value: Math.round(loadTime)
                    });
                }
            });
        }
    };

    // Accessibility Features
    const AccessibilityFeatures = {
        init() {
            this.setupKeyboardNavigation();
            this.setupFocusManagement();
            this.respectReducedMotion();
            utils.log('Accessibility Features iniciado');
        },

        setupKeyboardNavigation() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                }
            });

            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-navigation');
            });

            // Enter/Space para cards interativos
            const interactiveCards = document.querySelectorAll('.oportunidade-card, .passo-item');
            
            interactiveCards.forEach(card => {
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');
                
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const btn = card.querySelector('.card-btn, a');
                        if (btn) btn.click();
                    }
                });
            });
        },

        setupFocusManagement() {
            const style = document.createElement('style');
            style.textContent = `
                .keyboard-navigation *:focus {
                    outline: 2px solid var(--accent-cyan) !important;
                    outline-offset: 2px !important;
                }
                .btn:focus {
                    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.3) !important;
                }
            `;
            document.head.appendChild(style);
        },

        respectReducedMotion() {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            if (prefersReducedMotion.matches) {
                document.body.classList.add('reduced-motion');
            }
            
            prefersReducedMotion.addEventListener('change', () => {
                if (prefersReducedMotion.matches) {
                    document.body.classList.add('reduced-motion');
                } else {
                    document.body.classList.remove('reduced-motion');
                }
            });
        }
    };

    // Error Handler
    const ErrorHandler = {
        init() {
            window.addEventListener('error', this.handleError.bind(this));
            window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
        },

        handleError(e) {
            console.error('JavaScript Error:', {
                message: e.message,
                filename: e.filename,
                line: e.lineno,
                column: e.colno,
                stack: e.error?.stack
            });
        },

        handlePromiseRejection(e) {
            console.error('Promise Rejection:', e.reason);
            e.preventDefault();
        }
    };

    // Inicialização
    const PageInitializer = {
        init() {
            this.loadOverseasComponents();
            this.handlePageLoad();
            utils.log('Página Carreiras inicializada');
        },

        loadOverseasComponents() {
            if (typeof OverseasComponents !== 'undefined') {
                OverseasComponents.init({
                    activePage: 'carreiras',
                    title: 'Carreiras - Overseas Trading',
                    description: 'Desenvolvimento profissional, autonomia e reconhecimento para profissionais de alta performance.',
                    whatsappMessage: 'Olá! Gostaria de saber mais sobre as oportunidades de carreira na Overseas Trading.',
                    canonical: 'https://www.overseastrading.com.br/carreiras',
                    debug: config.debug,
                    onReady: this.onOverseasReady.bind(this)
                });
            } else {
                utils.log('OverseasComponents não encontrado');
                setTimeout(() => {
                    this.initializeModules();
                }, 100);
            }
        },

        onOverseasReady() {
            utils.log('Overseas Components carregado');
            setTimeout(() => {
                this.initializeModules();
            }, 100);
        },

        initializeModules() {
            if (state.isLoaded) return;
            
            try {
                ErrorHandler.init();
                PerformanceMonitor.init();
                AccessibilityFeatures.init();
                AOSAnimations.init();
                MetricsAnimation.init();
                CardEffects.init();
                SmoothScroll.init();
                ButtonInteractions.init();
                
                state.isLoaded = true;
                utils.log('Todos os módulos inicializados com sucesso');
                
            } catch (error) {
                console.error('Erro ao inicializar módulos:', error);
            }
        },

        handlePageLoad() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.onDOMReady.bind(this));
            } else {
                this.onDOMReady();
            }
            
            window.addEventListener('load', this.onWindowLoad.bind(this));
        },

        onDOMReady() {
            utils.log('DOM carregado');
            document.body.classList.add('carreiras-loaded');
        },

        onWindowLoad() {
            utils.log('Página completamente carregada');
            this.removeLoadingStates();
        },

        removeLoadingStates() {
            const loadingElements = document.querySelectorAll('.loading');
            loadingElements.forEach(el => {
                el.classList.remove('loading');
            });
        }
    };

    // API Pública
    window.CarreirasPageAPI = {
        scrollToOportunidades() {
            const oportunidadesSection = document.querySelector('#oportunidades');
            if (oportunidadesSection) {
                SmoothScroll.scrollToElement(oportunidadesSection);
            }
        },
        
        getState() {
            return { ...state };
        },
        
        enableDebug() {
            config.debug = true;
            utils.log('Debug mode enabled');
        }
    };

    // Auto-inicialização
    document.addEventListener('DOMContentLoaded', function() {
        PageInitializer.init();
        
        console.log('🌊 Página Carreiras da Overseas Trading carregada!');
        
        if (config.debug) {
            console.log('🔧 API disponível em: window.CarreirasPageAPI');
            console.log('📊 Estado da aplicação:', state);
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