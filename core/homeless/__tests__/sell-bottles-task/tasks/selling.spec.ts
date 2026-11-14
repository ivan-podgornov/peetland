import { plan } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory, createStubNpcTask } from '@peetland/npc-tasks/dev';
import { describe, expect, it, vi } from 'vitest';

import { BOTTLES_FOR_BOOZE, createPlacesWithCollection, createSellBottlesTask } from '../../../dev';
import { BOTTLE_PRICE } from '../../../src/constants';

describe('SellBottlesTask', () => {
  describe('Метод sell-in-nearest-collection', () => {
    describe('Задачи', () => {
      it('Отдаёт бутылки с анимацией item-give', () => {
        const playAnimation = vi.fn(() => createStubNpcTask('play-animation'));
        const task = createSellBottlesTask(
          createPlacesWithCollection(),
          createNpcTaskFactory({ playAnimation })
        );

        plan(
          task,
          new NpcStateBuilder().withInventory({ [Item.Bottles]: BOTTLES_FOR_BOOZE }).build()
        );

        expect(playAnimation).toHaveBeenCalledExactlyOnceWith({ animation: 'item-give' });
      });

      it('Отдаёт все бутылки из состояния', () => {
        const removeItem = vi.fn(() => createStubNpcTask('remove-item'));
        const task = createSellBottlesTask(
          createPlacesWithCollection(),
          createNpcTaskFactory({ removeItem })
        );

        plan(task, new NpcStateBuilder().withInventory({ [Item.Bottles]: 12 }).build());

        expect(removeItem).toHaveBeenCalledExactlyOnceWith({
          item: Item.Bottles,
          count: 12,
        });
      });

      it('Получает BOTTLE_PRICE за каждую бутылку', () => {
        const addItem = vi.fn(() => createStubNpcTask('add-item'));
        const task = createSellBottlesTask(
          createPlacesWithCollection(),
          createNpcTaskFactory({ addItem })
        );

        plan(task, new NpcStateBuilder().withInventory({ [Item.Bottles]: 12 }).build());

        expect(addItem).toHaveBeenCalledExactlyOnceWith({
          item: Item.Money,
          count: 12 * BOTTLE_PRICE,
        });
      });
    });
  });
});
