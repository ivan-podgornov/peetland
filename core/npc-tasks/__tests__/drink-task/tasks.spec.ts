import { Addiction, ConsumptionType } from '@peetland/addictions';
import { applyPlanEffects, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it, vi } from 'vitest';

import { createDrinkTask, createNpcTaskFactory } from '../../dev';
import { DrinkTask } from '../../src/drink-task';

describe('DrinkTask', () => {
  describe('Метод drink-booze', () => {
    describe('Задачи', () => {
      it('Планирует проиграть анимацию, отнять пойло, добавить пустую бутылку и сообщить зависимостям одной транзакцией', () => {
        const task = createDrinkTask();
        const state = new NpcStateBuilder().withInventory({ [Item.Booze]: 1 }).build();

        expect(planTree(planSteps(task, state) ?? [])).toStrictEqual(
          new PlanStructureBuilder()
            .transaction('drink', 'drink-booze', (drink) =>
              drink
                .primitive('play-animation')
                .primitive('remove-item')
                .primitive('add-item')
                .primitive('addictions-consume')
            )
            .build()
        );
      });

      it('Пьёт пойло стоя в течение DrinkTask.DURATION', () => {
        const playAnimation = vi.fn();

        createDrinkTask({ booze: Item.Booze }, createNpcTaskFactory({ playAnimation }));

        expect(playAnimation).toHaveBeenCalledExactlyOnceWith({
          animation: 'drink-standing-1',
          duration: DrinkTask.DURATION,
        });
      });

      it('Отнимает одну штуку того пойла, которое выпил NPC', () => {
        const removeItem = vi.fn();

        createDrinkTask({ booze: Item.Booze }, createNpcTaskFactory({ removeItem }));

        expect(removeItem).toHaveBeenCalledExactlyOnceWith({
          item: Item.Booze,
          count: 1,
        });
      });

      it('Добавляет пустую бутылку от пойла', () => {
        const addItem = vi.fn();

        createDrinkTask({ booze: Item.Booze }, createNpcTaskFactory({ addItem }));

        expect(addItem).toHaveBeenCalledExactlyOnceWith({
          item: Item.Bottles,
          count: 1,
        });
      });

      it('Сообщает зависимостям, что NPC выпил это пойло', () => {
        const addictionsConsume = vi.fn();

        createDrinkTask({ booze: Item.Booze }, createNpcTaskFactory({ addictionsConsume }));

        expect(addictionsConsume).toHaveBeenCalledExactlyOnceWith({
          type: ConsumptionType.Drink,
          details: { booze: Item.Booze },
        });
      });

      it('По плану пойло пропадает, пустая бутылка появляется, а алкоголизм удовлетворён', () => {
        const task = createDrinkTask();
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Booze]: 1 })
          .withAddictions((addictions) =>
            addictions
              .withStrength(Addiction.Alcoholism, 100)
              .withSatisfaction(Addiction.Alcoholism, 0)
              .build()
          )
          .build();

        const after = applyPlanEffects(task, state);

        expect(after.self.inventory.getAll()).toStrictEqual({ [Item.Bottles]: 1 });
        expect(after.self.addictions.get(Addiction.Alcoholism, after.world.time)).toBe(100);
      });
    });
  });
});
