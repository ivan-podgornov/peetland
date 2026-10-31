import { Item } from '@peetland/inventory';
import { createActor, createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { Npc } from '../../src';

import { createNpcData, createNpcDeps } from './helpers';

describe('Npc', () => {
  describe('#getState', () => {
    it('Возвращает содержимое инвентаря NPC', () => {
      const npc = new Npc(createNpcData({ inventory: { [Item.Money]: 150 } }), createNpcDeps());

      expect(npc.getState().inventory).toStrictEqual({ [Item.Money]: 150 });
    });

    it('Возвращает слепок инвентаря, который не меняется, когда меняется инвентарь', () => {
      const npc = new Npc(createNpcData({ inventory: { [Item.Money]: 150 } }), createNpcDeps());
      const state = npc.getState();

      npc.inventory.add(Item.Money, 50);

      expect(state.inventory).toStrictEqual({ [Item.Money]: 150 });
    });

    it('Возвращает позицию актора', () => {
      const actor = createActor({ position: { x: 1, y: 2, z: 3 } });
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ actorFactory: createMockedActorFactory(actor) })
      );

      expect(npc.getState().actor.position).toStrictEqual(actor.getPosition());
    });

    it('Возвращает угол актора', () => {
      const actor = createActor({ angle: 90 });
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ actorFactory: createMockedActorFactory(actor) })
      );

      expect(npc.getState().actor.angle).toBe(actor.getAngle());
    });

    it('Возвращает слепок актора, который не меняется, когда актор двигается', () => {
      const actor = createActor({ position: { x: 0, y: 0, z: 0 } });
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ actorFactory: createMockedActorFactory(actor) })
      );
      const state = npc.getState();

      actor.setPosition({ x: 5, y: 5, z: 5 });

      expect(state.actor.position).toStrictEqual({ x: 0, y: 0, z: 0 });
    });

    it('Возвращает черты характера NPC', () => {
      const npc = new Npc(createNpcData({ traits: { conscientiousness: 80 } }), createNpcDeps());

      expect(npc.getState().traits).toStrictEqual({ conscientiousness: 80 });
    });

    it('Возвращает чувства NPC', () => {
      const npc = new Npc(createNpcData({ feelings: { shame: 30 } }), createNpcDeps());

      expect(npc.getState().feelings).toStrictEqual({ shame: 30 });
    });
  });
});
