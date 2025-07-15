/**
 * Gerenciamento de Storage Local
 * Salvar, carregar e limpar dados no localStorage
 */

import { LogUtils } from './utils.js';

/**
 * Classe para gerenciar o localStorage
 */
export class StorageManager {
    // Chaves do localStorage
    static KEYS = {
        LAST_SIMULATION: 'calculadora_ultima_simulacao',
        USER_PREFERENCES: 'calculadora_preferencias',
        FORM_AUTOSAVE: 'calculadora_autosave'
    };

    /**
     * Salvar dados da última simulação
     * @param {object} data - Dados do formulário
     */
    static saveFormData(data) {
        try {
            const formData = {
                ...data,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            
            localStorage.setItem(
                this.KEYS.LAST_SIMULATION, 
                JSON.stringify(formData)
            );
            
            LogUtils.success('Dados salvos no localStorage');
        } catch (error) {
            LogUtils.warn('Não foi possível salvar dados no localStorage:', error);
        }
    }

    /**
     * Carregar dados da última simulação
     * @returns {object|null} Dados salvos ou null
     */
    static loadFormData() {
        try {
            const saved = localStorage.getItem(this.KEYS.LAST_SIMULATION);
            if (saved) {
                const data = JSON.parse(saved);
                LogUtils.success('Dados carregados do localStorage');
                return data;
            }
            return null;
        } catch (error) {
            LogUtils.warn('Não foi possível carregar dados do localStorage:', error);
            return null;
        }
    }

    /**
     * Limpar dados da última simulação
     */
    static clearFormData() {
        try {
            localStorage.removeItem(this.KEYS.LAST_SIMULATION);
            LogUtils.success('Dados removidos do localStorage');
        } catch (error) {
            LogUtils.warn('Não foi possível limpar dados do localStorage:', error);
        }
    }

    /**
     * Auto-save dos dados do formulário
     * @param {object} data - Dados para auto-save
     */
    static autoSaveFormData(data) {
        try {
            const autoSaveData = {
                ...data,
                timestamp: new Date().toISOString(),
                isAutoSave: true
            };
            
            localStorage.setItem(
                this.KEYS.FORM_AUTOSAVE, 
                JSON.stringify(autoSaveData)
            );
            
            LogUtils.info('Auto-save realizado');
        } catch (error) {
            LogUtils.warn('Erro no auto-save:', error);
        }
    }

    /**
     * Carregar dados do auto-save
     * @returns {object|null} Dados do auto-save ou null
     */
    static loadAutoSaveData() {
        try {
            const saved = localStorage.getItem(this.KEYS.FORM_AUTOSAVE);
            if (saved) {
                const data = JSON.parse(saved);
                LogUtils.info('Dados de auto-save carregados');
                return data;
            }
            return null;
        } catch (error) {
            LogUtils.warn('Erro ao carregar auto-save:', error);
            return null;
        }
    }

    /**
     * Salvar preferências do usuário
     * @param {object} preferences - Preferências do usuário
     */
    static saveUserPreferences(preferences) {
        try {
            localStorage.setItem(
                this.KEYS.USER_PREFERENCES, 
                JSON.stringify(preferences)
            );
            LogUtils.success('Preferências salvas');
        } catch (error) {
            LogUtils.warn('Erro ao salvar preferências:', error);
        }
    }

    /**
     * Carregar preferências do usuário
     * @returns {object} Preferências do usuário
     */
    static loadUserPreferences() {
        try {
            const saved = localStorage.getItem(this.KEYS.USER_PREFERENCES);
            if (saved) {
                return JSON.parse(saved);
            }
            
            // Preferências padrão
            return {
                darkMode: true,
                autoSave: true,
                notifications: true
            };
        } catch (error) {
            LogUtils.warn('Erro ao carregar preferências:', error);
            return {
                darkMode: true,
                autoSave: true,
                notifications: true
            };
        }
    }

    /**
     * Verificar se o localStorage está disponível
     * @returns {boolean} True se disponível
     */
    static isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Obter tamanho usado no localStorage
     * @returns {string} Tamanho em KB
     */
    static getStorageSize() {
        try {
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length;
                }
            }
            return `${(total / 1024).toFixed(2)} KB`;
        } catch (error) {
            return 'Indisponível';
        }
    }

    /**
     * Limpar todos os dados da aplicação
     */
    static clearAllData() {
        try {
            Object.values(this.KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            LogUtils.success('Todos os dados removidos do localStorage');
        } catch (error) {
            LogUtils.warn('Erro ao limpar todos os dados:', error);
        }
    }

    /**
     * Exportar dados para backup
     * @returns {object} Dados para backup
     */
    static exportData() {
        try {
            const exportData = {};
            Object.values(this.KEYS).forEach(key => {
                const data = localStorage.getItem(key);
                if (data) {
                    exportData[key] = JSON.parse(data);
                }
            });
            
            return {
                exportDate: new Date().toISOString(),
                version: '1.0',
                data: exportData
            };
        } catch (error) {
            LogUtils.error('Erro ao exportar dados:', error);
            return null;
        }
    }

    /**
     * Importar dados de backup
     * @param {object} backupData - Dados do backup
     * @returns {boolean} True se sucesso
     */
    static importData(backupData) {
        try {
            if (!backupData || !backupData.data) {
                throw new Error('Dados de backup inválidos');
            }
            
            Object.entries(backupData.data).forEach(([key, value]) => {
                localStorage.setItem(key, JSON.stringify(value));
            });
            
            LogUtils.success('Dados importados com sucesso');
            return true;
        } catch (error) {
            LogUtils.error('Erro ao importar dados:', error);
            return false;
        }
    }
}