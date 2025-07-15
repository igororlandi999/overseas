/**
 * Gerenciamento da Interface do Usuário
 * Manipulação de elementos DOM, exibição de resultados, notificações
 */

import { FormatUtils, LogUtils } from './utils.js';

/**
 * Classe para gerenciar notificações
 */
export class NotificationManager {
    /**
     * Exibir notificação
     * @param {string} message - Mensagem
     * @param {string} type - Tipo (success, error, info)
     * @param {number} duration - Duração em ms
     */
    static show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;

        document.body.appendChild(notification);

        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, duration);
        }

        LogUtils.info(`Notificação exibida: ${type}`, message);
    }

    /**
     * Notificação de sucesso
     * @param {string} message - Mensagem
     */
    static success(message) {
        this.show(message, 'success');
    }

    /**
     * Notificação de erro
     * @param {string} message - Mensagem
     */
    static error(message) {
        this.show(message, 'error');
    }

    /**
     * Notificação de informação
     * @param {string} message - Mensagem
     */
    static info(message) {
        this.show(message, 'info');
    }
}

/**
 * Classe para gerenciar a interface geral
 */
export class UIManager {
    /**
     * Exibir mensagem de erro no formulário
     * @param {string} message - Mensagem de erro
     */
    static showError(message) {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 8000);
        }
        
        LogUtils.error('Erro exibido na UI:', message);
    }

    /**
     * Ocultar mensagem de erro
     */
    static hideError() {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    /**
     * Definir estado de loading do botão de cálculo
     * @param {boolean} loading - Se está carregando
     */
    static setLoadingState(loading) {
        const btn = document.getElementById('calculateBtn');
        if (!btn) return;

        btn.disabled = loading;
        
        if (loading) {
            btn.textContent = '⏳ Calculando...';
            btn.classList.add('loading');
        } else {
            btn.textContent = '🧮 Calcular Simulação';
            btn.classList.remove('loading');
        }
    }

    /**
     * Exibir seção de resultados
     */
    static showResults() {
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.style.display = 'block';
            resultsSection.classList.add('fade-in');
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Ocultar seção de resultados
     */
    static hideResults() {
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.style.display = 'none';
        }
    }
}

/**
 * Classe para exibir resultados dos cálculos
 */
export class ResultsManager {
    /**
     * Exibir todos os resultados
     * @param {object} resultado - Resultado dos cálculos
     * @param {object} formData - Dados do formulário
     * @param {object} calculadoraInstance - Instância da calculadora
     */
    static display(resultado, formData, calculadoraInstance) {
        this.displayComparisonTable(resultado, calculadoraInstance);
        this.displayEconomy(resultado, calculadoraInstance);
        this.displayTributosDetails(resultado, calculadoraInstance);
        this.displayOperationDetails(formData, resultado);
        this.displayCustosDetails(resultado, calculadoraInstance);
        this.displayNCMsDetails(resultado, formData, calculadoraInstance);
        
        LogUtils.success('Resultados exibidos na interface');
    }

