/**
 * Controlador Principal da Aplicação
 * Inicialização, event handlers e coordenação entre módulos
 */

import { LogUtils, DataUtils } from './utils.js';
import { StorageManager } from './storage.js';
import { UIManager, NotificationManager, ResultsManager, ContactManager, ExportManager } from './ui.js';
import { NCMLoader, NCMManager } from './ncm.js';
import { CalculadoraImportacao, ImportacaoValidator } from './calculadora.js';

/**
 * Classe para gerenciar formulários
 */
class FormManager {
    /**
     * Coletar dados do formulário
     * @returns {object} Dados coletados
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

        // Verificar se todos os elementos existem
        for (const [key, element] of Object.entries(formElements)) {
            if (!element) {
                throw new Error(`Elemento do formulário não encontrado: ${key}`);
            }
        }

        return {
            cliente: formElements.cliente.value,
            regimeTributario: formElements.regimeTributario.value,
            unidade: formElements.unidade.value,
            moeda: formElements.moeda.value,
            taxaMoeda: parseFloat(formElements.taxaMoeda.value),
            destino: formElements.destino.value,
            mudaNcm: formElements.mudaNcm.value,
            valorFrete: parseFloat(formElements.valorFrete.value),
            modalImportacao: formElements.modalImportacao.value,
            estado: formElements.estado.value,
            ncms: NCMManager.collectData()
        };
    }

    /**
     * Preencher formulário com dados
     * @param {object} data - Dados para preencher
     */
    static fillForm(data) {
        try {
            Object.keys(data).forEach(key => {
                if (key === 'ncms') return; // NCMs são tratados separadamente
                
                const element = document.getElementById(key);
                if (element && data[key] !== undefined) {
                    element.value = data[key];
                }
            });

            LogUtils.success('Formulário preenchido com dados salvos');
        } catch (error) {
            LogUtils.error('Erro ao preencher formulário:', error);
        }
    }

    /**
     * Limpar formulário
     */
    static clearForm() {
        const form = document.getElementById('calculatorForm');
        if (form) {
            form.reset();
            NCMManager.initialize();
            UIManager.hideResults();
            LogUtils.success('Formulário limpo');
        }
    }
}

/**
 * Controlador principal da aplicação
 */
class AppController {
    constructor() {
        this.calculadora = new CalculadoraImportacao();
        this.isReady = false;
        this.autoSaveTimeout = null;
    }

    /**
     * Inicializar a aplicação
     */
    async init() {
        try {
            LogUtils.info('Inicializando aplicação...');
            
            // Mostrar estado de carregamento
            this.showLoadingState('Carregando base de dados NCM...');
            
            // Carregar base de dados NCM
            await NCMLoader.loadDatabase();
            
            // Inicializar NCM Manager
            NCMManager.initialize();
            
            // Configurar event listeners
            this.setupEventListeners();
            
            // Configurar auto-save
            this.setupAutoSave();
            
            // Aplicação pronta
            this.isReady = true;
            this.hideLoadingState();
            
            LogUtils.success('Aplicação carregada com sucesso!');
            NotificationManager.success('Calculadora carregada com sucesso!');
            
            // Verificar se há dados salvos para carregar
            this.checkForSavedData();
            
        } catch (error) {
            LogUtils.error('Erro na inicialização:', error);
            NotificationManager.error(`Erro ao carregar aplicação: ${error.message}`);
            
            // Mesmo com erro, permitir uso com base limitada
            NCMManager.initialize();
            this.setupEventListeners();
            this.isReady = true;
            this.hideLoadingState();
        }
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Formulário principal
        const form = document.getElementById('calculatorForm');
        if (form) {
            form.addEventListener('submit', this.handleCalculation.bind(this));
        }

        // Botão de adicionar NCM
        const addNCMBtn = document.getElementById('addNCMBtn');
        if (addNCMBtn) {
            addNCMBtn.addEventListener('click', () => NCMManager.addItem());
        }

        // Botão de contato
        const contactBtn = document.getElementById('contactBtn');
        if (contactBtn) {
            contactBtn.addEventListener('click', ContactManager.openWhatsApp);
        }

        // Atalho Enter (exceto em botões)
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
                e.preventDefault();
                const form = document.getElementById('calculatorForm');
                if (form && form.checkValidity()) {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        });

