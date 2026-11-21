import { createMockedRegistry } from '@peetland/game/dev';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { VisionSystem } from '../../src';

import { DEFAULT_DEPS } from './helpers';

describe('VisionSystem', () => {
  describe('#getVisibleActors — кто видим', () => {
    it('Возвращает всех акторов в радиусе, области видимости и с чистой прямой видимостью', () => {
      const target = createActor();
      const first = createActor();
      const second = createActor();
      const registry = createMockedRegistry([target, first, second]);
      const vision = new VisionSystem({
        ...DEFAULT_DEPS,
        registry,
      });

      const visible = vision.getVisibleActors(target, 50);

      expect(visible).toStrictEqual([first, second]);
    });

    it('Возвращает только тех акторов, которых вернул реестр', () => {
      const target = createActor();
      const first = createActor();
      const registry = createMockedRegistry([target, first]);
      const vision = new VisionSystem({
        ...DEFAULT_DEPS,
        registry,
      });

      const visible = vision.getVisibleActors(target, 50);

      expect(visible).toStrictEqual([first]);
    });
  });
});
