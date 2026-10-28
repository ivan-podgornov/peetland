import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { ANIMATION_DURATION, createActor, createAnimations } from '../../helpers';

describe('VirtualActor', () => {
  describe('#playAnimation', () => {
    describe('Если актор выполняет другую команду', () => {
      it('При подписке прерывает её', () => {
        const actor = createActor();
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();
        const cancel = vi.spyOn(actor.currentCommand!, 'cancel');

        actor.playAnimation('pay').subscribe();

        expect(cancel).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
      });

      it('Делает текущей командой проигрывание анимации', () => {
        const actor = createActor();
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();

        actor.playAnimation('pay').subscribe();

        expect(actor.currentCommand?.name).toBe('play-animation');
      });
    });

    describe('Если во время анимации актор получил другую команду', () => {
      it('Завершает Observable анимации ошибкой', () => {
        const actor = createActor();
        const error = vi.fn();
        actor.playAnimation('pay').subscribe({ error });

        actor.playAnimation('item-give').subscribe();

        expect(error).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
      });

      it('Не завершает Observable прерванной анимации успешно', () => {
        const timer = new ManualTimer();
        const actor = createActor({ timer });
        const complete = vi.fn();
        actor.playAnimation('pay').subscribe({ complete });
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();

        timer.advance(ANIMATION_DURATION);

        expect(complete).not.toHaveBeenCalled();
      });

      it('Не сбрасывает новую команду, когда проходит длительность прерванной анимации', () => {
        const timer = new ManualTimer();
        const animations = { ...createAnimations(), pay: { duration: 1000 } };
        const actor = createActor({ timer, animations });
        actor.playAnimation('pay').subscribe();
        actor.goToCoords({ x: 100, y: 0, z: 0 }, 1).subscribe();

        timer.advance(1000);

        expect(actor.currentCommand?.name).toBe('go-to-coords');
      });
    });
  });
});
