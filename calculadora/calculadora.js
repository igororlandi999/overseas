// ===== CALCULADORA FRONTEND - OVERSEAS TRADING =====

// ===== CONFIGURAÇÕES BÁSICAS =====
let ncmCounter = 1;
let detailsVisible = false;

// ===== HEADER E ANIMAÇÕES =====
const HeaderController = {
    init() {
        const header = document.getElementById('header');
        const mobileToggle = document.getElementById('mobileToggle');
        const navLinks = document.getElementById('navLinks');
        const scrollProgress = document.getElementById('scrollProgress');

        // Scroll effects
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Header background
            if (scrollTop > 100) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }

            // Progress bar
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = (scrollTop / documentHeight) * 100;
            scrollProgress.style.width = `${scrollPercentage}%`;
        });

        // Mobile menu
        mobileToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.contains('active');
            
            if (isActive) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            } else {
                navLinks.classList.add('active');
                mobileToggle.classList.add('active');
                mobileToggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            }
        });

        // Close mobile menu on link click
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = 'auto';
                }
            }
        });

        // ESC key closes menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            }
        });
    }
};

// ===== FUNÇÕES DE GERENCIAMENTO DE NCM =====
function addNCM() {
    const container = document.getElementById('ncm-container');
    const newNCM = document.createElement('div');
    newNCM.className = 'ncm-item';
    newNCM.innerHTML = `
        <div class="ncm-grid">
            <div class="form-group">
                <label>NCM (8 dígitos) *</label>
                <input type="text" class="ncm-input" placeholder="12345678" maxlength="8" required>
            </div>
            <div class="form-group">
                <label>Valor (USD) *</label>
                <input type="number" class="valor-input" step="0.01" placeholder="0.00" required>
            </div>
            <div class="form-group">
                <label>Quantidade *</label>
                <input type="number" class="quantidade-input" step="0.01" placeholder="0" required>
            </div>
        </div>
        
        <div class="ncm-description">
            <h4>Descrição NCM</h4>
            <p class="descricao-text">Descrição será exibida aqui após inserir o NCM</p>
            
            <div class="aliquotas-grid">
                <div class="aliquota-item">
                    <strong>II:</strong> <span class="ii-value">0%</span>
                </div>
                <div class="aliquota-item">
                    <strong>IPI:</strong> <span class="ipi-value">0%</span>
                </div>
                <div class="aliquota-item">
                    <strong>PIS:</strong> <span class="pis-value">0%</span>
                </div>
                <div class="aliquota-item">
                    <strong>COFINS:</strong> <span class="cofins-value">0%</span>
                </div>
            </div>
        </div>
        
        <div class="btn-actions">
            <button type="button" class="btn-remove-ncm" onclick="removeNCM(this)">🗑️ Remover NCM</button>
        </div>
    `;
    
    ncmCounter++;
    container.appendChild(newNCM);
    
    // Animação de entrada
    newNCM.style.opacity = '0';
    newNCM.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        newNCM.style.transition = 'all 0.3s ease';
        newNCM.style.opacity = '1';
        newNCM.style.transform = 'translateY(0)';
    }, 10);
    
    // Focus no primeiro input
    newNCM.querySelector('.ncm-input').focus();
}

function removeNCM(button) {
    const ncmItem = button.closest('.ncm-item');
    const container = document.getElementById('ncm-container');
    
    if (container.children.length > 1) {
        // Animação de saída
        ncmItem.style.transition = 'all 0.3s ease';
        ncmItem.style.opacity = '0';
        ncmItem.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            ncmItem.remove();
        }, 300);
    } else {
        alert('Deve haver pelo menos um NCM!');
    }
}

// ===== FUNÇÕES DE INTERFACE NCM =====

/**
 * Atualiza a interface com os dados do NCM consultado
 * @param {Element} ncmItem - Container do NCM na interface
 * @param {object} resultado - Resultado da consulta NCM
 */