        LogUtils.success('Event listeners configurados');
    }

    /**
     * Configurar auto-save
     */
    setupAutoSave() {
        const form = document.getElementById('calculatorForm');
        if (!form) return;

        form.addEventListener('input', () => {
            // Debounce auto-save
            clearTimeout(this.autoSaveTimeout);
            this.autoSaveTimeout = setTimeout(() => {
                try {
                    const formData = FormManager.collectData();
                    StorageManager.autoSaveFormData(formData);
                } catch (error) {
                    // Ignorar erros de auto-save
                    LogUtils.warn('Erro no auto-save:', error);
                }
            }, 2000);
        });

        LogUtils.success('Auto-save configurado');
    }

    /**
     * Verificar se há dados salvos
     */
    checkForSavedData() {
        const savedData = StorageManager.loadAutoSaveData();
        if (savedData && savedData.cliente) {
            // Perguntar se o usuário quer carregar os dados
            setTimeout(() => {
                if (confirm('Encontramos dados de uma sessão anterior. Deseja carregar?')) {
                    this.loadSavedData();
                }
            }, 1000);
        }
    }

    /**
     * Manipular cálculo da simulação
     * @param {Event} e - Event do formulário
     */
    async handleCalculation(e) {
        e.preventDefault();
        
        try {
            // Verificar se aplicação está pronta
            if (!this.isReady || !NCMLoader.isDatabaseLoaded()) {
                UIManager.showError('Aguarde o carregamento da base de dados NCM...');
                return;
            }

            UIManager.setLoadingState(true);
            UIManager.hideError();
            
            // Coletar e validar dados
            const formData = FormManager.collectData();
            ImportacaoValidator.validate(formData);
            
            LogUtils.info('Iniciando cálculo com dados:', formData);
            
            // Realizar cálculos
            const resultado = await this.calculadora.calcular(formData);
            
            // Salvar dados e resultados
            StorageManager.saveFormData(formData);
            this.storeCalculationResult(resultado, formData);
            
            // Exibir resultados
            ResultsManager.display(resultado, formData, this.calculadora);
            UIManager.showResults();
            
            // Adicionar botão de exportar
            this.addExportButton();
            
            NotificationManager.success('Cálculo realizado com sucesso!');
            LogUtils.success('Cálculo realizado com sucesso:', resultado);
            
        } catch (error) {
            UIManager.showError(error.message);
            NotificationManager.error(`Erro no cálculo: ${error.message}`);
            LogUtils.error('Erro no cálculo:', error);
        } finally {
            UIManager.setLoadingState(false);
        }
    }

    /**
     * Armazenar resultado do cálculo
     * @param {object} resultado - Resultado do cálculo
     * @param {object} formData - Dados do formulário
     */
    storeCalculationResult(resultado, formData) {
        // Disponibilizar globalmente para exportação
        window.lastCalculationResult = resultado;
        window.lastFormData = formData;
    }

    /**
     * Adicionar botão de exportar
     */
    addExportButton() {
        const resultsSection = document.getElementById('resultsSection');
        if (!resultsSection || document.getElementById('exportBtn')) return;

        const exportBtn = document.createElement('button');
        exportBtn.id = 'exportBtn';
        exportBtn.className = 'btn';
        exportBtn.style.marginTop = '1rem';
        exportBtn.innerHTML = '📄 Exportar Relatório';
        
        exportBtn.onclick = () => {
            const lastResult = window.lastCalculationResult;
            const lastFormData = window.lastFormData;
            
            if (lastResult && lastFormData) {
                ExportManager.exportToPDF(lastResult, lastFormData);
            } else {
                NotificationManager.error('Nenhum resultado disponível para exportar');
            }
        };
        
        resultsSection.appendChild(exportBtn);
    }

    /**
     * Mostrar estado de carregamento
     * @param {string} message - Mensagem de carregamento
     */
    showLoadingState(message) {
        const btn = document.getElementById('calculateBtn');
        if (btn) {
            btn.disabled = true;
            btn.textContent = `⏳ ${message}`;
            btn.classList.add('loading');
        }
    }

    /**
     * Ocultar estado de carregamento
     */
    hideLoadingState() {
        const btn = document.getElementById('calculateBtn');
        if (btn) {
            btn.disabled = false;
            btn.textContent = '🧮 Calcular Simulação';
            btn.classList.remove('loading');
        }
    }

    /**
     * Salvar dados atuais
     */
    saveCurrentData() {
        try {
            const formData = FormManager.collectData();
            StorageManager.saveFormData(formData);
            NotificationManager.success('Dados salvos com sucesso!');
        } catch (error) {
            NotificationManager.error('Erro ao salvar dados: ' + error.message);
        }
    }

    /**
     * Carregar dados salvos
     */
    loadSavedData() {
        try {
            const savedData = StorageManager.loadFormData();
            if (savedData) {
                FormManager.fillForm(savedData);
                NotificationManager.success('Dados carregados com sucesso!');
            } else {
                NotificationManager.info('Nenhum dado salvo encontrado.');
            }
        } catch (error) {
            NotificationManager.error('Erro ao carregar dados: ' + error.message);
        }
    }

    /**
     * Limpar todos os dados
     */
    clearAllData() {
        if (confirm('Tem certeza que deseja limpar todos os dados do formulário?')) {
            FormManager.clearForm();
            StorageManager.clearFormData();
            NotificationManager.success('Formulário limpo com sucesso!');
        }
    }
}

