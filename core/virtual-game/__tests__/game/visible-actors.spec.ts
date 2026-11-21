import type { IActor } from '@peetland/game';
import type { Vector3 } from '@peetland/geometry';
import { createMockedLos } from '@peetland/perception/dev';
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
  describe('#getVisibleActors — кого видно', () => {
    it('Возвращает акторов перед смотрящим в радиусе: виртуальный мир прозрачен', () => {
      const game = new VirtualGame();
      const target = createActorAt(game, point(0, 0));
      const first = createActorAt(game, point(0, 10));
      const second = createActorAt(game, point(-3, 8));

      const visible = game.getVisibleActors(target, 50);

      expect(visible).toStrictEqual([first, second]);
    });

    it('Не возвращает акторов за спиной смотрящего: они вне сектора зрения', () => {
      const game = new VirtualGame();
      const target = createActorAt(game, point(0, 0));
      createActorAt(game, point(0, -10));

      const visible = game.getVisibleActors(target, 50);

      expect(visible).toStrictEqual([]);
    });

    it('Не возвращает акторов дальше радиуса', () => {
      const game = new VirtualGame();
      const target = createActorAt(game, point(0, 0));
      createActorAt(game, point(0, 100));

      const visible = game.getVisibleActors(target, 50);

      expect(visible).toStrictEqual([]);
    });

    it('Не возвращает акторов с перекрытой прямой видимостью', () => {
      const game = new VirtualGame({ los: createMockedLos(false) });
      const target = createActorAt(game, point(0, 0));
      createActorAt(game, point(0, 10));

      const visible = game.getVisibleActors(target, 50);

      expect(visible).toStrictEqual([]);
    });
  });
});
