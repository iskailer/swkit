import { Timer, TimerState, formatDuration, parseDuration } from '../domain/timer.js';
import { WebAudioAlert } from '../infrastructure/web-audio-alert.js';

const presets = [
  ['30s', 30], ['1 min', 60], ['3 min', 180], ['5 min', 300],
  ['10 min', 600], ['15 min', 900], ['30 min', 1800],
];

export function renderTimer(root, goHome) {
  const page = document.createElement('section');
  page.className = 'timer-page';
  const alert = new WebAudioAlert();
  let timer;
  let frameId;
  let soundEnabled = true;

  function cancelLoop() {
    if (frameId) window.cancelAnimationFrame(frameId);
    frameId = undefined;
  }

  function scheduleTick(display) {
    cancelLoop();
    const loop = () => {
      const result = timer.tick();
      updateDisplay(display);
      if (result.justFinished && soundEnabled) alert.play();
      if (timer.state === TimerState.RUNNING || timer.state === TimerState.OVERTIME) frameId = window.requestAnimationFrame(loop);
    };
    frameId = window.requestAnimationFrame(loop);
  }

  function updateDisplay(display) {
    const isFinalTen = timer.remainingSeconds > 0 && timer.remainingSeconds <= 10 && timer.state === TimerState.RUNNING;
    display.textContent = formatDuration(timer.displaySeconds, timer.isOvertime);
    display.classList.toggle('timer-display--overtime', timer.isOvertime);
    display.classList.toggle('timer-display--last-ten', isFinalTen);
  }

  function showSetup() {
    cancelLoop();
    page.className = 'timer-page timer-page--setup';
    page.innerHTML = `<header class="timer-setup__header"><button class="back-link" type="button">← Ferramentas</button><p class="eyebrow">Cronômetro</p><h1>Timer</h1></header>
      <div class="timer-setup__panel"><h2>Defina o tempo</h2><md-outlined-text-field id="duration" label="HH:MM:SS" value="00:05:00" inputmode="numeric" aria-describedby="duration-help"></md-outlined-text-field><p id="duration-help" class="field-help">Use horas, minutos e segundos. Ex.: 00:05:00</p><p class="field-error" aria-live="polite"></p><div class="preset-list" aria-label="Tempos predefinidos"></div><label class="sound-setting">Alerta sonoro <md-switch selected aria-label="Ativar alerta sonoro"></md-switch></label><md-filled-button class="start-button">Iniciar timer</md-filled-button></div>`;
    page.querySelector('.back-link').addEventListener('click', goHome);
    const input = page.querySelector('#duration');
    const error = page.querySelector('.field-error');
    const soundSwitch = page.querySelector('md-switch');
    soundSwitch.addEventListener('change', () => { soundEnabled = soundSwitch.selected; });
    const presetList = page.querySelector('.preset-list');
    presets.forEach(([label, seconds]) => {
      const button = document.createElement('md-outlined-button');
      button.textContent = label;
      button.addEventListener('click', () => {
        input.value = `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
        error.textContent = '';
      });
      presetList.append(button);
    });
    page.querySelector('.start-button').addEventListener('click', async () => {
      const seconds = parseDuration(input.value);
      if (!seconds) {
        error.textContent = 'Informe um tempo válido e maior que zero no formato HH:MM:SS.';
        input.focus();
        return;
      }
      if (soundEnabled) await alert.unlock();
      timer = new Timer(seconds);
      timer.start();
      showExecution();
    });
  }

  function showExecution() {
    page.className = 'timer-page timer-page--running';
    page.innerHTML = `<div class="timer-execution"><p class="timer-status" aria-live="polite">Em execução</p><output class="timer-display" aria-label="Tempo restante"></output><div class="timer-controls"><md-filled-button class="pause-button">Pausar</md-filled-button><md-outlined-button class="stop-button">Parar</md-outlined-button></div></div>`;
    const display = page.querySelector('.timer-display');
    const status = page.querySelector('.timer-status');
    const pause = page.querySelector('.pause-button');
    updateDisplay(display);
    scheduleTick(display);
    pause.addEventListener('click', () => {
      if (timer.state === TimerState.PAUSED) {
        timer.resume();
        pause.textContent = 'Pausar';
        status.textContent = 'Em execução';
        scheduleTick(display);
      } else {
        timer.pause();
        cancelLoop();
        pause.textContent = 'Continuar';
        status.textContent = 'Pausado';
        updateDisplay(display);
      }
    });
    page.querySelector('.stop-button').addEventListener('click', () => {
      timer.stop();
      showSetup();
    });
  }

  showSetup();
  root.append(page);
}