/**
 * Funções globais para debug e testes
 */
class DebugUtils {
    /**
     * Testar calculadora com dados padrão
     */
    static async testarCalculadora() {
        if (!NCMLoader.isDatabaseLoaded()) {
            console.log('❌ Base NCM não carregada ainda');
            return;
        }

        const testData = {
            cliente: "Teste",
            regimeTributario: "SIMPLES NACIONAL",
            unidade: "Quilograma",
            moeda: "DOLAR",
            taxaMoeda: 5.50,
            destino: "INDUSTRIALIZAÇÃO",
            mudaNcm: "SIM",
            valorFrete: 1000,
            modalImportacao: "Marítimo",
            estado: "SC",
            ncms: [{ ncm: "38140030", valor: 5000, quantidade: 100 }]
        };
        
        const app = window.calculadoraApp;
        if (app && app.calculadora) {
            const resultado = await app.calculadora.calcular(testData);
            console.log('🧪 Teste da calculadora:', resultado);
            window.lastCalculationResult = resultado;
            return resultado;
        }
    }

    /**
     * Verificar dados de um NCM
     * @param {string} ncm - Código NCM
     */
    static verificarNCM(ncm) {
        if (!NCMLoader.isDatabaseLoaded()) {
            console.log('❌ Base NCM não carregada ainda');
            return;
        }
        
        const ncmData = NCMLoader.getNCMData(ncm);
        if (ncmData) {
            console.log(`✅ NCM ${ncm} encontrado:`, ncmData);
        } else {
            console.log(`❌ NCM ${ncm} não encontrado na base`);
        }
        return ncmData;
    }

    /**
     * Listar primeiros NCMs da base
     */
    static listarNCMs() {
        if (!NCMLoader.isDatabaseLoaded()) {
            console.log('❌ Base NCM não carregada ainda');
            return;
        }
        
        const database = NCMLoader.getDatabase();
        const ncms = Object.keys(database);
        console.log(`📋 ${ncms.length} NCMs disponíveis:`, ncms.slice(0, 20));
        return ncms;
    }
}

/**
 * Inicialização da aplicação quando DOM carregado
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        LogUtils.info('DOM carregado, iniciando aplicação...');
        
        // Criar instância do controlador
        const app = new AppController();
        await app.init();
        
        // Disponibilizar globalmente para debug
        window.calculadoraApp = app;
        
        // Disponibilizar funções de controle globalmente
        window.salvarDados = () => app.saveCurrentData();
        window.carregarDados = () => app.loadSavedData();
        window.limparFormulario = () => app.clearAllData();
        
        // Disponibilizar funções de debug
        window.testarCalculadora = DebugUtils.testarCalculadora;
        window.verificarNCM = DebugUtils.verificarNCM;
        window.listarNCMs = DebugUtils.listarNCMs;
        
        LogUtils.success('Aplicação inicializada com sucesso!');
        
    } catch (error) {
        LogUtils.error('Erro fatal na inicialização:', error);
        NotificationManager.error('Erro ao carregar a calculadora. Verifique o console para mais detalhes.');
    }
});

/**
 * Exportar classes principais para uso em outros módulos
 */
export { AppController, FormManager, DebugUtils };