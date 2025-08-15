// ===== CÁLCULO SERVICE - MOTOR TRIBUTÁRIO =====

// ===== CONSTANTES E CONFIGURAÇÕES =====
const CONFIGURACOES = {
    // Custos fixos
    SISCOMEX_BASE: 185.00,
    SISCOMEX_POR_ADICAO: 29.50,
    
    // AFRMM
    AFRMM_PERCENTUAL: 25.0, // 25% sobre frete marítimo
    
    // Seguro padrão
    SEGURO_PERCENTUAL: 0.7, // 0.7% sobre valor CIF
    
    // Armazenagem por modal
    ARMAZENAGEM: {
        MARITIMO: 1.6,   // 1.6% sobre valor aduaneiro
        AEREO: 0.105,    // 0.105% sobre valor aduaneiro
        RODOVIARIO: 0.5  // 0.5% sobre valor aduaneiro
    },
    
    // ICMS por estado (interestadual para SC)
    ICMS_INTERESTADUAL: 4.0, // 4% padrão interestadual
    
    // Margem trading
    MARGEM_TRADING: 0.0 // A definir conforme necessário
};

// ===== FUNÇÕES DE CÁLCULO BASE =====

/**
 * Converte valor em moeda estrangeira para Real
 * @param {number} valor - Valor em moeda estrangeira
 * @param {number} taxa - Taxa de câmbio (PTAX)
 * @returns {number} - Valor em Real
 */
function converterParaReal(valor, taxa) {
    return parseFloat((valor * taxa).toFixed(2));
}

/**
 * Calcula valor aduaneiro (CIF + despesas)
 * @param {number} valorCIF - Valor CIF em Real
 * @param {number} frete - Valor do frete em Real
 * @param {object} parametros - Parâmetros adicionais
 * @returns {object} - Breakdown do valor aduaneiro
 */
function calcularValorAduaneiro(valorCIF, frete, parametros = {}) {
    const { modalTransporte = 'MARITIMO' } = parametros;
    
    // AFRMM (apenas para marítimo)
    const afrmm = modalTransporte === 'MARITIMO' ? 
        parseFloat((frete * CONFIGURACOES.AFRMM_PERCENTUAL / 100).toFixed(2)) : 0;
    
    // Seguro
    const seguro = parseFloat((valorCIF * CONFIGURACOES.SEGURO_PERCENTUAL / 100).toFixed(2));
    
    // Valor aduaneiro = CIF + Frete + Seguro + AFRMM
    const valorAduaneiro = parseFloat((valorCIF + frete + seguro + afrmm).toFixed(2));
    
    return {
        valorCIF,
        frete,
        seguro,
        afrmm,
        valorAduaneiro,
        breakdown: {
            'Valor CIF': valorCIF,
            'Frete': frete,
            'Seguro': seguro,
            'AFRMM': afrmm,
            'Total (Valor Aduaneiro)': valorAduaneiro
        }
    };
}

/**
 * Calcula impostos seguindo a sequência correta
 * @param {object} dadosCalculo - Dados para cálculo
 * @returns {object} - Resultado completo dos impostos
 */
function calcularImpostos(dadosCalculo) {
    const {
        valorAduaneiro,
        aliquotas,
        estadoDestino = 'SC',
        modalTransporte = 'MARITIMO',
        quantidadeNCMs = 1
    } = dadosCalculo;
    
    // 1. IMPOSTO DE IMPORTAÇÃO (II)
    const ii = parseFloat((valorAduaneiro * aliquotas.ii / 100).toFixed(2));
    
    // 2. IPI - Base: Valor Aduaneiro + II
    const baseIPI = valorAduaneiro + ii;
    const ipi = parseFloat((baseIPI * aliquotas.ipi / 100).toFixed(2));
    
    // 3. SISCOMEX - Valor fixo
    const siscomex = CONFIGURACOES.SISCOMEX_BASE + (CONFIGURACOES.SISCOMEX_POR_ADICAO * quantidadeNCMs);
    
    // 4. PIS/COFINS - Base: VA + II + IPI + SISCOMEX
    const basePISCOFINS = valorAduaneiro + ii + ipi + siscomex;
    const pis = parseFloat((basePISCOFINS * aliquotas.pis / 100).toFixed(2));
    const cofins = parseFloat((basePISCOFINS * aliquotas.cofins / 100).toFixed(2));
    
    // 5. ICMS - Cálculo "por dentro"
    const icmsAliquota = obterAliquotaICMS(estadoDestino);
    const baseICMSAntes = valorAduaneiro + ii + ipi + pis + cofins;
    const baseICMS = parseFloat((baseICMSAntes / (1 - icmsAliquota / 100)).toFixed(2));
    const icms = parseFloat((baseICMS - baseICMSAntes).toFixed(2));
    
    // 6. Armazenagem
    const armazenagem = calcularArmazenagem(valorAduaneiro, modalTransporte);
    
    // 7. Totais
    const totalImpostos = ii + ipi + pis + cofins + icms + siscomex;
    const totalCustoImportacao = valorAduaneiro + totalImpostos + armazenagem;
    
    return {
        valorAduaneiro,
        impostos: {
            ii,
            ipi,
            pis,
            cofins,
            icms,
            siscomex
        },
        custosAdicionais: {
            armazenagem
        },
        bases: {
            ii: valorAduaneiro,
            ipi: baseIPI,
            pisCofinsSiscomex: basePISCOFINS,
            icms: baseICMS
        },
        aliquotas: {
            ...aliquotas,
            icms: icmsAliquota
        },
        totais: {
            impostos: totalImpostos,
            custosAdicionais: armazenagem,
            custoTotal: totalCustoImportacao
        },
        breakdown: {
            'Valor Aduaneiro': valorAduaneiro,
            'Imposto de Importação': ii,
            'IPI': ipi,
            'PIS': pis,
            'COFINS': cofins,
            'SISCOMEX': siscomex,
            'ICMS': icms,
            'Armazenagem': armazenagem,
            'Total dos Impostos': totalImpostos,
            'Custo Total da Importação': totalCustoImportacao
        }
    };
}

