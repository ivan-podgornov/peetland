import { ActorRegistry } from '@peetland/game';

import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { HUMAN_FOV_DEG, VisionSystem } from '../../src';

import { DEFAULT_DEPS } from './helpers';

import { getPointAt } from '@peetland/perception/dev';

describe('VisionSystem', () => {
  describe('#getVisibleActors — угол зрения', () => {
    it('Возвращает актора перед смотрящим', () => {
      const registry = new ActorRegistry();
      const target = createActor({ angle: 0 });
      const other = createActor({ position: getPointAt(0, 5) });
      registry.register(target);
      registry.register(other);
      const vision = new VisionSystem({
        ...DEFAULT_DEPS,
        registry,
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([other]);
    });

    it('Не возвращает актора за спиной у смотрящего', () => {
      const registry = new ActorRegistry();
      const target = createActor({ angle: 0 });
      const other = createActor({ position: getPointAt(180, 5) });
      registry.register(target);
      registry.register(other);
      const vision = new VisionSystem({
        ...DEFAULT_DEPS,
        registry,
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([]);
    });

    it('Возвращает актора ровно на краю человеческого угла зрения', () => {
      const registry = new ActorRegistry();
      const target = createActor({ angle: 0 });
      const other = createActor({ position: getPointAt(HUMAN_FOV_DEG / 2, 5) });
      registry.register(target);
      registry.register(other);
      const vision = new VisionSystem({
        ...DEFAULT_DEPS,
        registry,
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([other]);
    });

    it('Не возвращает актора за пределами человеческого угла зрения', () => {
      const registry = new ActorRegistry();
      const target = createActor({ angle: 0 });
      const other = createActor({ position: getPointAt(HUMAN_FOV_DEG / 2 + 10, 5) });
      registry.register(target);
      registry.register(other);
      const vision = new VisionSystem({
        ...DEFAULT_DEPS,
        registry,
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([]);
    });

    it('Считает угол от поворота смотрящего, а не от севера', () => {
      const registry = new ActorRegistry();
      const target = createActor({ angle: 180 });
      const other = createActor({ position: getPointAt(180, 5) });
      registry.register(target);
      registry.register(other);
      const vision = new VisionSystem({
        ...DEFAULT_DEPS,
        registry,
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([other]);
    });
  });
});
