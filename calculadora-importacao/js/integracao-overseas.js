/**
 * Integração Overseas com App.js Existente
 * Extensão do ResultsManager para usar a nova estrutura da planilha
 */

import { CalculadoraImportacao, OverseasResultsManager, ImportacaoValidator } from './calculadora.js';
import { LogUtils } from './utils.js';

/**
 * Extensão do ResultsManager existente
 */
class ResultsManagerExtended {
    /**
     * Substituir o método display original para usar a nova estrutura
     */
    static display(resultado, formData, calculadora) {
        // Verificar se é o resultado novo (com estrutura da planilha)
        if (resultado.impostosContribuicoes && resultado.totaisFinais) {
            // Usar o novo renderizador
            OverseasResultsManager.display(resultado, formData, calculadora);
        } else {
            // Fallback para estrutura antiga (se necessário)
            this.displayLegacy(resultado, formData, calculadora);
        }
    }

    /**
     * Manter compatibilidade com estrutura antiga
     */
    static displayLegacy(resultado, formData, calculadora) {
        const resultsSection = document.getElementById('resultsSection');
        if (!resultsSection) return;

        // Implementar renderização de compatibilidade se necessário
        resultsSection.innerHTML = `
            <div class="result-card">
                <h3>⚠️ Estrutura de Resultado Não Suportada</h3>
                <p>O resultado não está na estrutura esperada da planilha Overseas.</p>
                <pre>${JSON.stringify(resultado, null, 2)}</pre>
            </div>
        `;
    }
}

/**
 * Extensão do FormManager para melhor compatibilidade
 */
class FormManagerExtended {
    /**
     * Coletar dados do formulário com validação aprimorada
     */
    static collectData() {
        const formElements = {
            cliente: document.getElementById('cliente'),
            regimeTributario: document.getElementById('regimeTributario'),
            unidade: document.getElementById('unidade'),
            moeda: document.getElementById('moeda'),
            taxaMoeda: document.getElementById('taxaMoeda'),
            destino: document.getElementById('destino'),
            mudaNcm: document.getElementById('mudaNcm'),
            valorFrete: document.getElementById('valorFrete'),
            modalImportacao: document.getElementById('modalImportacao'),
            estado: document.getElementById('estado')
        };

        // Verificar elementos obrigatórios
        for (const [key, element] of Object.entries(formElements)) {
            if (!element) {
                LogUtils.warn(`Elemento do formulário não encontrado: ${key}`);
            }
        }

        // Coletar dados básicos
        const dados = {
            cliente: formElements.cliente?.value || 'Cliente Teste',
            regimeTributario: formElements.regimeTributario?.value || 'SIMPLES NACIONAL',
            unidade: formElements.unidade?.value || 'Quilograma',
            moeda: formElements.moeda?.value || 'DOLAR',
            taxaMoeda: parseFloat(formElements.taxaMoeda?.value) || 5.50,
            destino: formElements.destino?.value || 'INDUSTRIALIZAÇÃO',
            mudaNcm: formElements.mudaNcm?.value || 'SIM',
            valorFrete: parseFloat(formElements.valorFrete?.value) || 0,
            modalImportacao: formElements.modalImportacao?.value || 'Marítimo',
            estado: formElements.estado?.value || 'SC',
            ncms: []
        };

        // Coletar NCMs usando o método existente ou fallback
        try {
            if (window.NCMManager && typeof window.NCMManager.collectData === 'function') {
                dados.ncms = window.NCMManager.collectData();
            } else {
                // Fallback: coletar NCMs manualmente
                dados.ncms = this.collectNCMsManually();
            }
        } catch (error) {
            LogUtils.warn('Erro ao coletar NCMs, usando fallback:', error);
            dados.ncms = this.collectNCMsManually();
        }

        return dados;
    }

    /**
     * Coletar NCMs manualmente se NCMManager não estiver disponível
     */
    static collectNCMsManually() {
        const ncms = [];
        const ncmRows = document.querySelectorAll('.ncm-item, .ncm-row');
        
        ncmRows.forEach(row => {
            const ncmInput = row.querySelector('input[placeholder*="NCM"], .ncm-input, input[name*="ncm"]');
            const valorInput = row.querySelector('input[placeholder*="Valor"], .valor-input, input[name*="valor"]');
            const quantidadeInput = row.querySelector('input[placeholder*="Quantidade"], .quantidade-input, input[name*="quantidade"]');
            
            if (ncmInput && valorInput && quantidadeInput) {
                const ncm = ncmInput.value?.trim();
                const valor = parseFloat(valorInput.value) || 0;
                const quantidade = parseFloat(quantidadeInput.value) || 0;
                
                if (ncm && valor > 0 && quantidade > 0) {
                    ncms.push({ ncm, valor, quantidade });
                }
            }
        });

        // Se não encontrou NCMs, adicionar um padrão para teste
        if (ncms.length === 0) {
            LogUtils.warn('Nenhum NCM encontrado, usando NCM padrão para teste');
            ncms.push({ ncm: '84089010', valor: 5000, quantidade: 100 });
        }

        return ncms;
    }
}

/**
 * Substituir o AppController existente com versão estendida
 */
class AppControllerExtended {
    constructor() {
        this.calculadora = new CalculadoraImportacao();
        this.isReady = false;
        this.autoSaveTimeout = null;
    }

