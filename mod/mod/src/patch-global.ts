import { lua_thread, wait } from '@peetland/moonloader';
import type { LuaThread } from '@peetland/moonloader';

type AnyFunction = (...args: never[]) => unknown;

let timeoutId = 0;
const timeouts = new Map<number, LuaThread<unknown[]>>();
let intervalId = 0;
const intervals = new Map<number, LuaThread<unknown[]>>();

function setTimeout(
  callback: AnyFunction,
  timeout: number = 0,
  ...args: Parameters<AnyFunction>
): number {
  const id = timeoutId++;
  const thread = lua_thread.create(() => {
    wait(timeout);

    if (timeouts.has(id)) {
      timeouts.delete(id);
      callback(...args);
    }
  });

  timeouts.set(id, thread);

  return id;
}

function clearTimeout(timeoutId: number) {
  const thread = timeouts.get(timeoutId);
  if (thread) {
    thread.terminate();
  }
  timeouts.delete(timeoutId);
}

function setInterval(
  callback: AnyFunction,
  timeout: number = 0,
  ...args: Parameters<AnyFunction>
): number {
  const id = intervalId++;
  const thread = lua_thread.create_suspended(() => {
    while (intervals.has(id)) {
      wait(timeout);

      if (intervals.has(id)) {
        callback(...args);
      }
    }
  });

  intervals.set(id, thread);
  thread.run();

  return id;
}

function clearInterval(intervalId: number) {
  // Поток не завершается через terminate: clearInterval часто вызывают из колбэка этого же
  // интервала, и после terminate нативные функции в оставшейся части колбэка роняют игру.
  // Поток завершится сам: после wait цикл увидит, что интервала больше нет
  intervals.delete(intervalId);
}

globalThis.setTimeout = setTimeout;
globalThis.clearTimeout = clearTimeout;
globalThis.setInterval = setInterval;
globalThis.clearInterval = clearInterval;
