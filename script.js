// DOM Elements
const header = document.getElementById('header');
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
const scrollProgress = document.getElementById('scrollProgress');
const contactForm = document.getElementById('contactForm');

// Header Scroll Effect
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Header background change
    if (scrollTop > 100) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }

    // Scroll progress bar
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollTop / documentHeight) * 100;
    scrollProgress.style.width = `${scrollPercentage}%`;

    lastScrollTop = scrollTop;
});

// Mobile Menu Toggle
mobileToggle.addEventListener('click', () => {
    const isActive = navLinks.classList.contains('active');

    if (isActive) {
        // Fechar menu
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Abrir menu mobile');
        document.body.style.overflow = 'auto';
    } else {
        // Abrir menu
        navLinks.classList.add('active');
        mobileToggle.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
        mobileToggle.setAttribute('aria-label', 'Fechar menu mobile');
        document.body.style.overflow = 'hidden';
    }
});

// Close mobile menu when clicking on links
navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Abrir menu mobile');
        document.body.style.overflow = 'auto';
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.setAttribute('aria-label', 'Abrir menu mobile');
            document.body.style.overflow = 'auto';
        }
    }
});

// ESC key closes mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Abrir menu mobile');
        document.body.style.overflow = 'auto';
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with animation classes
document.querySelectorAll('.fade-in, .slide-left, .slide-right').forEach(el => {
    observer.observe(el);
});

// Statistics Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.indicador-number');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const centavos = counter.getAttribute('data-centavos') || '';
        const useSeparator = counter.getAttribute('data-separator') === 'true';
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current = Math.min(increment * step, target);

            counter.textContent = formatNumberComplete(
                Math.floor(current),
                prefix,
                suffix,
                centavos,
                useSeparator
            );

            if (step >= steps) {
                clearInterval(timer);
                counter.textContent = formatNumberComplete(
                    target,
                    prefix,
                    suffix,
                    centavos,
                    useSeparator
                );
            }
        }, duration / steps);
    });

    // Animate mini charts
    setTimeout(() => {
        animateMiniCharts();
    }, 500);
}

// Improved formatNumberComplete function
function formatNumberComplete(value, prefix, suffix, centavos, useSeparator) {
    let formattedValue = useSeparator ? value.toLocaleString('pt-BR') : value;

    if (centavos && prefix.includes('R')) {
        formattedValue = formattedValue + ',' + centavos;
    }

    return `${prefix}${formattedValue}${suffix}`;
}

// Animate Mini Charts
function animateMiniCharts() {
    const miniBars = document.querySelectorAll('.mini-bar');
    miniBars.forEach((bar, index) => {
        const height = bar.getAttribute('data-height');
        setTimeout(() => {
            bar.style.height = height;
        }, index * 200);
    });
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.indicadores');
let animationTriggered = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !animationTriggered) {
            animationTriggered = true;
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// Inicializar valores corretos nos elementos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.indicador-number');

    counters.forEach(counter => {
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const centavos = counter.getAttribute('data-centavos') || '';
        const useSeparator = counter.getAttribute('data-separator') === 'true';

        if (centavos && centavos !== '') {
            counter.textContent = `${prefix}0,00${suffix}`;
        } else {
            counter.textContent = `${prefix}0${suffix}`;
        }
    });

    console.log('Overseas Trading - Seção de indicadores inicializada! ✅');
    console.log('🔢 2 cards principais: 🏛️ R$ 35.019.349,73 | 🚛 R$ 387.600.395,04');
});

// ==============================================
// NOVA IMPLEMENTAÇÃO DE ENVIO DE EMAIL
// ==============================================

// Configuração do EmailJS (Solução Gratuita)
const EMAIL_CONFIG = {
    serviceID: 'service_overseas', // Você precisa configurar isso no EmailJS
    templateID: 'template_contact', // Você precisa criar esse template
    userID: 'YOUR_EMAILJS_USER_ID' // Seu user ID do EmailJS
};

