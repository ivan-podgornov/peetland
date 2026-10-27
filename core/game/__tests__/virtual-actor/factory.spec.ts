import { Geometry } from '@peetland/geometry';
import { ManualIntervalObservable } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { DespawnableActor, VirtualActorFactory } from '../../src';

describe('VirtualActorFactory', () => {
  describe('#create', () => {
    it('Создаёт актора на переданной позиции', () => {
      const factory = new VirtualActorFactory({
        geometry: new Geometry(),
        interval: new ManualIntervalObservable(),
      });

      const actor = factory.create({ modelId: 230, position: { x: 1, y: 2, z: 3 } });

      expect(actor.getPosition()).toStrictEqual({ x: 1, y: 2, z: 3 });
    });

    it('Создаёт актора, который двигается на значения переданного интервала', () => {
      const interval = new ManualIntervalObservable();
      const factory = new VirtualActorFactory({ geometry: new Geometry(), interval });
      const actor = factory.create({ modelId: 230, position: { x: 0, y: 0, z: 0 } });
      actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();

      interval.tick(1000);

      expect(actor.getPosition().x).toBeGreaterThan(0);
    });

    it('Возвращает актора, защищённого от использования после деспавна', () => {
      const factory = new VirtualActorFactory({
        geometry: new Geometry(),
        interval: new ManualIntervalObservable(),
      });

      const actor = factory.create({ modelId: 230, position: { x: 1, y: 2, z: 3 } });

      expect(actor).toBeInstanceOf(DespawnableActor);
    });
  });
});
