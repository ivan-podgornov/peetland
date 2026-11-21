import { createMockedRegistry } from '@peetland/game/dev';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { VisionSystem } from '../../src';

import { DEFAULT_DEPS } from './helpers';

describe('VisionSystem', () => {
  describe('#getVisibleActors — кто не виден', () => {
    it('Не возвращает самого смотрящего', () => {
      const target = createActor();
      const registry = createMockedRegistry([target]);
      const vision = new VisionSystem({
        ...DEFAULT_DEPS,
        registry,
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([]);
    });

    it('Не возвращает деспавненного актора, даже если реестр его вернул', () => {
      const target = createActor();
      const other = createActor();
      other.despawn();
      const registry = createMockedRegistry([target, other]);
      const vision = new VisionSystem({
        ...DEFAULT_DEPS,
        registry,
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([]);
    });
  });
});
