import { Inventory } from '@peetland/inventory';
import { createMockedInventoryFactory } from '@peetland/inventory/dev';
import { createMockedPsyche, createMockedPsycheFactory } from '@peetland/psyche/dev';
import { createActor, createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { createMockedNpcWorldKnowledge, createNpcData, createNpcDeps } from '../dev';
import { Npc } from '../src';

describe('Npc', () => {
  describe('#getState', () => {
    it('Возвращает инвентарь NPC', () => {
      const inventory = new Inventory();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ inventoryFactory: createMockedInventoryFactory(inventory) })
      );

      expect(npc.getState().self.inventory).toBe(inventory);
    });

    it('Возвращает позицию актора', () => {
      const actor = createActor({
        position: {
          x: 1,
          y: 2,
          z: 3,
        },
      });
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ actorFactory: createMockedActorFactory(actor) })
      );

      expect(npc.getState().self.actor.position).toStrictEqual(actor.getPosition());
    });

    it('Возвращает угол актора', () => {
      const actor = createActor({ angle: 90 });
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ actorFactory: createMockedActorFactory(actor) })
      );

      expect(npc.getState().self.actor.angle).toBe(actor.getAngle());
    });

    it('Возвращает слепок актора, который не меняется, когда актор двигается', () => {
      const actor = createActor({
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
      });
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ actorFactory: createMockedActorFactory(actor) })
      );
      const state = npc.getState();

      actor.setPosition({
        x: 5,
        y: 5,
        z: 5,
      });

      expect(state.self.actor.position).toStrictEqual({
        x: 0,
        y: 0,
        z: 0,
      });
    });

    it('Возвращает психику NPC', () => {
      const psyche = createMockedPsyche();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ psycheFactory: createMockedPsycheFactory(psyche) })
      );

      expect(npc.getState().self.psyche).toBe(psyche);
    });

    it('Возвращает состояние мира, которое вернуло знание о мире', () => {
      const worldKnowledge = createMockedNpcWorldKnowledge({
        time: {
          day: 1,
          hours: 20,
          minutes: 15,
        },
      });
      const npc = new Npc(createNpcData(), createNpcDeps({ worldKnowledge }));

      expect(npc.getState().world).toStrictEqual({
        time: {
          day: 1,
          hours: 20,
          minutes: 15,
        },
      });
    });
  });
});
