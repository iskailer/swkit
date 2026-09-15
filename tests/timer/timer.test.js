import test from 'node:test';
import assert from 'node:assert/strict';
import { Timer, TimerState } from '../../src/tools/timer/domain/timer.js';

function clock() {
  let value = 0;
  return { now: () => value, advance: (milliseconds) => { value += milliseconds; } };
}

test('start begins the countdown and calculates elapsed time from timestamps', () => {
  const time = clock(); const timer = new Timer(10, { now: time.now });
  timer.start(); time.advance(3_400); timer.tick();
  assert.equal(timer.remainingSeconds, 7);
  assert.equal(timer.state, TimerState.RUNNING);
});

test('pause preserves the current time', () => {
  const time = clock(); const timer = new Timer(10, { now: time.now });
  timer.start(); time.advance(2_000); timer.pause(); time.advance(8_000); timer.tick();
  assert.equal(timer.remainingSeconds, 8);
  assert.equal(timer.state, TimerState.PAUSED);
});

test('resume continues from the paused time', () => {
  const time = clock(); const timer = new Timer(10, { now: time.now });
  timer.start(); time.advance(2_000); timer.pause();
  timer.resume(); time.advance(1_000); timer.tick();
  assert.equal(timer.remainingSeconds, 7);
});

test('stop resets the timer to its original duration', () => {
  const time = clock(); const timer = new Timer(10, { now: time.now });
  timer.start(); time.advance(4_000); timer.tick(); timer.stop();
  assert.equal(timer.remainingSeconds, 10);
  assert.equal(timer.state, TimerState.IDLE);
});

test('finish reports the zero boundary once', () => {
  const time = clock(); const timer = new Timer(2, { now: time.now });
  timer.start(); time.advance(2_000);
  assert.equal(timer.tick().justFinished, true);
  assert.equal(timer.remainingSeconds, 0);
});

test('overtime counts negatively after zero', () => {
  const time = clock(); const timer = new Timer(2, { now: time.now });
  timer.start(); time.advance(3_000); timer.tick();
  assert.equal(timer.remainingSeconds, -1);
  assert.equal(timer.state, TimerState.OVERTIME);
});
