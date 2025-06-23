/**
 * OVERSEAS TRADING - TRABALHE CONOSCO JAVASCRIPT
 * Arquivo: assets/js/trabalhe-conosco.js
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
        formSubmitted: false
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

        // Validar email
        isValidEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        // Log de debug
        log: function(message, data = null) {
            if (pageConfig.debug) {
                console.log(`[Trabalhe Conosco] ${message}`, data || '');
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
            const cards = document.querySelectorAll('.beneficio-card, .vaga-card, .feature-card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', this.handleCardHover.bind(this));
                card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
            });
        },

        setupClickEffects: function() {
            const vagaCards = document.querySelectorAll('.vaga-card');
            
            vagaCards.forEach(card => {
                card.addEventListener('click', this.handleVagaClick.bind(this));
            });
        },

        handleCardHover: function(e) {
            const card = e.currentTarget;
            
            // Adicionar efeito de brilho
            this.addGlowEffect(card);
            
            // Animar ícone
            const icon = card.querySelector('.beneficio-icon, .feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotateY(180deg)';
            }
        },

        handleCardLeave: function(e) {
            const card = e.currentTarget;
            
            // Remover efeito de brilho
            this.removeGlowEffect(card);
            
            // Resetar animações
            const icon = card.querySelector('.beneficio-icon, .feature-icon');
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

        handleVagaClick: function(e) {
            const card = e.currentTarget;
            const vagaBtn = card.querySelector('.vaga-btn');
            
            // Se clicou no botão, não fazer nada (deixar o comportamento padrão)
            if (e.target === vagaBtn || vagaBtn.contains(e.target)) return;
            
            // Efeito de pulso
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
            
            // Scroll suave para o formulário
            document.querySelector('#candidatura').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Formulário de Candidatura
    const FormHandler = {
        init: function() {
            this.form = document.getElementById('candidaturaForm');
            this.fileInput = document.getElementById('curriculo');
            this.fileName = document.querySelector('.file-name');
            
            if (this.form) {
                this.bindEvents();
                this.setupFileInput();
                utils.log('Form Handler iniciado');
            }
        },

        bindEvents: function() {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            
            // Validação em tempo real
            const inputs = this.form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', this.validateField.bind(this));
                input.addEventListener('input', this.clearFieldError.bind(this));
            });
        },

        setupFileInput: function() {
            if (this.fileInput && this.fileName) {
                this.fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        this.fileName.textContent = file.name;
                        this.fileName.style.color = 'var(--accent-cyan)';
                    } else {
                        this.fileName.textContent = 'Nenhum arquivo selecionado';
                        this.fileName.style.color = 'var(--text-muted)';
                    }
                });
            }
        },

        handleSubmit: function(e) {
            e.preventDefault();
            
            if (appState.formSubmitted) return;
            
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Validação completa
            if (!this.validateForm(data)) {
                return;
            }
            
            // Simular envio
            this.simulateFormSubmission(data);
        },

        validateForm: function(data) {
            const errors = [];
            
            // Nome
            if (!data.nome || data.nome.trim().length < 2) {
                errors.push({ field: 'nome', message: 'Nome deve ter pelo menos 2 caracteres' });
            }
            
            // Email
            if (!data.email || !utils.isValidEmail(data.email)) {
                errors.push({ field: 'email', message: 'E-mail inválido' });
            }
            
            // Área
            if (!data.area) {
                errors.push({ field: 'area', message: 'Selecione uma área de interesse' });
            }
            
            // Arquivo
            if (!this.fileInput.files[0]) {
                errors.push({ field: 'curriculo', message: 'Anexe seu currículo' });
            } else {
                const file = this.fileInput.files[0];
                const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                const maxSize = 5 * 1024 * 1024; // 5MB
                
                if (!allowedTypes.includes(file.type)) {
                    errors.push({ field: 'curriculo', message: 'Formato de arquivo não suportado' });
                }
                
                if (file.size > maxSize) {
                    errors.push({ field: 'curriculo', message: 'Arquivo muito grande (máx. 5MB)' });
                }
            }
            
            // LinkedIn (se preenchido)
            if (data.linkedin && data.linkedin.trim() !== '') {
                const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w\-_]+\/?$/;
                if (!linkedinRegex.test(data.linkedin)) {
                    errors.push({ field: 'linkedin', message: 'URL do LinkedIn inválida' });
                }
            }
            
            if (errors.length > 0) {
                this.showErrors(errors);
                return false;
            }
            
            this.clearAllErrors();
            return true;
        },

        validateField: function(e) {
            const field = e.target;
            const fieldName = field.name;
            const value = field.value.trim();
            
            this.clearFieldError(e);
            
            let error = null;
            
            switch (fieldName) {
                case 'nome':
                    if (value.length < 2) {
                        error = 'Nome deve ter pelo menos 2 caracteres';
                    }
                    break;
                case 'email':
                    if (value && !utils.isValidEmail(value)) {
                        error = 'E-mail inválido';
                    }
                    break;
                case 'linkedin':
                    if (value && !/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w\-_]+\/?$/.test(value)) {
                        error = 'URL do LinkedIn inválida';
                    }
                    break;
            }
            
            if (error) {
                this.showFieldError(field, error);
            }
        },

        clearFieldError: function(e) {
            const field = e.target;
            const existingError = field.parentNode.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
            }
            field.style.borderColor = 'var(--border-color)';
        },

        showFieldError: function(field, message) {
            this.clearFieldError({ target: field });
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.cssText = `
                color: #ff6b6b;
                font-size: 0.8rem;
                margin-top: 0.3rem;
                display: block;
            `;
            errorDiv.textContent = message;
            
            field.style.borderColor = '#ff6b6b';
            field.parentNode.appendChild(errorDiv);
        },

        showErrors: function(errors) {
            errors.forEach(error => {
                const field = document.querySelector(`[name="${error.field}"]`);
                if (field) {
                    this.showFieldError(field, error.message);
                }
            });
            
            // Scroll para o primeiro erro
            const firstError = document.querySelector('.field-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        },

        clearAllErrors: function() {
            const errors = document.querySelectorAll('.field-error');
            errors.forEach(error => error.remove());
            
            const fields = this.form.querySelectorAll('input, select, textarea');
            fields.forEach(field => {
                field.style.borderColor = 'var(--border-color)';
            });
        },

        simulateFormSubmission: function(data) {
            const submitBtn = this.form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Estado de loading
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            appState.formSubmitted = true;
            
            // Simular tempo de envio
            setTimeout(() => {
                this.showSuccessMessage();
                this.form.reset();
                this.fileName.textContent = 'Nenhum arquivo selecionado';
                this.fileName.style.color = 'var(--text-muted)';
                
                // Resetar botão
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                appState.formSubmitted = false;
                
                utils.log('Formulário enviado com sucesso', data);
            }, 2000);
        },

        showSuccessMessage: function() {
            // Remover mensagens existentes
            const existingMessage = document.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'form-message success';
            messageDiv.style.cssText = `
                background: rgba(57, 255, 20, 0.1);
                border: 1px solid var(--accent-green);
                color: var(--accent-green);
                padding: 1rem;
                border-radius: 10px;
                margin-bottom: 2rem;
                text-align: center;
                font-weight: 500;
                animation: slideInMessage 0.5s ease;
            `;
            
            messageDiv.innerHTML = `
                <strong>✅ Candidatura enviada com sucesso!</strong><br>
                Obrigado pelo seu interesse. Analisaremos seu currículo e entraremos em contato em até 5 dias úteis.
            `;
            
            // Adicionar animação
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideInMessage {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            
            if (!document.querySelector('#message-animation')) {
                style.id = 'message-animation';
                document.head.appendChild(style);
            }
            
            this.form.parentNode.insertBefore(messageDiv, this.form);
            
            // Auto remover após 8 segundos
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 8000);
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

    // Scroll to Top Button
    const ScrollToTop = {
        init: function() {
            this.createButton();
            this.bindEvents();
            utils.log('Scroll to Top iniciado');
        },

        createButton: function() {
            // Verificar se o botão já existe
            if (document.querySelector('.scroll-to-top')) return;

            const button = document.createElement('button');
            button.className = 'scroll-to-top';
            button.setAttribute('aria-label', 'Voltar ao topo');
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 15l-6-6-6 6"/>
                </svg>
            `;
            
            document.body.appendChild(button);
            this.button = button;
        },

        bindEvents: function() {
            if (!this.button) return;

            // Mostrar/ocultar baseado no scroll
            window.addEventListener('scroll', utils.throttle(() => {
                if (window.pageYOffset > 300) {
                    this.button.classList.add('visible');
                } else {
                    this.button.classList.remove('visible');
                }
            }, 100));

            // Click para voltar ao topo
            this.button.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    };

    // Button Interactions
    const ButtonInteractions = {
        init: function() {
            this.setupButtonEffects();
            this.setupVagaButtons();
            utils.log('Button Interactions iniciado');
        },

        setupButtonEffects: function() {
            const buttons = document.querySelectorAll('.btn');
            
            buttons.forEach(button => {
                this.addButtonListeners(button);
                this.addAdvancedEffects(button);
            });
        },

        setupVagaButtons: function() {
            const vagaButtons = document.querySelectorAll('.vaga-btn');
            
            vagaButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Scroll para formulário
                    document.querySelector('#candidatura').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Destacar área correspondente no select
                    setTimeout(() => {
                        const areaSelect = document.getElementById('area');
                        if (areaSelect) {
                            areaSelect.focus();
                            areaSelect.style.borderColor = 'var(--accent-cyan)';
                            areaSelect.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.2)';
                            
                            setTimeout(() => {
                                areaSelect.style.borderColor = '';
                                areaSelect.style.boxShadow = '';
                            }, 2000);
                        }
                    }, 1000);
                });
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

                // Adicionar animação de ripple se não existir
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
        }
    };

    // Inicialização da página
    const PageInitializer = {
        init: function() {
            this.loadOverseasComponents();
            this.handlePageLoad();
            utils.log('Página Trabalhe Conosco inicializada');
        },

        loadOverseasComponents: function() {
            if (typeof OverseasComponents !== 'undefined') {
                OverseasComponents.init({
                    activePage: 'trabalhe-conosco',
                    title: 'Trabalhe Conosco - Carreiras em Comércio Exterior',
                    description: 'Junte-se à Overseas Trading e construa uma carreira de impacto no comércio exterior. Ambiente global, crescimento profissional e cultura colaborativa.',
                    whatsappMessage: 'Olá! Gostaria de saber mais sobre as oportunidades de carreira na Overseas Trading.',
                    canonical: 'https://www.overseastrading.com.br/trabalhe-conosco',
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
                FormHandler.init();
                SmoothScroll.init();
                ScrollToTop.init();
                ButtonInteractions.init();
                
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
            
            document.body.classList.add('trabalhe-conosco-loaded');
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
                    page_title: 'Trabalhe Conosco',
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
            const interactiveCards = document.querySelectorAll('.beneficio-card, .vaga-card, .feature-card');
            
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
    window.TrabalheConoscoPageAPI = {
        scrollToVagas: function() {
            const vagasSection = document.querySelector('.vagas-section');
            if (vagasSection) {
                SmoothScroll.scrollToElement(vagasSection);
            }
        },
        
        scrollToFormulario: function() {
            const candidaturaSection = document.querySelector('#candidatura');
            if (candidaturaSection) {
                SmoothScroll.scrollToElement(candidaturaSection);
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
        
        console.log('🌊 Página Trabalhe Conosco da Overseas Trading carregada com sucesso!');
        
        if (pageConfig.debug) {
            console.log('🔧 API disponível em: window.TrabalheConoscoPageAPI');
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