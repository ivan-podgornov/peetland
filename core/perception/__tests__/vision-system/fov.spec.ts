import { createMockedRegistry } from '@peetland/game/dev';
import { createMockedGeometry } from '@peetland/geometry/dev';

import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { HUMAN_FOV_DEG, VisionSystem } from '../../src';

import { DEFAULT_DEPS } from './helpers';

import { getPointAt } from '@peetland/perception/dev';

describe('VisionSystem', () => {
  describe('#getVisibleActors — угол зрения', () => {
    it('Не возвращает акторов вне области видимости', () => {
      const target = createActor();
      const other = createActor();
      const registry = createMockedRegistry([target, other]);
      const vision = new VisionSystem({
        ...DEFAULT_DEPS,
        registry,
        geometry: createMockedGeometry({
          isPointInSector2d: () => false,
        }),
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([]);
    });

    it('Проверяет сектор от позиции смотрящего, его поворота и человеческого угла зрения', () => {
      const targetPosition = getPointAt(0, 100);
      const otherPosition = getPointAt(0, 105);
      const target = createActor({
        angle: 90,
        position: targetPosition,
      });
      const other = createActor({ position: otherPosition });
      const registry = createMockedRegistry([target, other]);
      const geometry = createMockedGeometry();
      const vision = new VisionSystem({
        ...DEFAULT_DEPS,
        registry,
        geometry,
      });

      vision.getVisibleActors(target, 50);

      expect(geometry.isPointInSector2d).toHaveBeenCalledWith(
        {
          origin: targetPosition,
          angle: 90,
          fovDeg: HUMAN_FOV_DEG,
        },
        otherPosition
      );
    });
  });
});
