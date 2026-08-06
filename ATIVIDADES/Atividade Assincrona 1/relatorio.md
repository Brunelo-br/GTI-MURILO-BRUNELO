# Relatório Técnico — Interface Semântica, Responsiva e Acessível

**Disciplina:** Desenvolvimento Web Front-End  
**Atividade:** Cadastro e Visualização de Dados — Sistema de Gestão  
**Tecnologias:** HTML5 · CSS3 · JavaScript (ES2015+)

---

## 1. Estrutura Semântica HTML5

A construção da interface seguiu os princípios estabelecidos por **Freeman & Freeman** em *Head First HTML and CSS* (O'Reilly), que enfatizam o uso de tags que **descrevem o significado do conteúdo**, e não apenas sua aparência.

### 1.1 Tags estruturais de página

| Tag | Justificativa |
|-----|---------------|
| `<header>` | Delimita o topo do documento — logotipo e navegação principal — diferenciando-o semanticamente do conteúdo (`<main>`). |
| `<nav>` + `<ul>` | Identifica um bloco de navegação, permitindo que tecnologias assistivas ofereçam atalhos de teclado ao menu. O atributo `aria-label="Menu principal"` diferencia esta navegação de outras possíveis na página. |
| `<main>` | Indica ao navegador e às ferramentas de acessibilidade qual é a área de conteúdo central, única por página. |
| `<section>` | Cada seção possui um título associado via `aria-labelledby`, formando uma estrutura de *outline* semântico claro para leitores de tela. |
| `<footer>` | Delimita o rodapé do documento, separando metadados e informações institucionais do conteúdo principal. |

### 1.2 Tags de formulário

O formulário de cadastro utiliza a hierarquia semântica mais rica possível:

- **`<form>`** — coleta de dados com `novalidate` para permitir validação controlada via `checkValidity()` e `reportValidity()`, preservando mensagens de erro acessíveis nativas.  
- **`<fieldset>` + `<legend>`** — agrupa campos com relação temática ("Dados pessoais" / "Dados do registro"). Leitores de tela como NVDA e VoiceOver leem a legenda antes de cada campo do grupo, fornecendo contexto fundamental.  
- **`<label for="id">`** — vínculo explícito entre rótulo e controle. Amplia a área clicável e é lida automaticamente por tecnologias assistivas antes do controle.  
- **`<input type="email|tel|date">`** — tipos semânticos ativam teclados virtuais específicos em dispositivos móveis (e.g., teclado numérico para `tel`) e validação nativa do navegador.  
- **`<select>`** — lista de opções semanticamente correta para escolhas discretas, navegável por teclado.  
- **`<textarea>`** — elemento adequado para texto longo e multilinha, diferente de um `<input type="text">`.  
- **`<button type="submit|reset">`** — tipos nativos eliminam a necessidade de JavaScript adicional para comportamento básico e são reconhecidos por assistentes de tecnologia.

### 1.3 Tags de dados tabulares

A seção de visualização emprega a estrutura semântica completa de tabelas:

- **`<caption>`** — título programaticamente vinculado à tabela, lido por leitores de tela antes dos dados.  
- **`<thead>` / `<tbody>`** — separação lógica entre cabeçalho e corpo, permitindo rolagem independente e melhor renderização em impressão.  
- **`<th scope="col">`** — o atributo `scope` informa à tecnologia assistiva que aquele cabeçalho se aplica a toda a coluna, facilitando a navegação célula a célula.

---

## 2. Acessibilidade (WCAG 2.1 — Nível AA)

Além da semântica, foram implementados os seguintes mecanismos:

- **`aria-required="true"`** nos campos obrigatórios, reforçando a restrição para leitores de tela que podem não interpretar o atributo `required` nativo.  
- **`role="status"` + `aria-live="polite"`** no elemento de mensagem de feedback: atualizações dinâmicas são anunciadas sem interromper o fluxo de leitura.  
- **`.sr-only`** — classe CSS que oculta visualmente elementos mantendo-os acessíveis para leitores de tela (posicionamento absoluto fora do viewport, sem `display:none`).  
- **`:focus-visible`** — contorno de foco visível apenas para navegação por teclado, sem poluição visual para usuários de mouse.  
- **`aria-label` nos botões de excluir** — `"Excluir registro de [Nome]"` fornece contexto inequívoco, evitando múltiplos botões "Excluir" indistinguíveis.  
- **`@media (prefers-reduced-motion: reduce)`** — desativa animações e transições para usuários que solicitam menos movimento (WCAG 2.3.3).

---

## 3. Responsividade (CSS3)

O layout responsivo foi construído sem frameworks externos:

- **`clamp()`** em tamanhos de fonte para escala fluida entre telas pequenas e grandes.  
- **CSS Grid com `auto-fit` + `minmax(220px, 1fr)`** no `.form-grid`: os campos se reorganizam automaticamente de 1 a 4 colunas conforme o espaço disponível, sem breakpoints fixos artificiais.  
- **`overflow-x: auto`** na `.table-wrap`: a tabela rola horizontalmente em telas estreitas em vez de quebrar o layout.  
- **Breakpoint `@media (max-width: 600px)`**: ajustes pontuais para dispositivos móveis — pilha vertical no header, botões em largura total e ocultação da coluna de telefone (a menos importante) para preservar a legibilidade das colunas essenciais.  
- **`position: sticky`** no `<header>`: mantém a navegação acessível durante o scroll sem remover o elemento do fluxo do documento.

---

## 4. Boas Práticas de CSS (Freeman & Freeman)

Seguindo as orientações dos autores:

- **Separação de responsabilidades**: HTML carrega significado; CSS, apresentação; JavaScript, comportamento.  
- **Custom Properties (`--var`)**: sistema de tokens de design centralizado, facilitando manutenção e theming futuro.  
- **Seletores de baixa especificidade**: evitam conflitos em cascata; nenhum uso de `!important`.  
- **Atributo `defer`** no `<script>`: carrega o JavaScript após o parse do HTML, sem bloquear a renderização.

---

## 5. Conclusão

A interface resultante atende integralmente aos critérios da atividade: semântica que comunica estrutura e intenção, responsividade sem dependências externas e acessibilidade aderente ao nível AA do WCAG 2.1. Cada decisão de tag e atributo foi motivada pelo significado do conteúdo e pelo respeito ao usuário — seja ele humano, leitor de tela, mecanismo de busca ou dispositivo móvel.
