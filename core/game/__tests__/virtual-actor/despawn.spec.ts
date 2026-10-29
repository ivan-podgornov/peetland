import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { createActor } from '../helpers';

describe('VirtualActor', () => {
  describe('#despawn', () => {
    describe('При движении к определённым координатам', () => {
      it('Завершает движение ошибкой', () => {
        const actor = createActor();
        const error = vi.fn();
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe({ error });

        actor.despawn();

        expect(error).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
      });

      it('Останавливает движение', () => {
        const timer = new ManualTimer();
        const actor = createActor({ timer });
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();

        actor.despawn();
        timer.advance(1000);

        expect(actor.getPosition()).toStrictEqual({ x: 0, y: 0, z: 0 });
      });

      it('Сбрасывает текущую команду', () => {
        const actor = createActor();
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();

        actor.despawn();

        expect(actor.currentCommand).toBeNull();
      });
    });

    describe('При проигрывании анимации', () => {
      it('Завершает анимацию ошибкой', () => {
        const actor = createActor();
        const error = vi.fn();
        actor.playAnimation('pay').subscribe({ error });

        actor.despawn();

        expect(error).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
      });

      it('Сбрасывает текущую команду', () => {
        const actor = createActor();
        actor.playAnimation('pay').subscribe();

        actor.despawn();

        expect(actor.currentCommand).toBeNull();
      });
    });

    it('Не влияет на завершённое движение', () => {
      const actor = createActor({ position: { x: 0, y: 0, z: 0 } });
      const error = vi.fn();
      actor.goToCoords({ x: 1, y: 0, z: 0 }, 2).subscribe({ error });

      actor.despawn();

      expect(error).not.toHaveBeenCalled();
    });
  });
});
