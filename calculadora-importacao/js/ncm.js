/**
 * Gerenciamento de NCMs
 * Carregamento da base, validação, exibição e coleta de dados
 */

import { LogUtils, ValidationUtils } from './utils.js';

/**
 * Configuração e carregamento da base de dados NCM
 */
export class NCMLoader {
    static ncmDatabase = null;
    static ncmArray = null; // Array original para referência
    static isLoaded = false;

    /**
     * Carregar base de dados NCM do arquivo JSON
     * @returns {Promise<object>} Base de dados carregada
     */
    static async loadDatabase() {
        try {
            LogUtils.info('Carregando base de dados NCM...');
            
            const response = await fetch('./ncms.json');
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
            }
            
            const ncmArray = await response.json();
            
            // Verificar se é um array
            if (!Array.isArray(ncmArray)) {
                throw new Error('Formato inválido: esperado um array de NCMs');
            }
            
            LogUtils.info(`Array de NCMs carregado: ${ncmArray.length} registros`);
            
            // Converter array para objeto chaveado por NCM para busca rápida
            this.ncmDatabase = this.convertArrayToObject(ncmArray);
            this.ncmArray = ncmArray; // Manter referência do array original
            this.isLoaded = true;
            
            const totalNCMs = Object.keys(this.ncmDatabase).length;
            LogUtils.success(`Base NCM processada com sucesso: ${totalNCMs} NCMs únicos`);
            
            // Mostrar alguns exemplos no console
            const exemplos = Object.entries(this.ncmDatabase).slice(0, 3);
            LogUtils.info('Exemplos de NCMs processados:', exemplos);
            
            // Validar estrutura dos dados
            this.validateDataStructure(ncmArray);
            
            return this.ncmDatabase;
            
        } catch (error) {
            LogUtils.error('Erro ao carregar base NCM:', error);
            
            // Usar base de fallback em caso de erro
            LogUtils.warn('Usando base de dados de fallback...');
            this.ncmDatabase = this.getFallbackDatabase();
            this.isLoaded = true;
            
            throw new Error(`Falha ao carregar base NCM: ${error.message}`);
        }
    }

    /**
     * Converter array de NCMs para objeto chaveado
     * @param {Array} ncmArray - Array de objetos NCM
     * @returns {object} Objeto chaveado por NCM
     */
    static convertArrayToObject(ncmArray) {
        const ncmObject = {};
        let processedCount = 0;
        let duplicateCount = 0;
        let errorCount = 0;

        ncmArray.forEach((item, index) => {
            try {
                // Validar estrutura do item
                if (!item || typeof item !== 'object') {
                    LogUtils.warn(`Item ${index} não é um objeto válido:`, item);
                    errorCount++;
                    return;
                }

                // Extrair e normalizar NCM
                const ncmRaw = item.NCM || item.ncm;
                if (ncmRaw === undefined || ncmRaw === null) {
                    LogUtils.warn(`Item ${index} não possui campo NCM:`, item);
                    errorCount++;
                    return;
                }

                // Converter NCM para string com 8 dígitos
                const ncmKey = this.normalizeNCMFromNumber(ncmRaw);
                
                if (!ncmKey) {
                    LogUtils.warn(`NCM inválido no item ${index}:`, ncmRaw);
                    errorCount++;
                    return;
                }

                // Verificar duplicatas
                if (ncmObject[ncmKey]) {
                    LogUtils.warn(`NCM duplicado encontrado: ${ncmKey}`);
                    duplicateCount++;
                    return;
                }

                // Converter para formato padronizado (minúsculas)
                ncmObject[ncmKey] = {
                    descricao: item['DESCRIÇÃO'] || item.descricao || item['DESCRICAO'] || 'Descrição não disponível',
                    ii: this.normalizePercentage(item.II || item.ii || 0),
                    ipi: this.normalizePercentage(item.IPI || item.ipi || 0),
                    pis: this.normalizePercentage(item.PIS || item.pis || 0),
                    cofins: this.normalizePercentage(item.COFINS || item.cofins || 0),
                    gatt: this.normalizePercentage(item.GATT || item.gatt || 0)
                };

                processedCount++;

            } catch (error) {
                LogUtils.error(`Erro ao processar item ${index}:`, error, item);
                errorCount++;
            }
        });

        LogUtils.success(`Conversão concluída: ${processedCount} processados, ${duplicateCount} duplicatas, ${errorCount} erros`);
        
        return ncmObject;
    }

    /**
     * Normalizar NCM de número para string com 8 dígitos
     * @param {number|string} ncm - NCM como número ou string
     * @returns {string|null} NCM normalizado ou null se inválido
     */
    static normalizeNCMFromNumber(ncm) {
        try {
            // Converter para string e remover caracteres não numéricos
            const ncmStr = String(ncm).replace(/[^\d]/g, '');
            
            // Verificar se tem dígitos válidos
            if (!ncmStr || ncmStr.length === 0 || ncmStr.length > 8) {
                return null;
            }

            // Preencher com zeros à esquerda para 8 dígitos
            return ncmStr.padStart(8, '0');
            
        } catch (error) {
            LogUtils.warn('Erro ao normalizar NCM:', ncm, error);
            return null;
        }
    }

    /**
     * Normalizar valores percentuais
     * @param {any} value - Valor a ser normalizado
     * @returns {number} Valor numérico normalizado
     */
    static normalizePercentage(value) {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    }

    /**
     * Validar estrutura dos dados carregados
     * @param {Array} ncmArray - Array de NCMs
     */
    static validateDataStructure(ncmArray) {
        if (ncmArray.length === 0) {
            LogUtils.warn('Array de NCMs está vazio');
            return;
        }

        // Verificar primeiros itens para detectar problemas
        const sampleSize = Math.min(5, ncmArray.length);
        const samples = ncmArray.slice(0, sampleSize);
        
        samples.forEach((item, index) => {
            const hasNCM = item.NCM !== undefined || item.ncm !== undefined;
            const hasDescription = item['DESCRIÇÃO'] !== undefined || item.descricao !== undefined;
            const hasTaxes = item.II !== undefined || item.ii !== undefined;
            
            if (!hasNCM || !hasDescription || !hasTaxes) {
                LogUtils.warn(`Estrutura inconsistente no item ${index}:`, {
                    hasNCM,
                    hasDescription,
                    hasTaxes,
                    keys: Object.keys(item)
                });
            }
        });

        LogUtils.success('Validação da estrutura concluída');
    }

    /**
     * Base de dados de fallback com NCMs básicos
     * @returns {object} Base de fallback
     */
    static getFallbackDatabase() {
        LogUtils.info('Carregando base de dados de fallback...');
        
        return {
            "10121000": { 
                "descricao": "Reprodutores de raça pura", 
                "ii": 0, 
                "ipi": 0, 
                "pis": 2.1, 
                "cofins": 9.65, 
                "gatt": 35 
            },
            "38140030": { 
                "descricao": "Preparações orgânicas tensoativas", 
                "ii": 12.60, 
                "ipi": 6.50, 
                "pis": 2.10, 
                "cofins": 9.65, 
                "gatt": 35.00 
            },
            "85171231": { 
                "descricao": "Telefones celulares", 
                "ii": 16.00, 
                "ipi": 15.00, 
                "pis": 1.65, 
                "cofins": 7.60, 
                "gatt": 35.00 
            },
            "62034200": { 
                "descricao": "Calças de algodão", 
                "ii": 35.00, 
                "ipi": 5.00, 
                "pis": 1.65, 
                "cofins": 7.60, 
                "gatt": 35.00 
            },
            "22030000": { 
                "descricao": "Cerveja de malte", 
                "ii": 20.00, 
                "ipi": 25.00, 
                "pis": 1.65, 
                "cofins": 7.60, 
                "gatt": 35.00 
            }
        };
    }

    /**
     * Verificar se a base está carregada
     * @returns {boolean} True se carregada
     */
    static isDatabaseLoaded() {
        return this.isLoaded && this.ncmDatabase !== null;
    }

    /**
     * Obter a base de dados
     * @returns {object} Base de dados NCM
     */
    static getDatabase() {
        if (!this.isDatabaseLoaded()) {
            throw new Error('Base de dados NCM não foi carregada ainda');
        }
        return this.ncmDatabase;
    }

    /**
     * Buscar dados de um NCM específico (MÉTODO CORRIGIDO)
     * @param {string} ncm - Código NCM
     * @returns {object|null} Dados do NCM ou null
     */
    static getNCMData(ncm) {
        if (!this.isDatabaseLoaded()) {
            LogUtils.warn('Base de dados NCM não está carregada');
            return null;
        }

        try {
            // Normalizar NCM de entrada (string para 8 dígitos)
            const normalizedNCM = NCMManager.normalizeNCM(ncm);
            
            if (!normalizedNCM || normalizedNCM.length !== 8) {
                LogUtils.warn(`NCM inválido para busca: ${ncm} -> ${normalizedNCM}`);
                return null;
            }

            // Buscar no objeto chaveado (busca O(1))
            const ncmData = this.ncmDatabase[normalizedNCM];
            
            if (ncmData) {
                LogUtils.success(`NCM ${normalizedNCM} encontrado:`, ncmData);
                return ncmData;
            } else {
                LogUtils.info(`NCM ${normalizedNCM} não encontrado na base de dados`);
                return null;
            }

        } catch (error) {
            LogUtils.error('Erro ao buscar NCM:', error);
            return null;
        }
    }

    /**
     * Buscar NCMs por descrição (busca textual)
     * @param {string} searchTerm - Termo de busca
     * @param {number} limit - Limite de resultados (padrão: 10)
     * @returns {Array} Array de NCMs encontrados
     */
    static searchByDescription(searchTerm, limit = 10) {
        if (!this.isDatabaseLoaded()) {
            return [];
        }

        try {
            const term = searchTerm.toLowerCase().trim();
            if (term.length < 3) {
                return [];
            }

            const results = [];
            
            for (const [ncmCode, ncmData] of Object.entries(this.ncmDatabase)) {
                if (ncmData.descricao.toLowerCase().includes(term)) {
                    results.push({
                        ncm: ncmCode,
                        ...ncmData
                    });

                    if (results.length >= limit) {
                        break;
                    }
                }
            }

            LogUtils.info(`Busca textual por "${searchTerm}": ${results.length} resultados`);
            return results;

        } catch (error) {
            LogUtils.error('Erro na busca textual:', error);
            return [];
        }
    }

    /**
     * Obter estatísticas da base de dados
     * @returns {object} Estatísticas da base
     */
    static getStatistics() {
        if (!this.isDatabaseLoaded()) {
            return null;
        }

        try {
            const ncmCodes = Object.keys(this.ncmDatabase);
            const totalNCMs = ncmCodes.length;
            
            // Calcular estatísticas dos tributos
            const tributes = Object.values(this.ncmDatabase);
            const avgII = tributes.reduce((sum, item) => sum + item.ii, 0) / totalNCMs;
            const avgIPI = tributes.reduce((sum, item) => sum + item.ipi, 0) / totalNCMs;
            
            // Encontrar ranges de NCM
            const firstNCM = ncmCodes.sort()[0];
            const lastNCM = ncmCodes.sort()[ncmCodes.length - 1];

            const stats = {
                totalNCMs,
                firstNCM,
                lastNCM,
                averageTributes: {
                    ii: parseFloat(avgII.toFixed(2)),
                    ipi: parseFloat(avgIPI.toFixed(2))
                },
                loadedAt: new Date().toISOString(),
                memoryUsage: `${JSON.stringify(this.ncmDatabase).length} bytes`
            };

            LogUtils.info('Estatísticas da base NCM:', stats);
            return stats;

        } catch (error) {
            LogUtils.error('Erro ao calcular estatísticas:', error);
            return null;
        }
    }

    /**
     * Validar integridade da base carregada
     * @returns {object} Relatório de validação
     */
    static validateIntegrity() {
        if (!this.isDatabaseLoaded()) {
            return { valid: false, error: 'Base não carregada' };
        }

        try {
            const report = {
                valid: true,
                totalNCMs: 0,
                invalidNCMs: [],
                missingFields: [],
                duplicates: []
            };

            const seenNCMs = new Set();

            for (const [ncmCode, ncmData] of Object.entries(this.ncmDatabase)) {
                report.totalNCMs++;

                // Verificar formato do NCM
                if (!/^\d{8}$/.test(ncmCode)) {
                    report.invalidNCMs.push(ncmCode);
                    report.valid = false;
                }

                // Verificar duplicatas
                if (seenNCMs.has(ncmCode)) {
                    report.duplicates.push(ncmCode);
                    report.valid = false;
                } else {
                    seenNCMs.add(ncmCode);
                }

                // Verificar campos obrigatórios
                const requiredFields = ['descricao', 'ii', 'ipi', 'pis', 'cofins'];
                for (const field of requiredFields) {
                    if (ncmData[field] === undefined || ncmData[field] === null) {
                        report.missingFields.push(`${ncmCode}.${field}`);
                        report.valid = false;
                    }
                }
            }

            LogUtils.info('Relatório de validação da base:', report);
            return report;

        } catch (error) {
            LogUtils.error('Erro na validação de integridade:', error);
            return { valid: false, error: error.message };
        }
    }
}

