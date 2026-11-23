import { ActorRegistry } from '@peetland/game';
import type { Vector3 } from '@peetland/geometry';
import { Geometry } from '@peetland/geometry';
import { createMockedLos, createMockedVisionSystem } from '@peetland/perception/dev';
import { describe, expect, it, vi } from 'vitest';

import { VirtualGame } from '../../src';

function point(x: number, y: number): Vector3 {
  return {
    x,
    y,
    z: 0,
  };
}

describe('VirtualGame', () => {
  describe('#getVisibleActors', () => {
    it('Возвращает акторов, которых вернула система зрения', () => {
      const vision = createMockedVisionSystem();
      const game = new VirtualGame({
        visionSystemFactory: {
          create: vi.fn(() => vision),
        },
      });
      const target = game.actorFactory.create({
        modelId: 230,
        position: point(0, 0),
        angle: 0,
      });
      const first = game.actorFactory.create({
        modelId: 230,
        position: point(0, 10),
        angle: 0,
      });
      const second = game.actorFactory.create({
        modelId: 230,
        position: point(-3, 8),
        angle: 0,
      });
      vi.mocked(vision.getVisibleActors).mockReturnValue([first, second]);

      const visible = game.getVisibleActors(target, 50);

      expect(visible).toStrictEqual([first, second]);
      expect(vision.getVisibleActors).toHaveBeenCalledWith(target, 50);
    });

    it('Собирает систему зрения из реестра, прямой видимости и геометрии игры', () => {
      const actorRegistry = new ActorRegistry();
      const los = createMockedLos();
      const geometry = new Geometry();
      const create = vi.fn(() => createMockedVisionSystem());
      const game = new VirtualGame({
        actorRegistry,
        los,
        geometry,
        visionSystemFactory: {
          create,
        },
      });

      game.actorFactory.create({
        modelId: 230,
        position: point(0, 0),
        angle: 0,
      });

      expect(create).toHaveBeenCalledWith({
        registry: actorRegistry,
        los,
        geometry,
      });
    });
  });
});
