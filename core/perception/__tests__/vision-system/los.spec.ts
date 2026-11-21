import { createMockedRegistry } from '@peetland/game/dev';

import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { createMockedLos } from '../../dev/los';
import { VisionSystem } from '../../src';

import { DEFAULT_DEPS } from './helpers';

import { getPointAt } from '@peetland/perception/dev';

describe('VisionSystem', () => {
  describe('#getVisibleActors — прямая видимость', () => {
    it('Не возвращает акторов с перекрытой прямой видимостью', () => {
      const target = createActor();
      const other = createActor();
      const registry = createMockedRegistry([target, other]);
      const vision = new VisionSystem({
        ...DEFAULT_DEPS,
        registry,
        los: createMockedLos(false),
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([]);
    });

    it('Проверяет прямую от позиции смотрящего к позиции актора', () => {
      const targetPosition = getPointAt(0, 100);
      const otherPosition = getPointAt(0, 105);
      const target = createActor({ position: targetPosition });
      const other = createActor({ position: otherPosition });
      const registry = createMockedRegistry([target, other]);
      const los = createMockedLos();
      const vision = new VisionSystem({
        ...DEFAULT_DEPS,
        registry,
        los,
      });

      vision.getVisibleActors(target, 10);

      expect(los.isLineOfSightClear).toHaveBeenCalledWith(targetPosition, otherPosition);
    });
  });
});
