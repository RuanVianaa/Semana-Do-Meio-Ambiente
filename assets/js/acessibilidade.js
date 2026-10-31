(function () {
  const btnContraste = document.getElementById("btn-contrast");
  const btnAumentar = document.getElementById("btn-aum-fonte");
  const btnDiminuir = document.getElementById("btn-dim-fonte");

  const CHAVE_CONTRASTE = "acess-contraste";
  const CHAVE_FONTE = "acess-fonte";

  const FONTE_MIN = 80; 
  const FONTE_MAX = 150;
  const FONTE_PASSO = 10;
  const FONTE_PADRAO = 100;

  let fonteAtual = FONTE_PADRAO;

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
    }
  }

  // Alto contraste
  function aplicarContraste(ativo) {
    document.body.classList.toggle("high-contrast", ativo);
    if (btnContraste) {
      btnContraste.setAttribute("aria-pressed", String(ativo));
    }
    salvar(CHAVE_CONTRASTE, ativo ? "1" : "0");
  }

  //Tamanho da fonte 
  function aplicarFonte(percentual) {
    fonteAtual = Math.min(FONTE_MAX, Math.max(FONTE_MIN, percentual));
    document.documentElement.style.fontSize = fonteAtual + "%";
    salvar(CHAVE_FONTE, String(fonteAtual));

    // Desativa o botão quando chega ao limite
    if (btnAumentar) btnAumentar.disabled = fonteAtual >= FONTE_MAX;
    if (btnDiminuir) btnDiminuir.disabled = fonteAtual <= FONTE_MIN;
  }

  //Eventos
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

  aplicarContraste(ler(CHAVE_CONTRASTE) === "1");

  const fonteSalva = parseInt(ler(CHAVE_FONTE), 10);
  aplicarFonte(Number.isNaN(fonteSalva) ? FONTE_PADRAO : fonteSalva);
})();