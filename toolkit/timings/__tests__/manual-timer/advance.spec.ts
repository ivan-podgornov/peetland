import { AbortController } from '@peetland/events';
import { describe, expect, it, vi } from 'vitest';

import { ManualTimer } from '../../src';

describe('ManualTimer', () => {
  describe('#advance', () => {
    it('Если прошёл period, интервал сообщает, что прошло period миллисекунд', () => {
      const timer = new ManualTimer();
      const next = vi.fn();
      timer.interval(1000).subscribe({ next });

      timer.advance(1000);

      expect(next).toHaveBeenCalledExactlyOnceWith(1000);
    });

    it('Если period не прошёл, интервал ничего не сообщает', () => {
      const timer = new ManualTimer();
      const next = vi.fn();
      timer.interval(1000).subscribe({ next });

      timer.advance(999);

      expect(next).not.toHaveBeenCalled();
    });

    it('Интервал сообщает о каждом прошедшем period', () => {
      const timer = new ManualTimer();
      const next = vi.fn();
      timer.interval(1000).subscribe({ next });

      timer.advance(3500);

      expect(next).toHaveBeenCalledTimes(3);
    });

    it('Время, продвинутое за несколько вызовов, складывается', () => {
      const timer = new ManualTimer();
      const next = vi.fn();
      timer.interval(1000).subscribe({ next });

      timer.advance(500);
      timer.advance(500);

      expect(next).toHaveBeenCalledOnce();
    });

    it('Отсчитывает время каждого интервала от подписки на него', () => {
      const timer = new ManualTimer();
      const next = vi.fn();
      timer.interval(1000).subscribe();

      timer.advance(500);
      timer.interval(1000).subscribe({ next });
      timer.advance(500);

      expect(next).not.toHaveBeenCalled();
    });

    it('Интервалы сообщают о времени в том порядке, в котором подошёл их срок', () => {
      const timer = new ManualTimer();
      const calls: string[] = [];
      timer.interval(300).subscribe(() => calls.push('300'));
      timer.interval(200).subscribe(() => calls.push('200'));

      timer.advance(600);

      expect(calls).toStrictEqual(['200', '300', '200', '300', '200']);
    });

    it('Если наблюдатель отписался, интервал ему ничего не сообщает', () => {
      const timer = new ManualTimer();
      const next = vi.fn();
      const controller = new AbortController();
      timer.interval(1000).subscribe({ next }, { signal: controller.signal });
      controller.abort();

      timer.advance(1000);

      expect(next).not.toHaveBeenCalled();
    });

    it('Интервал, на который подписались во время advance, отсчитывает время от момента подписки', () => {
      const timer = new ManualTimer();
      const next = vi.fn();
      const controller = new AbortController();
      timer.interval(1000).subscribe(
        () => {
          controller.abort();
          timer.interval(1000).subscribe({ next });
        },
        { signal: controller.signal }
      );

      timer.advance(2000);

      expect(next).toHaveBeenCalledOnce();
    });

    it('Если ms отрицательное, выбрасывает RangeError', () => {
      const timer = new ManualTimer();

      expect(() => timer.advance(-1)).toThrow(RangeError);
    });

    it('Если ms равно NaN, выбрасывает RangeError', () => {
      const timer = new ManualTimer();

      expect(() => timer.advance(NaN)).toThrow(RangeError);
    });
  });
});
