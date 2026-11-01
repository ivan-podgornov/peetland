import type { CompoundTask, Method, Task } from '@peetland/htn';
import { Item } from '@peetland/inventory';
import type { IRandom } from '@peetland/random';

import type { NpcContext, NpcState } from '../npc';
import { PlaceType } from '../places';
import type { IPlaces } from '../places';

import type { ITaskFactory } from './task-factory';

/** Шанс найти бутылку за одну попытку, раз в секунду (см. TryLuckTask) */
export const BOTTLE_FIND_CHANCE = 1 / 60;

/** Сколько бутылок NPC ищет в мусорке за один заход */
export const MAX_BOTTLES_PER_VISIT = 5;

/** Сколько бутылок NPC может унести */
export const MAX_BOTTLES = 15;

/** На каком расстоянии от мусорки можно считать, что NPC до неё дошёл, в метрах */
const TRASH_BIN_COMPLETE_RADIUS = 0.5;

/** Насколько NPC может быть отвёрнут от мусорки, чтобы в ней рыться, в градусах */
const TRASH_BIN_FACING_TOLERANCE = 15;

export type CollectBottlesTaskOptions = {
  /** Места мира. Бутылки собираются в местах типа PlaceType.TrashBin */
  places: IPlaces;
};

export type CollectBottlesTaskDeps = {
  taskFactory: ITaskFactory;
  random: IRandom;
};

/**
 * Собрать бутылки: один заход к случайной мусорке. NPC роется в ней с анимацией, пока не найдёт
 * MAX_BOTTLES_PER_VISIT бутылок или пока не наберёт MAX_BOTTLES. Мусорка и сколько бутылок искать
 * определяются при планировании, один раз на весь план. Следующий заход — следующий план
 */
export class CollectBottlesTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'collect-bottles';

  readonly methods: Method<NpcState, NpcContext>[];

  private readonly places: IPlaces;
  private readonly deps: CollectBottlesTaskDeps;

  constructor(options: CollectBottlesTaskOptions, deps: CollectBottlesTaskDeps) {
    this.places = options.places;
    this.deps = deps;
    this.methods = [
      {
        name: 'search-random-trash-bin',
        preconditions: (state) => this.canCollect(state),
        tasks: (state) => this.searchRandomTrashBin(state),
      },
    ];
  }

  /** Собирать бутылки можно, если NPC унесёт ещё хотя бы одну и есть мусорки */
  private canCollect(state: NpcState): boolean {
    return (
      this.countBottles(state) < MAX_BOTTLES && this.places.ofType(PlaceType.TrashBin).length > 0
    );
  }

  /** Собирает задачи захода к случайной мусорке */
  private searchRandomTrashBin(state: NpcState): Task<NpcState, NpcContext>[] {
    const { random, taskFactory } = this.deps;
    const bin = random.pick(this.places.ofType(PlaceType.TrashBin));
    const bottles = Math.min(MAX_BOTTLES_PER_VISIT, MAX_BOTTLES - this.countBottles(state));
    const tasks: Task<NpcState, NpcContext>[] = [
      taskFactory.goToCoords({ coords: bin.position, completeRadius: TRASH_BIN_COMPLETE_RADIUS }),
      taskFactory.achieveAngle({ angle: bin.angle, tolerance: TRASH_BIN_FACING_TOLERANCE }),
      taskFactory.playAnimation({ animation: 'trash-search-start' }),
    ];

    for (let index = 0; index < bottles; index++) {
      tasks.push(
        taskFactory.parallel({
          main: taskFactory.tryLuck({ chance: BOTTLE_FIND_CHANCE }),
          background: taskFactory.playAnimation({ animation: 'trash-search' }),
        }),
        taskFactory.playAnimation({ animation: 'trash-search-pocket' }),
        taskFactory.addItem({ item: Item.Bottles, count: 1 })
      );
    }

    tasks.push(taskFactory.playAnimation({ animation: 'trash-search-end' }));

    return tasks;
  }

  /** Сколько у NPC бутылок */
  private countBottles(state: NpcState): number {
    return state.inventory[Item.Bottles] ?? 0;
  }
}