/**
 * Calcula créditos tributários conforme regime
 * @param {object} impostos - Impostos calculados
 * @param {string} regimeTributario - LUCRO_REAL, PRESUMIDO, SIMPLES_NACIONAL
 * @returns {object} - Créditos disponíveis
 */
function calcularCreditos(impostos, regimeTributario) {
    const creditos = {
        ii: 0,      // II nunca é creditado
        ipi: 0,
        pis: 0,
        cofins: 0,
        icms: 0,
        siscomex: 0, // SISCOMEX nunca é creditado
        total: 0
    };
    
    switch (regimeTributario.toUpperCase()) {
        case 'LUCRO_REAL':
            // Lucro Real: Credita PIS + COFINS + IPI + ICMS
            creditos.pis = impostos.pis;
            creditos.cofins = impostos.cofins;
            creditos.ipi = impostos.ipi;
            creditos.icms = impostos.icms;
            break;
            
        case 'PRESUMIDO':
            // Presumido: Credita apenas IPI + ICMS
            creditos.ipi = impostos.ipi;
            creditos.icms = impostos.icms;
            break;
            
        case 'SIMPLES_NACIONAL':
            // Simples: Não credita nada
            break;
            
        default:
            console.warn(`Regime tributário não reconhecido: ${regimeTributario}`);
            break;
    }
    
    // Calcular total de créditos
    creditos.total = creditos.ii + creditos.ipi + creditos.pis + creditos.cofins + creditos.icms + creditos.siscomex;
    
    return creditos;
}

/**
 * Calcula desembolso efetivo (impostos - créditos)
 * @param {object} impostos - Impostos calculados
 * @param {object} creditos - Créditos disponíveis
 * @returns {object} - Desembolso efetivo
 */
function calcularDesembolsoEfetivo(impostos, creditos) {
    const desembolso = {
        ii: impostos.ii - creditos.ii,
        ipi: impostos.ipi - creditos.ipi,
        pis: impostos.pis - creditos.pis,
        cofins: impostos.cofins - creditos.cofins,
        icms: impostos.icms - creditos.icms,
        siscomex: impostos.siscomex - creditos.siscomex,
        total: 0
    };
    
    desembolso.total = desembolso.ii + desembolso.ipi + desembolso.pis + 
                      desembolso.cofins + desembolso.icms + desembolso.siscomex;
    
    return desembolso;
}

// ===== FUNÇÕES AUXILIARES =====

/**
 * Obtém alíquota de ICMS por estado
 * @param {string} estado - Código do estado (UF)
 * @returns {number} - Alíquota de ICMS
 */
function obterAliquotaICMS(estado) {
    // Tabela simplificada - ICMS interestadual de SC para outros estados
    const tabelaICMS = {
        'AC': 4.0, 'AL': 4.0, 'AP': 4.0, 'AM': 4.0, 'BA': 4.0,
        'CE': 4.0, 'DF': 4.0, 'ES': 4.0, 'GO': 4.0, 'MA': 4.0,
        'MT': 4.0, 'MS': 4.0, 'MG': 4.0, 'PA': 4.0, 'PB': 4.0,
        'PR': 4.0, 'PE': 4.0, 'PI': 4.0, 'RJ': 4.0, 'RN': 4.0,
        'RS': 4.0, 'RO': 4.0, 'RR': 4.0, 'SC': 17.0, // Interno SC
        'SP': 4.0, 'SE': 4.0, 'TO': 4.0
    };
    
    return tabelaICMS[estado.toUpperCase()] || CONFIGURACOES.ICMS_INTERESTADUAL;
}

