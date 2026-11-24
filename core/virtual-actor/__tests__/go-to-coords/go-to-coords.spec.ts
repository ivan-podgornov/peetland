import { Geometry } from '@peetland/geometry';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { createActor } from '../../dev';

describe('VirtualActor', () => {
  describe('#goToCoords', () => {
    it('Не двигает актора до подписки', () => {
      const timer = new ManualTimer();
      const actor = createActor({
        position: Geometry.vector3(0, 0, 0),
        timer,
      });

      actor.goToCoords(Geometry.vector3(10, 0, 0), 1);
      timer.advance(1000);

      expect(actor.getPosition()).toStrictEqual({
        x: 0,
        y: 0,
        z: 0,
      });
    });

    it('При подписке сообщает текущую позицию актора', () => {
      const actor = createActor({
        position: Geometry.vector3(0, 0, 0),
      });
      const next = vi.fn();

      actor
        .goToCoords(Geometry.vector3(10, 0, 0), 1)
        .execute()
        .subscribe({ next });

      expect(next).toHaveBeenCalledExactlyOnceWith(Geometry.vector3(0, 0, 0));
    });
  });
});