function atualizarInterfaceNCM(ncmItem, resultado) {
    const descricaoText = ncmItem.querySelector('.descricao-text');
    const iiValue = ncmItem.querySelector('.ii-value');
    const ipiValue = ncmItem.querySelector('.ipi-value');
    const pisValue = ncmItem.querySelector('.pis-value');
    const cofinsValue = ncmItem.querySelector('.cofins-value');
    
    if (resultado.success) {
        // Sucesso - exibir dados
        descricaoText.textContent = resultado.data.descricao;
        descricaoText.className = 'descricao-text success';
        
        iiValue.textContent = `${resultado.data.aliquotas.ii}%`;
        ipiValue.textContent = `${resultado.data.aliquotas.ipi}%`;
        pisValue.textContent = `${resultado.data.aliquotas.pis}%`;
        cofinsValue.textContent = `${resultado.data.aliquotas.cofins}%`;
        
        // Adicionar classes de sucesso
        ncmItem.classList.remove('ncm-error', 'ncm-loading');
        ncmItem.classList.add('ncm-success');
        
        // Animação nas alíquotas
        const aliquotas = ncmItem.querySelectorAll('.aliquota-item');
        aliquotas.forEach((aliquota, index) => {
            setTimeout(() => {
                aliquota.classList.add('loaded');
            }, index * 100);
        });
        
    } else {
        // Erro - exibir mensagem
        descricaoText.textContent = resultado.error;
        descricaoText.className = 'descricao-text error';
        
        iiValue.textContent = '0%';
        ipiValue.textContent = '0%';
        pisValue.textContent = '0%';
        cofinsValue.textContent = '0%';
        
        // Adicionar classes de erro
        ncmItem.classList.remove('ncm-success', 'ncm-loading');
        ncmItem.classList.add('ncm-error');
    }
}

/**
 * Configura event listeners para consulta automática de NCM
 */
function configurarEventListenersNCM() {
    // Debounce para evitar consultas excessivas
    let timeoutNCM = null;
    
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('ncm-input')) {
            const ncmInput = e.target;
            const ncmItem = ncmInput.closest('.ncm-item');
            
            // Limpar timeout anterior
            if (timeoutNCM) {
                clearTimeout(timeoutNCM);
            }
            
            // Aplicar máscara (apenas números, máximo 8)
            let valor = ncmInput.value.replace(/\D/g, '');
            if (valor.length > 8) {
                valor = valor.substring(0, 8);
            }
            ncmInput.value = valor;
            
            // Estados visuais do input
            ncmInput.classList.remove('valid', 'invalid', 'loading');
            ncmItem.classList.remove('ncm-success', 'ncm-error', 'ncm-loading');
            
            if (valor.length > 0 && valor.length < 8) {
                ncmInput.classList.add('loading');
                ncmItem.classList.add('ncm-loading');
            }
            
            // Consultar NCM após 500ms de inatividade
            timeoutNCM = setTimeout(async () => {
                if (valor.length === 8) {
                    ncmInput.classList.add('loading');
                    ncmItem.classList.add('ncm-loading');
                    
                    // Verificar se NCMService está disponível
                    if (window.NCMService && window.NCMService.consultarNCM) {
                        const resultado = window.NCMService.consultarNCM(valor);
                        atualizarInterfaceNCM(ncmItem, resultado);
                        
                        // Atualizar estado do input
                        if (resultado.success) {
                            ncmInput.classList.remove('loading', 'invalid');
                            ncmInput.classList.add('valid');
                        } else {
                            ncmInput.classList.remove('loading', 'valid');
                            ncmInput.classList.add('invalid');
                        }
                    } else {
                        console.error('NCMService não está disponível');
                        atualizarInterfaceNCM(ncmItem, {
                            success: false,
                            error: 'Serviço NCM não carregado',
                            ncm: valor,
                            data: null
                        });
                    }
                } else if (valor.length > 0) {
                    // NCM incompleto
                    atualizarInterfaceNCM(ncmItem, {
                        success: false,
                        error: `NCM incompleto (${valor.length}/8 dígitos)`,
                        ncm: valor,
                        data: null
                    });
                } else {
                    // Campo vazio - resetar
                    atualizarInterfaceNCM(ncmItem, {
                        success: false,
                        error: 'Insira o código NCM (8 dígitos)',
                        ncm: '',
                        data: null
                    });
                }
            }, 500);
        }
    });
}

