/**
 * cep.js — Busca Assíncrona de Endereço via ViaCEP
 * ==================================================
 * Implementa a requisição HTTP assíncrona (fetch API)
 * para o serviço público ViaCEP (https://viacep.com.br).
 *
 * Fluxo:
 *  1. Usuário digita o CEP → máscara é aplicada por validacao.js
 *  2. Ao perder o foco (blur), buscarCEP() é acionada.
 *  3. Spinner visível durante a requisição (feedback de loading).
 *  4. Em caso de sucesso, os campos de endereço são preenchidos.
 *  5. Em caso de erro (CEP inválido / rede), mensagem inline.
 *
 * Conceitos aplicados (Riordan, Ajax):
 *  - Fetch API com async/await (sintaxe moderna de Promise)
 *  - Tratamento de erros com try/catch/finally
 *  - Manipulação do DOM sem recarregar a página
 */

"use strict";

function inicializarCEP() {
/* ── Referências DOM ──────────────────────────────────────── */
const campoCEP     = document.getElementById("cep");
const spinner      = document.getElementById("cep-spinner");
const erroCEP      = document.getElementById("erro-cep");

if (!campoCEP || !spinner || !erroCEP) return;

const camposEndereco = {
  logradouro:  document.getElementById("logradouro"),
  bairro:      document.getElementById("bairro"),
  cidade:      document.getElementById("cidade"),
  uf:          document.getElementById("uf"),
};

/* ── Constante da API ─────────────────────────────────────── */
const VIACEP_URL = "https://viacep.com.br/ws/{CEP}/json/";

/* ── Utilitários ──────────────────────────────────────────── */

/** Exibe o spinner e desabilita o campo durante a requisição */
function iniciarBusca() {
  spinner.hidden = false;
  campoCEP.setAttribute("aria-busy", "true");
  campoCEP.readOnly = true;
}

/** Oculta o spinner e reabilita o campo */
function finalizarBusca() {
  spinner.hidden = true;
  campoCEP.setAttribute("aria-busy", "false");
  campoCEP.readOnly = false;
}

/** Preenche os campos de endereço com os dados retornados */
function preencherEndereco(dados) {
  camposEndereco.logradouro.value = dados.logradouro || "";
  camposEndereco.bairro.value     = dados.bairro     || "";
  camposEndereco.cidade.value     = dados.localidade || "";
  camposEndereco.uf.value         = dados.uf         || "";

  // Feedback visual: destaca campos preenchidos automaticamente
  Object.values(camposEndereco).forEach(campo => {
    if (campo.value) {
      campo.classList.add("preenchido-auto");
      // Remove a classe após a animação terminar
      campo.addEventListener("animationend", () =>
        campo.classList.remove("preenchido-auto"), { once: true }
      );
    }
  });

  // Foca no campo "número" após preenchimento automático
  const campoNumero = document.getElementById("numero");
  if (campoNumero) campoNumero.focus();
}

/** Limpa os campos de endereço */
function limparEndereco() {
  Object.values(camposEndereco).forEach(c => c.value = "");
}

/** Exibe mensagem de erro inline no campo CEP */
function mostrarErroCEP(msg) {
  if (!erroCEP) return;
  erroCEP.textContent = msg;
  campoCEP.classList.add("invalido");
  campoCEP.classList.remove("valido");
  campoCEP.setAttribute("aria-invalid", "true");
  campoCEP.setAttribute("aria-describedby", "erro-cep");
}

/* ── Função principal: busca o CEP via fetch ──────────────── */

/**
 * Realiza uma requisição GET assíncrona ao ViaCEP.
 * Utiliza async/await sobre a Fetch API (Promise-based).
 */
async function buscarCEP() {
  const cepBruto = campoCEP.value.replace(/\D/g, "");

  // Pré-validação: exige exatamente 8 dígitos antes de chamar a API
  if (cepBruto.length !== 8) return;

  iniciarBusca();
  limparEndereco();

  try {
    // 1. Monta a URL e realiza a requisição HTTP GET
    const url      = VIACEP_URL.replace("{CEP}", cepBruto);
    const resposta = await fetch(url);

    // 2. Verifica se a requisição HTTP foi bem-sucedida (status 2xx)
    if (!resposta.ok) {
      throw new Error(`Erro na requisição: HTTP ${resposta.status}`);
    }

    // 3. Converte o corpo da resposta de JSON para objeto JS
    const dados = await resposta.json();

    // 4. ViaCEP retorna { erro: true } para CEPs não encontrados
    if (dados.erro) {
      mostrarErroCEP("CEP não encontrado. Verifique e tente novamente.");
      return;
    }

    // 5. Sucesso: preenche os campos com os dados retornados
    preencherEndereco(dados);

  } catch (erro) {
    // Distingue erro de rede (offline) de outros erros
    if (!navigator.onLine) {
      mostrarErroCEP("Sem conexão com a internet. Verifique sua rede.");
    } else {
      mostrarErroCEP("Não foi possível consultar o CEP. Tente novamente.");
    }
    console.error("[cep.js] Erro na busca do CEP:", erro);

  } finally {
    // Sempre é executado — garante que o spinner seja ocultado
    finalizarBusca();
  }
}

/* ── Evento: dispara a busca ao sair do campo CEP ────────── */
campoCEP.addEventListener("blur", buscarCEP);

/* ── Limpa endereço ao resetar o formulário ──────────────── */
const form = document.getElementById("formCadastro");
if (form) {
  form.addEventListener("reset", () => {
    // Aguarda um tick para que o reset nativo seja processado
    setTimeout(limparEndereco, 0);
  });
}
}

document.addEventListener("DOMContentLoaded", inicializarCEP);
