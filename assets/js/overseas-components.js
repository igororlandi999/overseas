/**
 * Sistema de Componentes Overseas Trading
 * Carrega header, footer e funcionalidades automaticamente
 * Arquivo: assets/js/overseas-components.js
 */

(function() {
    'use strict';

    // Configurações globais
    const OverseasComponents = {
        // Configurações do site
        config: {
            siteName: 'Overseas Trading',
            logoPath: 'assets/images/logo.png',
            phone: '+55 (48) 3204-9798',
            whatsapp: '554832049798',
            email: 'comercial@overseastrading.com.br',
            socialLinks: {
                linkedin: 'https://linkedin.com/company/overseas-trading',
                instagram: 'https://instagram.com/overseastrading',
                whatsapp: 'https://wa.me/5548999999999',
                email: 'mailto:comercial@overseastrading.com.br'
            }
        },

        // Estado da aplicação
        state: {
            currentPage: '',
            mobileMenuOpen: false,
            scrollPosition: 0
        },

        // Templates HTML
        templates: {
            header: `
                <!-- Scroll Progress -->
                <div class="overseas-scroll-progress" id="overseasScrollProgress"></div>

                <!-- Header Padrão Overseas Trading -->
                <header class="overseas-header" id="overseasHeader">
                    <nav class="overseas-nav" role="navigation" aria-label="Menu principal">
                        <a href="index.html" class="overseas-logo" aria-label="Overseas Trading - Página inicial">
                            <img src="{logoPath}" alt="Overseas Trading" class="overseas-logo-img">
                        </a>
                        <ul class="overseas-nav-links" id="overseasNavLinks">
                            <li class="overseas-dropdown">
                                <a href="#sobre">Sobre</a>
                                <div class="overseas-dropdown-content">
                                    <a href="sobre-nos.html">Sobre Nós</a>
                                    <a href="servicos.html">Serviços</a>
                                    <a href="solucoes.html">Soluções</a>
                                </div>
                            </li>
                            <li><a href="blog.html" data-page="blog">Blog</a></li>
                            <li class="overseas-dropdown">
                                <a href="#carreiras">Carreiras</a>
                                <div class="overseas-dropdown-content">
                                    <a href="trabalhe-conosco.html">Trabalhe Conosco</a>
                                    <a href="vagas-abertas.html">Vagas Abertas</a>
                                    <a href="crescimento-carreira.html">Crescimento e Carreira</a>
                                </div>
                            </li>
                            <li><a href="index.html#contact" data-page="contact">Contato</a></li>
                        </ul>
                        <button class="overseas-mobile-toggle" id="overseasMobileToggle" aria-label="Abrir menu mobile" aria-expanded="false">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </nav>
                </header>
            `,

            footer: `
                <!-- Footer Padrão Overseas Trading -->
                <footer class="overseas-footer">
                    <div class="footer-content">
                        <div class="footer-logo">OVERSEAS</div>
                        <p class="footer-description">Siga-nos para acompanhar novidades sobre comércio internacional</p>
                        <div class="social-links">
                            <a href="{linkedinUrl}" class="social-link" aria-label="LinkedIn" target="_blank">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                            <a href="{instagramUrl}" class="social-link" aria-label="Instagram" target="_blank">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a href="{whatsappFooterUrl}" class="social-link" aria-label="WhatsApp" target="_blank">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                </svg>
                            </a>
                            <a href="{emailUrl}" class="social-link" aria-label="E-mail" target="_blank">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819l6.545 4.91 6.545-4.91h3.819A1.636 1.636 0 0 1 24 5.457z"/>
                                </svg>
                            </a>
                        </div>
                        <p class="footer-text">© 2025 Overseas Trading - Todos os direitos reservados</p>
                    </div>
                </footer>

                <!-- WhatsApp Float Button -->
                <a href="https://wa.me/{whatsappNumber}?text={whatsappMessage}" class="overseas-whatsapp-float" target="_blank" aria-label="WhatsApp">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                </a>
            `,

            css: `
                /* Sistema de Componentes Overseas Trading - CSS Base */
                :root {
                    --primary-dark: #0a0a0a;
                    --secondary-dark: #1a1a1a;
                    --accent-blue: #00d4ff;
                    --accent-cyan: #00ffff;
                    --accent-green: #39ff14;
                    --text-primary: #ffffff;
                    --text-secondary: #b0b0b0;
                    --text-muted: #888888;
                    --gradient-primary: linear-gradient(135deg, #00d4ff 0%, #00ffff 100%);
                    --gradient-dark: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                    --border-color: rgba(0, 212, 255, 0.1);
                    --card-hover: rgba(0, 212, 255, 0.05);
                    --font-family: 'Inter', sans-serif;
                }

                /* Scroll Progress */
                .overseas-scroll-progress {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 0%;
                    height: 3px;
                    background: var(--gradient-primary);
                    z-index: 10001;
                    transition: width 0.3s ease;
                }

                /* Header Padrão */
                .overseas-header {
                    position: fixed;
                    top: 0;
                    width: 100%;
                    background: rgba(10, 10, 10, 0.95);
                    backdrop-filter: blur(20px);
                    z-index: 1000;
                    border-bottom: 1px solid var(--border-color);
                    transition: all 0.3s ease;
                }

                .overseas-header.scrolled {
                    background: rgba(10, 10, 10, 0.98);
                    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.1);
                }

                .overseas-nav {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 5%;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    box-sizing: border-box;
                }

                .overseas-logo {
                    height: 60px;
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                    font-family: var(--font-family);
                }

                .overseas-logo-img {
                    height: 180px;
                    width: auto;
                    max-width: 180px;
                    object-fit: contain;
                }

                .overseas-nav-links {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .overseas-nav-links > li {
                    position: relative;
                }

                .overseas-nav-links a {
                    color: var(--text-secondary);
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 1rem;
                    padding: 0.5rem 0;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .overseas-nav-links a:hover,
                .overseas-nav-links a.active {
                    color: var(--accent-cyan);
                }

                .overseas-nav-links a::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: var(--gradient-primary);
                    transition: width 0.3s ease;
                }

                .overseas-nav-links a:hover::after,
                .overseas-nav-links a.active::after {
                    width: 100%;
                }

                /* Dropdown Menu */
                .overseas-dropdown {
                    position: relative;
                }

                .overseas-dropdown-content {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    background: rgba(10, 10, 10, 0.98);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--border-color);
                    border-radius: 10px;
                    padding: 1rem 0;
                    min-width: 200px;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                    z-index: 1001;
                }

                .overseas-dropdown:hover .overseas-dropdown-content {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .overseas-dropdown-content a {
                    display: block;
                    padding: 0.8rem 1.5rem;
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    border-bottom: none;
                }

                .overseas-dropdown-content a::after {
                    display: none;
                }

                .overseas-dropdown-content a:hover {
                    background: rgba(0, 212, 255, 0.1);
                    color: var(--accent-cyan);
                }

                .overseas-mobile-toggle {
                    display: none;
                    flex-direction: column;
                    cursor: pointer;
                    gap: 4px;
                    background: none;
                    border: none;
                    padding: 0.5rem;
                    z-index: 1001;
                }

                .overseas-mobile-toggle span {
                    width: 25px;
                    height: 3px;
                    background: var(--accent-cyan);
                    transition: all 0.3s ease;
                    border-radius: 2px;
                }

                .overseas-mobile-toggle.active span:nth-child(1) {
                    transform: rotate(45deg) translate(5px, 5px);
                }

                .overseas-mobile-toggle.active span:nth-child(2) {
                    opacity: 0;
                }

                .overseas-mobile-toggle.active span:nth-child(3) {
                    transform: rotate(-45deg) translate(7px, -6px);
                }

                /* Footer Padrão */
                .overseas-footer {
                    background: var(--secondary-dark);
                    padding: 3rem 5% 1rem;
                    border-top: 1px solid var(--border-color);
                }

                .footer-content {
                    max-width: 1400px;
                    margin: 0 auto;
                    text-align: center;
                }

                .footer-logo {
                    font-family: var(--font-family);
                    font-size: 2.5rem;
                    font-weight: 700;
                    background: var(--gradient-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 1rem;
                }

                .footer-description {
                    color: var(--text-secondary);
                    margin-bottom: 2rem;
                    font-size: 1rem;
                }

                .social-links {
                    display: flex;
                    justify-content: center;
                    gap: 2rem;
                    margin-bottom: 2rem;
                }

                .social-link {
                    width: 50px;
                    height: 50px;
                    background: var(--gradient-primary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary-dark);
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .social-link:hover {
                    transform: translateY(-3px) scale(1.1);
                    box-shadow: 0 10px 20px rgba(0, 212, 255, 0.3);
                }

                .social-link svg {
                    width: 24px;
                    height: 24px;
                }

                .footer-text {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }

                /* WhatsApp Float Button */
                .overseas-whatsapp-float {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    width: 60px;
                    height: 60px;
                    background: #25d366;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    color: white;
                    font-size: 1.5rem;
                    z-index: 999;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
                    animation: pulse-whatsapp 2s infinite;
                }

                .overseas-whatsapp-float:hover {
                    transform: scale(1.1);
                    box-shadow: 0 10px 30px rgba(37, 211, 102, 0.5);
                }

                .overseas-whatsapp-float svg {
                    width: 24px;
                    height: 24px;
                }

                @keyframes pulse-whatsapp {
                    0% {
                        box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(37, 211, 102, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
                    }
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .overseas-mobile-toggle {
                        display: flex;
                    }

                    .overseas-nav-links {
                        position: fixed;
                        top: -100vh;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        background: rgba(10, 10, 10, 0.98);
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        padding: 2rem 0;
                        transition: top 0.3s ease;
                        backdrop-filter: blur(20px);
                        border-top: 1px solid var(--border-color);
                        z-index: 1000;
                        opacity: 0;
                        visibility: hidden;
                    }

                    .overseas-nav-links.active {
                        top: 0;
                        opacity: 1;
                        visibility: visible;
                    }

                    .overseas-nav-links li {
                        margin: 1rem 0;
                        width: 100%;
                        text-align: center;
                    }

                    .overseas-nav-links a {
                        font-size: 1.3rem;
                        padding: 1rem 2rem;
                        display: block;
                    }

                    .overseas-dropdown-content {
                        position: static;
                        opacity: 1;
                        visibility: visible;
                        transform: none;
                        background: none;
                        border: none;
                        padding: 0;
                        margin-top: 1rem;
                    }

                    .overseas-logo-img {
                        height: 150px;
                        max-width: 180px;
                    }

                    .overseas-nav {
                        padding: 0 4%;
                    }

                    .overseas-whatsapp-float {
                        bottom: 1rem;
                        right: 1rem;
                        width: 50px;
                        height: 50px;
                    }

                    .overseas-whatsapp-float svg {
                        width: 20px;
                        height: 20px;
                    }
                }

                @media (max-width: 480px) {
                    .overseas-nav {
                        padding: 0 3%;
                    }

                    .overseas-logo-img {
                        height: 120px;
                        max-width: 150px;
                    }
                }

                /* Body adjustments for fixed header */
                body.overseas-loaded {
                    padding-top: 80px;
                }

                /* Scroll to Top Button (Optional) */
                .overseas-scroll-top {
                    position: fixed;
                    bottom: 8rem;
                    right: 2rem;
                    width: 50px;
                    height: 50px;
                    background: var(--gradient-primary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    opacity: 0;
                    visibility: hidden;
                    z-index: 999;
                    color: var(--primary-dark);
                    font-weight: bold;
                    font-size: 1.2rem;
                    text-decoration: none;
                }

                .overseas-scroll-top.visible {
                    opacity: 1;
                    visibility: visible;
                }

                .overseas-scroll-top:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0, 212, 255, 0.3);
                }

                .overseas-scroll-top::before {
                    content: '↑';
                }
            `
        },

        // Renderizar templates com dados
        renderTemplate: function(template, data = {}) {
            let rendered = template;
            
            // Substituir variáveis do template
            rendered = rendered.replace(/{logoPath}/g, data.logoPath || this.config.logoPath);
            rendered = rendered.replace(/{linkedinUrl}/g, data.linkedinUrl || this.config.socialLinks.linkedin);
            rendered = rendered.replace(/{instagramUrl}/g, data.instagramUrl || this.config.socialLinks.instagram);
            rendered = rendered.replace(/{whatsappFooterUrl}/g, data.whatsappFooterUrl || this.config.socialLinks.whatsapp);
            rendered = rendered.replace(/{emailUrl}/g, data.emailUrl || this.config.socialLinks.email);
            rendered = rendered.replace(/{whatsappNumber}/g, data.whatsappNumber || this.config.whatsapp);
            rendered = rendered.replace(/{whatsappMessage}/g, encodeURIComponent(data.whatsappMessage || 'Olá! Gostaria de uma consultoria sobre comércio exterior.'));
            
            return rendered;
        },

        // Carregar CSS base
        loadCSS: function() {
            if (!document.getElementById('overseas-base-css')) {
                const style = document.createElement('style');
                style.id = 'overseas-base-css';
                style.textContent = this.templates.css;
                document.head.appendChild(style);
            }
        },

        // Carregar header
        loadHeader: function(options = {}) {
            const headerContainer = document.getElementById('overseas-header');
            if (headerContainer) {
                headerContainer.innerHTML = this.renderTemplate(this.templates.header, options);
                this.initHeaderEvents();
                this.setActivePage(options.activePage);
            }
        },

        // Carregar footer
        loadFooter: function(options = {}) {
            const footerContainer = document.getElementById('overseas-footer');
            if (footerContainer) {
                footerContainer.innerHTML = this.renderTemplate(this.templates.footer, options);
            }
        },

        // Inicializar eventos do header
        initHeaderEvents: function() {
            const header = document.getElementById('overseasHeader');
            const navLinks = document.getElementById('overseasNavLinks');
            const mobileToggle = document.getElementById('overseasMobileToggle');
            const scrollProgress = document.getElementById('overseasScrollProgress');

            if (!header || !navLinks || !mobileToggle) return;

            // Scroll effects
            let lastScrollTop = 0;
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Header background change
                if (scrollTop > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                // Scroll progress bar
                if (scrollProgress) {
                    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const scrollPercentage = (scrollTop / documentHeight) * 100;
                    scrollProgress.style.width = `${Math.min(scrollPercentage, 100)}%`;
                }
                
                // Scroll to top button
                const scrollTopBtn = document.querySelector('.overseas-scroll-top');
                if (scrollTopBtn) {
                    if (scrollTop > 300) {
                        scrollTopBtn.classList.add('visible');
                    } else {
                        scrollTopBtn.classList.remove('visible');
                    }
                }
                
                this.state.scrollPosition = scrollTop;
                lastScrollTop = scrollTop;
            });

            // Mobile menu toggle
            mobileToggle.addEventListener('click', () => {
                const isActive = navLinks.classList.contains('active');
                
                if (isActive) {
                    this.closeMobileMenu();
                } else {
                    this.openMobileMenu();
                }
            });

            // Close mobile menu when clicking on links
            navLinks.addEventListener('click', (e) => {
                if (e.target.tagName === 'A' && window.innerWidth <= 768) {
                    this.closeMobileMenu();
                }
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
                    if (navLinks.classList.contains('active')) {
                        this.closeMobileMenu();
                    }
                }
            });

            // ESC key closes mobile menu
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            });

            // Smooth scroll for anchor links
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

        // Abrir menu mobile
        openMobileMenu: function() {
            const navLinks = document.getElementById('overseasNavLinks');
            const mobileToggle = document.getElementById('overseasMobileToggle');
            
            if (navLinks && mobileToggle) {
                navLinks.classList.add('active');
                mobileToggle.classList.add('active');
                mobileToggle.setAttribute('aria-expanded', 'true');
                mobileToggle.setAttribute('aria-label', 'Fechar menu mobile');
                document.body.style.overflow = 'hidden';
                this.state.mobileMenuOpen = true;
            }
        },

        // Fechar menu mobile
        closeMobileMenu: function() {
            const navLinks = document.getElementById('overseasNavLinks');
            const mobileToggle = document.getElementById('overseasMobileToggle');
            
            if (navLinks && mobileToggle) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.setAttribute('aria-label', 'Abrir menu mobile');
                document.body.style.overflow = 'auto';
                this.state.mobileMenuOpen = false;
            }
        },

        // Definir página ativa no menu
        setActivePage: function(page) {
            if (!page) return;

            const navLinks = document.querySelectorAll('.overseas-nav-links a[data-page]');
            navLinks.forEach(link => {
                if (link.dataset.page === page) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            this.state.currentPage = page;
        },

        // Adicionar scroll to top button
        addScrollToTop: function() {
            if (!document.querySelector('.overseas-scroll-top')) {
                const scrollBtn = document.createElement('a');
                scrollBtn.className = 'overseas-scroll-top';
                scrollBtn.href = '#';
                scrollBtn.setAttribute('aria-label', 'Voltar ao topo');
                
                scrollBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
                
                document.body.appendChild(scrollBtn);
            }
        },

        // Atualizar meta tags dinamicamente
        updateMetaTags: function(options = {}) {
            // Title
            if (options.title) {
                document.title = `${options.title} | Overseas Trading`;
            }

            // Description
            if (options.description) {
                let metaDesc = document.querySelector('meta[name="description"]');
                if (!metaDesc) {
                    metaDesc = document.createElement('meta');
                    metaDesc.name = 'description';
                    document.head.appendChild(metaDesc);
                }
                metaDesc.content = options.description;
            }

            // Open Graph
            if (options.ogTitle) {
                this.updateMetaProperty('og:title', options.ogTitle);
            }
            if (options.ogDescription) {
                this.updateMetaProperty('og:description', options.ogDescription);
            }
            if (options.ogImage) {
                this.updateMetaProperty('og:image', options.ogImage);
            }
            if (options.ogUrl) {
                this.updateMetaProperty('og:url', options.ogUrl);
            }

            // Twitter Cards
            if (options.twitterTitle) {
                this.updateMetaProperty('twitter:title', options.twitterTitle);
            }
            if (options.twitterDescription) {
                this.updateMetaProperty('twitter:description', options.twitterDescription);
            }
            if (options.twitterImage) {
                this.updateMetaProperty('twitter:image', options.twitterImage);
            }

            // Canonical URL
            if (options.canonical) {
                let canonical = document.querySelector('link[rel="canonical"]');
                if (!canonical) {
                    canonical = document.createElement('link');
                    canonical.rel = 'canonical';
                    document.head.appendChild(canonical);
                }
                canonical.href = options.canonical;
            }
        },

        // Helper para atualizar meta properties
        updateMetaProperty: function(property, content) {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.head.appendChild(meta);
            }
            meta.content = content;
        },

        // Função de debug
        debug: function() {
            console.log(`
🌊 Sistema de Componentes Overseas Trading

📊 Status:
• Header: ${document.getElementById('overseasHeader') ? '✅ Carregado' : '❌ Não encontrado'}
• Footer: ${document.getElementById('overseas-footer') ? '✅ Carregado' : '❌ Não encontrado'}
• CSS: ${document.getElementById('overseas-base-css') ? '✅ Carregado' : '❌ Não encontrado'}
• Menu Mobile: ${this.state.mobileMenuOpen ? '📱 Aberto' : '📱 Fechado'}
• Página Ativa: ${this.state.currentPage || 'Não definida'}
• Scroll Position: ${this.state.scrollPosition}px

🔧 Configuração:
• Site: ${this.config.siteName}
• Logo: ${this.config.logoPath}
• WhatsApp: ${this.config.whatsapp}

💡 Uso:
// Carregar componentes
OverseasComponents.init({
    activePage: 'blog',
    title: 'Título da Página',
    whatsappMessage: 'Mensagem personalizada'
});

// Atualizar meta tags
OverseasComponents.updateMetaTags({
    title: 'Novo Título',
    description: 'Nova descrição'
});
            `);
        },

        // Inicialização principal
        init: function(options = {}) {
            // Carregar CSS base
            this.loadCSS();

            // Aguardar DOM estar pronto
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.initComponents(options);
                });
            } else {
                this.initComponents(options);
            }
        },

        // Inicializar componentes
        initComponents: function(options = {}) {
            // Adicionar classe ao body
            document.body.classList.add('overseas-loaded');

            // Carregar header
            this.loadHeader(options);

            // Carregar footer
            this.loadFooter(options);

            // Adicionar scroll to top
            if (options.scrollToTop !== false) {
                this.addScrollToTop();
            }

            // Atualizar meta tags
            if (options.title || options.description) {
                this.updateMetaTags(options);
            }

            // Debug info
            if (options.debug) {
                this.debug();
            }

            // Callback personalizado
            if (typeof options.onReady === 'function') {
                options.onReady();
            }

            console.log('🌊 Overseas Components carregados com sucesso!');
        }
    };

    // Exposição global
    window.OverseasComponents = OverseasComponents;

    // Auto-inicialização se houver containers
    document.addEventListener('DOMContentLoaded', function() {
        if (document.getElementById('overseas-header') || document.getElementById('overseas-footer')) {
            // Detectar página atual
            const currentPage = window.location.pathname;
            let activePage = '';
            
            if (currentPage.includes('blog.html') || currentPage.includes('blog')) {
                activePage = 'blog';
            } else if (currentPage.includes('contact') || window.location.hash.includes('contact')) {
                activePage = 'contact';
            }

            // Auto-inicializar se não foi inicializado manualmente
            setTimeout(() => {
                if (!document.body.classList.contains('overseas-loaded')) {
                    OverseasComponents.init({
                        activePage: activePage,
                        debug: false
                    });
                }
            }, 100);
        }
    });

})();