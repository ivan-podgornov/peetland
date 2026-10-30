import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { createActor, WALKING_SPEED } from '../helpers';

describe('VirtualActor', () => {
  describe('#goToCoords', () => {
    describe('Если актор выполняет другую команду', () => {
      it('До подписки не прерывает её', () => {
        const actor = createActor();
        const error = vi.fn();
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).execute().subscribe({ error });

        actor.goToCoords({ x: -10, y: 0, z: 0 }, 1);

        expect(error).not.toHaveBeenCalled();
      });

      it('При подписке прерывает её', () => {
        const actor = createActor();
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).execute().subscribe();
        const cancel = vi.spyOn(actor.currentCommand!, 'cancel');

        actor.goToCoords({ x: -10, y: 0, z: 0 }, 1).execute().subscribe();

        expect(cancel).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
      });

      it('Завершает Observable прерванной команды ошибкой', () => {
        const actor = createActor();
        const error = vi.fn();
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).execute().subscribe({ error });

        actor.goToCoords({ x: -10, y: 0, z: 0 }, 1).execute().subscribe();

        expect(error).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
      });

      it('Делает текущей командой новое движение', () => {
        const actor = createActor();
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).execute().subscribe();
        const previous = actor.currentCommand;

        actor.goToCoords({ x: -10, y: 0, z: 0 }, 1).execute().subscribe();

        expect(actor.currentCommand).not.toBe(previous);
      });

      it('Двигает актора только к новой точке', () => {
        const timer = new ManualTimer();
        const actor = createActor({ position: { x: 0, y: 0, z: 0 }, timer });
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).execute().subscribe();
        actor.goToCoords({ x: 0, y: 10, z: 0 }, 1).execute().subscribe();

        timer.advance(1000);

        expect(actor.getPosition()).toStrictEqual({ x: 0, y: WALKING_SPEED, z: 0 });
      });
    });
  });
});
