/**
 * Utilitários de formatação e validação
 * Funções reutilizáveis para toda a aplicação
 */

/**
 * Classe para formatação de valores
 */
export class FormatUtils {
    /**
     * Formatar valor em moeda brasileira
     * @param {number} valor - Valor numérico
     * @returns {string} Valor formatado em BRL
     */
    static formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    /**
     * Formatar valor como percentual
     * @param {number} valor - Valor numérico
     * @returns {string} Valor formatado como percentual
     */
    static formatarPercentual(valor) {
        return `${valor.toFixed(2)}%`;
    }

    /**
     * Formatar número com separadores de milhares
     * @param {number} valor - Valor numérico
     * @param {number} decimais - Número de casas decimais
     * @returns {string} Número formatado
     */
    static formatarNumero(valor, decimais = 2) {
        return valor.toLocaleString('pt-BR', {
            minimumFractionDigits: decimais,
            maximumFractionDigits: decimais
        });
    }

    /**
     * Formatar data no padrão brasileiro
     * @param {Date} data - Objeto Date
     * @returns {string} Data formatada
     */
    static formatarData(data = new Date()) {
        return data.toLocaleDateString('pt-BR');
    }
}

/**
 * Classe para validações diversas
 */
export class ValidationUtils {
    /**
     * Validar código NCM
     * @param {string} ncm - Código NCM
     * @returns {boolean} True se válido
     */
    static isValidNCM(ncm) {
        if (!ncm) return false;
        const normalized = ncm.replace(/[^\d]/g, '').padStart(8, '0').substring(0, 8);
        return normalized.length === 8 && /^\d{8}$/.test(normalized);
    }

    /**
     * Validar valor monetário
     * @param {any} value - Valor a ser validado
     * @returns {boolean} True se válido
     */
    static isValidCurrency(value) {
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue >= 0;
    }

    /**
     * Validar quantidade
     * @param {any} value - Valor a ser validado
     * @returns {boolean} True se válido
     */
    static isValidQuantity(value) {
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue > 0;
    }

    /**
     * Validar string não vazia
     * @param {string} str - String a ser validada
     * @returns {boolean} True se válido
     */
    static isValidString(str) {
        return typeof str === 'string' && str.trim().length > 0;
    }

    /**
     * Validar email
     * @param {string} email - Email a ser validado
     * @returns {boolean} True se válido
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

/**
 * Classe para manipulação de dados e conversões
 */
export class DataUtils {
    /**
     * Delay assíncrono
     * @param {number} ms - Milissegundos para esperar
     * @returns {Promise} Promise que resolve após o delay
     */
    static async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Fazer deep copy de um objeto
     * @param {object} obj - Objeto a ser copiado
     * @returns {object} Cópia profunda do objeto
     */
    static deepCopy(obj) {
        try {
            return JSON.parse(JSON.stringify(obj));
        } catch (error) {
            console.warn('Erro ao fazer deep copy:', error);
            return obj;
        }
    }

    /**
     * Debounce de função
     * @param {Function} func - Função a ser executada
     * @param {number} delay - Delay em milissegundos
     * @returns {Function} Função com debounce aplicado
     */
    static debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Gerar ID único simples
     * @returns {string} ID único
     */
    static generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}

/**
 * Classe para logs e debugging
 */
export class LogUtils {
    static DEBUG_MODE = true; // Altere para false em produção

    /**
     * Log de informação
     * @param {string} message - Mensagem
     * @param {any} data - Dados adicionais
     */
    static info(message, data = null) {
        if (this.DEBUG_MODE) {
            console.log(`ℹ️ ${message}`, data || '');
        }
    }

    /**
     * Log de sucesso
     * @param {string} message - Mensagem
     * @param {any} data - Dados adicionais
     */
    static success(message, data = null) {
        if (this.DEBUG_MODE) {
            console.log(`✅ ${message}`, data || '');
        }
    }

    /**
     * Log de aviso
     * @param {string} message - Mensagem
     * @param {any} data - Dados adicionais
     */
    static warn(message, data = null) {
        console.warn(`⚠️ ${message}`, data || '');
    }

    /**
     * Log de erro
     * @param {string} message - Mensagem
     * @param {any} error - Erro
     */
    static error(message, error = null) {
        console.error(`❌ ${message}`, error || '');
    }
}