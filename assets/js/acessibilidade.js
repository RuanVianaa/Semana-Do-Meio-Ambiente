(function () {
  const btnTema = document.getElementById("btn-tema");
  const btnContraste = document.getElementById("btn-contrast");
  const btnAumentar = document.getElementById("btn-aum-fonte");
  const btnDiminuir = document.getElementById("btn-dim-fonte");

  const CHAVE_TEMA = "acess-tema";
  const CHAVE_CONTRASTE = "acess-contraste";
  const CHAVE_FONTE = "acess-fonte";

  const FONTE_MIN = 80; // % do tamanho padrão
  const FONTE_MAX = 150;
  const FONTE_PASSO = 10;
  const FONTE_PADRAO = 100;

  let fonteAtual = FONTE_PADRAO;

  // localStorage pode estar bloqueado, então tudo vai em try/catch
  function ler(chave) {
    try {
      return localStorage.getItem(chave);
    } catch (e) {
      return null;
    }
  }

  function salvar(chave, valor) {
    try {
      localStorage.setItem(chave, valor);
    } catch (e) {
      /* sem armazenamento: o ajuste vale só nesta visita */
    }
  }

  // ---------- Tema claro / escuro ----------
  function aplicarTema(escuro) {
    document.body.classList.toggle("tema-escuro", escuro);
    if (btnTema) {
      btnTema.textContent = escuro ? "Modo claro" : "Modo escuro";
    }
    salvar(CHAVE_TEMA, escuro ? "escuro" : "claro");
  }

  // ---------- Alto contraste ----------
  function aplicarContraste(ativo) {
    document.body.classList.toggle("high-contrast", ativo);
    if (btnContraste) {
      btnContraste.setAttribute("aria-pressed", String(ativo));
    }
    // O alto contraste tem as próprias cores: o botão de tema não faz efeito
    if (btnTema) {
      btnTema.disabled = ativo;
    }
    salvar(CHAVE_CONTRASTE, ativo ? "1" : "0");
  }

  // ---------- Tamanho da fonte ----------
  function aplicarFonte(percentual) {
    fonteAtual = Math.min(FONTE_MAX, Math.max(FONTE_MIN, percentual));
    document.documentElement.style.fontSize = fonteAtual + "%";
    salvar(CHAVE_FONTE, String(fonteAtual));

    // Desativa o botão quando chega ao limite
    if (btnAumentar) btnAumentar.disabled = fonteAtual >= FONTE_MAX;
    if (btnDiminuir) btnDiminuir.disabled = fonteAtual <= FONTE_MIN;
  }

  // ---------- Eventos ----------
  if (btnTema) {
    btnTema.addEventListener("click", function () {
      aplicarTema(!document.body.classList.contains("tema-escuro"));
    });
  }

  if (btnContraste) {
    btnContraste.addEventListener("click", function () {
      aplicarContraste(!document.body.classList.contains("high-contrast"));
    });
  }

  if (btnAumentar) {
    btnAumentar.addEventListener("click", function () {
      aplicarFonte(fonteAtual + FONTE_PASSO);
    });
  }

  if (btnDiminuir) {
    btnDiminuir.addEventListener("click", function () {
      aplicarFonte(fonteAtual - FONTE_PASSO);
    });
  }

  // ---------- Restaurar preferências salvas ----------
  aplicarTema(ler(CHAVE_TEMA) === "escuro");
  aplicarContraste(ler(CHAVE_CONTRASTE) === "1");

  const fonteSalva = parseInt(ler(CHAVE_FONTE), 10);
  aplicarFonte(Number.isNaN(fonteSalva) ? FONTE_PADRAO : fonteSalva);
})();