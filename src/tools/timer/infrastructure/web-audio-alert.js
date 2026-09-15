export class WebAudioAlert {
  constructor() {
    this.context = null;
  }

  async unlock() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    this.context ??= new AudioContext();
    if (this.context.state === 'suspended') await this.context.resume();
    return this.context.state === 'running';
  }

  play() {
    if (!this.context || this.context.state !== 'running') return;
    const start = this.context.currentTime;
    [0, 0.22, 0.44].forEach((offset) => {
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(880, start + offset);
      gain.gain.setValueAtTime(0.0001, start + offset);
      gain.gain.exponentialRampToValueAtTime(0.5, start + offset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.19);
      oscillator.connect(gain).connect(this.context.destination);
      oscillator.start(start + offset);
      oscillator.stop(start + offset + 0.2);
    });
  }
}
