// ===== NCM SERVICE - LÓGICA DE NEGÓCIO =====

// Base de dados NCM (será carregada do JSON fornecido)
let baseDadosNCM = [];

// ===== FUNÇÕES DE VALIDAÇÃO =====

/**
 * Valida se o NCM está no formato correto (8 dígitos)
 * @param {string} ncm - NCM a ser validado
 * @returns {object} - {valid: boolean, error: string}
 */
function validarNCM(ncm) {
    // Remove espaços e caracteres especiais
    const ncmLimpo = ncm.toString().replace(/\D/g, '');
    
    if (!ncmLimpo) {
        return { valid: false, error: 'NCM não pode estar vazio' };
    }
    
    if (ncmLimpo.length !== 8) {
        return { valid: false, error: 'NCM deve conter exatamente 8 dígitos' };
    }
    
    if (!/^\d{8}$/.test(ncmLimpo)) {
        return { valid: false, error: 'NCM deve conter apenas números' };
    }
    
    return { valid: true, error: null };
}

/**
 * Formata NCM para exibição (12.34.56.78)
 * @param {string} ncm - NCM a ser formatado
 * @returns {string} - NCM formatado
 */
function formatarNCM(ncm) {
    const ncmLimpo = ncm.toString().replace(/\D/g, '');
    if (ncmLimpo.length === 8) {
        return `${ncmLimpo.slice(0,2)}.${ncmLimpo.slice(2,4)}.${ncmLimpo.slice(4,6)}.${ncmLimpo.slice(6,8)}`;
    }
    return ncm;
}

// ===== FUNÇÃO PRINCIPAL DE CONSULTA =====

/**
 * Consulta NCM na base de dados e retorna informações completas
 * @param {string} ncm - NCM a ser consultado (8 dígitos)
 * @returns {object} - Resultado da consulta
 */
function consultarNCM(ncm) {
    try {
        // 1. Validar formato do NCM
        const validacao = validarNCM(ncm);
        if (!validacao.valid) {
            return {
                success: false,
                error: validacao.error,
                ncm: ncm,
                data: null
            };
        }
        
        // 2. Limpar e converter NCM para número
        const ncmNumero = parseInt(ncm.toString().replace(/\D/g, ''));
        
        // 3. Buscar na base de dados
        const ncmEncontrado = baseDadosNCM.find(item => item.NCM === ncmNumero);
        
        if (!ncmEncontrado) {
            return {
                success: false,
                error: 'NCM não encontrado na base de dados',
                ncm: formatarNCM(ncm),
                data: null
            };
        }
        
        // 4. Retornar dados formatados
        return {
            success: true,
            error: null,
            ncm: formatarNCM(ncm),
            data: {
                ncm: ncmNumero,
                ncmFormatado: formatarNCM(ncm),
                descricao: ncmEncontrado.DESCRIÇÃO || 'Descrição não disponível',
                aliquotas: {
                    ii: parseFloat(ncmEncontrado.II) || 0,
                    ipi: parseFloat(ncmEncontrado.IPI) || 0,
                    pis: parseFloat(ncmEncontrado.PIS) || 0,
                    cofins: parseFloat(ncmEncontrado.COFINS) || 0
                },
                // Dados adicionais
                gatt: parseFloat(ncmEncontrado.GATT) || 0
            }
        };
        
    } catch (error) {
        console.error('Erro ao consultar NCM:', error);
        return {
            success: false,
            error: 'Erro interno ao consultar NCM',
            ncm: ncm,
            data: null
        };
    }
}

// ===== CARREGAMENTO DA BASE DE DADOS =====

/**
 * Carrega a base de dados NCM do JSON fornecido
 * @param {Array} dadosNCM - Array com dados NCM do JSON
 */
