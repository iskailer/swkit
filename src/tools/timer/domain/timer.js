export const TimerState = Object.freeze({
  IDLE: 'IDLE',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  FINISHED: 'FINISHED',
  OVERTIME: 'OVERTIME',
});

export class Timer {
  constructor(seconds, { now = () => performance.now() } = {}) {
    if (!Number.isInteger(seconds) || seconds <= 0) {
      throw new RangeError('A duração deve ser maior que zero.');
    }

    this.initialSeconds = seconds;
    this.remainingSeconds = seconds;
    this.state = TimerState.IDLE;
    this.now = now;
    this.lastStartedAt = null;
  }

  start() {
    if (this.state === TimerState.IDLE) {
      this.remainingSeconds = this.initialSeconds;
    }

    if (this.state === TimerState.RUNNING) {
      return {
        state: this.state,
        justFinished: false,
      };
    }

    this.lastStartedAt = this.now();

    this.state =
      this.remainingSeconds <= 0
        ? TimerState.OVERTIME
        : TimerState.RUNNING;

    return {
      state: this.state,
      justFinished: false,
    };
  }

  pause() {
    if (
      this.state !== TimerState.RUNNING &&
      this.state !== TimerState.OVERTIME
    ) {
      return {
        state: this.state,
        justFinished: false,
      };
    }

    const result = this.tick();

    this.state = TimerState.PAUSED;
    this.lastStartedAt = null;

    return {
      ...result,
      state: this.state,
    };
  }

  resume() {
    return this.start();
  }

  stop() {
    this.remainingSeconds = this.initialSeconds;
    this.state = TimerState.IDLE;
    this.lastStartedAt = null;

    return {
      state: this.state,
      justFinished: false,
    };
  }

  finish() {
    const wasFinished = this.remainingSeconds <= 0;

    this.remainingSeconds = 0;
    this.state = TimerState.OVERTIME;
    this.lastStartedAt = this.now();

    return {
      state: this.state,
      justFinished: !wasFinished,
    };
  }

  tick() {
    if (
      this.state !== TimerState.RUNNING &&
      this.state !== TimerState.OVERTIME
    ) {
      return {
        state: this.state,
        justFinished: false,
      };
    }

    const elapsedSeconds = Math.floor(
      (this.now() - this.lastStartedAt) / 1000
    );

    if (elapsedSeconds <= 0) {
      return {
        state: this.state,
        justFinished: false,
      };
    }

    const previous = this.remainingSeconds;

    this.remainingSeconds -= elapsedSeconds;
    this.lastStartedAt += elapsedSeconds * 1000;

    const justFinished =
      previous > 0 &&
      this.remainingSeconds <= 0;

    this.state =
      this.remainingSeconds <= 0
        ? TimerState.OVERTIME
        : TimerState.RUNNING;

    return {
      state: this.state,
      justFinished,
    };
  }

  get displaySeconds() {
    return Math.abs(this.remainingSeconds);
  }

  get isOvertime() {
    return (
      this.remainingSeconds < 0 ||
      this.state === TimerState.OVERTIME
    );
  }
}

export function parseDuration(value) {
  const match = /^(\d{2}):(\d{2}):(\d{2})$/.exec(value.trim());

  if (!match) return null;

  const [hours, minutes, seconds] = match
    .slice(1)
    .map(Number);

  if (minutes > 59 || seconds > 59) {
    return null;
  }

  const total =
    hours * 3600 +
    minutes * 60 +
    seconds;

  return total > 0 ? total : null;
}

export function formatDuration(totalSeconds, isNegative = false) {
  const seconds = Math.abs(totalSeconds);

  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor(
    (seconds % 3600) / 60
  );

  const remainingSeconds = seconds % 60;

  const body =
    hours > 0
      ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
      : `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

  return `${isNegative ? '-' : ''}${body}`;
}