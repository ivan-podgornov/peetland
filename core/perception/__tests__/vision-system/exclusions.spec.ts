import { ActorRegistry } from '@peetland/game';
import type { IActor, IActorRegistry } from '@peetland/game';
import { Geometry } from '@peetland/geometry';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { AlwaysClearLos, VisionSystem } from '../../src';

import { getPointAt } from '@peetland/perception/dev';

describe('VisionSystem', () => {
  describe('#getVisibleActors — кто не виден', () => {
    it('Не возвращает самого смотрящего', () => {
      const registry = new ActorRegistry();
      const target = createActor();
      registry.register(target);
      const vision = new VisionSystem({
        registry,
        los: new AlwaysClearLos(),
        geometry: new Geometry(),
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([]);
    });

    it('Не возвращает деспавненного актора', () => {
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
      other.despawn();

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([]);
    });

    it('Не возвращает деспавненного актора, даже если реестр его вернул', () => {
      const target = createActor();
      const other = createActor({ position: getPointAt(0, 5) });
      other.despawn();
      const registry: IActorRegistry = {
        register() {},
        remove() {},
        getAll(): IActor[] {
          return [target, other];
        },
      };
      const vision = new VisionSystem({
        registry,
        los: new AlwaysClearLos(),
        geometry: new Geometry(),
      });

      const visible = vision.getVisibleActors(target, 10);

      expect(visible).toStrictEqual([]);
    });
  });
});