// ===== FUNÇÃO CALCULAR =====
function calcularSimulacao() {
    const resultsSection = document.getElementById('results-section');
    const detailsSection = document.getElementById('details-section');
    const detailsBtn = document.getElementById('details-btn');
    const calculateBtn = document.querySelector('.calculate-btn');
    
    // Validar se há NCMs válidos antes de calcular
    const ncmsValidos = document.querySelectorAll('.ncm-item.ncm-success');
    if (ncmsValidos.length === 0) {
        alert('⚠️ Adicione pelo menos um NCM válido antes de calcular!');
        return;
    }
    
    // Loading state
    calculateBtn.textContent = '⏳ Calculando...';
    calculateBtn.disabled = true;
    
    // TODO: Implementar lógica real de cálculo
    // Por enquanto, simular processamento
    setTimeout(() => {
        // Reset do estado dos detalhes
        detailsVisible = false;
        detailsSection.classList.remove('show');
        detailsSection.style.display = 'none';
        detailsBtn.textContent = '🔽 Ver Detalhes da Simulação';
        
        // Exibir resultados com animação
        resultsSection.style.display = 'block';
        setTimeout(() => {
            resultsSection.classList.add('show');
        }, 100);
        
        // Scroll suave para os resultados
        resultsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Restaurar botão
        calculateBtn.textContent = '🧮 CALCULAR SIMULAÇÃO';
        calculateBtn.disabled = false;
    }, 1500);
}

// ===== FUNÇÃO TOGGLE DETALHES =====
function toggleDetails() {
    const detailsSection = document.getElementById('details-section');
    const detailsBtn = document.getElementById('details-btn');
    
    if (!detailsVisible) {
        // Mostrar detalhes
        detailsSection.style.display = 'block';
        setTimeout(() => {
            detailsSection.classList.add('show');
        }, 100);
        detailsBtn.textContent = '🔼 Ocultar Detalhes';
        detailsVisible = true;
        
        // Scroll suave para os detalhes
        setTimeout(() => {
            detailsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 200);
    } else {
        // Ocultar detalhes
        detailsSection.classList.remove('show');
        setTimeout(() => {
            detailsSection.style.display = 'none';
        }, 500);
        detailsBtn.textContent = '🔽 Ver Detalhes da Simulação';
        detailsVisible = false;
        
        // Scroll suave para os totais finais
        document.getElementById('totais-finais').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ===== FUNÇÕES UTILITÁRIAS DE INTERFACE =====

/**
 * Coleta dados de todos os NCMs válidos
 * @returns {Array} - Array com dados dos NCMs
 */
function coletarDadosNCMs() {
    const ncmsValidos = document.querySelectorAll('.ncm-item.ncm-success');
    const dados = [];
    
    ncmsValidos.forEach(ncmItem => {
        const ncmInput = ncmItem.querySelector('.ncm-input');
        const valorInput = ncmItem.querySelector('.valor-input');
        const quantidadeInput = ncmItem.querySelector('.quantidade-input');
        
        const ncm = ncmInput.value.replace(/\D/g, '');
        const valor = parseFloat(valorInput.value) || 0;
        const quantidade = parseFloat(quantidadeInput.value) || 0;
        
        if (ncm && valor > 0 && quantidade > 0) {
            // Obter alíquotas da interface
            const iiText = ncmItem.querySelector('.ii-value').textContent;
            const ipiText = ncmItem.querySelector('.ipi-value').textContent;
            const pisText = ncmItem.querySelector('.pis-value').textContent;
            const cofinsText = ncmItem.querySelector('.cofins-value').textContent;
            
            dados.push({
                ncm: ncm,
                valor: valor,
                quantidade: quantidade,
                aliquotas: {
                    ii: parseFloat(iiText.replace('%', '')) || 0,
                    ipi: parseFloat(ipiText.replace('%', '')) || 0,
                    pis: parseFloat(pisText.replace('%', '')) || 0,
                    cofins: parseFloat(cofinsText.replace('%', '')) || 0
                }
            });
        }
    });
    
    return dados;
}

/**
 * Coleta dados gerais do formulário
 * @returns {object} - Dados gerais da simulação
 */
function coletarDadosGerais() {
    return {
        cliente: document.getElementById('cliente')?.value || '',
        regimeTributario: document.getElementById('regime_tributario')?.value || '',
        moeda: document.getElementById('moeda')?.value || '',
        taxaMoeda: parseFloat(document.getElementById('taxa_moeda')?.value) || 0,
        unidade: document.getElementById('unidade')?.value || '',
        destino: document.getElementById('destino')?.value || '',
        mudaNcm: document.getElementById('muda_ncm')?.value || '',
        valorFrete: parseFloat(document.getElementById('valor_frete')?.value) || 0,
        modalImportacao: document.getElementById('modal_importacao')?.value || '',
        estadoDestino: document.getElementById('estado_destino')?.value || ''
    };
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar header
    HeaderController.init();
    
    // Configurar event listeners NCM (após NCMService estar disponível)
    setTimeout(() => {
        configurarEventListenersNCM();
    }, 1000);
    
    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            const inputs = document.querySelectorAll('input, select');
            const currentIndex = Array.from(inputs).indexOf(e.target);
            
            if (currentIndex < inputs.length - 1) {
                inputs[currentIndex + 1].focus();
            }
        }
    });

    // Smooth scrolling para links internos
    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                const headerHeight = 80;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });

    console.log('🧮 Calculadora Frontend - Overseas Trading iniciada!');
});

