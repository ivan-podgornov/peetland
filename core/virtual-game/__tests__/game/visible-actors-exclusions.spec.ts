import type { IActor } from '@peetland/game';
import type { Vector3 } from '@peetland/geometry';
import { describe, expect, it } from 'vitest';

import { VirtualGame } from '../../src';

function point(x: number, y: number): Vector3 {
  return {
    x,
    y,
    z: 0,
  };
}

function createActorAt(game: VirtualGame, position: Vector3): IActor {
  return game.actorFactory.create({
    modelId: 230,
    position,
    angle: 0,
  });
}

describe('VirtualGame', () => {
  describe('#getVisibleActors — кого не видно', () => {
    it('Не возвращает самого смотрящего', () => {
      const game = new VirtualGame();
      const target = createActorAt(game, point(0, 0));
      const first = createActorAt(game, point(0, 10));

      const visible = game.getVisibleActors(target, 50);

      expect(visible).toStrictEqual([first]);
    });

    it('Не возвращает деспавненных акторов', () => {
      const game = new VirtualGame();
      const target = createActorAt(game, point(0, 0));
      const first = createActorAt(game, point(0, 10));

      first.despawn();
      const visible = game.getVisibleActors(target, 50);

      expect(visible).toStrictEqual([]);
    });
  });
});
