/* ============================================
   BLOG OVERSEAS TRADING - JAVASCRIPT GLOBAL
   ============================================ */

// Configuração global do blog
const BlogConfig = {
    // Posts populares (atualize conforme necessário)
    popularPosts: [
        {
            title: "Passo a Passo: Como Obter o RADAR Siscomex",
            date: "20 Abr, 2025",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            alt: "RADAR"
        },
        {
            title: "Estudo de Viabilidade de Importação Eficaz",
            date: "08 Jan, 2025", 
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=150&h=150&fit=crop",
            alt: "Viabilidade"
        },
        {
            title: "Guia Completo: Como Classificar NCM Corretamente",
            date: "10 Abr, 2025",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=150&fit=crop",
            alt: "NCM"
        }
    ],

    // Categorias do blog
    categories: [
        { name: "Importação", count: 8 },
        { name: "Exportação", count: 6 },
        { name: "Micro/Pequenas Empresas", count: 4 },
        { name: "NCM", count: 5 },
        { name: "RADAR", count: 4 },
        { name: "Despacho Aduaneiro", count: 5 },
        { name: "Impostos", count: 7 },
        { name: "Legislação", count: 3 },
        { name: "Financiamento", count: 5 }
    ],

    // Tags do blog
    tags: [
        "Importação", "Exportação", "NCM", "RADAR", "Impostos", 
        "Microempresa", "Pequena Empresa", "MEI", "Simples Nacional",
        "SEBRAE", "BNDES", "Viabilidade", "ROI", "Análise Financeira",
        "Planejamento", "Riscos", "Fornecedores", "Logística", 
        "Mercado", "Legislação", "Tributação", "Financiamento"
    ],

    // Configurações de CTA por categoria
    ctaConfig: {
        "importacao": {
            title: "🚀 Precisa de Ajuda com Importação?",
            description: "Nossa equipe pode elaborar um estudo completo de viabilidade para seu projeto de importação.",
            button: "SOLICITAR CONSULTORIA",
            whatsappMessage: "Olá! Li o artigo sobre importação e gostaria de uma consultoria."
        },
        "exportacao": {
            title: "🌎 Quer Exportar seus Produtos?",
            description: "Ajudamos sua empresa a conquistar mercados internacionais com estratégias eficazes.",
            button: "FALAR COM ESPECIALISTA",
            whatsappMessage: "Olá! Li o artigo sobre exportação e gostaria de uma consultoria."
        },
        "micro-empresas": {
            title: "🎯 Consultoria Especializada para MPE",
            description: "Nossa equipe tem experiência específica em auxiliar micro e pequenas empresas no comércio exterior.",
            button: "FALAR COM ESPECIALISTA",
            whatsappMessage: "Olá! Li o artigo sobre MPE no comércio exterior e gostaria de uma consultoria especializada."
        },
        "default": {
            title: "🚀 Precisa de Ajuda Especializada?",
            description: "Nossa equipe pode ajudar com seu projeto de comércio exterior.",
            button: "SOLICITAR CONSULTORIA",
            whatsappMessage: "Olá! Li o artigo no blog e gostaria de uma consultoria."
        }
    }
};

