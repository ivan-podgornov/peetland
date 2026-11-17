import type { AnimationId } from '@peetland/game';
import type { CompoundTask, Method } from '@peetland/htn';
import { Item } from '@peetland/inventory';
import type { Food } from '@peetland/inventory';
import { Activity } from '@peetland/needs';
import type { NpcContext, NpcState } from '@peetland/npc';

import type { EatTaskOptions, INpcTaskFactory } from './types';

export type EatTaskDeps = {
  npcTaskFactory: INpcTaskFactory;
};

/**
 * Съесть еду из инвентаря там, где NPC стоит. Съесть — транзакция: если NPC начал есть, он доест,
 * еда пропадёт из инвентаря, а потребности узнают, что он поел
 */
export class EatTask implements CompoundTask<NpcState, NpcContext> {
  /** Какой анимацией NPC ест каждую еду */
  private static readonly ANIMATIONS: Readonly<Record<Food, AnimationId>> = {
    // Батон круглый, его едят как пиццу
    [Item.RomashkaLoaf]: 'eat-pizza',
    [Item.SmilePizza]: 'eat-pizza',
  };

  readonly name = 'eat';

  readonly transaction = true;

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(options: EatTaskOptions, deps: EatTaskDeps) {
    const { food } = options;
    const { npcTaskFactory } = deps;

    this.methods = [
      {
        name: 'eat-food',
        preconditions: (state) => state.self.inventory.has(food),
        tasks: [
          npcTaskFactory.playAnimation({ animation: EatTask.ANIMATIONS[food] }),
          npcTaskFactory.removeItem({
            item: food,
            count: 1,
          }),
          npcTaskFactory.needsPerform({
            activity: Activity.Eat,
            details: { food },
          }),
        ],
      },
    ];
  }
}
