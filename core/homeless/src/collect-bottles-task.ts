import { TransactionTask } from '@peetland/htn';
import type { CompoundTask, Method, Task } from '@peetland/htn';
import { Item } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { PlaceType } from '@peetland/places';
import type { IPlaces } from '@peetland/places';
import { Deed } from '@peetland/psyche';
import type { IRandom } from '@peetland/random';

import { BOTTLE_FIND_CHANCE, MAX_BOTTLES, MAX_BOTTLES_PER_VISIT } from './constants';

export type CollectBottlesTaskDeps = {
  /** Места мира. Бутылки собираются в местах типа PlaceType.TrashBin */
  places: IPlaces;
  npcTaskFactory: INpcTaskFactory;
  random: IRandom;
};

/**
 * Собрать бутылки: один заход к случайной мусорке. NPC роется в ней с анимацией, пока не найдёт
 * MAX_BOTTLES_PER_VISIT бутылок или пока не наберёт MAX_BOTTLES. Каждая найденная бутылка — поступок
 * Deed.BottleFound: бомж сам зарабатывает и не попрошайничает, и стыд от этого падает. Мусорка и сколько бутылок искать
 * определяются при планировании, один раз на весь план. Следующий заход — следующий план
 */
export class CollectBottlesTask implements CompoundTask<NpcState, NpcContext> {
  /** На каком расстоянии от мусорки можно считать, что NPC до неё дошёл, в метрах */
  private static readonly TRASH_BIN_COMPLETE_RADIUS = 0.5;

  /** Насколько NPC может быть отвёрнут от мусорки, чтобы в ней рыться, в градусах */
  private static readonly TRASH_BIN_FACING_TOLERANCE = 15;

  readonly name = 'collect-bottles';

  readonly methods: Method<NpcState, NpcContext>[];

  private readonly places: IPlaces;
  private readonly deps: CollectBottlesTaskDeps;

  constructor(deps: CollectBottlesTaskDeps) {
    this.places = deps.places;
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
    const { random, npcTaskFactory } = this.deps;
    const bin = random.pick(this.places.ofType(PlaceType.TrashBin));
    const bottles = Math.min(MAX_BOTTLES_PER_VISIT, MAX_BOTTLES - this.countBottles(state));
    const tasks: Task<NpcState, NpcContext>[] = [
      npcTaskFactory.goToCoords({
        coords: bin.position,
        completeRadius: CollectBottlesTask.TRASH_BIN_COMPLETE_RADIUS,
      }),
      npcTaskFactory.achieveAngle({
        angle: bin.angle,
        tolerance: CollectBottlesTask.TRASH_BIN_FACING_TOLERANCE,
      }),
      npcTaskFactory.playAnimation({ animation: 'trash-search-start' }),
    ];

    for (let index = 0; index < bottles; index++) {
      tasks.push(
        npcTaskFactory.parallel({
          main: npcTaskFactory.tryLuck({ chance: BOTTLE_FIND_CHANCE }),
          background: npcTaskFactory.playAnimation({ animation: 'trash-search' }),
        }),
        // Забрать бутылку — транзакция: если NPC положил её в карман, она у него, и он ей рад
        new TransactionTask('pocket-bottle', [
          npcTaskFactory.playAnimation({ animation: 'trash-search-pocket' }),
          npcTaskFactory.addItem({
            item: Item.Bottles,
            count: 1,
          }),
          npcTaskFactory.psycheReact({ deed: Deed.BottleFound }),
        ])
      );
    }

    tasks.push(npcTaskFactory.playAnimation({ animation: 'trash-search-end' }));

    return tasks;
  }

  /** Сколько у NPC бутылок */
  private countBottles(state: NpcState): number {
    return state.self.inventory.get(Item.Bottles);
  }
}
