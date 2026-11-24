import { Geometry } from '@peetland/geometry';
import { describe, expect, it, vi } from 'vitest';

import { VirtualGame } from '../../src';

describe('VirtualGame', () => {
  describe('#advanceTime', () => {
    it('Производит тик каждые 250 миллисекунд внутреннего времени', () => {
      const game = new VirtualGame();
      const onTick = vi.fn();
      game.ticks.subscribe(onTick);

      game.advanceTime(1000);

      expect(onTick).toHaveBeenCalledTimes(4);
    });

    it('Двигает акторов: команды акторов идут по продвинутому времени', () => {
      const game = new VirtualGame();
      const actor = game.actorFactory.create({
        modelId: 230,
        position: Geometry.vector3(0, 0, 0),
        angle: 0,
      });
      actor
        .goToCoords(Geometry.vector3(10, 0, 0), 1)
        .execute()
        .subscribe();

      game.advanceTime(1000);

      expect(actor.getPosition().x).toBeGreaterThan(0);
    });
  });
});
