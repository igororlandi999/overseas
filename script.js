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

// Statistics Counter Animation - ATUALIZADA PARA 3 CARDS
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
let animationTriggered = false; // Controle para executar apenas uma vez

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
    // Inicializar números com valores zero formatados corretamente
    const counters = document.querySelectorAll('.indicador-number');
    
    counters.forEach(counter => {
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const centavos = counter.getAttribute('data-centavos') || '';
        const useSeparator = counter.getAttribute('data-separator') === 'true';
        
        // Definir valor inicial correto
        if (centavos && centavos !== '') {
            counter.textContent = `${prefix}0,00${suffix}`;
        } else {
            counter.textContent = `${prefix}0${suffix}`;
        }
    });
    
    console.log('Overseas Trading - Seção de indicadores inicializada! ✅');
    console.log('🔢 3 cards principais: 📈 88% | 🏛️ R$ 35.019.349,73 | 🚛 R$ 387.600.395,04');
});

// Form Validation and Submission
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await simulateFormSubmission(data);
            
            // Show success message
            showMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            contactForm.reset();
            
        } catch (error) {
            showMessage('Erro ao enviar mensagem. Tente novamente.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Form Validation Function
function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('E-mail inválido');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Mensagem deve ter pelo menos 10 caracteres');
    }
    
    if (errors.length > 0) {
        showMessage(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Simulate Form Submission
function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success (90% chance) or failure (10% chance)
            if (Math.random() > 0.1) {
                resolve(data);
            } else {
                reject(new Error('Simulation error'));
            }
        }, 2000);
    });
}

// Show Success/Error Messages
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = message;
    
    // Insert before form
    contactForm.parentNode.insertBefore(messageDiv, contactForm);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

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
        // Day theme - slightly brighter
        root.style.setProperty('--accent-blue', '#00d4ff');
        root.style.setProperty('--accent-cyan', '#00ffff');
    } else {
        // Night theme - more muted
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
        
        // Add pulse effect on hover
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

// Lazy Loading for Images (if any are added later)
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
    // Remove unused event listeners and observers when page unloads
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
    
    // Check if input has value on page load
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
🌊 Overseas Trading - Website loaded successfully! 🚀
📧 Commercial: comercial@overseastrading.com.br
📱 WhatsApp: +55 (48) 3204-9798
🌍 23 years of international trade experience

📊 Seção de Indicadores Atualizada:
📈 +88% crescimento de processos desde 2020
🏛️ R$ 35.019.349,73 economizados em ICMS (2024)
🚛 R$ 387.600.395,04 movimentados (2024)

✨ Mantidos apenas os 3 cards solicitados
🎯 Grid responsivo: 3 colunas desktop, 1 coluna mobile
⚡ Animação countUp única por visita
🎨 Layout otimizado e limpo
`);

// Initialize all functions when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Overseas Trading - All systems initialized! ✅');
    console.log('🎯 Seção de indicadores atualizada com 3 cards! 📊');
});