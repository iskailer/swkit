import { GameSession } from '../domain/game-session.js';
import { getCardRepository } from '../infrastructure/browser-card-repository.js';
import { renderToolFooter } from '../../shared/presentation/tool-footer.js';

export function renderDuvido(root, goHome, manageCards, collaborators = []) {
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
    page.innerHTML = `<header class="duvido-topbar">
    <button class="back-link" type="button">← Ferramentas</button>
    <p class="eyebrow">Duvido</p></header>
    <main class="duvido-tutorial">
      <p class="duvido-tutorial__badge">Como jogar</p>
      <h1>duvido que validou!</h1>
      <p class="duvido-tutorial__badge">Regras</p>
      <ol>
        <li>O facilitador lê a pergunta do card, mas não revela a resposta.</li>
        <li>Um jogador inicia falando um <b>número</b> como seu palpite.</li>
        <li>Na sua vez, o próximo jogador deve escolher:</li>
        <ul>
          <li><b>Aumentar o número:</b> falar um número maior que o anterior; ou</li>
          <li><b>Duvidar:</b> ele precisa falar <strong>"duvido que validou"</strong> e falar um número menor.</li>
        </ul>
        <li>Quando alguém duvida, a rodada termina. A resposta correta é revelada clicando na carta para virá-la.</li>
        <li>Ganha o jogador que tiver o número mais próximo da resposta correta.</li>
        <li>O jogador que perder desce do palco e outro integrante da mesma equipe assume seu lugar.</li>
      </ol>
      <div class="duvido-actions">
        <md-filled-button class="start-game">Começar jogo</md-filled-button>
        <md-outlined-button class="manage-cards">Gerenciar cartas</md-outlined-button>
      </div>
      <p class="duvido-tutorial__badge">Dinâmica das equipes</p>
       <ul>  
        <li>É recomendado que cada equipe do evento coloque um jogador no palco.</li>
        <li>A cada derrota, o jogador deixa o palco e dá lugar a outro integrante da sua equipe.</li>
        <li>A dinâmica continua até que não reste nenhum jogador de uma das equipes.</li>
       <ul> 
       </br>
       </br>
🏆 Atenção: estratégia, conhecimento e coragem para duvidar podem fazer toda a diferença!
    </main>`;
    page.querySelector('.back-link').addEventListener('click', goHome);
    page.querySelector('.start-game').addEventListener('click', startGame);
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
  page.append(
  renderToolFooter({
    collaborators,
  })
);
}
