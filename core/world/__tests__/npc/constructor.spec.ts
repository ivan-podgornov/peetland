import { createControlledObservable } from '@peetland/events/dev';
import { Item } from '@peetland/inventory';
import { describe, expect, it } from 'vitest';

import { Npc } from '../../src';

import { createActorFactory, createHtn, createNpcData } from './helpers';

describe('Npc', () => {
  describe('#constructor', () => {
    it('Создаёт актора с моделью, позицией и углом спавна из данных', () => {
      const actorFactory = createActorFactory();
      const data = createNpcData({
        modelId: 78,
        spawnPosition: { x: 1, y: 2, z: 3 },
        spawnAngle: 90,
      });

      new Npc(data, {
        actorFactory,
        htn: createHtn(),
        frames: createControlledObservable().observable,
      });

      expect(actorFactory.create).toHaveBeenCalledExactlyOnceWith({
        modelId: 78,
        position: { x: 1, y: 2, z: 3 },
        angle: 90,
      });
    });

    it('Заполняет инвентарь начальным содержимым из данных', () => {
      const data = createNpcData({ inventory: { [Item.Money]: 150 } });

      const npc = new Npc(data, {
        actorFactory: createActorFactory(),
        htn: createHtn(),
        frames: createControlledObservable().observable,
      });

      expect(npc.inventory.getAll()).toStrictEqual({ [Item.Money]: 150 });
    });

    it('Берёт совестливость из черт характера', () => {
      const data = createNpcData({ traits: { conscientiousness: 80 } });

      const npc = new Npc(data, {
        actorFactory: createActorFactory(),
        htn: createHtn(),
        frames: createControlledObservable().observable,
      });

      expect(npc.conscientiousness).toBe(80);
    });

    it('Берёт начальный стыд из чувств', () => {
      const data = createNpcData({ feelings: { shame: 30 } });

      const npc = new Npc(data, {
        actorFactory: createActorFactory(),
        htn: createHtn(),
        frames: createControlledObservable().observable,
      });

      expect(npc.shame).toBe(30);
    });

    it('Не обновляет HTN-агента, пока не наступил кадр', () => {
      const htn = createHtn();

      new Npc(createNpcData(), {
        actorFactory: createActorFactory(),
        htn,
        frames: createControlledObservable().observable,
      });

      expect(htn.update).not.toHaveBeenCalled();
    });
  });
});
