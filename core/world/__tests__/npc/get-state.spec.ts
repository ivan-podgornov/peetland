import { Inventory, Item } from '@peetland/inventory';
import { createMockedInventoryFactory } from '@peetland/inventory/dev';
import { Feeling, Psyche } from '@peetland/psyche';
import {
  createMockedPsycheFactory,
  createPsycheDeps,
  createPsycheState,
} from '@peetland/psyche/dev';
import { createActor, createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { Npc } from '../../src';

import { createNpcData, createNpcDeps } from './helpers';

describe('Npc', () => {
  describe('#getState', () => {
    it('Возвращает содержимое инвентаря NPC', () => {
      const inventory = new Inventory({ [Item.Money]: 150 });
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ inventoryFactory: createMockedInventoryFactory(inventory) })
      );

      expect(npc.getState().inventory).toStrictEqual({ [Item.Money]: 150 });
    });

    it('Возвращает слепок инвентаря, который не меняется, когда меняется инвентарь', () => {
      const inventory = new Inventory({ [Item.Money]: 150 });
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ inventoryFactory: createMockedInventoryFactory(inventory) })
      );
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

    it('Возвращает слепок психики NPC', () => {
      const psyche = new Psyche(
        createPsycheState({
          feelings: { [Feeling.Shame]: 30 },
        }),
        createPsycheDeps()
      );
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({ psycheFactory: createMockedPsycheFactory(psyche) })
      );

      expect(npc.getState().psyche).toStrictEqual(psyche.getState());
    });
  });
});
