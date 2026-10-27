import { Geometry } from '@peetland/geometry';
import { describe, expect, it, vi } from 'vitest';

import { VirtualActorFactory } from '../../src';

describe('VirtualActorFactory', () => {
  describe('#create', () => {
    it('Создаёт актора на переданной позиции', () => {
      const factory = new VirtualActorFactory({ geometry: new Geometry() });

      const actor = factory.create({ modelId: 230, position: { x: 1, y: 2, z: 3 } });

      expect(actor.getPosition()).toStrictEqual({ x: 1, y: 2, z: 3 });
    });

    it('Создаёт актора со скоростью из опций фабрики', () => {
      vi.useFakeTimers();
      const factory = new VirtualActorFactory({ geometry: new Geometry() }, { speed: 3 });
      const actor = factory.create({ modelId: 230, position: { x: 0, y: 0, z: 0 } });

      actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();
      vi.advanceTimersByTime(1000);

      expect(actor.getPosition()).toStrictEqual({ x: 3, y: 0, z: 0 });
    });

    it('Если скорость не указана, создаёт актора со скоростью пешехода 5 км/ч', () => {
      vi.useFakeTimers();
      const factory = new VirtualActorFactory({ geometry: new Geometry() });
      const actor = factory.create({ modelId: 230, position: { x: 0, y: 0, z: 0 } });

      actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();
      vi.advanceTimersByTime(1000);

      expect(actor.getPosition().x).toBeCloseTo(1.39);
    });
  });
});
