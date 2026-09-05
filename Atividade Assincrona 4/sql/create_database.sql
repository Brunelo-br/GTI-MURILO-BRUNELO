-- ============================================================
-- Script SQL - Sistema de Gestão de Produtos
-- Banco de Dados: Supabase (PostgreSQL)
-- ============================================================

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela principal de produtos
CREATE TABLE IF NOT EXISTS produtos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10, 2) NOT NULL CHECK (preco >= 0),
    quantidade_estoque INTEGER NOT NULL DEFAULT 0 CHECK (quantidade_estoque >= 0),
    categoria_id BIGINT REFERENCES categorias(id) ON DELETE SET NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_produtos_updated_at
BEFORE UPDATE ON produtos
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Dados iniciais de categorias
INSERT INTO categorias (nome, descricao) VALUES
    ('Eletrônicos', 'Dispositivos e equipamentos eletrônicos'),
    ('Roupas', 'Vestuário e acessórios'),
    ('Alimentos', 'Produtos alimentícios e bebidas'),
    ('Livros', 'Livros, revistas e publicações'),
    ('Ferramentas', 'Ferramentas e equipamentos');

-- Dados iniciais de produtos
INSERT INTO produtos (nome, descricao, preco, quantidade_estoque, categoria_id) VALUES
    ('Notebook Dell Inspiron', 'Notebook 15.6" Intel Core i5, 8GB RAM, 256GB SSD', 3499.90, 15, 1),
    ('Smartphone Samsung Galaxy', 'Tela 6.4", 128GB, 5G', 1899.00, 30, 1),
    ('Camiseta Polo', 'Camiseta polo masculina 100% algodão', 79.90, 100, 2),
    ('Arroz Integral 1kg', 'Arroz integral tipo 1, pacote 1kg', 8.90, 500, 3),
    ('Clean Code - Robert Martin', 'Livro sobre boas práticas de programação', 89.90, 25, 4),
    ('Furadeira Bosch', 'Furadeira de impacto 650W com maleta', 349.00, 20, 5);

-- View para listagem completa
CREATE OR REPLACE VIEW vw_produtos_completo AS
SELECT
    p.id,
    p.nome,
    p.descricao,
    p.preco,
    p.quantidade_estoque,
    p.ativo,
    p.created_at,
    p.updated_at,
    c.id AS categoria_id,
    c.nome AS categoria_nome
FROM produtos p
LEFT JOIN categorias c ON p.categoria_id = c.id;
