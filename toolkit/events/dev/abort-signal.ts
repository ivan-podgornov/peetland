import { EventTarget } from '../src';
import type { IAbortSignal } from '../src/event-target/types';

/** Создаёт сигнал в переданном состоянии. Сам он состояние не меняет */
export function createMockedAbortSignal(aborted: boolean): IAbortSignal {
  const target = new EventTarget<{ abort: [reason?: unknown] }>();

  return {
    aborted,
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target),
    dispatchEvent: target.dispatchEvent.bind(target),
    when: target.when.bind(target),
  };
}