/**
 * Gerenciador de NCMs na interface
 */
export class NCMManager {
    static counter = 0;

    /**
     * Adicionar novo item NCM ao formulário
     */
    static addItem() {
        this.counter++;
        const container = document.getElementById('ncmContainer');
        if (!container) {
            LogUtils.error('Container de NCM não encontrado');
            return;
        }
        
        const ncmItem = document.createElement('div');
        ncmItem.className = 'ncm-item';
        ncmItem.id = `ncmItem${this.counter}`;
        
        ncmItem.innerHTML = `
            <div class="form-group">
                <label>NCM ${this.counter}</label>
                <input type="text" name="ncm" placeholder="Ex: 38140030" maxlength="8" 
                       value="${this.counter === 1 ? '38140030' : ''}" required>
                <div class="ncm-description" id="ncmDesc${this.counter}">
                    ${this.counter === 1 ? 'Digite um NCM para ver a descrição' : ''}
                </div>
            </div>
            <div class="form-group">
                <label>Valor (USD)</label>
                <input type="number" name="valor" placeholder="5000.00" step="0.01" 
                       value="${this.counter === 1 ? '5000' : ''}" required>
            </div>
            <div class="form-group">
                <label>Quantidade</label>
                <input type="number" name="quantidade" placeholder="100" step="0.001" 
                       value="${this.counter === 1 ? '100' : ''}" required>
            </div>
            <button type="button" class="remove-btn" onclick="NCMManager.removeItem(${this.counter})" 
                    ${this.counter === 1 ? 'disabled' : ''}>
                🗑️
            </button>
        `;
        
        container.appendChild(ncmItem);
        
        // Configurar validação em tempo real
        this.setupNCMValidation(ncmItem, this.counter);
        
        LogUtils.success(`NCM ${this.counter} adicionado ao formulário`);
    }

