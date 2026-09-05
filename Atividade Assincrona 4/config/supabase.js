/**
 * config/supabase.js
 * Camada de configuração da conexão com o Banco de Dados (Supabase/PostgreSQL)
 * Equivalente ao arquivo de conexão JDBC em Java
 */

const SUPABASE_URL = 'https://lshikckpxdzlurqjzvnu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_2j3EHMm_FKdRgUZynkfg0g_BOZo0JXy';

/**
 * Classe responsável pela conexão com o banco de dados via API REST do Supabase.
 * Simula a camada de conexão JDBC, encapsulando todos os detalhes de acesso ao BD.
 */
class SupabaseConnection {
    constructor() {
        this.baseURL = SUPABASE_URL;
        this.headers = {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Prefer': 'return=representation'
        };
    }

    /**
     * Executa uma requisição à API REST do Supabase (equivalente a executar uma query JDBC)
     */
    async query(endpoint, method = 'GET', body = null, extraHeaders = {}) {
        const options = {
            method,
            headers: { ...this.headers, ...extraHeaders }
        };
        if (body) options.body = JSON.stringify(body);

        const response = await fetch(`${this.baseURL}/rest/v1/${endpoint}`, options);
        const text = await response.text();
        const data = text ? JSON.parse(text) : [];

        if (!response.ok) {
            const err = typeof data === 'object' ? (data.message || JSON.stringify(data)) : text;
            throw new Error(`DB Error [${response.status}]: ${err}`);
        }
        return data;
    }
}

// Exporta uma instância única (Singleton) da conexão
const db = new SupabaseConnection();
export default db;
