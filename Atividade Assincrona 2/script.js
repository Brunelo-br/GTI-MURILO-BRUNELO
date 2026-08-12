/**
 * script.js — Controlador Principal do Formulário
 * =================================================
 * Responsável por:
 *  - Interceptar o submit e chamar window.validarTudo() (validacao.js)
 *  - Coletar os dados do formulário (incluindo endereço via cep.js)
 *  - Persistir em localStorage
 *  - Renderizar a tabela de registros com manipulação do DOM
 *  - Gerenciar exclusão de registros
 *
 * Padrão de separação de responsabilidades:
 *  validacao.js → regras de validação + máscaras
 *  cep.js       → requisição assíncrona ViaCEP
 *  script.js    → fluxo da aplicação + persistência + DOM da tabela
 */

"use strict";

function inicializarAplicacao() {
/* ── Seletores ─────────────────────────────────────────────── */
const form     = document.getElementById("formCadastro");
const mensagem = document.getElementById("mensagem");
const tbody    = document.querySelector("#tabelaRegistros tbody");

if (!form || !mensagem || !tbody) return;

const CHAVES_LS = ["sgRegistros_v2", "sgRegistros", "registros"];
const MEMORIA_REGISTROS = [];

function obterStorage() {
  try {
    const teste = "__sg_storage_test__";
    window.localStorage.setItem(teste, "1");
    window.localStorage.removeItem(teste);
    return window.localStorage;
  } catch {
    try {
      const teste = "__sg_storage_test__";
      window.sessionStorage.setItem(teste, "1");
      window.sessionStorage.removeItem(teste);
      return window.sessionStorage;
    } catch {
      return null;
    }
  }
}

const STORAGE = obterStorage();

/* ── Persistência ──────────────────────────────────────────── */
function lerRegistros() {
  if (STORAGE) {
    for (const chave of CHAVES_LS) {
      try {
        const valor = STORAGE.getItem(chave);
        if (!valor) continue;
        const dados = JSON.parse(valor);
        if (Array.isArray(dados)) {
          MEMORIA_REGISTROS.length = 0;
          MEMORIA_REGISTROS.push(...dados);
          return dados;
        }
      } catch {}
    }
  }

  return Array.isArray(MEMORIA_REGISTROS) ? [...MEMORIA_REGISTROS] : [];
}

function salvarRegistros(lista) {
  const dados = Array.isArray(lista) ? lista : [];
  MEMORIA_REGISTROS.length = 0;
  MEMORIA_REGISTROS.push(...dados);

  if (STORAGE) {
    CHAVES_LS.forEach(chave => {
      try {
        STORAGE.setItem(chave, JSON.stringify(dados));
      } catch {}
    });
  }
}

/* ── Formatação ────────────────────────────────────────────── */
function formatarData(iso) {
  if (!iso) return "—";
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

function escaparHTML(str) {
  return String(str || "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* ── Feedback ──────────────────────────────────────────────── */
function exibirMensagem(texto, tipo = "sucesso") {
  mensagem.textContent = texto;
  mensagem.className   = tipo;
  mensagem.classList.remove("sr-only");
  clearTimeout(mensagem._t);
  mensagem._t = setTimeout(() => {
    mensagem.textContent = "";
    mensagem.className   = "sr-only";
  }, 5000);
}

/* ── Tabela ────────────────────────────────────────────────── */
function renderizarTabela() {
  const registros = lerRegistros();
  tbody.innerHTML  = "";

  if (!registros.length) {
    const tr = document.createElement("tr");
    tr.className = "vazio";
    tr.innerHTML = `<td colspan="7">Nenhum registro cadastrado ainda.</td>`;
    tbody.appendChild(tr);
    return;
  }

  registros.forEach((r, i) => {
    const tr = document.createElement("tr");
    const cidadeUF = [r.cidade, r.uf].filter(Boolean).join(" / ") || "—";
    tr.innerHTML = `
      <td data-label="Nome">${escaparHTML(r.nome)}</td>
      <td data-label="E-mail">${escaparHTML(r.email)}</td>
      <td data-label="Telefone">${escaparHTML(r.telefone || "—")}</td>
      <td data-label="Cargo">${escaparHTML(r.cargo || "—")}</td>
      <td data-label="Cidade/UF">${escaparHTML(cidadeUF)}</td>
      <td data-label="Data">${formatarData(r.data)}</td>
      <td data-label="Ações">
        <button class="btn-excluir" type="button" data-idx="${i}"
          aria-label="Excluir registro de ${escaparHTML(r.nome)}">
          Excluir
        </button>
      </td>`;
    tbody.appendChild(tr);
  });
}

/* ── Exclusão ──────────────────────────────────────────────── */
tbody.addEventListener("click", e => {
  const btn = e.target.closest(".btn-excluir");
  if (!btn) return;
  const idx  = Number(btn.dataset.idx);
  const regs = lerRegistros();
  const nome = regs[idx]?.nome || "registro";
  if (confirm(`Deseja excluir o registro de "${nome}"?`)) {
    regs.splice(idx, 1);
    salvarRegistros(regs);
    renderizarTabela();
    exibirMensagem(`Registro de "${nome}" excluído.`);
  }
});

/* ── Submit ────────────────────────────────────────────────── */
form.addEventListener("submit", e => {
  e.preventDefault();

  // Chama o validador central definido em validacao.js
  if (typeof window.validarTudo === "function" && !window.validarTudo()) {
    exibirMensagem("Corrija os erros destacados antes de salvar.", "erro");
    // Foca no primeiro campo inválido
    const primeiro = form.querySelector(".invalido");
    if (primeiro) primeiro.focus();
    return;
  }

  const dados = {
    id:          Date.now(),
    nome:        form.nome.value.trim(),
    email:       form.email.value.trim(),
    telefone:    form.telefone.value.trim(),
    cargo:       form.cargo.value,
    cep:         form.cep.value.trim(),
    logradouro:  form.logradouro.value.trim(),
    numero:      form.numero.value.trim(),
    complemento: form.complemento.value.trim(),
    bairro:      form.bairro.value.trim(),
    cidade:      form.cidade.value.trim(),
    uf:          form.uf.value.trim(),
    data:        form.data.value,
    observacoes: form.observacoes.value.trim(),
  };

  const regs = lerRegistros();
  regs.push(dados);
  salvarRegistros(regs);

  form.reset();
  // Remove classes de validação visual dos campos
  form.querySelectorAll(".valido, .invalido").forEach(el => {
    el.classList.remove("valido", "invalido");
  });

  renderizarTabela();
  exibirMensagem(`Registro de "${dados.nome}" salvo com sucesso!`);
  document.getElementById("visualizacao").scrollIntoView({ behavior: "smooth" });
});

/* ── Inicialização ─────────────────────────────────────────── */
renderizarTabela();

// Define a data padrão como hoje
const campoData = document.getElementById("data");
if (campoData && !campoData.value) {
  campoData.valueAsDate = new Date();
}
}

document.addEventListener("DOMContentLoaded", inicializarAplicacao);
