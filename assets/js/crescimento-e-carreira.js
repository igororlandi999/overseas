/**
 * OVERSEAS TRADING - CRESCIMENTO E CARREIRA JAVASCRIPT
 * Arquivo: assets/js/crescimento-e-carreira.js
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
        scrollY: 0,
        chartAnimated: false
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
                console.log(`[Crescimento e Carreira] ${message}`, data || '');
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
            const animateOnScroll = utils.throttle(() => {
                elements.forEach(el => {
                    if (!appState.animated.has(el) && utils.isElementInViewport(el, 0.2)) {
                        const delay = parseInt(el.dataset.aosDelay) || 0;
                        setTimeout(() => {
                            this.animateElement(el);
                            appState.animated.add(el);
                        }, delay);
                    }
                });
            }, pageConfig.scrollThrottle);

            window.addEventListener('scroll', animateOnScroll);
            window.addEventListener('resize', animateOnScroll);
            
            // Verificar elementos iniciais
            animateOnScroll();
        }
    };

    // Animação do gráfico de crescimento
    const GrowthChart = {
        init: function() {
            this.chartContainer = document.querySelector('.growth-chart');
            if (!this.chartContainer) return;

            this.setupChartObserver();
            utils.log('Growth Chart iniciado');
        },

        setupChartObserver: function() {
            if (!window.IntersectionObserver) {
                this.animateChart();
                return;
            }

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !appState.chartAnimated) {
                            this.animateChart();
                            appState.chartAnimated = true;
                        }
                    });
                },
                { threshold: 0.3 }
            );

            observer.observe(this.chartContainer);
        },

        animateChart: function() {
            const bars = document.querySelectorAll('.bar-fill');
            
            bars.forEach((bar, index) => {
                setTimeout(() => {
                    const progress = bar.style.width;
                    bar.style.width = '0%';
                    bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    
                    requestAnimationFrame(() => {
                        bar.style.width = progress;
                    });
                }, index * 200);
            });

            utils.log('Gráfico de crescimento animado');
        }
    };

    // Efeitos de hover nos cards
    const CardEffects = {
        init: function() {
            this.setupFeatureCards();
            this.setupDepoimentoCards();
            this.setupReconhecimentoCards();
            utils.log('Card Effects iniciado');
        },

        setupFeatureCards: function() {
            const cards = document.querySelectorAll('.feature-card');
            this.addHoverEffects(cards, 'feature-hover');
        },

        setupDepoimentoCards: function() {
            const cards = document.querySelectorAll('.depoimento-card');
            this.addHoverEffects(cards, 'depoimento-hover');
        },

        setupReconhecimentoCards: function() {
            const cards = document.querySelectorAll('.reconhecimento-card');
            this.addHoverEffects(cards, 'reconhecimento-hover');
        },

        addHoverEffects: function(cards, className) {
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.classList.add(className);
                });

                card.addEventListener('mouseleave', () => {
                    card.classList.remove(className);
                });
            });
        }
    };

    // Scroll to Top button
    const ScrollToTop = {
        init: function() {
            this.createButton();
            this.setupScrollListener();
            utils.log('Scroll to Top iniciado');
        },

        createButton: function() {
            this.button = document.createElement('button');
            this.button.className = 'scroll-to-top';
            this.button.setAttribute('aria-label', 'Voltar ao topo');
            this.button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="18,15 12,9 6,15"></polyline>
                </svg>
            `;

            this.button.addEventListener('click', this.scrollToTop.bind(this));
            document.body.appendChild(this.button);
        },

        setupScrollListener: function() {
            const toggleButton = utils.throttle(() => {
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollY > 300) {
                    this.button.classList.add('visible');
                } else {
                    this.button.classList.remove('visible');
                }
            }, pageConfig.scrollThrottle);

            window.addEventListener('scroll', toggleButton);
        },

        scrollToTop: function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    // Timeline animations
    const TimelineAnimations = {
        init: function() {
            this.timelineItems = document.querySelectorAll('.timeline-item');
            if (!this.timelineItems.length) return;

            this.setupTimelineObserver();
            utils.log('Timeline Animations iniciado');
        },

        setupTimelineObserver: function() {
            if (!window.IntersectionObserver) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.animateTimelineItem(entry.target);
                        }
                    });
                },
                { threshold: 0.2 }
            );

            this.timelineItems.forEach(item => observer.observe(item));
        },

        animateTimelineItem: function(item) {
            const number = item.querySelector('.timeline-number');
            const content = item.querySelector('.timeline-content');

            if (number) {
                number.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    number.style.transform = 'scale(1)';
                }, 200);
            }

            if (content) {
                content.style.animation = 'slideInUp 0.6s ease forwards';
            }
        }
    };

    // Performance monitoring
    const Performance = {
        init: function() {
            this.measureLoadTime();
            this.setupPerformanceObserver();
            utils.log('Performance monitoring iniciado');
        },

        measureLoadTime: function() {
            window.addEventListener('load', () => {
                const loadTime = performance.now();
                utils.log(`Página carregada em ${loadTime.toFixed(2)}ms`);
            });
        },

        setupPerformanceObserver: function() {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (entry.entryType === 'paint') {
                            utils.log(`${entry.name}: ${entry.startTime.toFixed(2)}ms`);
                        }
                    });
                });

                observer.observe({ entryTypes: ['paint'] });
            }
        }
    };

    // Accessibility features
    const Accessibility = {
        init: function() {
            this.setupKeyboardNavigation();
            this.setupFocusManagement();
            this.setupReducedMotion();
            utils.log('Accessibility features iniciado');
        },

        setupKeyboardNavigation: function() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                }
            });

            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-navigation');
            });
        },

        setupFocusManagement: function() {
            const focusableElements = document.querySelectorAll(
                'a, button, [tabindex]:not([tabindex="-1"])'
            );

            focusableElements.forEach(el => {
                el.addEventListener('focus', () => {
                    el.classList.add('focused');
                });

                el.addEventListener('blur', () => {
                    el.classList.remove('focused');
                });
            });
        },

        setupReducedMotion: function() {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            if (prefersReducedMotion.matches) {
                document.body.classList.add('reduced-motion');
                utils.log('Reduced motion detectado');
            }

            prefersReducedMotion.addEventListener('change', (e) => {
                if (e.matches) {
                    document.body.classList.add('reduced-motion');
                } else {
                    document.body.classList.remove('reduced-motion');
                }
            });
        }
    };

    // Error handling
    const ErrorHandler = {
        init: function() {
            window.addEventListener('error', this.handleError.bind(this));
            window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
            utils.log('Error Handler iniciado');
        },

        handleError: function(event) {
            console.error('Erro capturado:', event.error);
            utils.log('Erro na página', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        },

        handlePromiseRejection: function(event) {
            console.error('Promise rejeitada:', event.reason);
            utils.log('Promise rejeitada', event.reason);
        }
    };

    // Inicialização principal
    const App = {
        init: function() {
            utils.log('Iniciando aplicação');
            
            // Verificar se o DOM está pronto
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.start.bind(this));
            } else {
                this.start();
            }
        },

        start: function() {
            try {
                // Inicializar módulos
                ErrorHandler.init();
                Performance.init();
                Accessibility.init();
                AOSAnimations.init();
                GrowthChart.init();
                CardEffects.init();
                ScrollToTop.init();
                TimelineAnimations.init();

                // Marcar como carregado
                appState.isLoaded = true;
                document.body.classList.add('app-loaded');

                utils.log('Aplicação iniciada com sucesso');
            } catch (error) {
                console.error('Erro ao inicializar aplicação:', error);
            }
        }
    };

    // Inicializar aplicação
    App.init();

    // Expor para debugging (apenas em desenvolvimento)
    if (pageConfig.debug) {
        window.CrescimentoCarreiraApp = {
            state: appState,
            config: pageConfig,
            modules: {
                AOSAnimations,
                GrowthChart,
                CardEffects,
                ScrollToTop,
                TimelineAnimations
            }
        };
    }

})();