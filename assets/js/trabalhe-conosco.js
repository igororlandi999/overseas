/**
 * OVERSEAS TRADING - TRABALHE CONOSCO JAVASCRIPT
 * Arquivo: assets/js/trabalhe-conosco.js
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
        formSubmitted: false
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

        // Verificar se elemento está visível
        isElementInViewport(el, threshold = 0.1) {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            return (
                rect.top <= windowHeight * (1 - threshold) &&
                rect.bottom >= windowHeight * threshold
            );
        },

        // Validar email
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        // Validar telefone brasileiro
        isValidPhone(phone) {
            const phoneRegex = /^(?:\+55\s?)?(?:\(?[1-9]{2}\)?\s?)?(?:9\s?)?[0-9]{4}-?[0-9]{4}$/;
            return phoneRegex.test(phone.replace(/\s/g, ''));
        },

        // Log de debug
        log(message, data = null) {
            if (config.debug) {
                console.log(`[Trabalhe Conosco] ${message}`, data || '');
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

    // Efeitos nos Cards
    const CardEffects = {
        init() {
            this.setupHoverEffects();
            this.setupClickEffects();
            utils.log('Card Effects iniciado');
        },

        setupHoverEffects() {
            const cards = document.querySelectorAll('.vaga-card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', this.handleCardHover.bind(this));
                card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
            });
        },

        setupClickEffects() {
            const vagaBtns = document.querySelectorAll('.vaga-btn');
            
            vagaBtns.forEach(btn => {
                btn.addEventListener('click', this.handleVagaClick.bind(this));
            });
        },

        handleCardHover(e) {
            const card = e.currentTarget;
            const icon = card.querySelector('.vaga-icon');
            
            if (icon) {
                icon.style.transform = 'scale(1.1) rotateY(180deg)';
            }
        },

        handleCardLeave(e) {
            const card = e.currentTarget;
            const icon = card.querySelector('.vaga-icon');
            
            if (icon) {
                icon.style.transform = '';
            }
        },

        handleVagaClick(e) {
            e.preventDefault();
            
            // Scroll suave para o formulário
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
        }
    };

    // Formulário
    const FormHandler = {
        init() {
            this.form = document.getElementById('candidaturaForm');
            this.fileInput = document.getElementById('curriculo');
            this.fileName = document.querySelector('.file-name');
            
            if (this.form) {
                this.bindEvents();
                this.setupFileInput();
                this.setupPhoneMask();
                utils.log('Form Handler iniciado');
            }
        },

        bindEvents() {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            
            // Validação em tempo real
            const inputs = this.form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', this.validateField.bind(this));
                input.addEventListener('input', this.clearFieldError.bind(this));
            });
        },

        setupFileInput() {
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

        setupPhoneMask() {
            const phoneInput = document.getElementById('telefone');
            if (phoneInput) {
                phoneInput.addEventListener('input', (e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    
                    if (value.length <= 11) {
                        if (value.length <= 10) {
                            value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                        } else {
                            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                        }
                        e.target.value = value;
                    }
                });
            }
        },

        handleSubmit(e) {
            e.preventDefault();
            
            if (state.formSubmitted) return;
            
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Validação completa
            if (!this.validateForm(data)) {
                return;
            }
            
            // Simular envio
            this.simulateFormSubmission(data);
        },

        validateForm(data) {
            const errors = [];
            
            // Nome
            if (!data.nome || data.nome.trim().length < 2) {
                errors.push({ field: 'nome', message: 'Nome deve ter pelo menos 2 caracteres' });
            }
            
            // Email
            if (!data.email || !utils.isValidEmail(data.email)) {
                errors.push({ field: 'email', message: 'E-mail inválido' });
            }
            
            // Telefone
            if (!data.telefone || !utils.isValidPhone(data.telefone)) {
                errors.push({ field: 'telefone', message: 'Telefone inválido' });
            }
            
            // Área
            if (!data.area) {
                errors.push({ field: 'area', message: 'Selecione uma área de interesse' });
            }
            
            // Apresentação
            if (!data.apresentacao || data.apresentacao.trim().length < 50) {
                errors.push({ field: 'apresentacao', message: 'Apresentação deve ter pelo menos 50 caracteres' });
            }
            
            // Arquivo
            if (!this.fileInput.files[0]) {
                errors.push({ field: 'curriculo', message: 'Anexe seu currículo' });
            } else {
                const file = this.fileInput.files[0];
                const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                const maxSize = 5 * 1024 * 1024; // 5MB
                
                if (!allowedTypes.includes(file.type)) {
                    errors.push({ field: 'curriculo', message: 'Formato de arquivo não suportado (apenas PDF, DOC, DOCX)' });
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

        validateField(e) {
            const field = e.target;
            const fieldName = field.name;
            const value = field.value.trim();
            
            this.clearFieldError(e);
            
            let error = null;
            
            switch (fieldName) {
                case 'nome':
                    if (value.length > 0 && value.length < 2) {
                        error = 'Nome deve ter pelo menos 2 caracteres';
                    }
                    break;
                case 'email':
                    if (value && !utils.isValidEmail(value)) {
                        error = 'E-mail inválido';
                    }
                    break;
                case 'telefone':
                    if (value && !utils.isValidPhone(value)) {
                        error = 'Telefone inválido';
                    }
                    break;
                case 'linkedin':
                    if (value && !/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w\-_]+\/?$/.test(value)) {
                        error = 'URL do LinkedIn inválida';
                    }
                    break;
                case 'apresentacao':
                    if (value.length > 0 && value.length < 50) {
                        error = 'Apresentação deve ter pelo menos 50 caracteres';
                    }
                    break;
            }
            
            if (error) {
                this.showFieldError(field, error);
            }
        },

        clearFieldError(e) {
            const field = e.target;
            const existingError = field.parentNode.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
            }
            field.style.borderColor = 'var(--border-color)';
        },

        showFieldError(field, message) {
            this.clearFieldError({ target: field });
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            
            field.style.borderColor = '#ff6b6b';
            field.parentNode.appendChild(errorDiv);
        },

        showErrors(errors) {
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

        clearAllErrors() {
            const errors = document.querySelectorAll('.field-error');
            errors.forEach(error => error.remove());
            
            const fields = this.form.querySelectorAll('input, select, textarea');
            fields.forEach(field => {
                field.style.borderColor = 'var(--border-color)';
            });
        },

        simulateFormSubmission(data) {
            const submitBtn = this.form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Estado de loading
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            state.formSubmitted = true;
            
            // Simular tempo de envio
            setTimeout(() => {
                this.showSuccessMessage();
                this.form.reset();
                this.fileName.textContent = 'Nenhum arquivo selecionado';
                this.fileName.style.color = 'var(--text-muted)';
                
                // Resetar botão
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                state.formSubmitted = false;
                
                utils.log('Formulário enviado com sucesso', data);
            }, 2000);
        },

        showSuccessMessage() {
            // Remover mensagens existentes
            const existingMessage = document.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'form-message success';
            messageDiv.innerHTML = `
                <strong>✅ Candidatura enviada com sucesso!</strong><br>
                Obrigado pelo seu interesse. Analisaremos seu currículo e entraremos em contato em até 5 dias úteis.
            `;
            
            this.form.parentNode.insertBefore(messageDiv, this.form);
            
            // Auto remover após 8 segundos
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 8000);
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
            const buttons = document.querySelectorAll('.btn, .vaga-btn, .submit-btn');
            
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
                if (!button.disabled) {
                    button.style.transform = states.hover;
                }
            });
            
            button.addEventListener('mouseleave', () => {
                if (!button.disabled) {
                    button.style.transform = states.default;
                }
            });
            
            button.addEventListener('mousedown', () => {
                if (!button.disabled) {
                    button.style.transform = states.active;
                }
            });
            
            button.addEventListener('mouseup', () => {
                if (!button.disabled) {
                    button.style.transform = states.hover;
                }
            });
        },

        addRippleEffect(button) {
            button.addEventListener('click', (e) => {
                if (button.disabled) return;
                
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

    // Inicialização
    const PageInitializer = {
        init() {
            this.loadOverseasComponents();
            this.handlePageLoad();
            utils.log('Página Trabalhe Conosco inicializada');
        },

        loadOverseasComponents() {
            if (typeof OverseasComponents !== 'undefined') {
                OverseasComponents.init({
                    activePage: 'trabalhe-conosco',
                    title: 'Trabalhe Conosco - Overseas Trading',
                    description: 'Profissionais de alta performance com autonomia e foco em resultados.',
                    whatsappMessage: 'Olá! Gostaria de saber mais sobre as oportunidades de carreira na Overseas Trading.',
                    canonical: 'https://www.overseastrading.com.br/trabalhe-conosco',
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
                AOSAnimations.init();
                CardEffects.init();
                FormHandler.init();
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
            document.body.classList.add('trabalhe-conosco-loaded');
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
    window.TrabalheConoscoPageAPI = {
        scrollToVagas() {
            const vagasSection = document.querySelector('.vagas-section');
            if (vagasSection) {
                SmoothScroll.scrollToElement(vagasSection);
            }
        },
        
        scrollToFormulario() {
            const candidaturaSection = document.querySelector('#candidatura');
            if (candidaturaSection) {
                SmoothScroll.scrollToElement(candidaturaSection);
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
        
        console.log('🌊 Página Trabalhe Conosco da Overseas Trading carregada!');
        
        if (config.debug) {
            console.log('🔧 API disponível em: window.TrabalheConoscoPageAPI');
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