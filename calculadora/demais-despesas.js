// ===== DEMAIS DESPESAS SERVICE =====
// Salvar como: calculadora/demais-despesas.js

console.log('🚛 Carregando serviço de Demais Despesas...');

/**
 * Calcula todas as demais despesas conforme fórmulas da planilha
 * @param {object} parametros - Parâmetros para cálculo
 * @returns {object} - Despesas calculadas
 */
function calcularDemaisDespesas(parametros) {
    const {
        valorAduaneiro,      // DETALHADO!AP19
        subtotalImpostos,    // DETALHADO!AP29 
        modalTransporte,     // D14 (Marítimo/Aéreo/Rodoviário)
        valorFreteUSD,       // D13 (frete em USD)
        taxaCambio          // D10 (taxa do dólar)
    } = parametros;
    
    console.log('🚛 Calculando Demais Despesas:');
    console.log(`   Valor Aduaneiro: R$ ${valorAduaneiro.toFixed(2)}`);
    console.log(`   Subtotal Impostos: R$ ${subtotalImpostos.toFixed(2)}`);
    console.log(`   Modal: ${modalTransporte}`);
    console.log(`   Frete USD: $${valorFreteUSD}`);
    console.log(`   Taxa: ${taxaCambio}`);
    
    // 1. SEGURO: =((DETALHADO!AP19+DETALHADO!AP29)/0,9)*0,7%
    const seguro = calcularSeguro(valorAduaneiro, subtotalImpostos);
    
    // 2. AFRMM: =SE(D14="Marítimo";((D13*D10)*8%);0)
    const afrmm = calcularAFRMM(modalTransporte, valorFreteUSD, taxaCambio);
    
    // 3. ARMAZENAGEM: =SE(D14="Marítimo";(DETALHADO!AP19*1,6%);(DETALHADO!AP19*0,105%))
    const armazenagem = calcularArmazenagemDemais(modalTransporte, valorAduaneiro);
    
    // 4. TCH: =SE(D14="Marítimo";20;0)
    const tch = calcularTCH(modalTransporte);
    
    // 5. HONORÁRIO DESPACHANTE: Valor fixo
    const honorarioDespachante = 1518.00;
    
    // 6. EXPEDIENTE: Valor fixo
    const expediente = 150.00;
    
    // 7. DESPESAS DESTINO: =SE(D14="Aéreo";1550;2300)
    const despesasDestino = calcularDespesasDestino(modalTransporte);
    
    // 8. TOTAL
    const total = seguro + afrmm + armazenagem + tch + honorarioDespachante + expediente + despesasDestino;
    
    const resultado = {
        seguro: parseFloat(seguro.toFixed(2)),
        afrmm: parseFloat(afrmm.toFixed(2)),
        armazenagem: parseFloat(armazenagem.toFixed(2)),
        tch: parseFloat(tch.toFixed(2)),
        honorarioDespachante: parseFloat(honorarioDespachante.toFixed(2)),
        expediente: parseFloat(expediente.toFixed(2)),
        despesasDestino: parseFloat(despesasDestino.toFixed(2)),
        total: parseFloat(total.toFixed(2))
    };
    
    console.log('📋 DEMAIS DESPESAS CALCULADAS:');
    console.log(`   Seguro: R$ ${resultado.seguro.toFixed(2)}`);
    console.log(`   AFRMM: R$ ${resultado.afrmm.toFixed(2)}`);
    console.log(`   Armazenagem: R$ ${resultado.armazenagem.toFixed(2)}`);
    console.log(`   TCH: R$ ${resultado.tch.toFixed(2)}`);
    console.log(`   Honorário Despachante: R$ ${resultado.honorarioDespachante.toFixed(2)}`);
    console.log(`   Expediente: R$ ${resultado.expediente.toFixed(2)}`);
    console.log(`   Despesas Destino: R$ ${resultado.despesasDestino.toFixed(2)}`);
    console.log(`   🎯 TOTAL: R$ ${resultado.total.toFixed(2)}`);
    
    return resultado;
}

/**
 * Calcula SEGURO: ((VA + Subtotal)/0,9) * 0,7%
 * @param {number} valorAduaneiro - Valor aduaneiro
 * @param {number} subtotalImpostos - Subtotal dos impostos
 * @returns {number} - Valor do seguro
 */
function calcularSeguro(valorAduaneiro, subtotalImpostos) {
    // Fórmula: ((DETALHADO!AP19+DETALHADO!AP29)/0,9)*0,7%
    const base = (valorAduaneiro + subtotalImpostos) / 0.9;
    const seguro = base * 0.007; // 0,7%
    
    console.log(`   🛡️ Seguro: ((${valorAduaneiro.toFixed(2)} + ${subtotalImpostos.toFixed(2)}) / 0.9) * 0.7% = R$ ${seguro.toFixed(2)}`);
    
    return seguro;
}