    /**
     * Remover item NCM do formulário
     * @param {number} id - ID do item a ser removido
     */
    static removeItem(id) {
        const item = document.getElementById(`ncmItem${id}`);
        if (item) {
            item.remove();
            LogUtils.info(`NCM ${id} removido do formulário`);
        }
    }

    /**
     * Configurar validação em tempo real para um NCM
     * @param {HTMLElement} ncmItem - Elemento do NCM
     * @param {number} counter - Contador do NCM
     */
    static setupNCMValidation(ncmItem, counter) {
        const ncmInput = ncmItem.querySelector('input[name="ncm"]');
        const descDiv = ncmItem.querySelector(`#ncmDesc${counter}`);
        
        if (!ncmInput || !descDiv) return;

        // Evento de input para validação em tempo real
        ncmInput.addEventListener('input', (e) => {
            this.handleNCMInput(e.target, descDiv);
        });

        // Validar NCM inicial se já tem valor
        if (ncmInput.value) {
            setTimeout(() => this.handleNCMInput(ncmInput, descDiv), 100);
        }
    }

    /**
     * Manipular input de NCM e validar
     * @param {HTMLInputElement} input - Campo de input
     * @param {HTMLElement} descDiv - Div de descrição
     */
    static handleNCMInput(input, descDiv) {
        const ncmValue = this.normalizeNCM(input.value);
        
        if (ncmValue.length === 8) {
            this.validateAndShowNCM(ncmValue, input, descDiv);
        } else if (ncmValue.length > 0) {
            this.showValidationMessage(
                descDiv, 
                '⚠️ NCM deve ter 8 dígitos', 
                'warning'
            );
            this.setInputBorderColor(input, 'var(--warning-color)');
        } else {
            descDiv.innerHTML = 'Digite um NCM para ver a descrição';
            this.setInputBorderColor(input, 'var(--border-color)');
        }
    }

