import * as prismic from "https://esm.sh/@prismicio/client@7";
const REPOSITORY = "semana-meio-ambiente-if";
const LINK_INSCRICAO = "";
const FUSO = "America/Sao_Paulo";

const client = prismic.createClient(REPOSITORY);
const container = document.getElementById("cards-container");
const hero = document.querySelector(".hero");

const prefereMenosMovimento = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const temMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function formatarData(data) {
  const dia = data.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    timeZone: FUSO,
  });
  const hora = data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: FUSO,
  });
  return `${dia} · ${hora}`;
}

function criarCard(doc) {
  const { titulo, inicio, descricao, local } = doc.data;

  const card = document.createElement("article");
  card.className = "card";

  const badge = document.createElement("span");
  badge.className = "data-badge";
  const data = prismic.asDate(inicio);
  badge.textContent = data ? formatarData(data) : "Data a definir";

  const h3 = document.createElement("h3");
  h3.textContent = titulo || "Sem título";

  const p = document.createElement("p");
  p.textContent = [descricao, local].filter(Boolean).join(" · ");

  card.append(badge, h3, p);
  return card;
}

function mostrarMensagem(texto) {
  const p = document.createElement("p");
  p.className = "loading-text";
  p.textContent = texto;
  container.replaceChildren(p);
}

function mostrarErro() {
  const p = document.createElement("p");
  p.className = "loading-text";
  p.textContent = "Não foi possível carregar a programação.";

  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "btn btn-primary";
  botao.textContent = "Tentar de novo";
  botao.addEventListener("click", () => {
    mostrarMensagem("Carregando programação...");
    carregarProgramacao();
  });

  container.replaceChildren(p, botao);
}

async function carregarProgramacao() {
  try {
    const atividades = await client.getAllByType("atividade", {
      orderings: { field: "my.atividade.inicio", direction: "asc" },
    });

    if (atividades.length === 0) {
      mostrarMensagem("Programação em breve.");
      return;
    }

    container.replaceChildren(...atividades.map(criarCard));
  } catch (erro) {
    console.error("Erro ao carregar programação:", erro);
    mostrarErro();
  }
}

if (container) {
  container.setAttribute("aria-live", "polite");
  carregarProgramacao();
}


function configurarVideo() {
  const video = hero?.querySelector(".hero-video");
  if (!video) return;


  if (prefereMenosMovimento) {
    video.pause();
    return;
  }

  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "hero-pause";

  function atualizar() {
    const tocando = !video.paused;
    botao.textContent = tocando ? "Pausar vídeo" : "Reproduzir vídeo";
    botao.setAttribute(
      "aria-label",
      tocando ? "Pausar vídeo de fundo" : "Reproduzir vídeo de fundo",
    );
  }

  botao.addEventListener("click", () => {
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });

  video.addEventListener("play", atualizar);
  video.addEventListener("pause", atualizar);

  hero.append(botao);
  atualizar();
}

configurarVideo();



if (hero && temMouse && !prefereMenosMovimento) {
  hero.addEventListener("mousemove", (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", `${e.clientX - r.left}px`);
    hero.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
}


function configurarInscricao() {
  if (!LINK_INSCRICAO) return;

  const botao = document.querySelector(".hero-buttons .btn-secondary");
  if (!botao) return;

  botao.href = LINK_INSCRICAO;
  botao.target = "_blank";
  botao.rel = "noopener";
}

configurarInscricao();

function configurarMenuAtivo() {
  if (!("IntersectionObserver" in window)) return;

  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const linkPorSecao = new Map();

  links.forEach((link) => {
    const secao = document.querySelector(link.getAttribute("href"));
    if (secao) linkPorSecao.set(secao, link);
  });

  if (linkPorSecao.size === 0) return;

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;

        links.forEach((l) => l.removeAttribute("aria-current"));


        const link = linkPorSecao.get(entrada.target);
        if (link) link.setAttribute("aria-current", "location");
      });
    },

    { rootMargin: "-45% 0px -50% 0px" },
  );

  document.querySelectorAll("section[id]").forEach((secao) => {
    observador.observe(secao);
  });
}

configurarMenuAtivo();