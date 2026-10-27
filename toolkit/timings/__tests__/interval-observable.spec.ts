import { AbortController } from '@peetland/events';
import { describe, expect, it, vi } from 'vitest';

import { IntervalObservable } from '../src';

describe('IntervalObservable', () => {
  it('Раз в period миллисекунд сообщает, что прошло period миллисекунд', () => {
    vi.useFakeTimers();
    const interval = new IntervalObservable(1000);
    const next = vi.fn();

    interval.subscribe({ next });
    vi.advanceTimersByTime(2000);

    expect(next.mock.calls).toStrictEqual([[1000], [1000]]);
  });

  it('Ничего не сообщает, пока не прошёл period', () => {
    vi.useFakeTimers();
    const interval = new IntervalObservable(1000);
    const next = vi.fn();

    interval.subscribe({ next });
    vi.advanceTimersByTime(999);

    expect(next).not.toHaveBeenCalled();
  });

  it('Если наблюдатель отписался, больше ему ничего не сообщает', () => {
    vi.useFakeTimers();
    const interval = new IntervalObservable(1000);
    const next = vi.fn();
    const controller = new AbortController();

    interval.subscribe({ next }, { signal: controller.signal });
    controller.abort();
    vi.advanceTimersByTime(1000);

    expect(next).not.toHaveBeenCalled();
  });
});