// Função para enviar email via EmailJS
async function sendEmailJS(formData) {
    const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        company: formData.company || 'Não informado',
        phone: formData.phone || 'Não informado',
        message: formData.message,
        to_email: 'maru@overseastrading.com.br'
    };

    try {
        const response = await emailjs.send(
            EMAIL_CONFIG.serviceID,
            EMAIL_CONFIG.templateID,
            templateParams,
            EMAIL_CONFIG.userID
        );

        console.log('Email enviado com sucesso:', response);
        return { success: true, response };
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        throw error;
    }
}

// Função alternativa usando Formspree (Backup)
async function sendFormspree(formData) {
    const response = await fetch('https://formspree.io/f/mldnzorw', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            company: formData.company,
            phone: formData.phone,
            message: formData.message,
            _replyto: formData.email,
            _subject: `Nova mensagem de contato - ${formData.name}`
        })
    });

    if (!response.ok) {
        throw new Error('Erro no envio via Formspree');
    }

    return await response.json();
}

// Função principal de envio de email
async function sendContactEmail(formData) {
    // Tentativa 1: EmailJS (Principal)
    try {
        if (typeof emailjs !== 'undefined') {
            return await sendEmailJS(formData);
        }
    } catch (error) {
        console.log('EmailJS falhou, tentando Formspree...', error);
    }

    // Tentativa 2: Formspree (Backup)
    try {
        return await sendFormspree(formData);
    } catch (error) {
        console.log('Formspree falhou, usando webhook...', error);
    }

    // Tentativa 3: Webhook personalizado (se você tiver um servidor)
    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Erro no webhook');
        }

        return await response.json();
    } catch (error) {
        console.log('Webhook falhou:', error);
        throw new Error('Todos os métodos de envio falharam');
    }
}

// Form Validation and Submission - ATUALIZADO
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Validação básica
        if (!validateForm(data)) {
            return;
        }

        // Mostrar estado de carregamento
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        try {
            // Enviar email
            await sendContactEmail(data);

            // Mostrar mensagem de sucesso
            showMessage(
                '✅ Mensagem enviada com sucesso!<br>Entraremos em contato em até 24 horas.',
                'success'
            );

            // Limpar formulário
            contactForm.reset();

            // Analytics/Tracking (opcional)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'Contact',
                    event_label: 'Contact Form Submission'
                });
            }

        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            showMessage(
                '❌ Erro ao enviar mensagem.<br>Tente novamente ou entre em contato via WhatsApp.',
                'error'
            );
        } finally {
            // Restaurar botão
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    });
}

// Form Validation Function - MELHORADA
function validateForm(data) {
    const errors = [];

    // Validação de nome
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    // Validação de email
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('E-mail inválido');
    }

    // Validação de mensagem
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Mensagem deve ter pelo menos 10 caracteres');
    }

    // Validação de telefone (opcional, mas se preenchido deve ser válido)
    if (data.phone && !isValidPhone(data.phone)) {
        errors.push('Telefone inválido (use formato brasileiro)');
    }

    if (errors.length > 0) {
        showMessage(errors.join('<br>'), 'error');
        return false;
    }

    return true;
}

// Email Validation - MELHORADA
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

// Phone Validation
function isValidPhone(phone) {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    // Verifica se tem entre 10 e 11 dígitos (formato brasileiro)
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
}

// Show Success/Error Messages - MELHORADA
function showMessage(message, type) {
    // Remove mensagens existentes
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = message;
    messageDiv.style.animation = 'slideInFromTop 0.5s ease';

    // Inserir antes do formulário
    contactForm.parentNode.insertBefore(messageDiv, contactForm);

    // Auto remover após 7 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideOutToTop 0.5s ease';
            setTimeout(() => {
                messageDiv.remove();
            }, 500);
        }
    }, 7000);
}

// ==============================================
// RESTO DO CÓDIGO ORIGINAL (mantido igual)
// ==============================================

// Animate Hero Chart Bars
function animateHeroChart() {
    const chartBars = document.querySelectorAll('.chart-bar');

    chartBars.forEach((bar, index) => {
        const height = bar.style.height;
        const fill = bar.querySelector('.bar-fill');

        // Reset height
        fill.style.height = '0';

        // Animate with delay
        setTimeout(() => {
            fill.style.height = height;
        }, index * 200);
    });
}

