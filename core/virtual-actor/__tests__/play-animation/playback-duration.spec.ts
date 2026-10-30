import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { createActor } from '../helpers';

describe('VirtualActor', () => {
  describe('#playAnimation', () => {
    describe('Для зацикленной анимации', () => {
      it('Завершает Observable, когда проходит переданное время проигрывания', () => {
        const timer = new ManualTimer();
        const actor = createActor({ timer });
        const complete = vi.fn();
        actor.playAnimation('trash-search', 5000).execute().subscribe({ complete });

        timer.advance(5000);

        expect(complete).toHaveBeenCalledOnce();
      });

      it('Не завершает Observable, пока переданное время проигрывания не прошло', () => {
        const timer = new ManualTimer();
        const actor = createActor({ timer });
        const complete = vi.fn();
        actor.playAnimation('trash-search', 5000).execute().subscribe({ complete });

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
      const error = vi.fn();
      actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).execute().subscribe({ error });

      try {
        actor.playAnimation('trash-search');
      } catch {
        // Ошибка проверяется в других тестах
      }

      expect(error).not.toHaveBeenCalled();
    });
  });
});
