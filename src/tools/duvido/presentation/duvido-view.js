import { GameSession } from '../domain/game-session.js';
import { getCardRepository } from '../infrastructure/browser-card-repository.js';

export function renderDuvido(root, goHome, manageCards) {
  const page = document.createElement('section');
  page.className = 'duvido-page';
  let game;

  function cardImage(svg, alt) {
    const image = document.createElement('img');
    image.className = 'duvido-card__image';
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    image.alt = alt;
    return image;
  }

  function showTutorial() {
    page.innerHTML = `<header class="duvido-topbar"><button class="back-link" type="button">← Ferramentas</button><p class="eyebrow">Duvido</p></header>
      <main class="duvido-tutorial"><p class="duvido-tutorial__badge">Como jogar</p><h1>Desafie o grupo.</h1><ol><li>Leia a pergunta em voz alta.</li><li>Toque ou clique na carta para virá-la.</li><li>Revele a resposta e siga para a próxima.</li></ol><div class="duvido-actions"><md-filled-button class="start-game">Começar jogo</md-filled-button><md-text-button class="skip-tutorial">Pular tutorial</md-text-button><md-outlined-button class="manage-cards">Gerenciar cartas</md-outlined-button></div></main>`;
    page.querySelector('.back-link').addEventListener('click', goHome);
    page.querySelector('.start-game').addEventListener('click', startGame);
    page.querySelector('.skip-tutorial').addEventListener('click', startGame);
    page.querySelector('.manage-cards').addEventListener('click', manageCards);
  }

  async function startGame(event) {
    const button = event?.currentTarget;
    if (button) button.disabled = true;
    const repository = await getCardRepository();
    game = new GameSession(await repository.findAvailableCards());
    showNextCard();
  }

  function showNextCard() {
    const card = game.selectRandomCard();
    if (!card) return showComplete();
    let isAnswer = false;
    const total = game.cards.length;
    page.innerHTML = `<header class="duvido-topbar"><button class="back-link" type="button">← Sair do jogo</button><p class="duvido-progress" aria-live="polite"></p></header>
      <main class="duvido-game"><button class="duvido-card" type="button" aria-label="Virar carta"><span class="duvido-card__face"><span class="duvido-card__type"></span><span class="duvido-card__image-slot"></span><span class="duvido-card__text"></span><span class="duvido-card__hint">Toque para virar</span></span></button><div class="duvido-actions"><md-filled-button class="flip-button">Virar</md-filled-button><md-filled-button class="next-button" hidden>Próxima carta</md-filled-button></div><section class="used-deck" aria-label="Cartas já utilizadas"><p>Cartas utilizadas</p><div class="used-deck__cards"></div></section></main>`;
    const cardButton = page.querySelector('.duvido-card');
    const flipButton = page.querySelector('.flip-button');
    const nextButton = page.querySelector('.next-button');
    const face = page.querySelector('.duvido-card__face');
    const imageSlot = page.querySelector('.duvido-card__image-slot');
    const type = page.querySelector('.duvido-card__type');
    const text = page.querySelector('.duvido-card__text');
    const progress = page.querySelector('.duvido-progress');

    const renderFace = () => {
      const side = isAnswer ? card.answer : card.question;
      type.textContent = isAnswer ? 'Resposta' : 'Pergunta';
      text.textContent = side.text;
      imageSlot.replaceChildren(cardImage(side.image, `${isAnswer ? 'Resposta' : 'Pergunta'} ilustrada`));
      progress.textContent = `Carta ${game.usedCardIds.length + 1} de ${total}`;
    };
    const renderDeck = () => {
      const deck = page.querySelector('.used-deck__cards');
      game.usedCardIds.forEach((id) => {
        const used = game.cards.find((item) => item._id === id);
        const chip = document.createElement('span');
        chip.className = 'used-deck__card';
        chip.textContent = used.question.text.replace('DEMO: ', '').slice(0, 18);
        deck.append(chip);
      });
    };
    const flip = () => {
      if (isAnswer) return;
      isAnswer = true;
      face.classList.add('duvido-card__face--flipped');
      window.setTimeout(() => {
        renderFace();
        face.classList.remove('duvido-card__face--flipped');
        flipButton.hidden = true;
        nextButton.hidden = false;
        cardButton.setAttribute('aria-label', 'Resposta revelada');
      }, 170);
    };
    renderFace();
    renderDeck();
    page.querySelector('.back-link').addEventListener('click', goHome);
    cardButton.addEventListener('click', flip);
    flipButton.addEventListener('click', flip);
    nextButton.addEventListener('click', () => { game.markAsUsed(); showNextCard(); });
  }

  function showComplete() {
    page.innerHTML = `<main class="duvido-complete"><p class="eyebrow">Duvido</p><h1>Você utilizou todas as cartas!</h1><p>Bom jogo. Que tal embaralhar e jogar novamente?</p><div class="duvido-actions"><md-filled-button class="restart">Jogar novamente</md-filled-button><md-outlined-button class="home">Voltar</md-outlined-button></div></main>`;
    page.querySelector('.restart').addEventListener('click', showTutorial);
    page.querySelector('.home').addEventListener('click', goHome);
  }

  showTutorial();
  root.append(page);
}
