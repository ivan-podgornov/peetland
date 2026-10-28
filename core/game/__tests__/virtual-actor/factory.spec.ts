import { Geometry } from '@peetland/geometry';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { DespawnableActor, VirtualActorFactory } from '../../src';

describe('VirtualActorFactory', () => {
  describe('#create', () => {
    it('Создаёт актора на переданной позиции', () => {
      const factory = new VirtualActorFactory(
        {},
        { geometry: new Geometry(), timer: new ManualTimer() }
      );

      const actor = factory.create({ modelId: 230, position: { x: 1, y: 2, z: 3 } });

      expect(actor.getPosition()).toStrictEqual({ x: 1, y: 2, z: 3 });
    });

    it('Создаёт актора, который двигается по времени переданного таймера', () => {
      const timer = new ManualTimer();
      const factory = new VirtualActorFactory({}, { geometry: new Geometry(), timer });
      const actor = factory.create({ modelId: 230, position: { x: 0, y: 0, z: 0 } });
      actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();

      timer.advance(1000);

      expect(actor.getPosition().x).toBeGreaterThan(0);
    });

    it('Возвращает актора, защищённого от использования после деспавна', () => {
      const factory = new VirtualActorFactory(
        {},
        { geometry: new Geometry(), timer: new ManualTimer() }
      );

      const actor = factory.create({ modelId: 230, position: { x: 1, y: 2, z: 3 } });

      expect(actor).toBeInstanceOf(DespawnableActor);
    });

    it('Создаёт актора, анимации которого длятся по переданной таблице', () => {
      const timer = new ManualTimer();
      const factory = new VirtualActorFactory(
        { animationDurations: { pay: 3000 } },
        { geometry: new Geometry(), timer }
      );
      const actor = factory.create({ modelId: 230, position: { x: 0, y: 0, z: 0 } });
      const complete = vi.fn();
      actor.playAnimation('pay').subscribe({ complete });

      timer.advance(3000);

      expect(complete).toHaveBeenCalledOnce();
    });
  });
});
