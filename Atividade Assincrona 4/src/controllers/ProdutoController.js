/**
 * src/controllers/ProdutoController.js
 * Camada Controller (C do MVC)
 * Processa as requisições do usuário, aplica regras de negócio,
 * aciona o DAO e retorna as respostas para a View.
 * Equivalente ao Servlet/Controller em Java.
 */

import { ProdutoDAO, CategoriaDAO } from '../dao/ProdutoDAO.js';
import { Produto } from '../models/Produto.js';

const produtoDAO = new ProdutoDAO();
const categoriaDAO = new CategoriaDAO();

export class ProdutoController {

    /**
     * Trata requisições HTTP e roteia para o método correto
     * baseado no método HTTP e parâmetros recebidos.
     * Simula o doGet/doPost do padrão Servlet Java.
     */
    async handleRequest(method, params = {}) {
        switch (method) {
            case 'GET_ALL':    return this.getAll(params.search);
            case 'GET_ONE':    return this.getOne(params.id);
            case 'POST':       return this.create(params.body);
            case 'PUT':        return this.update(params.id, params.body);
            case 'DELETE':     return this.remove(params.id);
            case 'GET_CATS':   return this.getCategorias();
            default: throw new Error('Método não suportado');
        }
    }

    /** GET /produtos — Lista todos os produtos (com filtro opcional) */
    async getAll(search = '') {
        if (search && search.trim()) {
            return await produtoDAO.findByNome(search.trim());
        }
        return await produtoDAO.findAll();
    }

    /** GET /produtos/:id — Retorna um produto pelo ID */
    async getOne(id) {
        const produto = await produtoDAO.findById(id);
        if (!produto) throw new Error(`Produto com ID ${id} não encontrado.`);
        return produto;
    }

    /** POST /produtos — Cria um novo produto (com validação) */
    async create(body) {
        const produto = new Produto(body);

        // Regra de negócio: validar dados antes de persistir
        const errors = produto.validate();
        if (errors.length > 0) throw new Error(errors.join(' '));

        return await produtoDAO.create(produto);
    }

    /** PUT /produtos/:id — Atualiza um produto existente */
    async update(id, body) {
        // Verifica se o produto existe antes de atualizar
        const existing = await produtoDAO.findById(id);
        if (!existing) throw new Error(`Produto com ID ${id} não encontrado.`);

        const produto = new Produto({ ...existing, ...body });
        const errors = produto.validate();
        if (errors.length > 0) throw new Error(errors.join(' '));

        return await produtoDAO.update(id, produto);
    }

    /** DELETE /produtos/:id — Remove um produto */
    async remove(id) {
        const existing = await produtoDAO.findById(id);
        if (!existing) throw new Error(`Produto com ID ${id} não encontrado.`);

        await produtoDAO.delete(id);
        return { message: `Produto "${existing.nome}" removido com sucesso.` };
    }

    /** GET /categorias — Lista todas as categorias (para o formulário) */
    async getCategorias() {
        return await categoriaDAO.findAll();
    }
}
