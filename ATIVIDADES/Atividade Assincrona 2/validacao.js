/**
 * validacao.js — Módulo de Validação do Lado Cliente
 * ====================================================
 * Implementa validação campo a campo com feedback inline
 * acessível, seguindo os padrões DOM de MICHAEL (2023) e
 * as boas práticas de UX de formulários.
 *
 * Estratégia:
 *  - Cada campo tem uma função validadora específica.
 *  - A validação ocorre no evento "blur" (foco perdido)
 *    para não interromper a digitação.
 *  - No "submit", todos os campos são revalidados e o
 *    envio é bloqueado se houver erros.
 *  - Mensagens de erro ficam em <span role="alert">
 *    vinculados via aria-describedby ao respectivo input.
 */

"use strict";

function inicializarValidacao() {
/* ── Referências aos campos ───────────────────────────────── */
const campos = {
  nome:     document.getElementById("nome"),
  email:    document.getElementById("email"),
  telefone: document.getElementById("telefone"),
  cep:      document.getElementById("cep"),
  numero:   document.getElementById("numero"),
  data:     document.getElementById("data"),
};

/* ── Expressões regulares ─────────────────────────────────── */
const REGEX = {
  nome:     /^[A-Za-zÀ-ÖØ-öø-ÿ]{3,}(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)*$/,
  email:    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  telefone: /^(\(?\d{2}\)?[\s.-]?)(\d{4,5}[\s.-]?\d{4})$/,
  cep:      /^\d{5}-?\d{3}$/,
};

/* ── Mensagens de erro ────────────────────────────────────── */
const MENSAGENS = {
  nome: {
    vazio:    "Nome completo é obrigatório.",
    invalido: "Informe nome e sobrenome (mínimo 2 caracteres cada parte).",
  },
  email: {
    vazio:    "E-mail é obrigatório.",
    invalido: "Informe um e-mail válido. Ex.: nome@empresa.com",
  },
  telefone: {
    invalido: "Formato inválido. Ex.: (11) 91234-5678",
  },
  cep: {
    vazio:    "CEP é obrigatório.",
    invalido: "CEP inválido. Informe no formato 00000-000.",
  },
  numero: {
    vazio: "Informe o número. Use \"S/N\" se não houver.",
  },
  data: {
    vazio:  "Data de registro é obrigatória.",
    futura: "A data não pode ser posterior a hoje.",
  },
};

/* ── Utilitários DOM ──────────────────────────────────────── */

function marcarErro(campo, id, msg) {
  const span = document.getElementById(id);
  if (!span) return;
  span.textContent = msg;
  campo.classList.add("invalido");
  campo.classList.remove("valido");
  campo.setAttribute("aria-describedby", id);
  campo.setAttribute("aria-invalid", "true");
}

function limparErro(campo, id) {
  const span = document.getElementById(id);
  if (span) span.textContent = "";
  campo.classList.remove("invalido");
  campo.classList.add("valido");
  campo.setAttribute("aria-invalid", "false");
  campo.removeAttribute("aria-describedby");
}

/* ── Funções validadoras ──────────────────────────────────── */

function validarNome() {
  const v = campos.nome.value.trim();
  if (!v) { marcarErro(campos.nome, "erro-nome", MENSAGENS.nome.vazio); return false; }
  if (!REGEX.nome.test(v)) { marcarErro(campos.nome, "erro-nome", MENSAGENS.nome.invalido); return false; }
  limparErro(campos.nome, "erro-nome");
  return true;
}

function validarEmail() {
  const v = campos.email.value.trim();
  if (!v) { marcarErro(campos.email, "erro-email", MENSAGENS.email.vazio); return false; }
  if (!REGEX.email.test(v)) { marcarErro(campos.email, "erro-email", MENSAGENS.email.invalido); return false; }
  limparErro(campos.email, "erro-email");
  return true;
}

function validarTelefone() {
  const v = campos.telefone.value.trim();
  if (v && !REGEX.telefone.test(v)) {
    marcarErro(campos.telefone, "erro-telefone", MENSAGENS.telefone.invalido);
    return false;
  }
  limparErro(campos.telefone, "erro-telefone");
  return true;
}

function validarCEP() {
  const v = campos.cep.value.trim();
  if (!v) { marcarErro(campos.cep, "erro-cep", MENSAGENS.cep.vazio); return false; }
  if (!REGEX.cep.test(v)) { marcarErro(campos.cep, "erro-cep", MENSAGENS.cep.invalido); return false; }
  limparErro(campos.cep, "erro-cep");
  return true;
}

function validarNumero() {
  const v = campos.numero.value.trim();
  if (!v) { marcarErro(campos.numero, "erro-numero", MENSAGENS.numero.vazio); return false; }
  limparErro(campos.numero, "erro-numero");
  return true;
}

function validarData() {
  const v = campos.data.value;
  if (!v) { marcarErro(campos.data, "erro-data", MENSAGENS.data.vazio); return false; }
  const selecionada = new Date(v + "T00:00:00");
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  if (selecionada > hoje) { marcarErro(campos.data, "erro-data", MENSAGENS.data.futura); return false; }
  limparErro(campos.data, "erro-data");
  return true;
}

/* ── Função pública: valida todos os campos ───────────────── */
window.validarTudo = function () {
  return [
    validarNome(),
    validarEmail(),
    validarTelefone(),
    validarCEP(),
    validarNumero(),
    validarData(),
  ].every(Boolean);
};

/* ── Máscara CEP ──────────────────────────────────────────── */
function mascaraCEP(e) {
  let v = e.target.value.replace(/\D/g, "").slice(0, 8);
  if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5);
  e.target.value = v;
}

/* ── Máscara Telefone ─────────────────────────────────────── */
function mascaraTelefone(e) {
  let v = e.target.value.replace(/\D/g, "").slice(0, 11);
  if (v.length === 11)      v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  else if (v.length >= 10)  v = v.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  else if (v.length > 6)    v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
  else if (v.length > 2)    v = v.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
  else                      v = v.replace(/^(\d{0,2})$/, "($1");
  e.target.value = v;
}

/* ── Registro de eventos ──────────────────────────────────── */
campos.nome.addEventListener("blur",      validarNome);
campos.email.addEventListener("blur",     validarEmail);
campos.telefone.addEventListener("blur",  validarTelefone);
campos.telefone.addEventListener("input", mascaraTelefone);
campos.cep.addEventListener("blur",       validarCEP);
campos.cep.addEventListener("input",      mascaraCEP);
campos.numero.addEventListener("blur",    validarNumero);
campos.data.addEventListener("blur",      validarData);
campos.data.addEventListener("change",    validarData);
}

document.addEventListener("DOMContentLoaded", inicializarValidacao);
