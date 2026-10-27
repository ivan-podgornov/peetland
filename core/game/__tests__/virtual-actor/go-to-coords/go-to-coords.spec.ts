import { ManualIntervalObservable } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { createActor } from '../../helpers';

describe('VirtualActor', () => {
  describe('#goToCoords', () => {
    it('Не двигает актора до подписки', () => {
      const interval = new ManualIntervalObservable();
      const actor = createActor({ position: { x: 0, y: 0, z: 0 }, interval });

      actor.goToCoords({ x: 10, y: 0, z: 0 }, 1);
      interval.tick(1000);

      expect(actor.getPosition()).toStrictEqual({ x: 0, y: 0, z: 0 });
    });

    it('Не меняет текущую команду до подписки', () => {
      const actor = createActor();

      actor.goToCoords({ x: 10, y: 0, z: 0 }, 1);

      expect(actor.currentCommand).toBeNull();
    });

    it('При подписке делает движение к точке текущей командой', () => {
      const actor = createActor();

      actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();

      expect(actor.currentCommand).not.toBeNull();
    });

    it('При подписке сообщает текущую позицию актора', () => {
      const actor = createActor({ position: { x: 0, y: 0, z: 0 } });
      const next = vi.fn();

      actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe({ next });

      expect(next).toHaveBeenCalledExactlyOnceWith({ x: 0, y: 0, z: 0 });
    });
  });
});
