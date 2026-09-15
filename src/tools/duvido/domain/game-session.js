export class GameSession {
  constructor(cards, { random = Math.random } = {}) { this.cards = cards.filter((card) => !card.isDeleted); this.random = random; this.resetGame(); }
  selectRandomCard() {
    if (this.currentCard || this.availableCardIds.length === 0) return this.currentCard ?? null;
    const index = Math.floor(this.random() * this.availableCardIds.length);
    const [id] = this.availableCardIds.splice(index, 1);
    this.currentCard = this.cards.find((card) => card._id === id) ?? null;
    return this.currentCard;
  }
  markAsUsed() { if (!this.currentCard) return null; this.usedCardIds.push(this.currentCard._id); const used = this.currentCard; this.currentCard = null; return used; }
  remainingCards() { return this.availableCardIds.length; }
  resetGame() { this.availableCardIds = this.cards.map((card) => card._id); this.usedCardIds = []; this.currentCard = null; }
}