/**
 * Calcula custo de armazenagem por modal
 * @param {number} valorAduaneiro - Valor aduaneiro
 * @param {string} modal - Modal de transporte
 * @returns {number} - Custo de armazenagem
 */
function calcularArmazenagem(valorAduaneiro, modal) {
    const percentual = CONFIGURACOES.ARMAZENAGEM[modal.toUpperCase()] || 
                      CONFIGURACOES.ARMAZENAGEM.MARITIMO;
    
    return parseFloat((valorAduaneiro * percentual / 100).toFixed(2));
}

// ===== FUNÇÃO PRINCIPAL DE SIMULAÇÃO =====

/**
 * Executa simulação completa de importação
 * @param {object} parametros - Parâmetros da simulação
 * @returns {object} - Resultado completo da simulação
 */
function executarSimulacao(parametros) {
    try {
        const {
            // Dados básicos
            cliente,
            regimeTributario,
            moeda,
            taxaCambio,
            estadoDestino,
            modalTransporte,
            valorFrete,
            
            // NCMs
            ncms, // Array de objetos {ncm, valor, quantidade, aliquotas}
            
            // Flags
            calcularTrading = true
        } = parametros;
        
        // Validações básicas
        if (!ncms || !Array.isArray(ncms) || ncms.length === 0) {
            throw new Error('Pelo menos um NCM deve ser fornecido');
        }
        
        if (!taxaCambio || taxaCambio <= 0) {
            throw new Error('Taxa de câmbio deve ser maior que zero');
        }
        
        // Cálculos por NCM
        const calculosPorNCM = ncms.map(ncmData => {
            // Conversão para Real
            const valorReal = converterParaReal(ncmData.valor * ncmData.quantidade, taxaCambio);
            const freteReal = converterParaReal(valorFrete || 0, taxaCambio);
            
            // Valor aduaneiro
            const valAduaneiro = calcularValorAduaneiro(valorReal, freteReal, {
                modalTransporte
            });
            
            // Cálculo de impostos
            const impostos = calcularImpostos({
                valorAduaneiro: valAduaneiro.valorAduaneiro,
                aliquotas: ncmData.aliquotas,
                estadoDestino,
                modalTransporte,
                quantidadeNCMs: ncms.length
            });
            
            return {
                ncm: ncmData.ncm,
                valorOriginal: ncmData.valor,
                quantidade: ncmData.quantidade,
                valorReal,
                valAduaneiro,
                impostos,
                aliquotas: ncmData.aliquotas
            };
        });
        
        // Consolidação dos totais
        const totaisConsolidados = consolidarTotais(calculosPorNCM);
        
        // Cenário 1: Importação Direta
        const creditosImportacaoDireta = calcularCreditos(totaisConsolidados.impostos, regimeTributario);
        const desembolsoImportacaoDireta = calcularDesembolsoEfetivo(
            totaisConsolidados.impostos, 
            creditosImportacaoDireta
        );
        
        const cenarioImportacaoDireta = {
            tipo: 'IMPORTACAO_DIRETA',
            valorAduaneiro: totaisConsolidados.valorAduaneiro,
            impostos: totaisConsolidados.impostos,
            creditos: creditosImportacaoDireta,
            desembolso: desembolsoImportacaoDireta,
            custoTotal: totaisConsolidados.valorAduaneiro + totaisConsolidados.impostos.total + totaisConsolidados.custosAdicionais,
            desembolsoTotal: totaisConsolidados.valorAduaneiro + desembolsoImportacaoDireta.total + totaisConsolidados.custosAdicionais
        };
        
        // Cenário 2: Trading (Overseas CO3)
        let cenarioTrading = null;
        if (calcularTrading) {
            // No trading, o ICMS não é pago pelo cliente
            const impostosTrading = { ...totaisConsolidados.impostos };
            impostosTrading.icms = 0; // Cliente não paga ICMS
            impostosTrading.total = impostosTrading.ii + impostosTrading.ipi + 
                                   impostosTrading.pis + impostosTrading.cofins + impostosTrading.siscomex;
            
            const creditosTrading = calcularCreditos(impostosTrading, regimeTributario);
            const desembolsoTrading = calcularDesembolsoEfetivo(impostosTrading, creditosTrading);
            
            cenarioTrading = {
                tipo: 'OVERSEAS_TRADING',
                valorAduaneiro: totaisConsolidados.valorAduaneiro,
                impostos: impostosTrading,
                creditos: creditosTrading,
                desembolso: desembolsoTrading,
                custoTotal: totaisConsolidados.valorAduaneiro + impostosTrading.total + totaisConsolidados.custosAdicionais,
                desembolsoTotal: totaisConsolidados.valorAduaneiro + desembolsoTrading.total + totaisConsolidados.custosAdicionais,
                economiaICMS: totaisConsolidados.impostos.icms
            };
        }
        
        // Comparação e economia
        const comparacao = calcularComparacao(cenarioImportacaoDireta, cenarioTrading);
        
        return {
            parametros: {
                cliente,
                regimeTributario,
                moeda,
                taxaCambio,
                estadoDestino,
                modalTransporte,
                quantidadeNCMs: ncms.length
            },
            calculosPorNCM,
            totaisConsolidados,
            cenarios: {
                importacaoDireta: cenarioImportacaoDireta,
                trading: cenarioTrading
            },
            comparacao,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('Erro na simulação:', error);
        return {
            sucesso: false,
            erro: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// ===== FUNÇÕES DE CONSOLIDAÇÃO =====

/**
 * Consolida totais de múltiplos NCMs
 * @param {Array} calculosPorNCM - Array com cálculos individuais
 * @returns {object} - Totais consolidados
 */
function consolidarTotais(calculosPorNCM) {
    const totais = {
        valorAduaneiro: 0,
        impostos: {
            ii: 0, ipi: 0, pis: 0, cofins: 0, icms: 0, siscomex: 0, total: 0
        },
        custosAdicionais: 0
    };
    
    calculosPorNCM.forEach(calculo => {
        totais.valorAduaneiro += calculo.valAduaneiro.valorAduaneiro;
        totais.impostos.ii += calculo.impostos.impostos.ii;
        totais.impostos.ipi += calculo.impostos.impostos.ipi;
        totais.impostos.pis += calculo.impostos.impostos.pis;
        totais.impostos.cofins += calculo.impostos.impostos.cofins;
        totais.impostos.icms += calculo.impostos.impostos.icms;
        totais.impostos.siscomex += calculo.impostos.impostos.siscomex;
        totais.custosAdicionais += calculo.impostos.custosAdicionais.armazenagem;
    });
    
    // Arredondar totais
    Object.keys(totais.impostos).forEach(key => {
        if (key !== 'total') {
            totais.impostos[key] = parseFloat(totais.impostos[key].toFixed(2));
        }
    });
    
    totais.impostos.total = totais.impostos.ii + totais.impostos.ipi + totais.impostos.pis + 
                           totais.impostos.cofins + totais.impostos.icms + totais.impostos.siscomex;
    totais.valorAduaneiro = parseFloat(totais.valorAduaneiro.toFixed(2));
    totais.custosAdicionais = parseFloat(totais.custosAdicionais.toFixed(2));
    
    return totais;
}

/**
 * Calcula comparação entre cenários
 * @param {object} cenario1 - Cenário importação direta
 * @param {object} cenario2 - Cenário trading
 * @returns {object} - Comparação e economia
 */
function calcularComparacao(cenario1, cenario2) {
    if (!cenario2) {
        return {
            economiaAbsoluta: 0,
            economiaPercentual: 0,
            melhorOpcao: 'IMPORTACAO_DIRETA'
        };
    }
    
    const economiaAbsoluta = cenario1.desembolsoTotal - cenario2.desembolsoTotal;
    const economiaPercentual = cenario1.desembolsoTotal > 0 ? 
        parseFloat(((economiaAbsoluta / cenario1.desembolsoTotal) * 100).toFixed(2)) : 0;
    
    return {
        economiaAbsoluta: parseFloat(economiaAbsoluta.toFixed(2)),
        economiaPercentual,
        melhorOpcao: economiaAbsoluta > 0 ? 'OVERSEAS_TRADING' : 'IMPORTACAO_DIRETA'
    };
}

// ===== EXPORTAÇÃO =====
window.CalculoService = {
    // Funções principais
    executarSimulacao,
    calcularImpostos,
    calcularCreditos,
    calcularDesembolsoEfetivo,
    
    // Funções auxiliares
    converterParaReal,
    calcularValorAduaneiro,
    obterAliquotaICMS,
    calcularArmazenagem,
    
    // Utilitárias
    consolidarTotais,
    calcularComparacao,
    
    // Configurações
    CONFIGURACOES
};

console.log('🧮 Cálculo Service - Motor Tributário carregado!');