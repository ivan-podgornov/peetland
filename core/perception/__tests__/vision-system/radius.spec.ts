import { ActorRegistry } from '@peetland/game';
import { Geometry } from '@peetland/geometry';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { AlwaysClearLos, VisionSystem } from '../../src';

import { getPointAt } from '@peetland/perception/dev';

describe('VisionSystem', () => {
  describe('#getVisibleActors — радиус', () => {
    it('Возвращает актора в радиусе', () => {
      const registry = new ActorRegistry();
      const target = createActor();
      const other = createActor({ position: getPointAt(0, 5) });
      registry.register(target);
      registry.register(other);
      const vision = new VisionSystem({
        registry,
        los: new AlwaysClearLos(),
        geometry: new Geometry(),
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([other]);
    });

    it('Не возвращает актора за пределами радиуса', () => {
      const registry = new ActorRegistry();
      const target = createActor();
      const other = createActor({ position: getPointAt(0, 15) });
      registry.register(target);
      registry.register(other);
      const vision = new VisionSystem({
        registry,
        los: new AlwaysClearLos(),
        geometry: new Geometry(),
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([]);
    });

    it('Возвращает актора ровно на границе радиуса', () => {
      const registry = new ActorRegistry();
      const target = createActor();
      const other = createActor({ position: getPointAt(0, 10) });
      registry.register(target);
      registry.register(other);
      const vision = new VisionSystem({
        registry,
        los: new AlwaysClearLos(),
        geometry: new Geometry(),
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([other]);
    });

    it('Измеряет радиус от позиции смотрящего, а не от начала координат', () => {
      const registry = new ActorRegistry();
      const target = createActor({ position: getPointAt(0, 100) });
      const other = createActor({ position: getPointAt(0, 105) });
      registry.register(target);
      registry.register(other);
      const vision = new VisionSystem({
        registry,
        los: new AlwaysClearLos(),
        geometry: new Geometry(),
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([other]);
    });
  });
});
