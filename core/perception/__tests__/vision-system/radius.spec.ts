import { createMockedRegistry } from '@peetland/game/dev';
import { createMockedGeometry } from '@peetland/geometry/dev';

import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { VisionSystem } from '../../src';

import { DEFAULT_DEPS } from './helpers';

import { getPointAt } from '@peetland/perception/dev';

describe('VisionSystem', () => {
  describe('#getVisibleActors — радиус', () => {
    it('Не возвращает акторов, которых геометрия считает вне радиуса', () => {
      const target = createActor();
      const other = createActor();
      const registry = createMockedRegistry([target, other]);
      const vision = new VisionSystem({
        ...DEFAULT_DEPS,
        registry,
        geometry: createMockedGeometry({
          isWithinRadius2d: () => false,
        }),
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([]);
    });

    it('Проверяет радиус от позиции смотрящего до позиции актора', () => {
      const targetPosition = getPointAt(0, 100);
      const otherPosition = getPointAt(0, 105);
      const target = createActor({ position: targetPosition });
      const other = createActor({ position: otherPosition });
      const registry = createMockedRegistry([target, other]);
      const geometry = createMockedGeometry();
      const vision = new VisionSystem({
        ...DEFAULT_DEPS,
        registry,
        geometry,
      });

      vision.getVisibleActors(target, 50);

      expect(geometry.isWithinRadius2d).toHaveBeenCalledWith(otherPosition, targetPosition, 50);
    });
  });
});