    /**
     * Manipular cálculo da simulação com nova estrutura
     */
    async handleCalculation(e) {
        e.preventDefault();
        
        try {
            // Usar UIManager existente se disponível
            if (window.UIManager) {
                window.UIManager.setLoadingState(true);
                window.UIManager.hideError();
            }
            
            // Coletar e validar dados
            const formData = FormManagerExtended.collectData();
            ImportacaoValidator.validate(formData);
            
            LogUtils.info('Iniciando cálculo com dados:', formData);
            
            // Realizar cálculos com nova estrutura
            const resultado = await this.calculadora.calcular(formData);
            
            // Salvar dados se StorageManager disponível
            if (window.StorageManager) {
                window.StorageManager.saveFormData(formData);
            }
            
            // Armazenar resultado globalmente
            this.storeCalculationResult(resultado, formData);
            
            // Exibir resultados com nova estrutura
            ResultsManagerExtended.display(resultado, formData, this.calculadora);
            
            // Mostrar seção de resultados
            if (window.UIManager) {
                window.UIManager.showResults();
            } else {
                const resultsSection = document.getElementById('resultsSection');
                if (resultsSection) {
                    resultsSection.style.display = 'block';
                    resultsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            // Notificação de sucesso
            if (window.NotificationManager) {
                window.NotificationManager.success('Cálculo realizado com sucesso!');
            }
            
            LogUtils.success('Cálculo realizado com sucesso:', resultado);
            
        } catch (error) {
            // Tratamento de erro
            if (window.UIManager) {
                window.UIManager.showError(error.message);
            }
            
            if (window.NotificationManager) {
                window.NotificationManager.error(`Erro no cálculo: ${error.message}`);
            }
            
            LogUtils.error('Erro no cálculo:', error);
        } finally {
            if (window.UIManager) {
                window.UIManager.setLoadingState(false);
            }
        }
    }

    /**
     * Armazenar resultado do cálculo
     */
    storeCalculationResult(resultado, formData) {
        window.lastCalculationResult = resultado;
        window.lastFormData = formData;
    }

    /**
     * Inicializar com compatibilidade
     */
    async init() {
        try {
            LogUtils.info('Inicializando versão estendida da aplicação...');
            
            // Verificar se NCMLoader está disponível
            if (window.NCMLoader) {
                await window.NCMLoader.loadDatabase();
            }
            
            // Configurar event listeners
            this.setupEventListeners();
            
            this.isReady = true;
            LogUtils.success('Aplicação estendida inicializada com sucesso!');
            
        } catch (error) {
            LogUtils.error('Erro na inicialização estendida:', error);
            // Continuar mesmo com erro
            this.setupEventListeners();
            this.isReady = true;
        }
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        const form = document.getElementById('calculatorForm');
        if (form) {
            // Remover listeners antigos
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);
            
            // Adicionar novo listener
            newForm.addEventListener('submit', this.handleCalculation.bind(this));
        }

        LogUtils.success('Event listeners estendidos configurados');
    }
}

/**
 * Função para integrar com app.js existente
 */
function integrarOverseasExtension() {
    // Verificar se o app original existe
    if (window.calculadoraApp) {
        LogUtils.info('App original detectado, estendendo funcionalidade...');
        
        // Substituir métodos específicos
        if (window.calculadoraApp.handleCalculation) {
            const appExtended = new AppControllerExtended();
            window.calculadoraApp.handleCalculation = appExtended.handleCalculation.bind(appExtended);
            window.calculadoraApp.calculadora = appExtended.calculadora;
        }
        
        // Estender ResultsManager se existir
        if (window.ResultsManager) {
            window.ResultsManager.display = ResultsManagerExtended.display;
        }
        
        LogUtils.success('Extensão Overseas integrada com sucesso!');
    } else {
        LogUtils.info('App original não encontrado, criando nova instância...');
        
        // Criar nova instância se não existir
        const appExtended = new AppControllerExtended();
        appExtended.init();
        window.calculadoraApp = appExtended;
    }
}

/**
 * Função para testes e debug
 */
function testarNovaEstrutura() {
    const testData = {
        cliente: "Teste Overseas",
        regimeTributario: "SIMPLES NACIONAL",
        unidade: "Quilograma",
        moeda: "DOLAR",
        taxaMoeda: 5.50,
        destino: "INDUSTRIALIZAÇÃO",
        mudaNcm: "SIM",
        valorFrete: 1000,
        modalImportacao: "Marítimo",
        estado: "SC",
        ncms: [{ ncm: "84089010", valor: 5000, quantidade: 100 }]
    };
    
    if (window.calculadoraApp && window.calculadoraApp.calculadora) {
        return window.calculadoraApp.calculadora.calcular(testData)
            .then(resultado => {
                console.log('🧪 Teste da nova estrutura:', resultado);
                window.lastCalculationResult = resultado;
                return resultado;
            })
            .catch(error => {
                console.error('❌ Erro no teste:', error);
                return null;
            });
    } else {
        console.log('❌ Calculadora não disponível');
        return Promise.resolve(null);
    }
}

/**
 * Auto-inicialização quando script for carregado
 */
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que outros scripts carregaram
    setTimeout(() => {
        integrarOverseasExtension();
        
        // Disponibilizar função de teste globalmente
        window.testarNovaEstrutura = testarNovaEstrutura;
        
        LogUtils.success('Integração Overseas carregada!');
    }, 500);
});

// Exportar para uso em módulos
export { 
    ResultsManagerExtended, 
    FormManagerExtended, 
    AppControllerExtended, 
    integrarOverseasExtension, 
    testarNovaEstrutura 
};