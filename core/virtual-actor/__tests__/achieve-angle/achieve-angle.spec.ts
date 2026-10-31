import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { createActor } from '../../dev';

describe('VirtualActor', () => {
  describe('#achieveAngle', () => {
    it('Не поворачивает актора до подписки', () => {
      const timer = new ManualTimer();
      const actor = createActor({ angle: 0, timer });

      actor.achieveAngle(90, 15);
      timer.advance(1000);

      expect(actor.getAngle()).toBe(0);
    });

    it('При подписке сообщает текущий угол актора', () => {
      const actor = createActor({ angle: 0 });
      const next = vi.fn();

      actor.achieveAngle(90, 15).execute().subscribe({ next });

      expect(next).toHaveBeenCalledExactlyOnceWith(0);
    });

    it('Через секунду поворачивает актора на угол', () => {
      const timer = new ManualTimer();
      const actor = createActor({ angle: 0, timer });
      actor.achieveAngle(90, 15).execute().subscribe();

      timer.advance(1000);

      expect(actor.getAngle()).toBe(90);
    });

    it('Через секунду сообщает новый угол актора', () => {
      const timer = new ManualTimer();
      const actor = createActor({ angle: 0, timer });
      const next = vi.fn();
      actor.achieveAngle(90, 15).execute().subscribe({ next });

      timer.advance(1000);

      expect(next).toHaveBeenLastCalledWith(90);
    });

    it('Поворачивает актора на угол, приведённый к диапазону [0, 360)', () => {
      const timer = new ManualTimer();
      const actor = createActor({ angle: 0, timer });
      actor.achieveAngle(-90, 15).execute().subscribe();

      timer.advance(1000);

      expect(actor.getAngle()).toBe(270);
    });
  });
});
