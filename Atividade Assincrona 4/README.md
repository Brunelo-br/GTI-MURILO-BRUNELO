# GestorPro — Sistema de Gestão de Produtos

Aplicação web CRUD completa desenvolvida com o padrão arquitetural **MVC**, integrando front-end com persistência em banco de dados relacional via **Supabase (PostgreSQL)**.

---

## 📐 Arquitetura MVC

```
crud-app/
├── public/
│   └── index.html          ← VIEW: Interface do usuário (HTML/CSS/JS)
├── src/
│   ├── models/
│   │   └── Produto.js      ← MODEL: Entidades e regras de negócio
│   ├── dao/
│   │   └── ProdutoDAO.js   ← DAO: Acesso ao banco de dados (equivalente JDBC)
│   └── controllers/
│       └── ProdutoController.js  ← CONTROLLER: Orquestra Model ↔ View
├── config/
│   └── supabase.js         ← Configuração da conexão com o BD
├── sql/
│   └── create_database.sql ← Script de criação do banco de dados
└── README.md
```

### Papel de cada camada

| Camada | Arquivo | Responsabilidade |
|---|---|---|
| **Model** | `src/models/Produto.js` | Define a estrutura das entidades e valida dados (regras de negócio) |
| **DAO** | `src/dao/ProdutoDAO.js` | Executa operações SQL no banco via API REST do Supabase |
| **Controller** | `src/controllers/ProdutoController.js` | Recebe requisições, aciona Model e DAO, retorna resposta à View |
| **View** | `public/index.html` | Renderiza a interface e delega ações ao Controller |
| **Config/Conexão** | `config/supabase.js` | Gerencia a conexão com o banco (equivalente ao JDBC ConnectionFactory) |

---

## 🗄️ Banco de Dados

**SGBD:** PostgreSQL via Supabase  
**Tabelas:** `produtos`, `categorias`  
**View:** `vw_produtos_completo` (join de produtos com categorias)

### Diagrama ER

```
categorias           produtos
─────────────        ─────────────────────────
id (PK)         ←── categoria_id (FK)
nome                 id (PK)
descricao            nome
created_at           descricao
                     preco
                     quantidade_estoque
                     ativo
                     created_at
                     updated_at
```

---

## ⚙️ Pré-requisitos

- Navegador moderno com suporte a **ES Modules** (Chrome 80+, Firefox 80+, Edge 80+)
- Conta no [Supabase](https://supabase.com) *(já configurada neste projeto)*
- Servidor HTTP local (não pode abrir `index.html` diretamente como arquivo — precisa de servidor)

---

## 🚀 Instruções de Execução

### 1. Clone o repositório

```bash
git clone https://github.com/SEU_USUARIO/crud-app.git
cd crud-app
```

### 2. Configure o banco de dados no Supabase

1. Acesse seu projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor**
3. Cole e execute o conteúdo de `sql/create_database.sql`
4. As tabelas, dados iniciais e a view serão criados automaticamente

### 3. Configure as credenciais (se necessário)

Abra `config/supabase.js` e verifique as variáveis:

```js
const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
const SUPABASE_KEY = 'sua_publishable_key';
```

### 4. Inicie um servidor HTTP local

**Opção A — Node.js (npx):**
```bash
npx serve public
```

**Opção B — Python:**
```bash
cd public
python3 -m http.server 3000
```

**Opção C — VS Code:**  
Instale a extensão **Live Server** e clique em "Go Live" com `public/index.html` aberto.

### 5. Acesse no navegador

```
http://localhost:3000
```

---

## 🔧 Operações CRUD implementadas

| Operação | HTTP | Método Controller | Método DAO | SQL equivalente |
|---|---|---|---|---|
| **Create** | POST | `create(body)` | `ProdutoDAO.create()` | `INSERT INTO produtos` |
| **Read All** | GET | `getAll(search)` | `ProdutoDAO.findAll()` | `SELECT * FROM vw_produtos_completo` |
| **Read One** | GET | `getOne(id)` | `ProdutoDAO.findById()` | `SELECT * WHERE id = ?` |
| **Search** | GET | `getAll(search)` | `ProdutoDAO.findByNome()` | `SELECT * WHERE nome ILIKE ?` |
| **Update** | PATCH | `update(id, body)` | `ProdutoDAO.update()` | `UPDATE produtos SET ... WHERE id = ?` |
| **Delete** | DELETE | `remove(id)` | `ProdutoDAO.delete()` | `DELETE FROM produtos WHERE id = ?` |

---

## 📦 Tecnologias utilizadas

- **Front-end:** HTML5, CSS3, JavaScript (ES Modules nativos)
- **Banco de dados:** PostgreSQL (via Supabase)
- **Comunicação BD:** API REST do Supabase (equivalente funcional ao JDBC)
- **Padrão arquitetural:** MVC com camada DAO
- **Hospedagem BD:** [Supabase](https://supabase.com)

---

## 📝 Funcionalidades

- ✅ Listagem de produtos com informações de categoria
- ✅ Busca por nome (filtro em tempo real)
- ✅ Filtro por categoria
- ✅ Cadastro de novos produtos
- ✅ Edição de produtos existentes
- ✅ Exclusão com confirmação
- ✅ Validação de dados no Controller (regras de negócio)
- ✅ Feedback visual (toasts de sucesso/erro)
- ✅ Dashboard com estatísticas (total, em estoque, estoque baixo)
- ✅ Interface responsiva (mobile-friendly)
