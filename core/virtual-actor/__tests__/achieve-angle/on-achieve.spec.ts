import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { createActor } from '../../dev';

describe('VirtualActor', () => {
  describe('#achieveAngle', () => {
    it('Через секунду завершает команду', () => {
      const timer = new ManualTimer();
      const actor = createActor({ angle: 0, timer });
      const complete = vi.fn();
      actor.achieveAngle(90, 15).execute().subscribe({ complete });

      timer.advance(1000);

      expect(complete).toHaveBeenCalledOnce();
    });

    it('Если актор уже повёрнут на угол в пределах допуска, сразу завершает команду', () => {
      const actor = createActor({ angle: 80 });
      const complete = vi.fn();

      actor.achieveAngle(90, 15).execute().subscribe({ complete });

      expect(complete).toHaveBeenCalledOnce();
    });

    it('Если актор уже повёрнут на угол в пределах допуска, не меняет его угол', () => {
      const timer = new ManualTimer();
      const actor = createActor({ angle: 80, timer });
      actor.achieveAngle(90, 15).execute().subscribe();

      timer.advance(1000);

      expect(actor.getAngle()).toBe(80);
    });

    it('Если актор повёрнут на угол в пределах допуска через переход 360°, сразу завершает команду', () => {
      const actor = createActor({ angle: 355 });
      const complete = vi.fn();

      actor.achieveAngle(5, 15).execute().subscribe({ complete });

      expect(complete).toHaveBeenCalledOnce();
    });

    it('Если актор отвёрнут больше допуска, не завершает команду сразу', () => {
      const actor = createActor({ angle: 70 });
      const complete = vi.fn();

      actor.achieveAngle(90, 15).execute().subscribe({ complete });

      expect(complete).not.toHaveBeenCalled();
    });
  });
});
