import * as prismic from "https://esm.sh/@prismicio/client@7";

const REPOSITORY = "semana-meio-ambiente-if";

const client = prismic.createClient(REPOSITORY);
const container = document.getElementById("cards-container");

function criarCard(doc) {
  const { titulo, inicio, descricao, local } = doc.data;

  const card = document.createElement("article");
  card.className = "card";

  const badge = document.createElement("span");
  badge.className = "data-badge";
  const data = prismic.asDate(inicio);
  badge.textContent = data
    ? data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    : "Data a definir";

  const h3 = document.createElement("h3");
  h3.textContent = titulo || "Sem título";

  const p = document.createElement("p");
  p.textContent = [descricao, local].filter(Boolean).join(" · ");

  card.append(badge, h3, p);
  return card;
}

async function carregarProgramacao() {
  try {
    const atividades = await client.getAllByType("atividade", {
      orderings: { field: "my.atividade.inicio", direction: "asc" },
    });

    container.replaceChildren();

    if (atividades.length === 0) {
      container.innerHTML = '<p class="loading-text">Programação em breve.</p>';
      return;
    }

    atividades.forEach((doc) => container.append(criarCard(doc)));
  } catch (erro) {
    console.error("Erro ao carregar programação:", erro);
    container.innerHTML =
      '<p class="loading-text">Não foi possível carregar a programação.</p>';
  }
}

carregarProgramacao();

// Luz que segue o cursor no hero
const hero = document.querySelector(".hero");
if (hero) {
  hero.addEventListener("mousemove", (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", `${e.clientX - r.left}px`);
    hero.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
}