// ===== INTEGRAÇÃO CALCULADORA + MOTOR DE CÁLCULO =====

// ===== FUNÇÕES DE COLETA DE DADOS =====

/**
 * Coleta dados gerais do formulário
 * @returns {object} - Dados gerais da simulação
 */
function coletarDadosGerais() {
    return {
        cliente: document.getElementById('cliente')?.value?.trim() || '',
        regimeTributario: document.getElementById('regime_tributario')?.value || '',
        moeda: document.getElementById('moeda')?.value || '',
        taxaMoeda: parseFloat(document.getElementById('taxa_moeda')?.value) || 0,
        unidade: document.getElementById('unidade')?.value || '',
        destino: document.getElementById('destino')?.value || '',
        mudaNcm: document.getElementById('muda_ncm')?.value || '',
        valorFrete: parseFloat(document.getElementById('valor_frete')?.value) || 0,
        modalImportacao: document.getElementById('modal_importacao')?.value || '',
        estadoDestino: document.getElementById('estado_destino')?.value || ''
    };
}

/**
 * Coleta dados de todos os NCMs válidos
 * @returns {Array} - Array com dados dos NCMs
 */
function coletarDadosNCMs() {
    const ncmsValidos = document.querySelectorAll('.ncm-item.ncm-success');
    const dados = [];
    
    ncmsValidos.forEach(ncmItem => {
        const ncmInput = ncmItem.querySelector('.ncm-input');
        const valorInput = ncmItem.querySelector('.valor-input');
        const quantidadeInput = ncmItem.querySelector('.quantidade-input');
        
        const ncm = ncmInput.value.replace(/\D/g, '');
        const valor = parseFloat(valorInput.value) || 0;
        const quantidade = parseFloat(quantidadeInput.value) || 0;
        
        if (ncm && valor > 0 && quantidade > 0) {
            // Obter alíquotas da interface
            const iiText = ncmItem.querySelector('.ii-value').textContent;
            const ipiText = ncmItem.querySelector('.ipi-value').textContent;
            const pisText = ncmItem.querySelector('.pis-value').textContent;
            const cofinsText = ncmItem.querySelector('.cofins-value').textContent;
            
            dados.push({
                ncm: ncm,
                valor: valor,
                quantidade: quantidade,
                aliquotas: {
                    ii: parseFloat(iiText.replace('%', '')) || 0,
                    ipi: parseFloat(ipiText.replace('%', '')) || 0,
                    pis: parseFloat(pisText.replace('%', '')) || 0,
                    cofins: parseFloat(cofinsText.replace('%', '')) || 0
                }
            });
        }
    });
    
    return dados;
}

// ===== FUNÇÕES DE VALIDAÇÃO =====

