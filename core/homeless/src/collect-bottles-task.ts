import type { CompoundTask, Method, Task } from '@peetland/htn';
import { Item } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { PlaceType } from '@peetland/places';
import type { IPlaces } from '@peetland/places';
import { Deed } from '@peetland/psyche';
import type { IRandom } from '@peetland/random';

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
    return [
      npcTaskFactory.goToCoords({
        coords: bin.position,
        completeRadius: TRASH_BIN_COMPLETE_RADIUS,
      }),
      npcTaskFactory.achieveAngle({
        angle: bin.angle,
        tolerance: TRASH_BIN_FACING_TOLERANCE,
      }),
      npcTaskFactory.playAnimation({ animation: 'trash-search-start' }),
      ...npcTaskFactory.repeat(bottles, () => [
        npcTaskFactory.parallel({
          main: npcTaskFactory.tryLuck({ chance: BOTTLE_FIND_CHANCE }),
          background: npcTaskFactory.playAnimation({ animation: 'trash-search' }),
        }),
        npcTaskFactory.playAnimation({ animation: 'trash-search-pocket' }),
        npcTaskFactory.addItem({
          item: Item.Bottles,
          count: 1,
        }),
        npcTaskFactory.psycheReact({ deed: Deed.BottleFound }),
      ]),
      npcTaskFactory.playAnimation({ animation: 'trash-search-end' }),
    ];
  }

  /** Сколько у NPC бутылок */
  private countBottles(state: NpcState): number {
    return state.self.inventory[Item.Bottles] ?? 0;
  }
}
