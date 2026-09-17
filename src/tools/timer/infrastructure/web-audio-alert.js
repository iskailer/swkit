export class WebAudioAlert {
  constructor() {
    this.context = null;
  }

  async unlock() {
    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioContext) {
      return false;
    }

    this.context ??= new AudioContext();

    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    return this.context.state === 'running';
  }

  play() {
    if (
      !this.context ||
      this.context.state !== 'running'
    ) {
      return;
    }

    const start = this.context.currentTime;

    const beepDuration = 0.18;
    const pauseDuration = 0.08;

    const sequence = [
      { offset: 0, frequency: 880 },
      { offset: 0.20, frequency: 660 },
      { offset: 0.40, frequency: 880 },
      { offset: 0.60, frequency: 660 },
    ];

    sequence.forEach(({ offset, frequency }) => {
      const oscillator =
        this.context.createOscillator();

      const gain =
        this.context.createGain();

      oscillator.type = 'square';

      oscillator.frequency.setValueAtTime(
        frequency,
        start + offset
      );

      gain.gain.setValueAtTime(
        0.0001,
        start + offset
      );

      gain.gain.exponentialRampToValueAtTime(
        0.45,
        start + offset + 0.01
      );

      gain.gain.setValueAtTime(
        0.45,
        start + offset + beepDuration - 0.02
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        start + offset + beepDuration
      );

      oscillator.connect(gain);
      gain.connect(this.context.destination);

      oscillator.start(start + offset);

      oscillator.stop(
        start + offset + beepDuration + 0.01
      );
    });
  }
}