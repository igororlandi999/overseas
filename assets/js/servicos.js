/*
====================================
SERVICOS.JS LIMPO - Overseas Trading
Versão simplificada sem conflitos
====================================
*/

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌊 Página de Serviços iniciando...');
    
    // Aguarda os componentes overseas carregarem
    setTimeout(() => {
        initCleanComponents();
    }, 1000);
});

// Função principal - inicializa tudo de forma limpa
function initCleanComponents() {
    console.log('🔧 Inicializando componentes limpos...');
    
    // 1. Corrige menu hamburger
    fixHamburgerMenu();
    
    // 2. Corrige botão WhatsApp
    fixWhatsAppButton();
    
    // 3. Inicializa funcionalidades básicas
    initBasicFeatures();
    
    console.log('✅ Componentes inicializados com sucesso!');
}

// Corrige o menu hamburger de forma definitiva
function fixHamburgerMenu() {
    // Aguarda um pouco mais para garantir que elementos estão carregados
    setTimeout(() => {
        const hamburger = document.querySelector('.overseas-mobile-toggle, #overseasMobileToggle');
        const menu = document.querySelector('.overseas-nav-links, #overseasNavLinks');
        
        if (!hamburger || !menu) {
            console.log('⚠️ Elementos do menu não encontrados, tentando novamente...');
            fixHamburgerMenu(); // Tenta novamente
            return;
        }
        
        console.log('🍔 Elementos encontrados:', {
            hamburger: hamburger.outerHTML.substring(0, 100),
            menu: menu.outerHTML.substring(0, 100)
        });
        
        // Força estilos nas listras primeiro
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => {
            span.style.cssText = `
                width: 25px !important; height: 3px !important; 
                background: #00ffff !important; display: block !important; 
                border-radius: 2px !important; transition: all 0.3s ease !important;
            `;
        });
        
        // Remove qualquer listener anterior
        const newHamburger = hamburger.cloneNode(true);
        hamburger.parentNode.replaceChild(newHamburger, hamburger);
        
        // Força estilos nas novas listras
        const newSpans = newHamburger.querySelectorAll('span');
        newSpans.forEach(span => {
            span.style.cssText = `
                width: 25px !important; height: 3px !important; 
                background: #00ffff !important; display: block !important; 
                border-radius: 2px !important; transition: all 0.3s ease !important;
            `;
        });
        
        // Adiciona o evento de clique
        newHamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🍔 HAMBURGER CLICADO!');
            
            const isActive = this.classList.contains('active');
            
            if (isActive) {
                // FECHAR MENU
                console.log('❌ Fechando menu...');
                this.classList.remove('active');
                menu.classList.remove('active');
                menu.style.display = 'none';
                document.body.style.overflow = 'auto';
            } else {
                // ABRIR MENU
                console.log('✅ Abrindo menu...');
                this.classList.add('active');
                menu.classList.add('active');
                
                // Força estilos do menu aberto
                menu.style.cssText = `
                    display: flex !important;
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    background: rgba(10, 10, 10, 0.98) !important;
                    backdrop-filter: blur(20px) !important;
                    flex-direction: column !important;
                    justify-content: center !important;
                    align-items: center !important;
                    z-index: 1000 !important;
                    gap: 2rem !important;
                `;
                
                // Estiliza os links
                const links = menu.querySelectorAll('a');
                links.forEach(link => {
                    link.style.cssText = `
                        color: #b0b0b0 !important;
                        font-size: 1.3rem !important;
                        padding: 1rem 2rem !important;
                        text-decoration: none !important;
                    `;
                });
                
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Fecha menu ao clicar nos links
        const menuLinks = menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                console.log('🔗 Link clicado - fechando menu');
                newHamburger.classList.remove('active');
                menu.classList.remove('active');
                menu.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        });
        
        // Configuração de responsividade
        function updateMenuVisibility() {
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                // MOBILE
                newHamburger.style.display = 'flex';
                if (!menu.classList.contains('active')) {
                    menu.style.display = 'none';
                }
            } else {
                // DESKTOP
                newHamburger.style.display = 'none';
                newHamburger.classList.remove('active');
                menu.classList.remove('active');
                menu.style.cssText = `
                    display: flex !important;
                    flex-direction: row !important;
                    gap: 2rem !important;
                    position: static !important;
                    background: none !important;
                `;
                document.body.style.overflow = 'auto';
            }
        }
        
        // Atualiza na carga e resize
        updateMenuVisibility();
        window.addEventListener('resize', updateMenuVisibility);
        
        console.log('✅ Menu hamburger configurado e funcionando!');
        
    }, 500);
}