/**
 * Valida dados antes do cálculo
 * @param {object} dadosGerais - Dados gerais
 * @param {Array} dadosNCMs - Dados dos NCMs
 * @returns {object} - {valido: boolean, erros: Array}
 */
function validarDadosCalculo(dadosGerais, dadosNCMs) {
    const erros = [];
    
    // Validações obrigatórias
    if (!dadosGerais.cliente) {
        erros.push('Nome do cliente é obrigatório');
    }
    
    if (!dadosGerais.regimeTributario) {
        erros.push('Regime tributário é obrigatório');
    }
    
    if (!dadosGerais.moeda) {
        erros.push('Moeda é obrigatória');
    }
    
    if (!dadosGerais.taxaMoeda || dadosGerais.taxaMoeda <= 0) {
        erros.push('Taxa da moeda deve ser maior que zero');
    }
    
    if (!dadosNCMs || dadosNCMs.length === 0) {
        erros.push('Pelo menos um NCM válido deve ser informado');
    }
    
    // Validar NCMs individuais
    dadosNCMs.forEach((ncm, index) => {
        if (!ncm.ncm || ncm.ncm.length !== 8) {
            erros.push(`NCM ${index + 1}: Código deve ter 8 dígitos`);
        }
        
        if (!ncm.valor || ncm.valor <= 0) {
            erros.push(`NCM ${index + 1}: Valor deve ser maior que zero`);
        }
        
        if (!ncm.quantidade || ncm.quantidade <= 0) {
            erros.push(`NCM ${index + 1}: Quantidade deve ser maior que zero`);
        }
    });
    
    return {
        valido: erros.length === 0,
        erros: erros
    };
}

// ===== FUNÇÕES DE PREENCHIMENTO DA INTERFACE =====

/**
 * Formata valor para exibição em Real
 * @param {number} valor - Valor numérico
 * @returns {string} - Valor formatado (R$ 1.234,56)
 */