/**
 * Calcula AFRMM: Se Marítimo: (Frete USD × Taxa) × 8%
 * @param {string} modalTransporte - Modal de transporte
 * @param {number} valorFreteUSD - Valor do frete em USD
 * @param {number} taxaCambio - Taxa de câmbio
 * @returns {number} - Valor do AFRMM
 */
function calcularAFRMM(modalTransporte, valorFreteUSD, taxaCambio) {
    // Fórmula: =SE(D14="Marítimo";((D13*D10)*8%);0)
    if (modalTransporte.toUpperCase() === 'MARITIMO') {
        const freteReal = valorFreteUSD * taxaCambio;
        const afrmm = freteReal * 0.08; // 8%
        
        console.log(`   ⚓ AFRMM (Marítimo): ($${valorFreteUSD} × ${taxaCambio}) × 8% = R$ ${afrmm.toFixed(2)}`);
        
        return afrmm;
    }
    
    console.log(`   ⚓ AFRMM (${modalTransporte}): R$ 0,00`);
    return 0;
}

/**
 * Calcula ARMAZENAGEM baseada no modal
 * @param {string} modalTransporte - Modal de transporte
 * @param {number} valorAduaneiro - Valor aduaneiro
 * @returns {number} - Valor da armazenagem
 */
function calcularArmazenagemDemais(modalTransporte, valorAduaneiro) {
    // Fórmula: =SE(D14="Marítimo";(DETALHADO!AP19*1,6%);(DETALHADO!AP19*0,105%))
    let percentual;
    
    if (modalTransporte.toUpperCase() === 'MARITIMO') {
        percentual = 0.016; // 1,6%
    } else {
        percentual = 0.00105; // 0,105%
    }
    
    const armazenagem = valorAduaneiro * percentual;
    
    console.log(`   📦 Armazenagem (${modalTransporte}): R$ ${valorAduaneiro.toFixed(2)} × ${(percentual * 100).toFixed(3)}% = R$ ${armazenagem.toFixed(2)}`);
    
    return armazenagem;
}

/**
 * Calcula TCH: Se Marítimo: R$ 20,00
 * @param {string} modalTransporte - Modal de transporte
 * @returns {number} - Valor do TCH
 */
function calcularTCH(modalTransporte) {
    // Fórmula: =SE(D14="Marítimo";20;0)
    if (modalTransporte.toUpperCase() === 'MARITIMO') {
        console.log(`   🚢 TCH (Marítimo): R$ 20,00`);
        return 20.00;
    }
    
    console.log(`   🚢 TCH (${modalTransporte}): R$ 0,00`);
    return 0;
}

/**
 * Calcula DESPESAS DESTINO baseada no modal
 * @param {string} modalTransporte - Modal de transporte
 * @returns {number} - Valor das despesas de destino
 */
function calcularDespesasDestino(modalTransporte) {
    // Fórmula: =SE(D14="Aéreo";1550;2300)
    if (modalTransporte.toUpperCase() === 'AEREO') {
        console.log(`   ✈️ Despesas Destino (Aéreo): R$ 1.550,00`);
        return 1550.00;
    }
    
    console.log(`   🚛 Despesas Destino (${modalTransporte}): R$ 2.300,00`);
    return 2300.00;
}

/**
 * Integra demais despesas no cálculo principal
 * @param {object} resultadoSimulacao - Resultado da simulação existente
 * @param {object} parametrosDespesas - Parâmetros das despesas
 * @returns {object} - Resultado atualizado com despesas
 */
function integrarDemaisDespesasNaSimulacao(resultadoSimulacao, parametrosDespesas) {
    try {
        console.log('🔄 Integrando Demais Despesas na simulação...');
        
        // Calcular despesas
        const despesas = calcularDemaisDespesas(parametrosDespesas);
        
        // Atualizar cenários
        if (resultadoSimulacao.cenarios) {
            // Importação Direta
            if (resultadoSimulacao.cenarios.importacaoDireta) {
                resultadoSimulacao.cenarios.importacaoDireta.demaisDespesas = despesas;
                resultadoSimulacao.cenarios.importacaoDireta.custoTotal += despesas.total;
                resultadoSimulacao.cenarios.importacaoDireta.desembolsoTotal += despesas.total;
            }
            
            // Trading
            if (resultadoSimulacao.cenarios.trading) {
                resultadoSimulacao.cenarios.trading.demaisDespesas = despesas;
                resultadoSimulacao.cenarios.trading.custoTotal += despesas.total;
                resultadoSimulacao.cenarios.trading.desembolsoTotal += despesas.total;
            }
        }
        
        // Atualizar totais consolidados
        if (resultadoSimulacao.totaisConsolidados) {
            resultadoSimulacao.totaisConsolidados.demaisDespesas = despesas;
        }
        
        // Recalcular comparação
        if (resultadoSimulacao.cenarios && resultadoSimulacao.cenarios.importacaoDireta && resultadoSimulacao.cenarios.trading) {
            resultadoSimulacao.comparacao = calcularComparacaoComDespesas(
                resultadoSimulacao.cenarios.importacaoDireta,
                resultadoSimulacao.cenarios.trading
            );
        }
        
        console.log('✅ Demais Despesas integradas com sucesso!');
        
        return resultadoSimulacao;
        
    } catch (error) {
        console.error('❌ Erro ao integrar Demais Despesas:', error);
        return resultadoSimulacao;
    }
}

