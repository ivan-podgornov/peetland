import type { CompoundTask, Method } from '@peetland/htn';
import { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '../npc';

import { PlayAnimationTask } from './play-animation-task';
import { RemoveItemTask } from './remove-item-task';

/** Сколько NPC пьёт одну бутылку пойла, в миллисекундах */
export const DRINK_DURATION = 10000;

/** Бухать: выпить бутылку пойла, если оно есть. Пойло отнимается, только когда NPC допил */
export class DrinkTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'drink';

  readonly methods: Method<NpcState, NpcContext>[] = [
    {
      name: 'drink-standing',
      preconditions: (state) => (state.inventory[Item.Booze] ?? 0) > 0,
      tasks: [
        new PlayAnimationTask({ animation: 'drink-standing-1', duration: DRINK_DURATION }),
        new RemoveItemTask({ item: Item.Booze, count: 1 }),
      ],
    },
  ];
}