function formatarMoeda(valor) {
    if (typeof valor !== 'number' || isNaN(valor)) {
        return 'R$ 0,00';
    }
    
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/**
 * Formata percentual para exibição
 * @param {number} valor - Valor decimal
 * @returns {string} - Percentual formatado (12,34%)
 */
function formatarPercentual(valor) {
    if (typeof valor !== 'number' || isNaN(valor)) {
        return '0%';
    }
    
    return `${valor.toFixed(2).replace('.', ',')}%`;
}

/**
 * Preenche tabela de totais finais
 * @param {object} resultado - Resultado da simulação
 */
function preencherTotaisFinais(resultado) {
    const tabela = document.querySelector('#totais-finais tbody');
    if (!tabela) return;
    
    const cenarioDirecto = resultado.cenarios.importacaoDireta;
    const cenarioTrading = resultado.cenarios.trading;
    const comparacao = resultado.comparacao;
    
    // Encontrar linhas por texto (mais seguro que índice)
    const linhas = tabela.querySelectorAll('tr');
    
    linhas.forEach(linha => {
        const primeiraColuna = linha.querySelector('td:first-child');
        if (!primeiraColuna) return;
        
        const texto = primeiraColuna.textContent.trim();
        const colunaDirecto = linha.querySelector('td:nth-child(2)');
        const colunaTrading = linha.querySelector('td:nth-child(3)');
        
        if (!colunaDirecto || !colunaTrading) return;
        
        switch (true) {
            case texto.includes('Total do Custo da Importação'):
                colunaDirecto.innerHTML = `<strong>${formatarMoeda(cenarioDirecto.custoTotal)}</strong>`;
                colunaTrading.innerHTML = `<strong>${formatarMoeda(cenarioTrading.custoTotal)}</strong>`;
                break;
                
            case texto.includes('Total Desembolso'):
                colunaDirecto.innerHTML = `<strong>${formatarMoeda(cenarioDirecto.desembolsoTotal)}</strong>`;
                colunaTrading.innerHTML = `<strong>${formatarMoeda(cenarioTrading.desembolsoTotal)}</strong>`;
                break;
                
            case texto.includes('Economia Gerada (%)'):
                colunaDirecto.innerHTML = `<strong>-</strong>`;
                colunaTrading.innerHTML = `<strong>${formatarPercentual(comparacao.economiaPercentual)}</strong>`;
                break;
                
            case texto.includes('Economia Gerada (R$)'):
                colunaDirecto.innerHTML = `<strong>-</strong>`;
                colunaTrading.innerHTML = `<strong>${formatarMoeda(comparacao.economiaAbsoluta)}</strong>`;
                break;
        }
    });
}

/**
 * Preenche seção de impostos e contribuições
 * @param {object} resultado - Resultado da simulação
 */
function preencherImpostosContribuicoes(resultado) {
    const secao = document.querySelector('.details-section .results-table:nth-child(1)');
    if (!secao) return;
    
    const tabela = secao.querySelector('tbody');
    if (!tabela) return;
    
    const cenarioDirecto = resultado.cenarios.importacaoDireta;
    const cenarioTrading = resultado.cenarios.trading;
    
    const linhas = tabela.querySelectorAll('tr');
    
    linhas.forEach(linha => {
        const primeiraColuna = linha.querySelector('td:first-child');
        if (!primeiraColuna) return;
        
        const texto = primeiraColuna.textContent.trim();
        const colunaDirecto = linha.querySelector('td:nth-child(2)');
        const colunaTrading = linha.querySelector('td:nth-child(3)');
        
        if (!colunaDirecto || !colunaTrading) return;
        
        switch (true) {
            case texto.includes('Valor Aduaneiro'):
                colunaDirecto.textContent = formatarMoeda(cenarioDirecto.valorAduaneiro);
                colunaTrading.textContent = formatarMoeda(cenarioTrading.valorAduaneiro);
                break;
                
            case texto.includes('Imposto de Importação'):
                colunaDirecto.textContent = formatarMoeda(cenarioDirecto.impostos.ii);
                colunaTrading.textContent = formatarMoeda(cenarioTrading.impostos.ii);
                break;
                
            case texto.includes('IPI'):
                colunaDirecto.textContent = formatarMoeda(cenarioDirecto.impostos.ipi);
                colunaTrading.textContent = formatarMoeda(cenarioTrading.impostos.ipi);
                break;
                
            case texto.includes('PIS'):
                colunaDirecto.textContent = formatarMoeda(cenarioDirecto.impostos.pis);
                colunaTrading.textContent = formatarMoeda(cenarioTrading.impostos.pis);
                break;
                
            case texto.includes('COFINS'):
                colunaDirecto.textContent = formatarMoeda(cenarioDirecto.impostos.cofins);
                colunaTrading.textContent = formatarMoeda(cenarioTrading.impostos.cofins);
                break;
                
            case texto.includes('SISCOMEX'):
                colunaDirecto.textContent = formatarMoeda(cenarioDirecto.impostos.siscomex);
                colunaTrading.textContent = formatarMoeda(cenarioTrading.impostos.siscomex);
                break;
                
            case texto.includes('ICMS'):
                colunaDirecto.textContent = formatarMoeda(cenarioDirecto.impostos.icms);
                colunaTrading.textContent = formatarMoeda(cenarioTrading.impostos.icms);
                break;
                
            case texto.includes('Sub-total') && linha.classList.contains('total-row'):
                colunaDirecto.innerHTML = `<strong>${formatarMoeda(cenarioDirecto.impostos.total)}</strong>`;
                colunaTrading.innerHTML = `<strong>${formatarMoeda(cenarioTrading.impostos.total)}</strong>`;
                break;
        }
    });
}

/**
 * Preenche seção de créditos dos tributos
 * @param {object} resultado - Resultado da simulação
 */
function preencherCreditosTributos(resultado) {
    const secao = document.querySelector('.details-section .results-table:nth-child(4)'); // 4ª seção
    if (!secao) return;
    
    const tabela = secao.querySelector('tbody');
    if (!tabela) return;
    
    const cenarioDirecto = resultado.cenarios.importacaoDireta;
    const cenarioTrading = resultado.cenarios.trading;
    
    const linhas = tabela.querySelectorAll('tr');
    
    linhas.forEach(linha => {
        const primeiraColuna = linha.querySelector('td:first-child');
        if (!primeiraColuna) return;
        
        const texto = primeiraColuna.textContent.trim();
        const colunaDirecto = linha.querySelector('td:nth-child(2)');
        const colunaTrading = linha.querySelector('td:nth-child(3)');
        
        if (!colunaDirecto || !colunaTrading) return;
        
        switch (true) {
            case texto.includes('ICMS'):
                colunaDirecto.textContent = formatarMoeda(cenarioDirecto.creditos.icms);
                colunaTrading.textContent = formatarMoeda(cenarioTrading.creditos.icms);
                break;
                
            case texto.includes('IPI'):
                colunaDirecto.textContent = formatarMoeda(cenarioDirecto.creditos.ipi);
                colunaTrading.textContent = formatarMoeda(cenarioTrading.creditos.ipi);
                break;
                
            case texto.includes('PIS'):
                colunaDirecto.textContent = formatarMoeda(cenarioDirecto.creditos.pis);
                colunaTrading.textContent = formatarMoeda(cenarioTrading.creditos.pis);
                break;
                
            case texto.includes('COFINS'):
                colunaDirecto.textContent = formatarMoeda(cenarioDirecto.creditos.cofins);
                colunaTrading.textContent = formatarMoeda(cenarioTrading.creditos.cofins);
                break;
                
            case texto.includes('Total a Recuperar') && linha.classList.contains('total-row'):
                colunaDirecto.innerHTML = `<strong>${formatarMoeda(cenarioDirecto.creditos.total)}</strong>`;
                colunaTrading.innerHTML = `<strong>${formatarMoeda(cenarioTrading.creditos.total)}</strong>`;
                break;
        }
    });
}

/**
 * Preenche todas as seções de resultados
 * @param {object} resultado - Resultado da simulação
 */
function preencherTodosResultados(resultado) {
    console.log('📊 Preenchendo resultados:', resultado);
    
    try {
        // 1. Totais Finais
        preencherTotaisFinais(resultado);
        
        // 2. Impostos e Contribuições
        preencherImpostosContribuicoes(resultado);
        
        // 3. Créditos dos Tributos
        preencherCreditosTributos(resultado);
        
        // 4. Adicionar informações extras
        adicionarInformacoesExtras(resultado);
        
        console.log('✅ Resultados preenchidos com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao preencher resultados:', error);
    }
}

/**
 * Adiciona informações extras nos resultados
 * @param {object} resultado - Resultado da simulação
 */
function adicionarInformacoesExtras(resultado) {
    // Destacar melhor opção
    const melhorOpcao = resultado.comparacao.melhorOpcao;
    const colunas = document.querySelectorAll('.overseas-co3');
    
    if (melhorOpcao === 'OVERSEAS_TRADING') {
        colunas.forEach(coluna => {
            coluna.style.background = 'rgba(57, 255, 20, 0.15)';
            coluna.style.fontWeight = 'bold';
        });
    }
    
    // Adicionar tooltip com informações detalhadas
    const economiaElement = document.querySelector('.economia-row td:last-child');
    if (economiaElement && resultado.comparacao.economiaAbsoluta > 0) {
        economiaElement.title = `Economia de ${formatarPercentual(resultado.comparacao.economiaPercentual)} ` +
                                `equivalente a ${formatarMoeda(resultado.comparacao.economiaAbsoluta)}`;
    }
}

// ===== FUNÇÃO PRINCIPAL DE CÁLCULO INTEGRADA =====

/**
 * Executa cálculo completo da simulação
 */
function calcularSimulacao() {
    const resultsSection = document.getElementById('results-section');
    const detailsSection = document.getElementById('details-section');
    const detailsBtn = document.getElementById('details-btn');
    const calculateBtn = document.querySelector('.calculate-btn');
    
    try {
        console.log('🚀 Iniciando cálculo da simulação...');
        
        // Loading state
        calculateBtn.textContent = '⏳ Calculando...';
        calculateBtn.disabled = true;
        
        // 1. Coletar dados do formulário
        const dadosGerais = coletarDadosGerais();
        const dadosNCMs = coletarDadosNCMs();
        
        console.log('📋 Dados coletados:', { dadosGerais, dadosNCMs });
        
        // 2. Validar dados
        const validacao = validarDadosCalculo(dadosGerais, dadosNCMs);
        
        if (!validacao.valido) {
            alert('❌ Erro na validação:\n\n' + validacao.erros.join('\n'));
            calculateBtn.textContent = '🧮 CALCULAR SIMULAÇÃO';
            calculateBtn.disabled = false;
            return;
        }
        
        // 3. Verificar se CalculoService está disponível
        if (!window.CalculoService) {
            throw new Error('Motor de cálculo não está carregado. Verifique se o arquivo calculo-service.js foi incluído.');
        }
        
        // 4. Preparar parâmetros para o cálculo
        const parametrosCalculo = {
            cliente: dadosGerais.cliente,
            regimeTributario: dadosGerais.regimeTributario,
            moeda: dadosGerais.moeda,
            taxaCambio: dadosGerais.taxaMoeda,
            estadoDestino: dadosGerais.estadoDestino || 'SC',
            modalTransporte: dadosGerais.modalImportacao || 'MARITIMO',
            valorFrete: dadosGerais.valorFrete || 0,
            ncms: dadosNCMs,
            calcularTrading: true
        };
        
        console.log('⚙️ Parâmetros do cálculo:', parametrosCalculo);
        
        // 5. Executar simulação
        const resultado = window.CalculoService.executarSimulacao(parametrosCalculo);
        
        if (resultado.sucesso === false) {
            throw new Error(resultado.erro || 'Erro desconhecido no cálculo');
        }
        
        console.log('💰 Resultado da simulação:', resultado);
        
        // 6. Aguardar um pouco para simular processamento
        setTimeout(() => {
            // Reset do estado dos detalhes
            detailsVisible = false;
            detailsSection.classList.remove('show');
            detailsSection.style.display = 'none';
            detailsBtn.textContent = '🔽 Ver Detalhes da Simulação';
            
            // 7. Preencher resultados na interface
            preencherTodosResultados(resultado);
            
            // 8. Exibir resultados com animação
            resultsSection.style.display = 'block';
            setTimeout(() => {
                resultsSection.classList.add('show');
            }, 100);
            
            // 9. Scroll suave para os resultados
            resultsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // 10. Restaurar botão
            calculateBtn.textContent = '🧮 CALCULAR SIMULAÇÃO';
            calculateBtn.disabled = false;
            
            // 11. Mostrar mensagem de sucesso
            const economia = resultado.comparacao.economiaAbsoluta;
            if (economia > 0) {
                setTimeout(() => {
                    alert(`🎉 Simulação concluída!\n\n💰 Economia potencial: ${formatarMoeda(economia)}\n📊 Percentual: ${formatarPercentual(resultado.comparacao.economiaPercentual)}`);
                }, 1000);
            }
            
        }, 800); // Delay para melhor UX
        
    } catch (error) {
        console.error('❌ Erro no cálculo:', error);
        
        alert(`❌ Erro no cálculo da simulação:\n\n${error.message}\n\nVerifique os dados informados e tente novamente.`);
        
        // Restaurar botão em caso de erro
        calculateBtn.textContent = '🧮 CALCULAR SIMULAÇÃO';
        calculateBtn.disabled = false;
    }
}

// ===== FUNÇÕES UTILITÁRIAS EXTRAS =====

/**
 * Limpa todos os resultados da interface
 */
function limparResultados() {
    const todasTabelas = document.querySelectorAll('.results-table tbody');
    todasTabelas.forEach(tabela => {
        const linhas = tabela.querySelectorAll('tr');
        linhas.forEach(linha => {
            const colunas = linha.querySelectorAll('td:not(:first-child)');
            colunas.forEach(coluna => {
                if (!linha.classList.contains('total-row')) {
                    coluna.textContent = 'R$ 0,00';
                } else {
                    coluna.innerHTML = '<strong>R$ 0,00</strong>';
                }
            });
        });
    });
}

/**
 * Exporta resultados para impressão/PDF
 * @param {object} resultado - Resultado da simulação
 */
function exportarResultados(resultado) {
    // TODO: Implementar exportação para PDF
    console.log('📄 Exportando resultados:', resultado);
}

console.log('🔗 Integração Calculadora + Motor de Cálculo carregada!');