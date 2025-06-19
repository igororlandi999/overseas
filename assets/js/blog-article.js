/**
 * JavaScript para Páginas de Artigos do Blog
 * Arquivo: assets/js/blog-article.js
 */

(function() {
    'use strict';

    // Configuração global para artigos
    const BlogArticle = {
        // Estado do artigo
        state: {
            readingProgress: 0,
            timeOnPage: 0,
            scrollMilestones: {},
            shareEvents: {}
        },

        // Configurações
        config: {
            readingSpeedWPM: 200, // Palavras por minuto
            milestones: [25, 50, 75, 90, 100],
            analytics: true
        },

        // Inicialização principal
        init: function(options = {}) {
            // Merge configurações
            Object.assign(this.config, options);

            // Aguardar DOM estar pronto
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.initFeatures();
                });
            } else {
                this.initFeatures();
            }
        },

        // Inicializar funcionalidades
        initFeatures: function() {
            this.setupReadingProgress();
            this.setupSmoothScroll();
            this.setupShareButtons();
            this.setupTableOfContents();
            this.setupReadingTime();
            this.setupEngagementTracking();
            this.setupCopyToClipboard();
            this.setupKeyboardShortcuts();
            
            console.log('📖 Blog Article features carregadas!');
        },

        // Progresso de leitura
        setupReadingProgress: function() {
            const progressBar = document.querySelector('.overseas-scroll-progress');
            if (!progressBar) return;

            window.addEventListener('scroll', () => {
                const article = document.querySelector('.article-content');
                if (!article) return;

                const articleTop = article.offsetTop;
                const articleHeight = article.offsetHeight;
                const windowHeight = window.innerHeight;
                const scrollTop = window.pageYOffset;

                // Calcular progresso baseado no conteúdo do artigo
                const articleBottom = articleTop + articleHeight;
                const windowBottom = scrollTop + windowHeight;

                let progress = 0;
                if (scrollTop >= articleTop) {
                    const articleScrolled = Math.min(windowBottom - articleTop, articleHeight);
                    progress = (articleScrolled / articleHeight) * 100;
                }

                progress = Math.min(Math.max(progress, 0), 100);
                progressBar.style.width = `${progress}%`;
                
                this.state.readingProgress = progress;
                this.trackReadingMilestones(progress);
            });
        },

        // Rastrear marcos de leitura
        trackReadingMilestones: function(progress) {
            this.config.milestones.forEach(milestone => {
                if (progress >= milestone && !this.state.scrollMilestones[milestone]) {
                    this.state.scrollMilestones[milestone] = true;
                    this.trackEvent('reading_progress', {
                        milestone: milestone,
                        article_title: document.title
                    });
                    console.log(`📖 ${milestone}% do artigo lido`);
                }
            });
        },

        // Scroll suave para links internos
        setupSmoothScroll: function() {
            document.addEventListener('click', (e) => {
                if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(e.target.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        },

        // Botões de compartilhamento
        setupShareButtons: function() {
            // Criar botões se não existirem
            this.createShareButtons();
            
            // Event listeners para compartilhamento
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('share-btn')) {
                    e.preventDefault();
                    const platform = e.target.dataset.platform;
                    this.shareArticle(platform);
                }
            });
        },

        // Criar botões de compartilhamento
        createShareButtons: function() {
            const existingButtons = document.querySelector('.share-buttons');
            if (existingButtons) return;

            const shareContainer = document.createElement('div');
            shareContainer.className = 'share-buttons';
            shareContainer.innerHTML = `
                <button class="share-btn" data-platform="linkedin">
                    📈 LinkedIn
                </button>
                <button class="share-btn" data-platform="whatsapp">
                    📱 WhatsApp
                </button>
                <button class="share-btn" data-platform="email">
                    ✉️ Email
                </button>
                <button class="share-btn" data-platform="copy">
                    🔗 Copiar Link
                </button>
            `;

            // Inserir após o conteúdo do artigo
            const articleContent = document.querySelector('.article-content');
            if (articleContent) {
                articleContent.after(shareContainer);
            }
        },

        // Compartilhar artigo
        shareArticle: function(platform) {
            const url = window.location.href;
            const title = document.title;
            const text = document.querySelector('.article-subtitle')?.textContent || 
                        'Confira este artigo sobre comércio exterior!';

            let shareUrl = '';
            
            switch(platform) {
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
                    break;
                case 'copy':
                    this.copyToClipboard(url);
                    return;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
                this.trackEvent('article_share', {
                    platform: platform,
                    article_title: title
                });
                console.log(`📤 Artigo compartilhado no ${platform}`);
            }
        },

        // Copiar para clipboard
        copyToClipboard: function(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    this.showNotification('✅ Link copiado para a área de transferência!');
                });
            } else {
                // Fallback para browsers mais antigos
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.showNotification('✅ Link copiado!');
            }
            
            this.trackEvent('article_link_copy', {
                article_title: document.title
            });
        },

        // Gerar índice automaticamente
        setupTableOfContents: function() {
            const tocContainer = document.querySelector('.article-toc ul');
            if (!tocContainer) return;

            const headings = document.querySelectorAll('.article-content h2, .article-content h3');
            if (headings.length === 0) return;

            tocContainer.innerHTML = '';
            
            headings.forEach((heading, index) => {
                // Adicionar ID se não tiver
                if (!heading.id) {
                    heading.id = `heading-${index}`;
                }

                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `#${heading.id}`;
                a.textContent = heading.textContent;
                a.style.paddingLeft = heading.tagName === 'H3' ? '1rem' : '0';
                
                li.appendChild(a);
                tocContainer.appendChild(li);
            });
        },

        // Calcular tempo de leitura
        setupReadingTime: function() {
            const content = document.querySelector('.article-content');
            const readingTimeElement = document.querySelector('.article-meta span:nth-child(2)');
            
            if (!content || !readingTimeElement) return;

            const text = content.textContent || content.innerText;
            const wordCount = text.trim().split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / this.config.readingSpeedWPM);
            
            readingTimeElement.innerHTML = `⏱️ ${readingTime} min de leitura`;
        },

        // Rastreamento de engajamento
        setupEngagementTracking: function() {
            if (!this.config.analytics) return;

            // Tempo na página
            const startTime = Date.now();
            
            // Track quando o usuário sair da página
            window.addEventListener('beforeunload', () => {
                const timeOnPage = Math.round((Date.now() - startTime) / 1000);
                this.trackEvent('article_time_on_page', {
                    time_seconds: timeOnPage,
                    reading_progress: this.state.readingProgress,
                    article_title: document.title
                });
            });

            // Track engagement em intervalos
            setInterval(() => {
                this.state.timeOnPage += 30;
                if (this.state.timeOnPage % 120 === 0) { // A cada 2 minutos
                    this.trackEvent('article_engagement', {
                        time_minutes: this.state.timeOnPage / 60,
                        reading_progress: this.state.readingProgress
                    });
                }
            }, 30000);
        },

        // Configurar botão copiar
        setupCopyToClipboard: function() {
            // Adicionar botões de copiar para código
            const codeBlocks = document.querySelectorAll('pre code');
            codeBlocks.forEach(code => {
                const button = document.createElement('button');
                button.className = 'copy-code-btn';
                button.textContent = 'Copiar';
                button.style.cssText = `
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    background: var(--accent-cyan);
                    color: var(--primary-dark);
                    border: none;
                    padding: 0.3rem 0.8rem;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    cursor: pointer;
                `;
                
                const pre = code.parentElement;
                pre.style.position = 'relative';
                pre.appendChild(button);
                
                button.addEventListener('click', () => {
                    this.copyToClipboard(code.textContent);
                    button.textContent = 'Copiado!';
                    setTimeout(() => {
                        button.textContent = 'Copiar';
                    }, 2000);
                });
            });
        },

        // Atalhos de teclado
        setupKeyboardShortcuts: function() {
            document.addEventListener('keydown', (e) => {
                // Não executar se estiver em um input
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

                switch(e.key.toLowerCase()) {
                    case 'c':
                        if (e.ctrlKey || e.metaKey) return; // Não interferir com Ctrl+C
                        this.copyToClipboard(window.location.href);
                        break;
                    case 's':
                        e.preventDefault();
                        this.shareArticle('whatsapp');
                        break;
                    case 't':
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        break;
                    case 'b':
                        e.preventDefault();
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                        break;
                }
            });
        },

        // Mostrar notificação
        showNotification: function(message, duration = 3000) {
            // Remover notificação existente
            const existing = document.querySelector('.article-notification');
            if (existing) existing.remove();

            const notification = document.createElement('div');
            notification.className = 'article-notification';
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 2rem;
                background: var(--accent-cyan);
                color: var(--primary-dark);
                padding: 1rem 1.5rem;
                border-radius: 8px;
                z-index: 10000;
                font-weight: 600;
                animation: slideInRight 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        },

        // Rastrear eventos (integração com analytics)
        trackEvent: function(eventName, data = {}) {
            // Google Analytics 4
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, data);
            }
            
            // Facebook Pixel
            if (typeof fbq !== 'undefined') {
                fbq('track', 'CustomEvent', { eventName, ...data });
            }
            
            // Console para debug
            console.log(`📊 Event: ${eventName}`, data);
        },

        // Utilitários
        utils: {
            // Debounce para otimizar performance
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

            // Throttle para scroll events
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

            // Formatar números
            formatNumber: function(num) {
                return new Intl.NumberFormat('pt-BR').format(num);
            },

            // Formatar moeda
            formatCurrency: function(value) {
                return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(value);
            },

            // Formatar porcentagem
            formatPercent: function(value) {
                return new Intl.NumberFormat('pt-BR', {
                    style: 'percent',
                    minimumFractionDigits: 2
                }).format(value / 100);
            }
        }
    };

    // Exposição global
    window.BlogArticle = BlogArticle;

    // Auto-inicialização
    BlogArticle.init();

    // Adicionar estilos CSS para animações via JavaScript
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .copy-code-btn:hover {
            background: var(--accent-green) !important;
        }
    `;
    document.head.appendChild(style);

})();