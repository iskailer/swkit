export function renderToolFooter({
  collaborators = [],
} = {}) {
  const footer = document.createElement('footer');

  footer.className = 'tool-footer';

  if (!collaborators.length) {
    return footer;
  }

  footer.innerHTML = `
    <div class="tool-footer__content">
      <p class="tool-footer__title">
        Colaboradores principais
      </p>

      <div
        class="tool-footer__collaborators"
        aria-label="Colaboradores principais">
      </div>
    </div>
  `;

  const container = footer.querySelector(
    '.tool-footer__collaborators'
  );

  collaborators.forEach((collaborator) => {
    const item = document.createElement('span');

    item.className = 'tool-footer__collaborator';

    item.textContent = collaborator;

    container.append(item);
  });

  return footer;
}