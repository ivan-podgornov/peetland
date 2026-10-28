import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { DEFAULT_ANIMATION_DURATION } from '../../../src';
import { createActor } from '../../helpers';

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

      it('Делает текущей командой новую анимацию', () => {
        const actor = createActor();
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();
        const previous = actor.currentCommand;

        actor.playAnimation('pay').subscribe();

        expect(actor.currentCommand).not.toBe(previous);
      });
    });

    describe('Если во время анимации актор получил другую команду', () => {
      it('Завершает Observable анимации ошибкой', () => {
        const actor = createActor();
        const error = vi.fn();
        actor.playAnimation('pay').subscribe({ error });

        actor.playAnimation('beg-sitting').subscribe();

        expect(error).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
      });

      it('Не завершает Observable прерванной анимации успешно', () => {
        const timer = new ManualTimer();
        const actor = createActor({ timer });
        const complete = vi.fn();
        actor.playAnimation('pay').subscribe({ complete });
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();

        timer.advance(DEFAULT_ANIMATION_DURATION);

        expect(complete).not.toHaveBeenCalled();
      });

      it('Не сбрасывает новую команду, когда проходит длительность прерванной анимации', () => {
        const timer = new ManualTimer();
        const actor = createActor({
          timer,
          animationDurations: { pay: 1000, 'beg-sitting': 3000 },
        });
        actor.playAnimation('pay').subscribe();
        actor.playAnimation('beg-sitting').subscribe();
        const current = actor.currentCommand;

        timer.advance(1000);

        expect(actor.currentCommand).toBe(current);
      });
    });
  });
});
