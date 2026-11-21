import { ActorRegistry } from '@peetland/game';
import { Geometry } from '@peetland/geometry';
import type { Vector3 } from '@peetland/geometry';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { VisionSystem } from '../../src';
import type { ILosProvider } from '../../src';

import { getPointAt } from '@peetland/perception/dev';

describe('VisionSystem', () => {
  describe('#getVisibleActors — прямая видимость', () => {
    it('Возвращает актора, если прямая видимость свободна', () => {
      const registry = new ActorRegistry();
      const target = createActor();
      const other = createActor({ position: getPointAt(0, 5) });
      registry.register(target);
      registry.register(other);
      const vision = new VisionSystem({
        registry,
        los: {
          isLineOfSightClear() {
            return true;
          },
        },
        geometry: new Geometry(),
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([other]);
    });

    it('Не возвращает актора, если прямая видимость перекрыта', () => {
      const registry = new ActorRegistry();
      const target = createActor();
      const other = createActor({ position: getPointAt(0, 5) });
      registry.register(target);
      registry.register(other);
      const vision = new VisionSystem({
        registry,
        los: {
          isLineOfSightClear() {
            return false;
          },
        },
        geometry: new Geometry(),
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([]);
    });

    it('Проверяет прямую от позиции смотрящего к позиции актора', () => {
      const registry = new ActorRegistry();
      const targetPosition = getPointAt(0, 100);
      const otherPosition = getPointAt(0, 105);
      const target = createActor({ position: targetPosition });
      const other = createActor({ position: otherPosition });
      registry.register(target);
      registry.register(other);
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
        registry,
        los,
        geometry: new Geometry(),
      });

      vision.getVisibleActors(target, 10);

      expect(checks).toStrictEqual([[targetPosition, otherPosition]]);
    });
  });
});