    /**
     * Exibir tabela de comparação
     * @param {object} resultado - Resultado dos cálculos
     * @param {object} calculadoraInstance - Instância da calculadora
     */
    static displayComparisonTable(resultado, calculadoraInstance) {
        const tableBody = document.getElementById('comparisonTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = `
            <tr>
                <td class="item-name"><strong>Valor Aduaneiro</strong></td>
                <td>${calculadoraInstance.formatarMoeda(resultado.valorAduaneiro.total)}</td>
                <td>${calculadoraInstance.formatarMoeda(resultado.valorAduaneiro.total)}</td>
            </tr>
            <tr>
                <td class="item-name">Imposto de Importação</td>
                <td>${calculadoraInstance.formatarMoeda(resultado.tributos.ii)}</td>
                <td>${calculadoraInstance.formatarMoeda(resultado.tributos.ii)}</td>
            </tr>
            <tr>
                <td class="item-name">IPI</td>
                <td>${calculadoraInstance.formatarMoeda(resultado.tributos.ipi)}</td>
                <td>${calculadoraInstance.formatarMoeda(resultado.tributos.ipi)}</td>
            </tr>
            <tr>
                <td class="item-name">PIS</td>
                <td>${calculadoraInstance.formatarMoeda(resultado.tributos.pis)}</td>
                <td>${calculadoraInstance.formatarMoeda(resultado.tributos.pis)}</td>
            </tr>
            <tr>
                <td class="item-name">COFINS</td>
                <td>${calculadoraInstance.formatarMoeda(resultado.tributos.cofins)}</td>
                <td>${calculadoraInstance.formatarMoeda(resultado.tributos.cofins)}</td>
            </tr>
            <tr>
                <td class="item-name">SISCOMEX</td>
                <td>${calculadoraInstance.formatarMoeda(resultado.tributos.siscomex)}</td>
                <td>${calculadoraInstance.formatarMoeda(resultado.tributos.siscomex)}</td>
            </tr>
            <tr>
                <td class="item-name">ICMS</td>
                <td>${calculadoraInstance.formatarMoeda(resultado.icms.direta)}</td>
                <td>${calculadoraInstance.formatarMoeda(resultado.icms.overseas)}</td>
            </tr>
            <tr style="background: rgba(0, 240, 255, 0.1);">
                <td class="item-name"><strong>Total do Custo da Importação</strong></td>
                <td><strong>${calculadoraInstance.formatarMoeda(resultado.totais.importacaoDireta)}</strong></td>
                <td><strong>${calculadoraInstance.formatarMoeda(resultado.totais.overseasCO3)}</strong></td>
            </tr>
            <tr style="background: rgba(57, 255, 20, 0.1);">
                <td class="item-name"><strong>Total do Desembolso</strong></td>
                <td><strong>${calculadoraInstance.formatarMoeda(resultado.totais.importacaoDireta)}</strong></td>
                <td><strong>${calculadoraInstance.formatarMoeda(resultado.totais.overseasCO3)}</strong></td>
            </tr>
        `;
    }

    /**
     * Exibir dados de economia
     * @param {object} resultado - Resultado dos cálculos
     * @param {object} calculadoraInstance - Instância da calculadora
     */
    static displayEconomy(resultado, calculadoraInstance) {
        const percentualElement = document.getElementById('percentualEconomia');
        const valorElement = document.getElementById('valorEconomia');

        if (percentualElement) {
            percentualElement.textContent = `${resultado.economia.percentual.toFixed(2)}%`;
        }

        if (valorElement) {
            valorElement.textContent = calculadoraInstance.formatarMoeda(resultado.economia.valor);
        }
    }

    /**
     * Exibir detalhes dos tributos
     * @param {object} resultado - Resultado dos cálculos
     * @param {object} calculadoraInstance - Instância da calculadora
     */
    static displayTributosDetails(resultado, calculadoraInstance) {
        const detailsElement = document.getElementById('tributosDetails');
        if (!detailsElement) return;

        const totalTributos = resultado.tributos.ii + resultado.tributos.ipi + 
                            resultado.tributos.pis + resultado.tributos.cofins + 
                            resultado.tributos.siscomex;

        detailsElement.innerHTML = `
            <div class="detail-item">
                <span>Imposto de Importação:</span>
                <span>${calculadoraInstance.formatarMoeda(resultado.tributos.ii)}</span>
            </div>
            <div class="detail-item">
                <span>IPI:</span>
                <span>${calculadoraInstance.formatarMoeda(resultado.tributos.ipi)}</span>
            </div>
            <div class="detail-item">
                <span>PIS:</span>
                <span>${calculadoraInstance.formatarMoeda(resultado.tributos.pis)}</span>
            </div>
            <div class="detail-item">
                <span>COFINS:</span>
                <span>${calculadoraInstance.formatarMoeda(resultado.tributos.cofins)}</span>
            </div>
            <div class="detail-item">
                <span>SISCOMEX:</span>
                <span>${calculadoraInstance.formatarMoeda(resultado.tributos.siscomex)}</span>
            </div>
            <div class="detail-item" style="border-top: 2px solid var(--primary-color); margin-top: 1rem; padding-top: 1rem;">
                <span><strong>Total Tributos Federais:</strong></span>
                <span><strong>${calculadoraInstance.formatarMoeda(totalTributos)}</strong></span>
            </div>
        `;
    }

    /**
     * Exibir detalhes da operação
     * @param {object} formData - Dados do formulário
     * @param {object} resultado - Resultado dos cálculos
     */
    static displayOperationDetails(formData, resultado) {
        const detailsElement = document.getElementById('operationDetails');
        if (!detailsElement) return;

        detailsElement.innerHTML = `
            <div class="detail-item">
                <span>Cliente:</span>
                <span>${formData.cliente}</span>
            </div>
            <div class="detail-item">
                <span>Regime Tributário:</span>
                <span>${formData.regimeTributario}</span>
            </div>
            <div class="detail-item">
                <span>Modal de Transporte:</span>
                <span>${formData.modalImportacao}</span>
            </div>
            <div class="detail-item">
                <span>Estado de Destino:</span>
                <span>${formData.estado}</span>
            </div>
            <div class="detail-item">
                <span>Taxa ${formData.moeda}:</span>
                <span>R$ ${formData.taxaMoeda.toFixed(4)}</span>
            </div>
            <div class="detail-item">
                <span>Total de NCMs:</span>
                <span>${resultado.detalhes.totalNCMs}</span>
            </div>
            <div class="detail-item">
                <span>Peso Total:</span>
                <span>${resultado.detalhes.pesoTotal.toFixed(2)} ${formData.unidade}</span>
            </div>
            <div class="detail-item">
                <span>Valor da Mercadoria:</span>
                <span>US$ ${FormatUtils.formatarNumero(resultado.detalhes.valorTotalMercadoria)}</span>
            </div>
        `;
    }

    /**
     * Exibir detalhes dos custos
     * @param {object} resultado - Resultado dos cálculos
     * @param {object} calculadoraInstance - Instância da calculadora
     */
    static displayCustosDetails(resultado, calculadoraInstance) {
        const detailsElement = document.getElementById('custosDetails');
        if (!detailsElement) return;

        const totalCustos = resultado.valorAduaneiro.seguro + resultado.custos.afrmm + 
                          resultado.custos.armazenagem + resultado.custos.tch + 
                          resultado.custos.honorarioDespachante + resultado.custos.expediente + 
                          resultado.custos.despesasDestino;

        detailsElement.innerHTML = `
            <div class="detail-item">
                <span>Seguro:</span>
                <span>${calculadoraInstance.formatarMoeda(resultado.valorAduaneiro.seguro)}</span>
            </div>
            <div class="detail-item">
                <span>AFRMM:</span>
                <span>${calculadoraInstance.formatarMoeda(resultado.custos.afrmm)}</span>
            </div>
            <div class="detail-item">
                <span>Armazenagem:</span>
                <span>${calculadoraInstance.formatarMoeda(resultado.custos.armazenagem)}</span>
            </div>
            <div class="detail-item">
                <span>TCH:</span>
                <span>${calculadoraInstance.formatarMoeda(resultado.custos.tch)}</span>
            </div>
            <div class="detail-item">
                <span>Honorários:</span>
                <span>${calculadoraInstance.formatarMoeda(resultado.custos.honorarioDespachante)}</span>
            </div>
            <div class="detail-item">
                <span>Expediente:</span>
                <span>${calculadoraInstance.formatarMoeda(resultado.custos.expediente)}</span>
            </div>
            <div class="detail-item">
                <span>Despesas Destino:</span>
                <span>${calculadoraInstance.formatarMoeda(resultado.custos.despesasDestino)}</span>
            </div>
            <div class="detail-item">
                <span>Taxa Trading Overseas:</span>
                <span>${calculadoraInstance.formatarMoeda(resultado.custos.taxaTrading)}</span>
            </div>
            <div class="detail-item" style="border-top: 2px solid var(--primary-color); margin-top: 1rem; padding-top: 1rem;">
                <span><strong>Total Custos Operacionais:</strong></span>
                <span><strong>${calculadoraInstance.formatarMoeda(totalCustos)}</strong></span>
            </div>
        `;
    }

    /**
     * Exibir detalhes dos NCMs
     * @param {object} resultado - Resultado dos cálculos
     * @param {object} formData - Dados do formulário
     * @param {object} calculadoraInstance - Instância da calculadora
     */
    static displayNCMsDetails(resultado, formData, calculadoraInstance) {
        const detailsElement = document.getElementById('ncmsDetails');
        if (!detailsElement) return;

        let ncmsHtml = '';
        
        if (resultado.tributos.ncmsDetalhes && resultado.tributos.ncmsDetalhes.length > 0) {
            resultado.tributos.ncmsDetalhes.forEach((ncm, index) => {
                ncmsHtml += `
                    <div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px; border-left: 4px solid var(--primary-color);">
                        <div style="font-weight: bold; color: var(--primary-color); margin-bottom: 0.5rem; font-size: 1.1rem;">
                            📦 NCM ${ncm.ncm}
                        </div>
                        <div style="color: var(--text-secondary); margin-bottom: 1rem; font-style: italic;">
                            ${ncm.descricao}
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                            <div class="detail-item">
                                <span>Valor da Mercadoria:</span>
                                <span style="color: var(--primary-color); font-weight: bold;">US$ ${FormatUtils.formatarNumero(ncm.valor)}</span>
                            </div>
                            <div class="detail-item">
                                <span>Quantidade:</span>
                                <span>${FormatUtils.formatarNumero(ncm.quantidade, 3)} ${formData.unidade}</span>
                            </div>
                        </div>

                        <div style="background: rgba(0, 0, 0, 0.2); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                            <div style="font-weight: bold; margin-bottom: 0.5rem; color: var(--warning-color);">
                                📊 Alíquotas Aplicadas:
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; font-size: 0.9rem;">
                                <div>II: <strong>${FormatUtils.formatarPercentual(ncm.aliquotas.ii)}</strong></div>
                                <div>IPI: <strong>${FormatUtils.formatarPercentual(ncm.aliquotas.ipi)}</strong></div>
                                <div>PIS: <strong>${FormatUtils.formatarPercentual(ncm.aliquotas.pis)}</strong></div>
                                <div>COFINS: <strong>${FormatUtils.formatarPercentual(ncm.aliquotas.cofins)}</strong></div>
                            </div>
                        </div>

                        <div style="background: rgba(0, 240, 255, 0.1); padding: 1rem; border-radius: 8px;">
                            <div style="font-weight: bold; margin-bottom: 0.5rem; color: var(--primary-color);">
                                💰 Tributos Calculados:
                            </div>
                            <div class="detail-item">
                                <span>Imposto de Importação (${FormatUtils.formatarPercentual(ncm.aliquotas.ii)}):</span>
                                <span>${calculadoraInstance.formatarMoeda(ncm.tributos.ii)}</span>
                            </div>
                            <div class="detail-item">
                                <span>IPI (${FormatUtils.formatarPercentual(ncm.aliquotas.ipi)}):</span>
                                <span>${calculadoraInstance.formatarMoeda(ncm.tributos.ipi)}</span>
                            </div>
                            <div class="detail-item">
                                <span>PIS (${FormatUtils.formatarPercentual(ncm.aliquotas.pis)}):</span>
                                <span>${calculadoraInstance.formatarMoeda(ncm.tributos.pis)}</span>
                            </div>
                            <div class="detail-item">
                                <span>COFINS (${FormatUtils.formatarPercentual(ncm.aliquotas.cofins)}):</span>
                                <span>${calculadoraInstance.formatarMoeda(ncm.tributos.cofins)}</span>
                            </div>
                            <div class="detail-item" style="border-top: 2px solid var(--primary-color); margin-top: 0.5rem; padding-top: 0.5rem; font-size: 1.1rem;">
                                <span><strong>💎 Total do NCM:</strong></span>
                                <span style="color: var(--success-color);"><strong>${calculadoraInstance.formatarMoeda(ncm.total)}</strong></span>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        if (ncmsHtml === '') {
            ncmsHtml = '<div style="text-align: center; color: var(--text-secondary); padding: 2rem;">Nenhum NCM foi processado</div>';
        }

        detailsElement.innerHTML = ncmsHtml;
    }
}

/**
 * Classe para gerenciar contato e WhatsApp
 */
export class ContactManager {
    /**
     * Abrir WhatsApp com mensagem pré-definida
     */
    static openWhatsApp() {
        const message = `Olá! Realizei uma simulação na Calculadora de Importação Overseas Trading e gostaria de uma consultoria especializada.

📋 Interesse em conhecer mais sobre:
• Regime CO3 (Conta e Ordem de Terceiros)
• Economia em ICMS
• Assessoria completa em importação
• Análise detalhada da minha operação

Aguardo contato para mais informações!`;
        
        const whatsappUrl = `https://wa.me/554832049798?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        LogUtils.info('WhatsApp aberto para contato');
    }
}

/**
 * Classe para gerenciar exportações
 */
export class ExportManager {
    /**
     * Exportar resultados para PDF/impressão
     * @param {object} resultado - Resultado dos cálculos
     * @param {object} formData - Dados do formulário
     */
    static exportToPDF(resultado, formData) {
        // Preparar dados para impressão
        const printData = this.preparePrintData(resultado, formData);
        
        // Abrir janela de impressão
        const printWindow = window.open('', '_blank');
        printWindow.document.write(this.generatePrintHTML(printData));
        printWindow.document.close();
        printWindow.print();
        
        LogUtils.success('Relatório exportado para impressão');
    }

    /**
     * Preparar dados para impressão
     * @param {object} resultado - Resultado dos cálculos
     * @param {object} formData - Dados do formulário
     * @returns {object} Dados preparados
     */
    static preparePrintData(resultado, formData) {
        return {
            cliente: formData.cliente,
            data: FormatUtils.formatarData(),
            valorAduaneiro: resultado.valorAduaneiro.total,
            tributos: resultado.tributos,
            economia: resultado.economia,
            ncms: resultado.tributos.ncmsDetalhes || []
        };
    }

    /**
     * Gerar HTML para impressão
     * @param {object} data - Dados preparados
     * @returns {string} HTML formatado
     */
    static generatePrintHTML(data) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Simulação de Importação - ${data.cliente}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 40px; 
                    color: #333;
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 30px; 
                    border-bottom: 2px solid #0066cc;
                    padding-bottom: 20px;
                }
                .section { 
                    margin: 20px 0; 
                    page-break-inside: avoid;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 20px 0; 
                }
                th, td { 
                    border: 1px solid #ddd; 
                    padding: 8px; 
                    text-align: left; 
                }
                th { 
                    background-color: #f2f2f2; 
                    font-weight: bold;
                }
                .highlight { 
                    background-color: #e8f5e8; 
                    font-weight: bold; 
                }
                .footer {
                    margin-top: 40px; 
                    font-size: 12px; 
                    color: #666;
                    text-align: center;
                    border-top: 1px solid #ddd;
                    padding-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🧮 Simulação de Importação</h1>
                <h2>Overseas Trading</h2>
                <p><strong>Cliente:</strong> ${data.cliente} | <strong>Data:</strong> ${data.data}</p>
            </div>
            
            <div class="section">
                <h3>💰 Resumo da Economia</h3>
                <p><strong>Economia Total:</strong> ${FormatUtils.formatarMoeda(data.economia.valor)} (${FormatUtils.formatarPercentual(data.economia.percentual)})</p>
                <p><strong>Valor Aduaneiro:</strong> ${FormatUtils.formatarMoeda(data.valorAduaneiro)}</p>
            </div>
            
            <div class="section">
                <h3>🏷️ NCMs Calculados</h3>
                <table>
                    <tr>
                        <th>NCM</th>
                        <th>Descrição</th>
                        <th>Valor (USD)</th>
                        <th>II (%)</th>
                        <th>IPI (%)</th>
                        <th>Total Tributos</th>
                    </tr>
                    ${data.ncms.map(ncm => `
                        <tr>
                            <td>${ncm.ncm}</td>
                            <td>${ncm.descricao}</td>
                            <td>${FormatUtils.formatarNumero(ncm.valor)}</td>
                            <td>${FormatUtils.formatarPercentual(ncm.aliquotas.ii)}</td>
                            <td>${FormatUtils.formatarPercentual(ncm.aliquotas.ipi)}</td>
                            <td class="highlight">${FormatUtils.formatarMoeda(ncm.total)}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
            
            <div class="footer">
                <p>Documento gerado automaticamente pela Calculadora de Importação Overseas Trading</p>
                <p>Data de geração: ${data.data}</p>
            </div>
        </body>
        </html>
        `;
    }
}