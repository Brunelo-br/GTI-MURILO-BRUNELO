# Sistema de Gestão — Front-End Web

Projeto acadêmico desenvolvido em **HTML5 + CSS3 + JavaScript (ES2021)**.  
Trabalhos 1 e 2 — Interface semântica, responsiva, acessível e com requisição assíncrona.

---

## 📁 Estrutura de arquivos

```
sistema-gestao/
├── index.html                  → Estrutura semântica da página
├── styles.css                  → Estilos responsivos e acessíveis
├── validacao.js                → Validação no lado cliente + máscaras
├── cep.js                      → Busca assíncrona de endereço (ViaCEP)
├── script.js                   → Controlador principal + localStorage
├── relatorio.md                → Relatório técnico das escolhas semânticas
├── sistema-gestao.code-workspace → Workspace do VS Code
├── .prettierrc                 → Formatação de código (Prettier)
├── .eslintrc.json              → Regras de linting (ESLint)
└── .gitignore                  → Arquivos ignorados pelo Git
```

---

## 🚀 Como rodar

### Opção 1 — Live Server (recomendado)
1. Abra o VS Code nesta pasta  
2. Instale a extensão **Live Server** (recomendada no workspace)  
3. Clique em **"Go Live"** na barra inferior  
4. O navegador abrirá em `http://127.0.0.1:5500`

### Opção 2 — Abrir direto no navegador
Abra o arquivo `index.html` diretamente no Chrome ou Firefox.  
> ⚠️ A busca de CEP via `fetch()` requer conexão com a internet.

---

## ✅ Funcionalidades

### Trabalho 1 — Interface Semântica
- Formulário de cadastro com `<fieldset>` + `<legend>`
- Tabela de registros com `<thead>`, `<tbody>`, `<caption>`
- Responsivo via CSS Grid com `auto-fit + minmax`
- Acessível: `aria-*`, `:focus-visible`, `prefers-reduced-motion`
- Persistência de dados via **localStorage**

### Trabalho 2 — JavaScript e Ajax
- **Validação no cliente** (`validacao.js`):
  - Nome e sobrenome obrigatórios
  - E-mail com regex RFC simplificado
  - Telefone opcional com máscara `(11) 91234-5678`
  - CEP obrigatório com máscara `00000-000`
  - Número obrigatório
  - Data obrigatória e não futura
- **Busca de CEP** (`cep.js`):
  - `fetch()` com `async/await` → API pública **ViaCEP**
  - Spinner durante a requisição
  - Preenchimento automático: logradouro, bairro, cidade, UF
  - Animação de destaque nos campos preenchidos
  - Tratamento de erros: CEP inválido, sem internet, HTTP error

---

## 🔌 Extensões VS Code recomendadas

| Extensão | Finalidade |
|----------|-----------|
| **Live Server** | Servidor local com hot-reload |
| **Prettier** | Formatação automática de código |
| **ESLint** | Linting de JavaScript |
| **Auto Close Tag** | Fecha tags HTML automaticamente |
| **Auto Rename Tag** | Renomeia tag de abertura e fechamento juntas |
| **Color Highlight** | Visualiza cores CSS inline |
| **Path Intellisense** | Autocomplete de caminhos de arquivo |

---

## 📚 Referências

- FREEMAN, E.; FREEMAN, E. *Head First HTML and CSS*. O'Reilly, 2012.  
- MICHAEL, M. *JavaScript: The Definitive Guide*. O'Reilly, 2023.  
- RIORDAN, R. *Ajax: The Definitive Guide*. O'Reilly, 2008.  
- ViaCEP — API pública de consulta de CEP: https://viacep.com.br  
- WCAG 2.1 — Diretrizes de Acessibilidade: https://www.w3.org/TR/WCAG21/
