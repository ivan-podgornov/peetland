import { createStubTask, plan, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { createNpcTaskFactory, createStubNpcTask } from '@peetland/npc-tasks/dev';
import { PlaceType } from '@peetland/places';
import { createPlace } from '@peetland/places/dev';
import { describe, expect, it, vi } from 'vitest';

import { createBuyBoozeTask, createHomelessTaskFactory, createPlacesWithShop } from '../../dev';
import { BOOZE_PRICE } from '../../src/constants';

/** Создаёт состояние NPC, у которого хватает денег на пойло: без них план не составляется */
function createStateWithMoney() {
  return new NpcStateBuilder().withInventory({ [Item.Money]: BOOZE_PRICE }).build();
}

describe('BuyBoozeTask', () => {
  describe('Метод buy-in-nearest-shop', () => {
    describe('Задачи', () => {
      it('Планирует дойти до магазина, повернуться к прилавку и купить пойло', () => {
        const task = createBuyBoozeTask(createPlacesWithShop(), {
          homelessTaskFactory: createHomelessTaskFactory({
            purchase: () => createStubTask('purchase'),
          }),
        });

        expect(planTree(planSteps(task, createStateWithMoney()) ?? [])).toStrictEqual(
          new PlanStructureBuilder()
            .compound('buy-booze', 'buy-in-nearest-shop', (buy) =>
              buy.primitive('go-to-coords').primitive('achieve-angle').primitive('purchase')
            )
            .build()
        );
      });

      it('Ищет магазин, ближайший к позиции NPC из состояния', () => {
        const places = createPlacesWithShop();
        const state = new NpcStateBuilder()
          .withPosition(8, 0, 0)
          .withInventory({ [Item.Money]: BOOZE_PRICE })
          .build();

        plan(createBuyBoozeTask(places), state);

        expect(places.findNearest).toHaveBeenCalledExactlyOnceWith(
          {
            x: 8,
            y: 0,
            z: 0,
          },
          PlaceType.Shop
        );
      });

      it('Идёт к магазину, который вернул places.findNearest', () => {
        const goToCoords = vi.fn(() => createStubNpcTask('go-to-coords'));
        const shop = createPlace({
          position: {
            x: 50,
            y: 0,
            z: 0,
          },
        });
        const task = createBuyBoozeTask(createPlacesWithShop(shop), {
          npcTaskFactory: createNpcTaskFactory({ goToCoords }),
        });

        plan(task, createStateWithMoney());

        expect(goToCoords).toHaveBeenCalledExactlyOnceWith({
          coords: {
            x: 50,
            y: 0,
            z: 0,
          },
          completeRadius: 0.5,
        });
      });

      it('Поворачивается лицом к прилавку магазина, который вернул places.findNearest', () => {
        const achieveAngle = vi.fn(() => createStubNpcTask('achieve-angle'));
        const shop = createPlace({ angle: 90 });
        const task = createBuyBoozeTask(createPlacesWithShop(shop), {
          npcTaskFactory: createNpcTaskFactory({ achieveAngle }),
        });

        plan(task, createStateWithMoney());

        expect(achieveAngle).toHaveBeenCalledExactlyOnceWith({
          angle: 90,
          tolerance: 15,
        });
      });

      it('Покупает одну бутылку пойла за BOOZE_PRICE', () => {
        const purchase = vi.fn(() => createStubTask<NpcState, NpcContext>('purchase'));
        const task = createBuyBoozeTask(createPlacesWithShop(), {
          homelessTaskFactory: createHomelessTaskFactory({ purchase }),
        });

        plan(task, createStateWithMoney());

        expect(purchase).toHaveBeenCalledExactlyOnceWith({
          item: Item.Booze,
          count: 1,
          price: BOOZE_PRICE,
        });
      });
    });
  });
});