// Classe principal do blog
class BlogManager {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeComponents();
            this.setupEventListeners();
            this.generateContent();
            console.log('✅ Blog Overseas Trading inicializado com sucesso!');
        });
    }

    initializeComponents() {
        // Inicializar componentes Overseas Trading
        if (typeof OverseasComponents !== 'undefined') {
            const articleData = this.getArticleData();
            
            OverseasComponents.init({
                activePage: 'blog',
                title: articleData.title,
                description: articleData.description,
                whatsappMessage: articleData.whatsappMessage,
                canonical: articleData.canonical,
                scrollToTop: false // Desabilitar scroll to top dos componentes
            });

            // Remover botões duplicados
            setTimeout(() => this.removeExistingButtons(), 500);
        }

        // Remover novamente após um tempo para garantir
        setTimeout(() => this.removeExistingButtons(), 1000);
    }

    setupEventListeners() {
        // Scroll progress e back to top
        window.addEventListener('scroll', () => {
            this.updateScrollProgress();
            this.updateBackToTopButton();
        });

        // Smooth scroll para links internos
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

        // Back to top functionality
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Intersection Observer para índice ativo
        this.setupSectionObserver();
    }

    generateContent() {
        this.generateArticleIndex();
        this.generatePopularPosts();
        this.generateCategories();
        this.generateTags();
        this.setupCTA();
    }

    getArticleData() {
        const titleElement = document.querySelector('.article-title');
        const categoryElement = document.querySelector('.article-category');
        const title = titleElement ? titleElement.textContent : 'Artigo do Blog';
        const category = categoryElement ? categoryElement.getAttribute('data-category') : 'default';
        
        return {
            title: title,
            description: `Artigo completo sobre ${title.toLowerCase()}. Guia prático e atualizado.`,
            whatsappMessage: BlogConfig.ctaConfig[category]?.whatsappMessage || BlogConfig.ctaConfig.default.whatsappMessage,
            canonical: window.location.href
        };
    }

    removeExistingButtons() {
        const existingBtns = document.querySelectorAll('.overseas-scroll-top, .back-to-top:not(#backToTop)');
        existingBtns.forEach(btn => btn.remove());
    }

    updateScrollProgress() {
        const article = document.querySelector('.article-content');
        const progressBar = document.getElementById('scrollProgress');

        if (!article || !progressBar) return;

        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;

        const articleBottom = articleTop + articleHeight;
        const windowBottom = scrollTop + windowHeight;

        let progress = 0;
        if (scrollTop >= articleTop) {
            const articleScrolled = Math.min(windowBottom - articleTop, articleHeight);
            progress = (articleScrolled / articleHeight) * 100;
        }

        progress = Math.min(Math.max(progress, 0), 100);
        progressBar.style.width = `${progress}%`;
    }

    updateBackToTopButton() {
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }

    generateArticleIndex() {
        const indexContainer = document.getElementById('article-index-list');
        if (!indexContainer) return;

        const headings = document.querySelectorAll('.article-content h2[id]');
        let indexHTML = '';

        headings.forEach(heading => {
            const id = heading.getAttribute('id');
            const text = heading.textContent;
            indexHTML += `<li><a href="#${id}">${text}</a></li>`;
        });

        indexContainer.innerHTML = indexHTML;
    }

    generatePopularPosts() {
        const container = document.getElementById('popular-posts-container');
        if (!container) return;

        let html = '';
        BlogConfig.popularPosts.forEach(post => {
            html += `
                <div class="popular-post">
                    <div class="popular-post-image">
                        <img src="${post.image}" alt="${post.alt}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="popular-post-content">
                        <h4>${post.title}</h4>
                        <div class="popular-post-meta">📅 ${post.date}</div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    generateCategories() {
        const container = document.getElementById('categories-container');
        if (!container) return;

        let html = '';
        BlogConfig.categories.forEach(category => {
            html += `
                <div class="category-item">
                    <span>${category.name}</span>
                    <span class="category-count">(${category.count})</span>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    generateTags() {
        const container = document.getElementById('tags-container');
        if (!container) return;

        let html = '';
        BlogConfig.tags.forEach(tag => {
            html += `<a href="#" class="tag">${tag}</a>`;
        });

        container.innerHTML = html;
    }

    setupCTA() {
        const categoryElement = document.querySelector('.article-category');
        const category = categoryElement ? categoryElement.getAttribute('data-category') : 'default';
        const ctaConfig = BlogConfig.ctaConfig[category] || BlogConfig.ctaConfig.default;

        // Atualizar elementos do CTA
        const titleElement = document.getElementById('cta-title');
        const descriptionElement = document.getElementById('cta-description');
        const buttonElement = document.getElementById('cta-button');

        if (titleElement) titleElement.textContent = ctaConfig.title;
        if (descriptionElement) descriptionElement.textContent = ctaConfig.description;
        if (buttonElement) buttonElement.textContent = ctaConfig.button;
    }

    setupSectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -35% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                const link = document.querySelector(`.article-index a[href="#${id}"]`);

                if (entry.isIntersecting && link) {
                    // Remove active class from all links
                    document.querySelectorAll('.article-index a').forEach(l => {
                        l.classList.remove('active');
                    });

                    // Add active class to current link
                    link.classList.add('active');
                }
            });
        }, observerOptions);

        // Observe all sections with IDs
        document.querySelectorAll('[id]').forEach(section => {
            observer.observe(section);
        });
    }

    // Método para adicionar animações
    addAnimations() {
        const elements = document.querySelectorAll('.article-content > *');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Método para atualizar meta tags dinamicamente
    updateMetaTags(title, description, canonical) {
        document.title = `${title} | Blog Overseas Trading`;
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        }

        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', title);
        }

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            ogDescription.setAttribute('content', description);
        }

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) {
            ogUrl.setAttribute('content', canonical);
        }
    }

    // Método para lazy loading de imagens
    initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('fade-in');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }
}

