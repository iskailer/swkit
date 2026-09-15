export function renderToolPlaceholder(root, tool, goHome) {
  const page = document.createElement('section');
  page.className = 'tool-placeholder';
  const name = tool?.name ?? 'Página não encontrada';
  const description = tool
    ? `A ferramenta ${name} será desenvolvida em uma próxima fase.`
    : 'A rota solicitada não existe.';
  page.innerHTML = `<div class="tool-placeholder__content">
    <p class="eyebrow">Sw Toolkit</p>
    <h1>${name}</h1>
    <p>${description}</p>
    <md-filled-button>Voltar para ferramentas</md-filled-button>
  </div>`;
  page.querySelector('md-filled-button').addEventListener('click', goHome);
  root.append(page);
}
