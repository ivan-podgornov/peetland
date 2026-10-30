import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { VIRTUAL_ANIMATIONS } from '../../src';
import { createActor } from '../helpers';

describe('VirtualActor', () => {
  describe('#playAnimation', () => {
    describe('Если актор выполняет другую команду', () => {
      it('До подписки не прерывает её', () => {
        const actor = createActor();
        const error = vi.fn();
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).execute().subscribe({ error });

        actor.playAnimation('pay');

        expect(error).not.toHaveBeenCalled();
      });

      it('При подписке прерывает её', () => {
        const actor = createActor();
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).execute().subscribe();
        const cancel = vi.spyOn(actor.currentCommand!, 'cancel');

        actor.playAnimation('pay').execute().subscribe();

        expect(cancel).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
      });

      it('Делает текущей командой проигрывание анимации', () => {
        const actor = createActor();
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).execute().subscribe();

        actor.playAnimation('pay').execute().subscribe();

        expect(actor.currentCommand).toHaveProperty('name', 'play-animation');
      });
    });

    describe('Если во время анимации актор получил другую команду', () => {
      it('Завершает Observable анимации ошибкой', () => {
        const actor = createActor();
        const error = vi.fn();
        actor.playAnimation('pay').execute().subscribe({ error });

        actor.playAnimation('item-give').execute().subscribe();

        expect(error).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
      });

      it('Не завершает Observable прерванной анимации успешно', () => {
        const timer = new ManualTimer();
        const actor = createActor({ timer });
        const complete = vi.fn();
        actor.playAnimation('pay').execute().subscribe({ complete });
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).execute().subscribe();

        timer.advance(VIRTUAL_ANIMATIONS.pay.duration);

        expect(complete).not.toHaveBeenCalled();
      });

      it('Не сбрасывает новую команду, когда проходит длительность прерванной анимации', () => {
        const timer = new ManualTimer();
        const actor = createActor({ timer });
        actor.playAnimation('pay').execute().subscribe();
        actor.goToCoords({ x: 100, y: 0, z: 0 }, 1).execute().subscribe();

        timer.advance(VIRTUAL_ANIMATIONS.pay.duration);

        expect(actor.currentCommand).toHaveProperty('name', 'go-to-coords');
      });
    });
  });
});
