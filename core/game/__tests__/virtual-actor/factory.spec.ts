import { Geometry } from '@peetland/geometry';
import { describe, expect, it } from 'vitest';

import { DespawnableActor, VirtualActorFactory } from '../../src';

describe('VirtualActorFactory', () => {
  describe('#create', () => {
    it('Создаёт актора на переданной позиции', () => {
      const factory = new VirtualActorFactory({ geometry: new Geometry() });

      const actor = factory.create({ modelId: 230, position: { x: 1, y: 2, z: 3 } });

      expect(actor.getPosition()).toStrictEqual({ x: 1, y: 2, z: 3 });
    });

    it('Возвращает актора, защищённого от использования после деспавна', () => {
      const factory = new VirtualActorFactory({ geometry: new Geometry() });

      const actor = factory.create({ modelId: 230, position: { x: 1, y: 2, z: 3 } });

      expect(actor).toBeInstanceOf(DespawnableActor);
    });
  });
});