// Corrige o botão WhatsApp
function fixWhatsAppButton() {
    console.log('📱 Configurando botão WhatsApp...');
    
    // Remove botões duplicados
    const allWhatsAppButtons = document.querySelectorAll('a[href*="whatsapp"], a[href*="wa.me"], .whatsapp-btn, .overseas-whatsapp-float');
    
    if (allWhatsAppButtons.length > 1) {
        // Mantém apenas o primeiro
        for (let i = 1; i < allWhatsAppButtons.length; i++) {
            allWhatsAppButtons[i].remove();
        }
    }
    
    // Pega o botão restante
    const whatsAppBtn = document.querySelector('a[href*="whatsapp"], a[href*="wa.me"], .whatsapp-btn, .overseas-whatsapp-float');
    
    if (whatsAppBtn) {
        // Força estilos consistentes - CANTOS DA TELA SUPER FORÇADO
        whatsAppBtn.style.cssText = `
            position: fixed !important; 
            bottom: 1.5rem !important; 
            right: 1rem !important;
            left: auto !important;
            top: auto !important;
            width: 60px !important; 
            height: 60px !important; 
            background: #25d366 !important;
            border-radius: 50% !important; 
            display: flex !important;
            align-items: center !important; 
            justify-content: center !important;
            z-index: 99999 !important; 
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3) !important;
            transition: transform 0.3s ease !important; 
            opacity: 1 !important;
            color: white !important; 
            text-decoration: none !important;
            margin: 0 !important;
            padding: 0 !important;
            transform: none !important;
        `;
        
        // Força cor branca no SVG
        const svg = whatsAppBtn.querySelector('svg');
        if (svg) {
            svg.style.cssText = `
                width: 24px !important; height: 24px !important; 
                fill: white !important; color: white !important;
            `;
        }
        
        // Responsivo - ajusta apenas tamanho, mantém posição nos cantos
        const updateWhatsAppSize = () => {
            if (window.innerWidth <= 768) {
                whatsAppBtn.style.width = '70px';
                whatsAppBtn.style.height = '70px';
                const svg = whatsAppBtn.querySelector('svg');
                if (svg) {
                    svg.style.width = '28px';
                    svg.style.height = '28px';
                }
            } else {
                whatsAppBtn.style.width = '60px';
                whatsAppBtn.style.height = '60px';
                const svg = whatsAppBtn.querySelector('svg');
                if (svg) {
                    svg.style.width = '24px';
                    svg.style.height = '24px';
                }
            }
        };
        
        updateWhatsAppSize();
        window.addEventListener('resize', updateWhatsAppSize);
        
        console.log('✅ Botão WhatsApp configurado');
    } else {
        console.log('⚠️ Botão WhatsApp não encontrado');
    }
}

// Inicializa funcionalidades básicas
function initBasicFeatures() {
    console.log('⚙️ Inicializando funcionalidades básicas...');
    
    // AOS (se disponível)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50
        });
    }
    
    // Animações dos cards de serviço
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Back to top button
    let backToTopBtn = document.querySelector('.back-to-top-btn');
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top-btn';
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.style.cssText = `
            position: fixed !important; 
            bottom: 1.5rem !important; 
            left: 1rem !important;
            right: auto !important; 
            top: auto !important;
            width: 60px !important; 
            height: 60px !important;
            background: linear-gradient(135deg, #00d4ff, #00ffff) !important; 
            border: none !important;
            border-radius: 50% !important; 
            color: black !important; 
            font-size: 1.2rem !important; 
            cursor: pointer !important; 
            opacity: 0 !important; 
            transition: all 0.3s ease !important; 
            z-index: 99999 !important; 
            display: flex !important; 
            align-items: center !important; 
            justify-content: center !important; 
            box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3) !important;
            margin: 0 !important;
            padding: 0 !important;
            transform: none !important;
        `;
        document.body.appendChild(backToTopBtn);
        
        // Responsivo - ajusta apenas tamanho, mantém posição no canto esquerdo
        const updateBackToTopSize = () => {
            if (window.innerWidth <= 768) {
                backToTopBtn.style.width = '70px';
                backToTopBtn.style.height = '70px';
                backToTopBtn.style.fontSize = '1.4rem';
            } else {
                backToTopBtn.style.width = '60px';
                backToTopBtn.style.height = '60px';
                backToTopBtn.style.fontSize = '1.2rem';
            }
        };
        
        updateBackToTopSize();
        window.addEventListener('resize', updateBackToTopSize);
        
        // Funcionalidade
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.opacity = '1';
            } else {
                backToTopBtn.style.opacity = '0';
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Efeito visual
            backToTopBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                backToTopBtn.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    console.log('✅ Funcionalidades básicas inicializadas');
}

