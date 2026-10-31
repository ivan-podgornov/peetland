import { lua_thread, localClock, print, wait } from '@peetland/moonloader';

type AnyFunction = (...args: never[]) => unknown;

type ScheduledTimer = {
  callback: AnyFunction;
  args: Parameters<AnyFunction>;
  /** Через сколько миллисекунд вызывать колбэк */
  delay: number;
  /** Когда вызвать колбэк, в миллисекундах от запуска скрипта */
  dueAt: number;
  /** Вызывать ли колбэк повторно, как setInterval */
  repeat: boolean;
};

/**
 * Все таймеры живут в одном потоке, который запускает startTimers. Отдельный поток на каждый таймер
 * не годится: поток, созданный из колбэка другого таймера, после первого wait не продолжается
 */
const timers = new Map<number, ScheduledTimer>();
let lastTimerId = 0;

/** Текущее время в миллисекундах от запуска скрипта */
function now(): number {
  return localClock() * 1000;
}

function schedule(
  callback: AnyFunction,
  delay: number,
  args: Parameters<AnyFunction>,
  repeat: boolean
): number {
  const id = ++lastTimerId;
  timers.set(id, { callback, args, delay, dueAt: now() + delay, repeat });

  return id;
}

/** Вызывает колбэки таймеров, которым пора сработать */
function runDueTimers(): void {
  const time = now();

  // Колбэки могут добавлять и удалять таймеры, поэтому обходим копию
  for (const [id, timer] of [...timers]) {
    if (!timers.has(id) || timer.dueAt > time) {
      continue;
    }

    if (timer.repeat) {
      // Если поток долго не вызывался, например, игра стояла на паузе, интервал срабатывает один
      // раз, а не столько, сколько пропустил
      timer.dueAt = Math.max(timer.dueAt + timer.delay, time);
    } else {
      timers.delete(id);
    }

    try {
      timer.callback(...timer.args);
    } catch (error) {
      // Ошибка одного колбэка не должна останавливать остальные таймеры
      reportError(error);
    }
  }
}

/**
 * Запускает поток, который каждый кадр вызывает колбэки таймеров. Вызывается один раз из main:
 * до этого setTimeout и setInterval только запоминают таймеры
 * @param canRun - можно ли сейчас вызывать колбэки. Пока нельзя, таймеры не срабатывают, а после
 * срабатывают те, которым пора
 */
export function startTimers(canRun: () => boolean): void {
  lua_thread.create(() => {
    while (true) {
      wait(0);

      if (canRun()) {
        runDueTimers();
      }
    }
  });
}

function setTimeout(
  callback: AnyFunction,
  timeout: number = 0,
  ...args: Parameters<AnyFunction>
): number {
  return schedule(callback, timeout, args, false);
}

function setInterval(
  callback: AnyFunction,
  timeout: number = 0,
  ...args: Parameters<AnyFunction>
): number {
  return schedule(callback, timeout, args, true);
}

function clearTimer(timerId: number): void {
  timers.delete(timerId);
}

/** Печатает ошибку в лог MoonLoader: текст и, если есть, стек */
function reportError(error: unknown): void {
  const stack = error instanceof Error ? error.stack : undefined;

  print(`Ошибка: ${String(error)}`);

  if (stack) {
    print(stack);
  }
}

globalThis.setTimeout = setTimeout;
globalThis.clearTimeout = clearTimer;
globalThis.setInterval = setInterval;
globalThis.clearInterval = clearTimer;
globalThis.reportError = reportError;
