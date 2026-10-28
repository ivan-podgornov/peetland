import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { DEFAULT_ANIMATION_DURATION } from '../../../src';
import { createActor } from '../../helpers';

describe('VirtualActor', () => {
  describe('#playAnimation', () => {
    describe('Если длительность анимации есть в таблице', () => {
      it('Завершает Observable, когда проходит эта длительность', () => {
        const timer = new ManualTimer();
        const actor = createActor({ timer, animationDurations: { pay: 4670 } });
        const complete = vi.fn();
        actor.playAnimation('pay').subscribe({ complete });

        timer.advance(4670);

        expect(complete).toHaveBeenCalledOnce();
      });

      it('Не завершает Observable, пока эта длительность не прошла', () => {
        const timer = new ManualTimer();
        const actor = createActor({ timer, animationDurations: { pay: 4670 } });
        const complete = vi.fn();
        actor.playAnimation('pay').subscribe({ complete });

        timer.advance(4669);

        expect(complete).not.toHaveBeenCalled();
      });
    });

    describe('Если длительности анимации нет в таблице', () => {
      it('Завершает Observable, когда проходит длительность по умолчанию', () => {
        const timer = new ManualTimer();
        const actor = createActor({ timer, animationDurations: { pay: 4670 } });
        const complete = vi.fn();
        actor.playAnimation('beg-sitting').subscribe({ complete });

        timer.advance(DEFAULT_ANIMATION_DURATION);

        expect(complete).toHaveBeenCalledOnce();
      });

      it('Не завершает Observable, пока длительность по умолчанию не прошла', () => {
        const timer = new ManualTimer();
        const actor = createActor({ timer, animationDurations: { pay: 4670 } });
        const complete = vi.fn();
        actor.playAnimation('beg-sitting').subscribe({ complete });

        timer.advance(DEFAULT_ANIMATION_DURATION - 1);

        expect(complete).not.toHaveBeenCalled();
      });
    });

    it('Не сообщает значений', () => {
      const timer = new ManualTimer();
      const actor = createActor({ timer });
      const next = vi.fn();
      actor.playAnimation('pay').subscribe({ next });

      timer.advance(DEFAULT_ANIMATION_DURATION);

      expect(next).not.toHaveBeenCalled();
    });

    it('При подписке делает анимацию текущей командой', () => {
      const actor = createActor();

      actor.playAnimation('pay').subscribe();

      expect(actor.currentCommand).not.toBeNull();
    });

    it('Сбрасывает текущую команду, когда анимация закончилась', () => {
      const timer = new ManualTimer();
      const actor = createActor({ timer });
      actor.playAnimation('pay').subscribe();

      timer.advance(DEFAULT_ANIMATION_DURATION);

      expect(actor.currentCommand).toBeNull();
    });

    it('Не начинает анимацию до подписки', () => {
      const actor = createActor();

      actor.playAnimation('pay');

      expect(actor.currentCommand).toBeNull();
    });
  });
});
