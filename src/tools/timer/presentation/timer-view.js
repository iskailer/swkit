import {
  Timer,
  TimerState,
  formatDuration,
  parseDuration
} from '../domain/timer.js';

import { WebAudioAlert } from '../infrastructure/web-audio-alert.js';
import { renderToolFooter } from '../../shared/presentation/tool-footer.js';

const presets = [
  ['30s', 30],
  ['1 min', 60],
  ['3 min', 180],
  ['4 min', 240],
  ['5 min', 300],
  ['10 min', 600],
  ['15 min', 900],
  ['30 min', 1800],
];

export function renderTimer(root, goHome, collaborators = []) {
  const page = document.createElement('section');
  page.className = 'timer-page';

  const alert = new WebAudioAlert();

  let timer;
  let frameId;

  // Controla a repetição do alerta sonoro durante o overtime.
  let alertIntervalId;

  let soundEnabled = true;

  // Guarda a duração escolhida pelo usuário.
  // Fica disponível para o botão "Reiniciar".
  let selectedDurationSeconds = 0;

  function cancelLoop() {
    if (frameId) {
      window.cancelAnimationFrame(frameId);
    }

    frameId = undefined;
  }

  function stopAlertLoop() {
    if (alertIntervalId) {
      window.clearInterval(alertIntervalId);
    }

    alertIntervalId = undefined;
  }

  function startAlertLoop() {
    if (!soundEnabled) {
      return;
    }

    // Evita criar mais de um loop de som.
    if (alertIntervalId) {
      return;
    }

    // Toca imediatamente.
    alert.play();

    // Continua chamando o alerta enquanto o timer
    // estiver rodando, inclusive durante o overtime.
    alertIntervalId = window.setInterval(() => {
      if (
        !timer ||
        (
          timer.state !== TimerState.RUNNING &&
          timer.state !== TimerState.OVERTIME
        )
      ) {
        stopAlertLoop();
        return;
      }

      if (soundEnabled) {
        alert.play();
      }
    }, 1000);
  }

  function scheduleTick(display, status, controls) {
    cancelLoop();

    const loop = () => {
      const result = timer.tick();

      updateDisplay(display);

      // Chegou em zero.
      if (result.justFinished) {
        status.textContent = 'Finalizado';

        controls.start.disabled = true;
        controls.pause.disabled = false;
        controls.stop.disabled = false;
        controls.restart.disabled = false;

        if (soundEnabled) {
          startAlertLoop();
        }
      }

      if (
        timer.state === TimerState.RUNNING ||
        timer.state === TimerState.OVERTIME
      ) {
        frameId = window.requestAnimationFrame(loop);
      }
    };

    frameId = window.requestAnimationFrame(loop);
  }

  function updateDisplay(display) {
    const isFinalTen =
      timer.remainingSeconds > 0 &&
      timer.remainingSeconds <= 10 &&
      timer.state === TimerState.RUNNING;

    display.textContent = formatDuration(
      timer.displaySeconds,
      timer.isOvertime
    );

    display.classList.toggle(
      'timer-display--overtime',
      timer.isOvertime
    );

    display.classList.toggle(
      'timer-display--last-ten',
      isFinalTen
    );
  }

  function showSetup() {
    cancelLoop();
    stopAlertLoop();

    page.className = 'timer-page timer-page--setup';

    page.innerHTML = `
      <header class="timer-setup__header">
        <button class="back-link" type="button">
          ← Ferramentas
        </button>

        <p class="eyebrow">Cronômetro</p>

        <h1>Timer</h1>
      </header>

      <div class="timer-setup__panel">
        <h2>Defina o tempo</h2>

        <md-outlined-text-field
          id="duration"
          label="HH:MM:SS"
          value="00:05:00"
          inputmode="numeric"
          aria-describedby="duration-help">
        </md-outlined-text-field>

        <p
          id="duration-help"
          class="field-help">
          Use horas, minutos e segundos. Ex.: 00:05:00
        </p>

        <p
          class="field-error"
          aria-live="polite">
        </p>

        <div
          class="preset-list"
          aria-label="Tempos predefinidos">
        </div>

        <label class="sound-setting">
          Alerta sonoro

          <md-switch
            selected
            aria-label="Ativar alerta sonoro">
          </md-switch>
        </label>

        <md-filled-button class="start-button">
          Iniciar timer
        </md-filled-button>
      </div>
    `;

    page
      .querySelector('.back-link')
      .addEventListener('click', goHome);

    const input = page.querySelector('#duration');
    const error = page.querySelector('.field-error');
    const soundSwitch = page.querySelector('md-switch');
    const presetList = page.querySelector('.preset-list');

    soundSwitch.addEventListener('change', () => {
      soundEnabled = soundSwitch.selected;

      // Se o usuário desativar o som enquanto o timer
      // estiver rodando, interrompe o alerta.
      if (!soundEnabled) {
        stopAlertLoop();
      } else if (
        timer &&
        (
          timer.state === TimerState.RUNNING ||
          timer.state === TimerState.OVERTIME
        )
      ) {
        startAlertLoop();
      }
    });

    presets.forEach(([label, seconds]) => {
      const button =
        document.createElement('md-outlined-button');

      button.textContent = label;

      button.addEventListener('click', () => {
        input.value =
          `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:` +
          `${String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')}:` +
          `${String(seconds % 60).padStart(2, '0')}`;

        error.textContent = '';
      });

      presetList.append(button);
    });

    page
      .querySelector('.start-button')
      .addEventListener('click', async () => {
        const seconds = parseDuration(input.value);

        if (!seconds) {
          error.textContent =
            'Informe um tempo válido e maior que zero no formato HH:MM:SS.';

          input.focus();

          return;
        }

        if (soundEnabled) {
          await alert.unlock();
        }

        // Guarda o tempo selecionado no escopo correto.
        selectedDurationSeconds = seconds;

        timer = new Timer(selectedDurationSeconds);

        // IMPORTANTE:
        // Não chama timer.start().
        // O timer entra na tela parado.
        showExecution();
      });
  }

  function showExecution() {
    cancelLoop();
    stopAlertLoop();

    page.className =
      'timer-page timer-page--running';

    page.innerHTML = `
      <div class="timer-execution">
        <p
          class="timer-status"
          aria-live="polite">
          Pronto para iniciar
        </p>

        <output
          class="timer-display"
          aria-label="Tempo restante">
        </output>

        <div class="timer-controls">

          <md-filled-button class="start-button">
            Iniciar
          </md-filled-button>

          <md-outlined-button
            class="pause-button"
            disabled>
            Pausar
          </md-outlined-button>

          <md-outlined-button class="stop-button">
            Parar
          </md-outlined-button>

          <md-outlined-button class="restart-button">
            Reiniciar
          </md-outlined-button>

        </div>
      </div>
    `;

    const display =
      page.querySelector('.timer-display');

    const status =
      page.querySelector('.timer-status');

    const controls = {
      start: page.querySelector('.start-button'),
      pause: page.querySelector('.pause-button'),
      stop: page.querySelector('.stop-button'),
      restart: page.querySelector('.restart-button'),
    };

    updateDisplay(display);

    // ==========================================
    // INICIAR / CONTINUAR
    // ==========================================

    controls.start.addEventListener('click', () => {
      if (timer.state === TimerState.IDLE) {
        timer.start();

        status.textContent = 'Em execução';

        controls.start.disabled = true;
        controls.pause.disabled = false;

        scheduleTick(
          display,
          status,
          controls
        );

        return;
      }

      if (timer.state === TimerState.PAUSED) {
        timer.resume();

        if (timer.state === TimerState.OVERTIME) {
          status.textContent = 'Finalizado';

          if (soundEnabled) {
            startAlertLoop();
          }
        } else {
          status.textContent = 'Em execução';
        }

        controls.start.disabled = true;
        controls.pause.disabled = false;

        scheduleTick(
          display,
          status,
          controls
        );
      }
    });

    // ==========================================
    // PAUSAR
    // ==========================================

    controls.pause.addEventListener('click', () => {
      if (
        timer.state !== TimerState.RUNNING &&
        timer.state !== TimerState.OVERTIME
      ) {
        return;
      }

      timer.pause();

      cancelLoop();
      stopAlertLoop();

      status.textContent = 'Pausado';

      controls.start.textContent = 'Continuar';
      controls.start.disabled = false;

      controls.pause.disabled = true;
    });

    // ==========================================
    // PARAR
    // ==========================================

    controls.stop.addEventListener('click', () => {
      stopAlertLoop();
      cancelLoop();

      timer.stop();

      showSetup();
    });

    // ==========================================
    // REINICIAR
    // ==========================================

    controls.restart.addEventListener('click', () => {
      stopAlertLoop();
      cancelLoop();

      timer = new Timer(
        selectedDurationSeconds
      );

      status.textContent =
        'Pronto para iniciar';

      controls.start.textContent =
        'Iniciar';

      controls.start.disabled = false;

      controls.pause.disabled = true;

      controls.restart.disabled = false;
      controls.stop.disabled = false;

      updateDisplay(display);
    });
  }

  showSetup();

  root.append(page);
  page.append(
  renderToolFooter({
    collaborators,
  })
);
}