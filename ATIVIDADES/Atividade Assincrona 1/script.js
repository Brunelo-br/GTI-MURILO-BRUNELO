// Gerencia registros no localStorage e renderiza a tabela
const form = document.getElementById('formCadastro');
const tabela = document.getElementById('tabelaRegistros').querySelector('tbody');
const mensagem = document.getElementById('mensagem');

function lerRegistros(){
  try{
    return JSON.parse(localStorage.getItem('registros_v1')||'[]');
  }catch(e){
    return [];
  }
}

function salvarRegistros(arr){
  localStorage.setItem('registros_v1', JSON.stringify(arr));
}

function criarLinha(reg, index){
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${escapeHtml(reg.nome)}</td>
    <td>${escapeHtml(reg.email)}</td>
    <td>${escapeHtml(reg.telefone||'')}</td>
    <td>${escapeHtml(reg.cargo||'')}</td>
    <td>${escapeHtml(reg.data||'')}</td>
    <td><button class="action-btn" data-index="${index}" aria-label="Excluir registro ${escapeHtml(reg.nome)}">Excluir</button></td>
  `;
  return tr;
}

function render(){
  tabela.innerHTML = '';
  const regs = lerRegistros();
  if(regs.length===0){
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="6">Nenhum registro encontrado.</td>';
    tabela.appendChild(tr);
    return;
  }
  regs.forEach((r,i)=> tabela.appendChild(criarLinha(r,i)));
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\' : '&#39;'
  }[c]));
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = new FormData(form);
  const registro = Object.fromEntries(data.entries());
  // validações simples
  if(!registro.nome || registro.nome.trim().length<2){
    showMessage('Informe um nome válido.', 'error');
    return;
  }
  if(!registro.email){ showMessage('Informe um email válido.', 'error'); return; }

  const regs = lerRegistros();
  regs.push(registro);
  salvarRegistros(regs);
  render();
  form.reset();
  showMessage('Registro salvo com sucesso.', 'success');
});

function showMessage(text, type){
  mensagem.className = '';
  mensagem.classList.add(type==='success' ? 'msg-success' : 'msg-error');
  mensagem.textContent = text;
  // visível para leitores de tela
  mensagem.classList.remove('sr-only');
  setTimeout(()=>{ mensagem.classList.add('sr-only'); }, 3000);
}

// Delegação para botões de ação (excluir)
tabela.addEventListener('click', (e)=>{
  const btn = e.target.closest('button[data-index]');
  if(!btn) return;
  const idx = Number(btn.dataset.index);
  const regs = lerRegistros();
  if(idx>=0 && idx<regs.length){
    if(confirm(`Excluir ${regs[idx].nome}?`)){
      regs.splice(idx,1);
      salvarRegistros(regs);
      render();
      showMessage('Registro excluído.', 'success');
    }
  }
});

// inicializa
render();