// Trigger chart animation when hero section is visible
const heroSection = document.querySelector('.hero');
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(animateHeroChart, 500);
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

if (heroSection) {
    heroObserver.observe(heroSection);
}

// Card Hover Effects Enhancement
document.querySelectorAll('.diferencial-item').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

document.querySelectorAll('.solucao-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Enhanced Hover Effects for Indicador Cards
document.querySelectorAll('.indicador-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Dynamic Theme Color Based on Time
function setDynamicTheme() {
    const hour = new Date().getHours();
    const root = document.documentElement;

    if (hour >= 6 && hour < 18) {
        root.style.setProperty('--accent-blue', '#00d4ff');
        root.style.setProperty('--accent-cyan', '#00ffff');
    } else {
        root.style.setProperty('--accent-blue', '#0099cc');
        root.style.setProperty('--accent-cyan', '#00cccc');
    }
}

// Apply dynamic theme
setDynamicTheme();

// Add scroll-based reveal animation for elements
function addScrollReveal() {
    const revealElements = document.querySelectorAll('.diferencial-item, .indicador-card, .solucao-card');

    revealElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        element.style.transitionDelay = `${index * 0.1}s`;
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Initialize scroll reveal
addScrollReveal();

// Add floating action button animation
function animateFloatingButton() {
    const whatsappButton = document.querySelector('.whatsapp-float');

    if (whatsappButton) {
        let isVisible = false;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;

            if (scrollTop > 300 && !isVisible) {
                whatsappButton.style.opacity = '1';
                whatsappButton.style.transform = 'scale(1)';
                isVisible = true;
            } else if (scrollTop <= 300 && isVisible) {
                whatsappButton.style.opacity = '0.8';
                whatsappButton.style.transform = 'scale(0.9)';
                isVisible = false;
            }
        });

        whatsappButton.addEventListener('mouseenter', () => {
            whatsappButton.style.animation = 'none';
        });

        whatsappButton.addEventListener('mouseleave', () => {
            whatsappButton.style.animation = 'pulse-whatsapp 2s infinite';
        });
    }
}

// Initialize floating button animation
animateFloatingButton();

// Performance Monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
            }, 0);
        });
    }
}

// Initialize performance monitoring
measurePerformance();

// Lazy Loading for Images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

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

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

// Add smooth transitions to section appearances
function initSectionTransitions() {
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.8s ease';
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Initialize section transitions
initSectionTransitions();

// Cleanup function for performance
function cleanup() {
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
        statsObserver.disconnect();
        if (heroObserver) heroObserver.disconnect();
    });
}

// Initialize cleanup
cleanup();

// Handle form input focus effects
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });

    if (input.value) {
        input.parentElement.classList.add('focused');
    }
});

// Optimized button interactions
const buttonInteractions = {
    init() {
        document.querySelectorAll('.cta-button, .submit-btn').forEach(button => {
            button.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            this.addButtonListeners(button);
        });

        document.querySelectorAll('.social-link').forEach(link => {
            link.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            this.addLinkListeners(link);
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

    addLinkListeners(link) {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-5px) scale(1.1)';
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0) scale(1)';
        });
    }
};

// Initialize optimized interactions
buttonInteractions.init();

// Console welcome message
console.log(`
🌊 Overseas Trading - Website com Email Integrado! 🚀
📧 Commercial: comercial@overseastrading.com.br
📧 Maru: maru@overseastrading.com.br
📱 WhatsApp: +55 (48) 3204-9798
🌍 25+ anos de experiência em comércio internacional

📊 Sistema de Email Configurado:
✅ EmailJS (Principal)
✅ Formspree (Backup)
✅ Validação avançada
✅ Mensagens de feedback
✅ Analytics tracking

💡 Próximos passos:
1. Configurar EmailJS ou Formspree
2. Testar envio de emails
3. Monitorar formulários
`);

// Initialize all functions when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Overseas Trading - Sistema completo inicializado! ✅');
    console.log('📧 Formulário de contato conectado ao email! 📬');
});