import { ConsumptionType } from '@peetland/addictions';
import type { CompoundTask, Method } from '@peetland/htn';
import { Item } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';

import type { DrinkTaskOptions, INpcTaskFactory } from './types';

export type DrinkTaskDeps = {
  npcTaskFactory: INpcTaskFactory;
};

/**
 * Выпить пойло из инвентаря там, где NPC стоит. Выпить — транзакция: если NPC начал пить, он допьёт,
 * пойло пропадёт из инвентаря, у NPC останется пустая бутылка, а зависимости узнают, что он выпил
 */
export class DrinkTask implements CompoundTask<NpcState, NpcContext> {
  /** Сколько NPC пьёт одну бутылку пойла, в миллисекундах */
  static readonly DURATION = 10000;

  readonly name = 'drink';

  readonly transaction = true;

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(options: DrinkTaskOptions, deps: DrinkTaskDeps) {
    const { booze } = options;
    const { npcTaskFactory } = deps;

    this.methods = [
      {
        name: 'drink-booze',
        preconditions: (state) => state.self.inventory.has(booze),
        tasks: [
          npcTaskFactory.playAnimation({
            animation: 'drink-standing-1',
            duration: DrinkTask.DURATION,
          }),
          npcTaskFactory.removeItem({
            item: booze,
            count: 1,
          }),
          npcTaskFactory.addItem({
            item: Item.Bottles,
            count: 1,
          }),
          npcTaskFactory.addictionsConsume({
            type: ConsumptionType.Drink,
            details: { booze },
          }),
        ],
      },
    ];
  }
}
