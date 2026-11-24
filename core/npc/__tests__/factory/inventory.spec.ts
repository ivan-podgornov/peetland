import { Inventory, Item } from '@peetland/inventory';
import { createMockedInventoryFactory } from '@peetland/inventory/dev';
import { describe, expect, it } from 'vitest';

import { createNpcData } from '../../dev';
import { NpcFactory } from '../../src';

import { createRequiredDeps } from './helpers';

describe('NpcFactory', () => {
  describe('#create', () => {
    it('Вызывает inventoryFactory.create с начальным содержимым инвентаря из данных', () => {
      const inventoryFactory = createMockedInventoryFactory();
      const factory = new NpcFactory(createRequiredDeps({ inventoryFactory }));
      const data = createNpcData({ inventory: { [Item.Money]: 150 } });

      factory.create(data);

      expect(inventoryFactory.create).toHaveBeenCalledExactlyOnceWith(data.inventory);
    });

    it('Передаёт NPC инвентарь, который вернула inventoryFactory', () => {
      const inventory = new Inventory();
      const factory = new NpcFactory(
        createRequiredDeps({ inventoryFactory: createMockedInventoryFactory(inventory) })
      );

      const npc = factory.create(createNpcData());

      expect(npc.getState().self.inventory).toBe(inventory);
    });

    it('Если inventoryFactory не передана, NPC получает экземпляр Inventory', () => {
      const factory = new NpcFactory(createRequiredDeps());

      const npc = factory.create(createNpcData());

      expect(npc.getState().self.inventory).toBeInstanceOf(Inventory);
    });
  });
});
