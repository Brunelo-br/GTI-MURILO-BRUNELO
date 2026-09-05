/**
 * src/models/Produto.js
 * Camada Model (M do MVC)
 * Define a estrutura de dados da entidade Produto
 */

export class Produto {
    constructor({ id = null, nome, descricao = '', preco, quantidade_estoque = 0, categoria_id = null, ativo = true, created_at = null, updated_at = null, categoria_nome = '' } = {}) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = parseFloat(preco) || 0;
        this.quantidade_estoque = parseInt(quantidade_estoque) || 0;
        this.categoria_id = categoria_id;
        this.categoria_nome = categoria_nome;
        this.ativo = ativo;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    /** Valida os campos obrigatórios do modelo (regra de negócio) */
    validate() {
        const errors = [];
        if (!this.nome || this.nome.trim().length < 2)
            errors.push('Nome deve ter pelo menos 2 caracteres.');
        if (isNaN(this.preco) || this.preco < 0)
            errors.push('Preço deve ser um valor positivo.');
        if (isNaN(this.quantidade_estoque) || this.quantidade_estoque < 0)
            errors.push('Quantidade em estoque não pode ser negativa.');
        return errors;
    }

    /** Serializa para persistência no banco (sem campos gerados pelo BD) */
    toDAO() {
        const obj = {
            nome: this.nome.trim(),
            descricao: this.descricao?.trim() || '',
            preco: this.preco,
            quantidade_estoque: this.quantidade_estoque,
            ativo: this.ativo
        };
        if (this.categoria_id) obj.categoria_id = this.categoria_id;
        return obj;
    }
}

export class Categoria {
    constructor({ id = null, nome, descricao = '' } = {}) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
    }
}