/**
 * Calcula comparação com despesas incluídas
 */
function calcularComparacaoComDespesas(cenario1, cenario2) {
    const economiaAbsoluta = cenario1.desembolsoTotal - cenario2.desembolsoTotal;
    const economiaPercentual = cenario1.desembolsoTotal > 0 ? 
        parseFloat(((economiaAbsoluta / cenario1.desembolsoTotal) * 100).toFixed(2)) : 0;
    
    return {
        economiaAbsoluta: parseFloat(economiaAbsoluta.toFixed(2)),
        economiaPercentual,
        melhorOpcao: economiaAbsoluta > 0 ? 'OVERSEAS_TRADING' : 'IMPORTACAO_DIRETA'
    };
}

/**
 * Preenche seção de Demais Despesas na interface
 * @param {object} despesas - Objeto com as despesas calculadas
 */
function preencherDemaisDespesasInterface(despesas) {
    try {
        // Encontrar a seção "Demais Despesas"
        const secaoDemaisDespesas = document.querySelector('.results-table:nth-child(2)'); // 2ª seção
        if (!secaoDemaisDespesas) {
            console.warn('Seção Demais Despesas não encontrada');
            return;
        }
        
        const tabela = secaoDemaisDespesas.querySelector('tbody');
        if (!tabela) return;
        
        const linhas = tabela.querySelectorAll('tr');
        
        linhas.forEach(linha => {
            const primeiraColuna = linha.querySelector('td:first-child');
            if (!primeiraColuna) return;
            
            const texto = primeiraColuna.textContent.trim();
            const colunaDirecto = linha.querySelector('td:nth-child(2)');
            const colunaTrading = linha.querySelector('td:nth-child(3)');
            
            if (!colunaDirecto || !colunaTrading) return;
            
            switch (true) {
                case texto.includes('Total') && !linha.classList.contains('total-row'):
                    colunaDirecto.textContent = formatarMoeda(despesas.total);
                    colunaTrading.textContent = formatarMoeda(despesas.total);
                    break;
                    
                case texto.includes('Total Nota Fiscal de Entrada') && linha.classList.contains('total-row'):
                    // Este será preenchido pela função principal
                    break;
            }
        });
        
        console.log('✅ Interface Demais Despesas preenchida!');
        
    } catch (error) {
        console.error('❌ Erro ao preencher Demais Despesas:', error);
    }
}

// Função auxiliar para formatação
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

// ===== APLICAR INTEGRAÇÃO =====

function aplicarDemaisDespesas() {
    if (window.CalculoService) {
        console.log('🚛 Aplicando serviço de Demais Despesas...');
        
        // Adicionar funções ao CalculoService
        window.CalculoService.calcularDemaisDespesas = calcularDemaisDespesas;
        window.CalculoService.integrarDemaisDespesasNaSimulacao = integrarDemaisDespesasNaSimulacao;
        window.CalculoService.preencherDemaisDespesasInterface = preencherDemaisDespesasInterface;
        
        // Adicionar funções auxiliares
        window.CalculoService.calcularSeguro = calcularSeguro;
        window.CalculoService.calcularAFRMM = calcularAFRMM;
        window.CalculoService.calcularArmazenagemDemais = calcularArmazenagemDemais;
        window.CalculoService.calcularTCH = calcularTCH;
        window.CalculoService.calcularDespesasDestino = calcularDespesasDestino;
        
        console.log('✅ Demais Despesas aplicadas ao CalculoService!');
    } else {
        console.log('⏳ Aguardando CalculoService para Demais Despesas...');
        setTimeout(aplicarDemaisDespesas, 500);
    }
}

// Aplicar quando carregar
aplicarDemaisDespesas();

console.log('🚛 Serviço de Demais Despesas carregado!');