    /**
     * Validar NCM e exibir informações
     * @param {string} ncm - Código NCM normalizado
     * @param {HTMLInputElement} input - Campo de input
     * @param {HTMLElement} descDiv - Div de descrição
     */
    static async validateAndShowNCM(ncm, input, descDiv) {
        try {
            if (!NCMLoader.isDatabaseLoaded()) {
                this.showValidationMessage(
                    descDiv, 
                    '⏳ Carregando base de dados...', 
                    'warning'
                );
                return;
            }

            const ncmData = NCMLoader.getNCMData(ncm);

            if (ncmData) {
                // NCM encontrado
                this.showValidationMessage(
                    descDiv,
                    `✅ ${ncmData.descricao}<br><small>II: ${ncmData.ii}% | IPI: ${ncmData.ipi}% | PIS: ${ncmData.pis}% | COFINS: ${ncmData.cofins}%</small>`,
                    'success'
                );
                this.setInputBorderColor(input, 'var(--success-color)');
                input.style.boxShadow = '0 0 10px rgba(57, 255, 20, 0.3)';
            } else {
                // NCM não encontrado
                this.showValidationMessage(
                    descDiv,
                    `❌ NCM não encontrado na base de dados<br><small>Será usado: II: 10% | IPI: 5% | PIS: 1.65% | COFINS: 7.6%</small>`,
                    'error'
                );
                this.setInputBorderColor(input, 'var(--error-color)');
                input.style.boxShadow = '0 0 10px rgba(255, 71, 87, 0.3)';
            }

        } catch (error) {
            LogUtils.error('Erro ao validar NCM:', error);
            this.showValidationMessage(
                descDiv, 
                '❌ Erro ao validar NCM', 
                'error'
            );
        }
    }

