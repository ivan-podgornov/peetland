import { plan, planNames } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import type { TryLuckTaskOptions } from '@peetland/npc-tasks';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { Deed } from '@peetland/psyche';
import { describe, expect, it, vi } from 'vitest';

import { createCollectBottlesTask, createPlacesWithTrashBins } from '../../dev';
import { BOTTLE_FIND_CHANCE, MAX_BOTTLES } from '../../src/collect-bottles-task';

describe('CollectBottlesTask', () => {
  it('Начинает рыться с анимацией trash-search-start, а заканчивает — с trash-search-end', () => {
    const playAnimation = vi.fn();
    const task = createCollectBottlesTask(
      createPlacesWithTrashBins(),
      createNpcTaskFactory({ playAnimation })
    );

    plan(task, new NpcStateBuilder().withInventory({ [Item.Bottles]: MAX_BOTTLES - 1 }).build());

    expect(playAnimation.mock.calls).toStrictEqual([
      [{ animation: 'trash-search-start' }],
      [{ animation: 'trash-search' }],
      [{ animation: 'trash-search-pocket' }],
      [{ animation: 'trash-search-end' }],
    ]);
  });

  it('Ищет каждую бутылку с шансом BOTTLE_FIND_CHANCE', () => {
    const tryLuck = vi.fn((options: TryLuckTaskOptions) => createNpcTaskFactory().tryLuck(options));
    const task = createCollectBottlesTask(
      createPlacesWithTrashBins(),
      createNpcTaskFactory({ tryLuck })
    );

    plan(task, new NpcStateBuilder().withInventory({ [Item.Bottles]: MAX_BOTTLES - 1 }).build());

    expect(tryLuck).toHaveBeenCalledExactlyOnceWith({ chance: BOTTLE_FIND_CHANCE });
  });

  it('Пока ищет бутылку, роется в мусорке с анимацией trash-search', () => {
    const real = createNpcTaskFactory();
    const tryLuck = real.tryLuck({ chance: BOTTLE_FIND_CHANCE });
    const searching = real.playAnimation({ animation: 'trash-search' });
    const parallel = vi.fn();
    const task = createCollectBottlesTask(
      createPlacesWithTrashBins(),
      createNpcTaskFactory({
        tryLuck: () => tryLuck,
        playAnimation: (options) =>
          options.animation === 'trash-search' ? searching : real.playAnimation(options),
        parallel,
      })
    );

    plan(task, new NpcStateBuilder().withInventory({ [Item.Bottles]: MAX_BOTTLES - 1 }).build());

    expect(parallel).toHaveBeenCalledExactlyOnceWith({
      main: tryLuck,
      background: searching,
    });
  });

  it('Каждую найденную бутылку кладёт в карман с анимацией trash-search-pocket, добавляет в инвентарь и реагирует на находку', () => {
    const task = createCollectBottlesTask(createPlacesWithTrashBins());
    const state = new NpcStateBuilder().withInventory({ [Item.Bottles]: MAX_BOTTLES - 2 }).build();

    const names = planNames(task, state);

    expect(names?.slice(3, -1)).toStrictEqual([
      'parallel',
      'play-animation',
      'add-item',
      'psyche-react',
      'parallel',
      'play-animation',
      'add-item',
      'psyche-react',
    ]);
  });

  it('Добавляет по одной бутылке за находку', () => {
    const addItem = vi.fn();
    const task = createCollectBottlesTask(
      createPlacesWithTrashBins(),
      createNpcTaskFactory({ addItem })
    );

    plan(task, new NpcStateBuilder().withInventory({ [Item.Bottles]: MAX_BOTTLES - 1 }).build());

    expect(addItem).toHaveBeenCalledExactlyOnceWith({
      item: Item.Bottles,
      count: 1,
    });
  });

  it('На каждую найденную бутылку реагирует поступком Deed.BottleFound', () => {
    const psycheReact = vi.fn();
    const task = createCollectBottlesTask(
      createPlacesWithTrashBins(),
      createNpcTaskFactory({ psycheReact })
    );

    plan(task, new NpcStateBuilder().withInventory({ [Item.Bottles]: MAX_BOTTLES - 1 }).build());

    expect(psycheReact).toHaveBeenCalledExactlyOnceWith({ deed: Deed.BottleFound });
  });
});