// Função de debug MELHORADA
function debugComponents() {
    console.log('🐛 DEBUG - Estado dos componentes:');
    
    const hamburger = document.querySelector('.overseas-mobile-toggle, #overseasMobileToggle');
    const menu = document.querySelector('.overseas-nav-links, #overseasNavLinks');
    const whatsapp = document.querySelector('a[href*="whatsapp"], .overseas-whatsapp-float');
    
    console.log('Hamburger encontrado:', !!hamburger);
    if (hamburger) {
        console.log('Hamburger display:', window.getComputedStyle(hamburger).display);
        console.log('Hamburger classes:', hamburger.className);
        console.log('Spans dentro:', hamburger.querySelectorAll('span').length);
    }
    
    console.log('Menu encontrado:', !!menu);
    if (menu) {
        console.log('Menu display:', window.getComputedStyle(menu).display);
        console.log('Menu classes:', menu.className);
    }
    
    console.log('WhatsApp encontrado:', !!whatsapp);
    console.log('Largura da tela:', window.innerWidth);
    console.log('É mobile?', window.innerWidth <= 768);
    
    // Teste de clique no hamburger
    if (hamburger) {
        console.log('🧪 Testando clique no hamburger...');
        hamburger.click();
    }
}

// Disponibiliza debug globalmente
window.debugOverseas = debugComponents;

// FUNÇÃO DE TESTE MANUAL MELHORADA
window.testHamburger = function() {
    const hamburger = document.querySelector('.overseas-mobile-toggle, #overseasMobileToggle');
    if (hamburger) {
        console.log('🧪 Simulando clique no hamburger...');
        hamburger.click();
    } else {
        console.log('❌ Hamburger não encontrado para teste');
    }
};

// FUNÇÃO PARA FORÇAR POSIÇÃO DOS BOTÕES MANUALMENTE
window.forceButtonPositions = function() {
    const backBtn = document.querySelector('.back-to-top-btn');
    const whatsBtn = document.querySelector('a[href*="whatsapp"], .overseas-whatsapp-float');
    
    console.log('🎯 Forçando posições...');
    
    if (backBtn) {
        backBtn.style.cssText = `
            position: fixed !important; bottom: 1.5rem !important; left: 1rem !important;
            right: auto !important; width: 60px !important; height: 60px !important;
            background: linear-gradient(135deg, #00d4ff, #00ffff) !important;
            border-radius: 50% !important; z-index: 99999 !important;
            display: flex !important; align-items: center !important; justify-content: center !important;
            opacity: 1 !important; color: black !important; font-size: 1.2rem !important;
        `;
        console.log('✅ Botão azul reposicionado');
    }
    
    if (whatsBtn) {
        whatsBtn.style.cssText = `
            position: fixed !important; bottom: 1.5rem !important; right: 1rem !important;
            left: auto !important; width: 60px !important; height: 60px !important;
            background: #25d366 !important; border-radius: 50% !important; z-index: 99999 !important;
            display: flex !important; align-items: center !important; justify-content: center !important;
            opacity: 1 !important; color: white !important;
        `;
        console.log('✅ Botão WhatsApp reposicionado');
    }
};

// Log final
console.log('🌊 SERVICOS.JS LIMPO carregado!');
console.log('💡 Use debugOverseas() para debug');
console.log('🧪 Use testHamburger() para testar manualmente');