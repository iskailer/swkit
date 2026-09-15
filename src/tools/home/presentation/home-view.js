export function renderHome(root, tools, navigate) {
  const page = document.createElement('section');
  page.className = 'home-page';
  page.innerHTML = `
    <header class="home-page__header">
      <p class="eyebrow">Sw</p>
      <h1>Sw<br>Toolkit</h1>
      <p class="home-page__intro">Ferramentas simples para dar ritmo, foco e energia ao seu evento.</p>
    </header>
    <nav class="tool-grid" aria-label="Ferramentas disponíveis"></nav>`;

  const grid = page.querySelector('.tool-grid');
  tools.forEach((tool) => {
    const tile = document.createElement('button');
    tile.className = `tool-tile ${tool.tileClass}`;
    tile.type = 'button';
    tile.setAttribute('aria-label', `Abrir ${tool.name}`);
    tile.innerHTML = `<span class="tool-tile__icon" aria-hidden="true">${tool.icon}</span>
      <span class="tool-tile__name">${tool.name}</span>
      <span class="tool-tile__description">${tool.description}</span>`;
    tile.addEventListener('click', () => navigate(tool.route));
    grid.append(tile);
  });
  root.append(page);
}
