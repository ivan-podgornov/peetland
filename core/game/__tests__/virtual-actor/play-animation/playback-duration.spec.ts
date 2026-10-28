import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { createActor, createAnimations } from '../../helpers';

describe('VirtualActor', () => {
  describe('#playAnimation', () => {
    describe('Для зацикленной анимации', () => {
      it('Завершает Observable, когда проходит переданное время проигрывания', () => {
        const timer = new ManualTimer();
        const animations = { ...createAnimations(), 'trash-search': { duration: 2000 } };
        const actor = createActor({ timer, animations });
        const complete = vi.fn();
        actor.playAnimation('trash-search', 5000).subscribe({ complete });

        timer.advance(5000);

        expect(complete).toHaveBeenCalledOnce();
      });

      it('Не завершает Observable, пока переданное время проигрывания не прошло', () => {
        const timer = new ManualTimer();
        const animations = { ...createAnimations(), 'trash-search': { duration: 2000 } };
        const actor = createActor({ timer, animations });
        const complete = vi.fn();
        actor.playAnimation('trash-search', 5000).subscribe({ complete });

        timer.advance(4999);

        expect(complete).not.toHaveBeenCalled();
      });

      it('Если время проигрывания не передано, выбрасывает ошибку', () => {
        const actor = createActor();

        expect(() => actor.playAnimation('trash-search')).toThrow(Error);
      });

      it('Если время проигрывания равно нулю, выбрасывает RangeError', () => {
        const actor = createActor();

        expect(() => actor.playAnimation('trash-search', 0)).toThrow(RangeError);
      });

      it('Если время проигрывания бесконечно, выбрасывает RangeError', () => {
        const actor = createActor();

        expect(() => actor.playAnimation('trash-search', Infinity)).toThrow(RangeError);
      });
    });

    describe('Для незацикленной анимации', () => {
      it('Если передано время проигрывания, выбрасывает ошибку', () => {
        const actor = createActor();

        expect(() => actor.playAnimation('pay', 5000)).toThrow(Error);
      });
    });

    it('Если время проигрывания не подходит анимации, не прерывает текущую команду', () => {
      const actor = createActor();
      actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();

      try {
        actor.playAnimation('trash-search');
      } catch {
        // Ошибка проверяется в других тестах
      }

      expect(actor.currentCommand?.name).toBe('go-to-coords');
    });
  });
});