// Utilitários globais
const BlogUtils = {
    // Formatar data
    formatDate(dateString) {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    },

    // Calcular tempo de leitura
    calculateReadingTime(text) {
        const wordsPerMinute = 200;
        const wordCount = text.split(' ').length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readingTime} min de leitura`;
    },

    // Gerar slug
    generateSlug(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    // Copiar para clipboard
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Texto copiado para o clipboard');
        });
    },

    // Compartilhar artigo
    shareArticle(platform, url, title) {
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    }
};

// Analytics e tracking
const BlogAnalytics = {
    trackPageView() {
        // Implementar tracking de página vista
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_path: window.location.pathname
            });
        }
    },

    trackEvent(action, category, label) {
        // Implementar tracking de eventos
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
    },

    trackScrollDepth() {
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
                maxScroll = scrollPercent;
                this.trackEvent('scroll', 'engagement', `${scrollPercent}%`);
            }
        });
    }
};

// Inicializar o blog
const blog = new BlogManager();

// Exportar para uso global
window.BlogManager = BlogManager;
window.BlogConfig = BlogConfig;
window.BlogUtils = BlogUtils;
window.BlogAnalytics = BlogAnalytics;

  // Mobile menu functionality
        document.addEventListener('DOMContentLoaded', function() {
            const mobileToggle = document.getElementById('mobileToggle');
            const navbarMenu = document.querySelector('.navbar-menu');
            const dropdowns = document.querySelectorAll('.dropdown');

            // Toggle mobile menu
            mobileToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                navbarMenu.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.navbar-nav')) {
                    mobileToggle.classList.remove('active');
                    navbarMenu.classList.remove('active');
                }
            });

            // Mobile dropdown functionality
            if (window.innerWidth <= 768) {
                dropdowns.forEach(dropdown => {
                    const toggle = dropdown.querySelector('.dropdown-toggle');
                    toggle.addEventListener('click', function(e) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                        
                        // Close other dropdowns
                        dropdowns.forEach(otherDropdown => {
                            if (otherDropdown !== dropdown) {
                                otherDropdown.classList.remove('active');
                            }
                        });
                    });
                });
            }

            // Handle window resize
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768) {
                    mobileToggle.classList.remove('active');
                    navbarMenu.classList.remove('active');
                    dropdowns.forEach(dropdown => {
                        dropdown.classList.remove('active');
                    });
                }
            });

            // Smooth scroll for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Close mobile menu if open
                        mobileToggle.classList.remove('active');
                        navbarMenu.classList.remove('active');
                    }
                });
            });

            // Active page detection
            const currentPage = window.location.pathname;
            const navLinks = document.querySelectorAll('.navbar-menu a');
            
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && (currentPage.includes(href) || currentPage === href)) {
                    link.classList.add('active');
                }
            });
        });

        