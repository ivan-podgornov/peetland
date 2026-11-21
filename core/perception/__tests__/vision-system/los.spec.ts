import { createMockedRegistry } from '@peetland/game/dev';
import type { Vector3 } from '@peetland/geometry';

import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { VisionSystem } from '../../src';
import type { ILosProvider } from '../../src';

import { DEFAULT_DEPS } from './helpers';

import { getPointAt } from '@peetland/perception/dev';

describe('VisionSystem', () => {
  describe('#getVisibleActors — прямая видимость', () => {
    it('Возвращает актора, если прямая видимость свободна', () => {
      const target = createActor({ angle: 0 });
      const other = createActor({ position: getPointAt(0, 5) });
      const registry = createMockedRegistry([target, other]);
      const vision = new VisionSystem({
        ...DEFAULT_DEPS,
        registry,
        los: {
          isLineOfSightClear() {
            return true;
          },
        },
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([other]);
    });

    it('Не возвращает актора, если прямая видимость перекрыта', () => {
      const target = createActor({ angle: 0 });
      const other = createActor({ position: getPointAt(0, 5) });
      const registry = createMockedRegistry([target, other]);
      const vision = new VisionSystem({
        ...DEFAULT_DEPS,
        registry,
        los: {
          isLineOfSightClear() {
            return false;
          },
        },
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([]);
    });

    it('Проверяет прямую от позиции смотрящего к позиции актора', () => {
      const targetPosition = getPointAt(0, 100);
      const otherPosition = getPointAt(0, 105);
      const target = createActor({
        angle: 0,
        position: targetPosition,
      });
      const other = createActor({ position: otherPosition });
      const registry = createMockedRegistry([target, other]);
      const checks: Array<[Vector3, Vector3]> = [];
      const los: ILosProvider = {
        isLineOfSightClear(from, to) {
          checks.push([
            {
              ...from,
            },
            {
              ...to,
            },
          ]);
          return true;
        },
      };
      const vision = new VisionSystem({
        ...DEFAULT_DEPS,
        registry,
        los,
      });

      vision.getVisibleActors(target, 10);

      expect(checks).toStrictEqual([[targetPosition, otherPosition]]);
    });
  });
});