function carregarBaseDadosNCM(dadosNCM) {
    try {
        if (!Array.isArray(dadosNCM)) {
            throw new Error('Dados NCM devem ser um array');
        }
        
        baseDadosNCM = dadosNCM;
        console.log(`✅ Base NCM carregada: ${baseDadosNCM.length} registros`);
        
        // Estatísticas da base
        const ncmsComII = baseDadosNCM.filter(item => item.II > 0).length;
        const ncmsComIPI = baseDadosNCM.filter(item => item.IPI > 0).length;
        
        console.log(`📊 Estatísticas da base:`);
        console.log(`   - NCMs com Imposto de Importação: ${ncmsComII}`);
        console.log(`   - NCMs com IPI: ${ncmsComIPI}`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao carregar base NCM:', error);
        baseDadosNCM = [];
        return false;
    }
}

/**
 * Carrega automaticamente a base NCM do arquivo JSON
 */
async function inicializarBaseNCM() {
    try {
        console.log('🔄 Carregando base NCM...');
        
        // Tentar carregar do arquivo csvjson.json
        const response = await fetch('./csvjson.json');
        if (!response.ok) {
            throw new Error(`Erro ao carregar JSON: ${response.status}`);
        }
        
        const dadosNCM = await response.json();
        const sucesso = carregarBaseDadosNCM(dadosNCM);
        
        if (sucesso) {
            console.log('✅ Base NCM inicializada com sucesso!');
            return true;
        } else {
            throw new Error('Falha ao processar dados NCM');
        }
        
    } catch (error) {
        console.error('❌ Erro ao inicializar base NCM:', error);
        
        // Fallback: tentar outros caminhos possíveis
        const caminhosPossiveis = [
            '/calculadora/csvjson.json',
            '../csvjson.json',
            '/csvjson.json'
        ];
        
        for (const caminho of caminhosPossiveis) {
            try {
                console.log(`🔄 Tentando carregar de: ${caminho}`);
                const response = await fetch(caminho);
                if (response.ok) {
                    const dadosNCM = await response.json();
                    const sucesso = carregarBaseDadosNCM(dadosNCM);
                    if (sucesso) {
                        console.log(`✅ Base NCM carregada de: ${caminho}`);
                        return true;
                    }
                }
            } catch (e) {
                // Continuar tentando
                console.log(`❌ Falhou: ${caminho}`);
            }
        }
        
        console.error('❌ Não foi possível carregar a base NCM de nenhum local');
        return false;
    }
}

// ===== FUNÇÕES UTILITÁRIAS =====

/**
 * Busca NCMs por descrição (autocomplete)
 * @param {string} termo - Termo de busca
 * @param {number} limite - Limite de resultados (padrão: 10)
 * @returns {Array} - Lista de NCMs encontrados
 */
function buscarNCMPorDescricao(termo, limite = 10) {
    if (!termo || termo.length < 3) {
        return [];
    }
    
    const termoLimpo = termo.toLowerCase().trim();
    
    return baseDadosNCM
        .filter(item => 
            item.DESCRIÇÃO && 
            item.DESCRIÇÃO.toLowerCase().includes(termoLimpo)
        )
        .slice(0, limite)
        .map(item => ({
            ncm: item.NCM,
            ncmFormatado: formatarNCM(item.NCM.toString()),
            descricao: item.DESCRIÇÃO,
            aliquotas: {
                ii: item.II,
                ipi: item.IPI,
                pis: item.PIS,
                cofins: item.COFINS
            }
        }));
}

/**
 * Obtém estatísticas da base de dados NCM
 * @returns {object} - Estatísticas da base
 */
function obterEstatisticasNCM() {
    if (baseDadosNCM.length === 0) {
        return null;
    }
    
    const totalNCMs = baseDadosNCM.length;
    const ncmsComII = baseDadosNCM.filter(item => item.II > 0).length;
    const ncmsComIPI = baseDadosNCM.filter(item => item.IPI > 0).length;
    const ncmsComPIS = baseDadosNCM.filter(item => item.PIS > 0).length;
    const ncmsComCOFINS = baseDadosNCM.filter(item => item.COFINS > 0).length;
    
    // Alíquotas médias
    const mediaII = baseDadosNCM.reduce((acc, item) => acc + (item.II || 0), 0) / totalNCMs;
    const mediaIPI = baseDadosNCM.reduce((acc, item) => acc + (item.IPI || 0), 0) / totalNCMs;
    
    return {
        total: totalNCMs,
        comImpostos: {
            ii: ncmsComII,
            ipi: ncmsComIPI,
            pis: ncmsComPIS,
            cofins: ncmsComCOFINS
        },
        aliquotasMedias: {
            ii: parseFloat(mediaII.toFixed(2)),
            ipi: parseFloat(mediaIPI.toFixed(2))
        }
    };
}

/**
 * Verifica se a base NCM está carregada
 * @returns {boolean} - True se carregada
 */
function baseNCMCarregada() {
    return baseDadosNCM.length > 0;
}

/**
 * Obtém NCM por código
 * @param {string|number} ncm - Código NCM
 * @returns {object|null} - Dados do NCM ou null se não encontrado
 */
function obterNCM(ncm) {
    const ncmNumero = parseInt(ncm.toString().replace(/\D/g, ''));
    return baseDadosNCM.find(item => item.NCM === ncmNumero) || null;
}

/**
 * Lista todos os NCMs (com paginação)
 * @param {number} pagina - Página a ser exibida (padrão: 1)
 * @param {number} itensPorPagina - Itens por página (padrão: 50)
 * @returns {object} - {dados: Array, total: number, pagina: number}
 */
function listarNCMs(pagina = 1, itensPorPagina = 50) {
    const inicio = (pagina - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    
    return {
        dados: baseDadosNCM.slice(inicio, fim).map(item => ({
            ncm: item.NCM,
            ncmFormatado: formatarNCM(item.NCM.toString()),
            descricao: item.DESCRIÇÃO,
            aliquotas: {
                ii: item.II,
                ipi: item.IPI,
                pis: item.PIS,
                cofins: item.COFINS
            }
        })),
        total: baseDadosNCM.length,
        pagina: pagina,
        totalPaginas: Math.ceil(baseDadosNCM.length / itensPorPagina)
    };
}

// ===== EXPORTAÇÃO E INICIALIZAÇÃO =====

// Criar namespace global
window.NCMService = {
    // Funções principais
    consultarNCM,
    validarNCM,
    formatarNCM,
    
    // Carregamento
    carregarBaseDadosNCM,
    inicializarBaseNCM,
    
    // Utilitárias
    buscarNCMPorDescricao,
    obterEstatisticasNCM,
    baseNCMCarregada,
    obterNCM,
    listarNCMs
};

// Inicializar automaticamente quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(inicializarBaseNCM, 100);
    });
} else {
    setTimeout(inicializarBaseNCM, 100);
}

// Exportação para Node.js (caso necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.NCMService;
}