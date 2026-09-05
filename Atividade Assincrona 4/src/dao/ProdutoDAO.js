/**
 * src/dao/ProdutoDAO.js
 * Camada DAO - Data Access Object
 * Responsável por todas as operações de acesso ao Banco de Dados da entidade Produto.
 * Equivalente ao DAO com JDBC em Java, abstraindo as queries SQL do restante da aplicação.
 */

import db from '../../config/supabase.js';
import { Produto, Categoria } from '../models/Produto.js';

export class ProdutoDAO {

    // ─── CREATE ───────────────────────────────────────────────────────────────

    /**
     * Insere um novo produto no banco de dados.
     * Equivalente a: INSERT INTO produtos (...) VALUES (...)
     */
    async create(produto) {
        const data = await db.query('produtos', 'POST', produto.toDAO());
        const row = Array.isArray(data) ? data[0] : data;
        return new Produto(row);
    }

    // ─── READ ─────────────────────────────────────────────────────────────────

    /**
     * Busca todos os produtos, com join de categoria via view.
     * Equivalente a: SELECT * FROM vw_produtos_completo ORDER BY id DESC
     */
    async findAll() {
        const data = await db.query('vw_produtos_completo?order=id.desc');
        return data.map(row => new Produto(row));
    }

    /**
     * Busca produto por ID.
     * Equivalente a: SELECT * FROM vw_produtos_completo WHERE id = ?
     */
    async findById(id) {
        const data = await db.query(`vw_produtos_completo?id=eq.${id}`);
        if (!data || data.length === 0) return null;
        return new Produto(data[0]);
    }

    /**
     * Busca produtos por nome (pesquisa parcial, case-insensitive).
     * Equivalente a: SELECT * FROM produtos WHERE nome ILIKE '%termo%'
     */
    async findByNome(termo) {
        const data = await db.query(`vw_produtos_completo?nome=ilike.*${encodeURIComponent(termo)}*&order=id.desc`);
        return data.map(row => new Produto(row));
    }

    // ─── UPDATE ───────────────────────────────────────────────────────────────

    /**
     * Atualiza os dados de um produto existente.
     * Equivalente a: UPDATE produtos SET ... WHERE id = ?
     */
    async update(id, produto) {
        const data = await db.query(`produtos?id=eq.${id}`, 'PATCH', produto.toDAO());
        const row = Array.isArray(data) ? data[0] : data;
        return new Produto(row);
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────

    /**
     * Remove um produto pelo ID (hard delete).
     * Equivalente a: DELETE FROM produtos WHERE id = ?
     */
    async delete(id) {
        await db.query(`produtos?id=eq.${id}`, 'DELETE');
        return true;
    }
}

export class CategoriaDAO {
    /**
     * Busca todas as categorias.
     * Equivalente a: SELECT * FROM categorias ORDER BY nome
     */
    async findAll() {
        const data = await db.query('categorias?order=nome.asc');
        return data.map(row => new Categoria(row));
    }
}
