# Sistema de Gestão — Front-end (semântico, responsivo e acessível)

Arquivos criados:

- `index.html` — página principal com formulário semântico e tabela de visualização.
- `styles.css` — estilos responsivos e acessíveis.
- `script.js` — lógica cliente para salvar em `localStorage` e renderizar registros.

Como usar:

1. Abra o arquivo `index.html` no navegador (duplo-clique ou `File → Open`).
2. Preencha o formulário e clique em "Salvar"; os registros são armazenados localmente no navegador.
3. Na seção "Visualização de Registros" você poderá ver e excluir registros.

Notas de implementação:

- Estrutura baseada em tags semânticas: `header`, `main`, `section`, `form`, `fieldset`, `table`.
- Acessibilidade: `aria-label`, `aria-live`, `role="status"`, `caption` na tabela e foco natural do teclado preservado.
- Responsividade: `grid` com media queries para dispositivos móveis.

Se desejar, eu posso adicionar validação mais robusta, exportação/importação CSV, ou adaptar para envio a um servidor backend.
