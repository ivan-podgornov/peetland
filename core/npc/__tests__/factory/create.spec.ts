import { Geometry } from '@peetland/geometry';
import { createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { createNpcData } from '../../dev';
import { Npc, NpcFactory } from '../../src';

import { createRequiredDeps } from './helpers';

describe('NpcFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Npc', () => {
      const factory = new NpcFactory(createRequiredDeps());

      const npc = factory.create(createNpcData());

      expect(npc).toBeInstanceOf(Npc);
    });

    it('Создаёт актора с моделью, позицией и углом спавна из данных', () => {
      const actorFactory = createMockedActorFactory();
      const data = createNpcData({
        modelId: 78,
        spawnPosition: Geometry.vector3(1, 2, 3),
        spawnAngle: 90,
      });
      const factory = new NpcFactory(createRequiredDeps({ actorFactory }));

      factory.create(data);

      expect(actorFactory.create).toHaveBeenCalledExactlyOnceWith({
        modelId: data.modelId,
        position: data.spawnPosition,
        angle: data.spawnAngle,
      });
    });
  });
});
