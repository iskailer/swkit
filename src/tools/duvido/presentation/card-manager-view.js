import { CardManagementService } from '../application/card-management-service.js';
import { getCardRepository } from '../infrastructure/browser-card-repository.js';

export async function renderCardManager(root, goBack) {
  const service = new CardManagementService(await getCardRepository());
  const page = document.createElement('section');
  page.className = 'card-manager';
  root.replaceChildren(page);
  let editingId = null;
  page.innerHTML = `<header class="card-manager__header"><button class="back-link" type="button">← Voltar ao Duvido</button><p class="eyebrow">Duvido</p><h1>Gerenciar cartas</h1><p>Crie, edite ou retire cartas deste dispositivo.</p><md-filled-button class="new-card">Nova carta</md-filled-button></header><main class="card-manager__content"><section><h2>Cartas de demonstração</h2><div class="card-list seed-list"></div></section><section><h2>Suas cartas</h2><div class="card-list user-list"></div></section></main><dialog class="card-editor"><form method="dialog" class="card-editor__form"><div class="card-editor__top"><h2></h2><button class="close-editor" value="cancel" aria-label="Fechar">×</button></div><label>Pergunta<md-outlined-text-field name="questionText" label="Texto da pergunta"></md-outlined-text-field><small data-error="questionText"></small></label><label>SVG da pergunta<textarea name="questionSvg" rows="5" placeholder="&lt;svg ...&gt;"></textarea><small data-error="questionSvg"></small></label><div class="svg-preview question-preview"></div><label>Resposta<md-outlined-text-field name="answerText" label="Texto da resposta"></md-outlined-text-field><small data-error="answerText"></small></label><label>SVG da resposta<textarea name="answerSvg" rows="5" placeholder="&lt;svg ...&gt;"></textarea><small data-error="answerSvg"></small></label><div class="svg-preview answer-preview"></div><div class="duvido-actions"><md-filled-button type="submit" class="save-card">Salvar</md-filled-button><md-text-button type="button" class="cancel-card">Cancelar</md-text-button></div></form></dialog>`;
  const dialog = page.querySelector('.card-editor');
  const form = page.querySelector('.card-editor__form');
  const renderPreview = (field, selector) => {
    const area = form.elements[field]; const preview = form.querySelector(selector);
    const svg = area.value.trim(); preview.replaceChildren();
    if (!svg) return;
    const image = document.createElement('img'); image.alt = 'Prévia do SVG'; image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`; preview.append(image);
  };
  const openEditor = (card = null) => {
    editingId = card?._id ?? null; form.reset(); form.querySelectorAll('small').forEach((item) => { item.textContent = ''; });
    form.querySelector('h2').textContent = card ? 'Editar carta' : 'Nova carta';
    if (card) { form.elements.questionText.value = card.question.text; form.elements.questionSvg.value = card.question.image; form.elements.answerText.value = card.answer.text; form.elements.answerSvg.value = card.answer.image; }
    renderPreview('questionSvg', '.question-preview'); renderPreview('answerSvg', '.answer-preview'); dialog.showModal();
  };
  const renderLists = async () => {
    const cards = await service.listCards();
    for (const [selector, origin] of [['.seed-list', 'seed'], ['.user-list', 'user']]) {
      const list = page.querySelector(selector); list.replaceChildren(); const group = cards.filter((card) => card.origin === origin);
      if (!group.length) list.innerHTML = '<p class="empty-state">Nenhuma carta nesta seção.</p>';
      group.forEach((card) => {
        const item = document.createElement('article'); item.className = 'card-list__item';
        const title = document.createElement('p'); title.textContent = card.question.text; item.append(title);
        const actions = document.createElement('div'); const edit = document.createElement('md-text-button'); edit.textContent = 'Editar'; edit.addEventListener('click', () => openEditor(card));
        const remove = document.createElement('md-text-button'); remove.textContent = 'Excluir'; remove.addEventListener('click', async () => { await service.deleteCard(card._id); renderLists(); });
        actions.append(edit, remove); item.append(actions); list.append(item);
      });
    }
  };
  page.querySelector('.back-link').addEventListener('click', goBack);
  page.querySelector('.new-card').addEventListener('click', () => openEditor());
  page.querySelector('.cancel-card').addEventListener('click', () => dialog.close());
  form.elements.questionSvg.addEventListener('input', () => renderPreview('questionSvg', '.question-preview'));
  form.elements.answerSvg.addEventListener('input', () => renderPreview('answerSvg', '.answer-preview'));
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); const input = Object.fromEntries(new FormData(form)); const result = await service.save(input, editingId);
    form.querySelectorAll('small').forEach((item) => { item.textContent = result.errors[item.dataset.error] ?? ''; });
    if (result.card) { dialog.close(); await renderLists(); }
  });
  await renderLists();
}
