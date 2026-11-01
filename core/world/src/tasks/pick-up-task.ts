import type { AnimationId } from '@peetland/game';
import type { CompoundTask, Method } from '@peetland/htn';
import type { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '../npc';

import { AddItemTask } from './add-item-task';
import { PlayAnimationTask } from './play-animation-task';

export type PickUpTaskOptions = {
  /** Какой предмет взять */
  item: Item;
  /** Сколько предмета взять */
  count: number;
  /** Анимация, с которой NPC берёт предмет, например, кладёт в карман находку из мусорки */
  animation: AnimationId;
};

/** Взять предмет даром, например, находку. Предмет добавляется, только когда анимация закончилась */
export class PickUpTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'pick-up';

  readonly methods: Method<NpcState, NpcContext>[];

  constructor(options: PickUpTaskOptions) {
    const { item, count, animation } = options;

    this.methods = [
      {
        name: 'take',
        preconditions: () => true,
        tasks: [new PlayAnimationTask({ animation }), new AddItemTask({ item, count })],
      },
    ];
  }
}
