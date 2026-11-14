import { plan, planSteps, PlanStructureBuilder, planTree } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import type { TryLuckTaskOptions } from '@peetland/npc-tasks';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { Deed } from '@peetland/psyche';
import { describe, expect, it, vi } from 'vitest';

import {
  buildPocketBottle,
  createCollectBottlesTask,
  createPlacesWithTrashBins,
} from '../../../dev';
import { BOTTLE_FIND_CHANCE, MAX_BOTTLES, MAX_BOTTLES_PER_VISIT } from '../../../src/constants';

/** Планирует заход за одной бутылкой фабрикой примитивов, в которой подменены переданные методы */
function planOneBottle(overrides: Parameters<typeof createNpcTaskFactory>[0]) {
  plan(
    createCollectBottlesTask(createPlacesWithTrashBins(), createNpcTaskFactory(overrides)),
    new NpcStateBuilder().withInventory({ [Item.Bottles]: MAX_BOTTLES - 1 }).build()
  );
}

describe('CollectBottlesTask', () => {
  describe('Метод search-random-trash-bin', () => {
    describe('Задачи', () => {
      it('Если до MAX_BOTTLES осталось не меньше MAX_BOTTLES_PER_VISIT, за заход ищет MAX_BOTTLES_PER_VISIT бутылок', () => {
        const tryLuck = vi.fn((options: TryLuckTaskOptions) =>
          createNpcTaskFactory().tryLuck(options)
        );
        const task = createCollectBottlesTask(
          createPlacesWithTrashBins(),
          createNpcTaskFactory({ tryLuck })
        );

        plan(task, new NpcStateBuilder().withEmptyInventory().build());

        expect(tryLuck).toHaveBeenCalledTimes(MAX_BOTTLES_PER_VISIT);
      });

      it('Если до MAX_BOTTLES осталось меньше MAX_BOTTLES_PER_VISIT, ищет столько, сколько осталось', () => {
        const tryLuck = vi.fn((options: TryLuckTaskOptions) =>
          createNpcTaskFactory().tryLuck(options)
        );
        const task = createCollectBottlesTask(
          createPlacesWithTrashBins(),
          createNpcTaskFactory({ tryLuck })
        );

        plan(
          task,
          new NpcStateBuilder().withInventory({ [Item.Bottles]: MAX_BOTTLES - 3 }).build()
        );

        expect(tryLuck).toHaveBeenCalledTimes(3);
      });

      it('Ищет каждую бутылку с шансом BOTTLE_FIND_CHANCE', () => {
        const tryLuck = vi.fn((options: TryLuckTaskOptions) =>
          createNpcTaskFactory().tryLuck(options)
        );

        planOneBottle({ tryLuck });

        expect(tryLuck).toHaveBeenCalledExactlyOnceWith({ chance: BOTTLE_FIND_CHANCE });
      });

      it('Пока ищет бутылку, роется в мусорке с анимацией trash-search', () => {
        const real = createNpcTaskFactory();
        const tryLuck = real.tryLuck({ chance: BOTTLE_FIND_CHANCE });
        const searching = real.playAnimation({ animation: 'trash-search' });
        const parallel = vi.fn();

        planOneBottle({
          tryLuck: () => tryLuck,
          playAnimation: (options) =>
            options.animation === 'trash-search' ? searching : real.playAnimation(options),
          parallel,
        });

        expect(parallel).toHaveBeenCalledExactlyOnceWith({
          main: tryLuck,
          background: searching,
        });
      });

      it('Каждую найденную бутылку кладёт в карман, добавляет в инвентарь и реагирует на находку', () => {
        const task = createCollectBottlesTask(createPlacesWithTrashBins());
        const state = new NpcStateBuilder()
          .withInventory({ [Item.Bottles]: MAX_BOTTLES - 2 })
          .build();

        expect(planTree(planSteps(task, state) ?? [])).toStrictEqual(
          new PlanStructureBuilder()
            .compound('collect-bottles', 'search-random-trash-bin', (collect) =>
              buildPocketBottle(
                buildPocketBottle(
                  collect
                    .primitive('go-to-coords')
                    .primitive('achieve-angle')
                    .primitive('play-animation')
                    .primitive('parallel')
                ).primitive('parallel')
              ).primitive('play-animation')
            )
            .build()
        );
      });

      it('Кладёт найденную бутылку в карман с анимацией trash-search-pocket', () => {
        const playAnimation = vi.fn();

        planOneBottle({ playAnimation });

        expect(playAnimation).toHaveBeenCalledWith({ animation: 'trash-search-pocket' });
      });

      it('Добавляет по одной бутылке за находку', () => {
        const addItem = vi.fn();

        planOneBottle({ addItem });

        expect(addItem).toHaveBeenCalledExactlyOnceWith({
          item: Item.Bottles,
          count: 1,
        });
      });

      it('На каждую найденную бутылку реагирует поступком Deed.BottleFound', () => {
        const psycheReact = vi.fn();

        planOneBottle({ psycheReact });

        expect(psycheReact).toHaveBeenCalledExactlyOnceWith({ deed: Deed.BottleFound });
      });
    });
  });
});
