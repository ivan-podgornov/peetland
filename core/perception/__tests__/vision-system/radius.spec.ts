import type { IActorRegistry } from '@peetland/game';
import { createMockedRegistry } from '@peetland/game/dev';
import { Geometry } from '@peetland/geometry';

import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { VisionSystem } from '../../src';

import { DEFAULT_DEPS } from './helpers';

import { getPointAt } from '@peetland/perception/dev';

function createVision(registry: IActorRegistry, isWithinRadius: boolean): VisionSystem {
  const geometry = new Geometry();

  vi.spyOn(geometry, 'isWithinRadius2d').mockReturnValue(isWithinRadius);

  return new VisionSystem({
    ...DEFAULT_DEPS,
    registry,
    geometry,
  });
}

describe('VisionSystem', () => {
  describe('#getVisibleActors — радиус', () => {
    it('Возвращает актора, если геометрия считает его в радиусе', () => {
      const target = createActor({ angle: 0 });
      const other = createActor({ position: getPointAt(0, 5) });
      const registry = createMockedRegistry([target, other]);
      const vision = createVision(registry, true);

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([other]);
    });

    it('Не возвращает актора, если геометрия считает его вне радиуса', () => {
      const target = createActor({ angle: 0 });
      const other = createActor({ position: getPointAt(0, 5) });
      const registry = createMockedRegistry([target, other]);
      const vision = createVision(registry, false);

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([]);
    });

    it('Проверяет радиус от позиции смотрящего до позиции актора', () => {
      const target = createActor({
        angle: 0,
        position: getPointAt(0, 100),
      });
      const other = createActor({ position: getPointAt(0, 105) });
      const registry = createMockedRegistry([target, other]);
      const geometry = new Geometry();
      const isWithinRadius2d = vi.spyOn(geometry, 'isWithinRadius2d').mockReturnValue(true);
      const vision = new VisionSystem({
        ...DEFAULT_DEPS,
        registry,
        geometry,
      });

      vision.getVisibleActors(target, 50);

      expect(isWithinRadius2d).toHaveBeenCalledWith(other.getPosition(), target.getPosition(), 50);
    });
  });
});