    /**
     * Exibir mensagem de validação
     * @param {HTMLElement} element - Elemento onde exibir
     * @param {string} message - Mensagem
     * @param {string} type - Tipo (success, error, warning)
     */
    static showValidationMessage(element, message, type) {
        const color = type === 'success' ? 'var(--success-color)' :
                     type === 'error' ? 'var(--error-color)' :
                     'var(--warning-color)';
        
        element.innerHTML = `<span style="color: ${color};">${message}</span>`;
    }

    /**
     * Definir cor da borda do input
     * @param {HTMLInputElement} input - Campo de input
     * @param {string} color - Cor da borda
     */
    static setInputBorderColor(input, color) {
        input.style.borderColor = color;
    }

    /**
     * Normalizar código NCM
     * @param {string} ncm - Código NCM bruto
     * @returns {string} NCM normalizado
     */
    static normalizeNCM(ncm) {
        if (!ncm) return '';
        // Remove caracteres não numéricos e preenche com zeros à esquerda
        return ncm.replace(/[^\d]/g, '').padStart(8, '0').substring(0, 8);
    }

    /**
     * Coletar dados de todos os NCMs do formulário
     * @returns {Array} Array com dados dos NCMs
     */
    static collectData() {
        const ncms = [];
        const ncmItems = document.querySelectorAll('.ncm-item');
        
        LogUtils.info(`Coletando dados de ${ncmItems.length} NCMs`);
        
        ncmItems.forEach((item, index) => {
            const ncmInput = item.querySelector('input[name="ncm"]');
            const valorInput = item.querySelector('input[name="valor"]');
            const quantidadeInput = item.querySelector('input[name="quantidade"]');
            
            if (!ncmInput || !valorInput || !quantidadeInput) {
                LogUtils.warn(`NCM ${index + 1}: Campos não encontrados`);
                return;
            }

            const ncmRaw = ncmInput.value;
            const ncm = this.normalizeNCM(ncmRaw);
            const valor = parseFloat(valorInput.value);
            const quantidade = parseFloat(quantidadeInput.value);
            
            // Validar dados antes de adicionar
            if (this.validateNCMData(ncm, valor, quantidade, index + 1)) {
                ncms.push({ 
                    ncm: ncm,
                    ncmOriginal: ncmRaw,
                    valor, 
                    quantidade 
                });
                LogUtils.success(`NCM ${index + 1} coletado:`, { ncm, valor, quantidade });
            }
        });

        LogUtils.info(`Total de NCMs válidos coletados: ${ncms.length}`);
        return ncms;
    }

    /**
     * Validar dados de um NCM
     * @param {string} ncm - Código NCM
     * @param {number} valor - Valor
     * @param {number} quantidade - Quantidade
     * @param {number} index - Índice do NCM
     * @returns {boolean} True se válido
     */
    static validateNCMData(ncm, valor, quantidade, index) {
        if (!ValidationUtils.isValidNCM(ncm)) {
            LogUtils.warn(`NCM ${index}: Código inválido - ${ncm}`);
            return false;
        }

        if (!ValidationUtils.isValidCurrency(valor)) {
            LogUtils.warn(`NCM ${index}: Valor inválido - ${valor}`);
            return false;
        }

        if (!ValidationUtils.isValidQuantity(quantidade)) {
            LogUtils.warn(`NCM ${index}: Quantidade inválida - ${quantidade}`);
            return false;
        }

        return true;
    }

    /**
     * Limpar todos os NCMs do formulário
     */
    static clearAll() {
        const container = document.getElementById('ncmContainer');
        if (container) {
            container.innerHTML = '';
            this.counter = 0;
            LogUtils.info('Todos os NCMs removidos do formulário');
        }
    }

    /**
     * Inicializar o primeiro NCM no formulário
     */
    static initialize() {
        this.clearAll();
        this.addItem();
        LogUtils.success('NCM Manager inicializado');
    }
}

// Disponibilizar NCMManager globalmente para uso nos event handlers inline
window.NCMManager = NCMManager;