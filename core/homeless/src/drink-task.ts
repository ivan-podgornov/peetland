import type { CompoundTask, Method, PrimitiveTask, Task } from '@peetland/htn';
import { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '@peetland/npc';
import type { INpcTaskFactory } from '@peetland/npc-tasks';
import { PlaceType } from '@peetland/places';
import type { IPlaces } from '@peetland/places';

/** Сколько NPC пьёт одну бутылку пойла, в миллисекундах */
export const DRINK_DURATION = 10000;

/** На каком расстоянии от бомжарни NPC считается в бомжарне, в метрах */
export const HOMELESS_CAMP_RADIUS = 3;

/** На каком расстоянии от бомжарни можно считать, что NPC до неё дошёл, в метрах */
const HOMELESS_CAMP_COMPLETE_RADIUS = 0.5;

export type DrinkTaskDeps = {
  /** Места мира. Пьёт NPC в местах типа PlaceType.HomelessCamp */
  places: IPlaces;
  npcTaskFactory: INpcTaskFactory;
};

/**
 * Бухать: выпить бутылку пойла в бомжарне, если пойло есть. Если NPC не в бомжарне, сначала он
 * идёт к ближайшей. Когда NPC допил, пойло отнимается, а пустая бутылка остаётся в инвентаре
 */
export class DrinkTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'drink';

  readonly methods: Method<NpcState, NpcContext>[];

  private readonly places: IPlaces;
  private readonly deps: DrinkTaskDeps;

  constructor(deps: DrinkTaskDeps) {
    const { npcTaskFactory } = deps;
    const drink: PrimitiveTask<NpcState, NpcContext>[] = [
      npcTaskFactory.playAnimation({
        animation: 'drink-standing-1',
        duration: DRINK_DURATION,
      }),
      npcTaskFactory.removeItem({
        item: Item.Booze,
        count: 1,
      }),
      npcTaskFactory.addItem({
        item: Item.Bottles,
        count: 1,
      }),
    ];

    this.places = deps.places;
    this.deps = deps;
    this.methods = [
      {
        name: 'drink-in-camp',
        preconditions: (state) => hasBooze(state) && this.isInCamp(state),
        tasks: drink,
      },
      {
        name: 'go-to-camp-and-drink',
        preconditions: (state) =>
          hasBooze(state) && this.places.ofType(PlaceType.HomelessCamp).length > 0,
        tasks: (state) => [this.goToNearestCamp(state), ...drink],
      },
    ];
  }

  /** Находится ли NPC в радиусе HOMELESS_CAMP_RADIUS от какой-нибудь бомжарни */
  private isInCamp(state: NpcState): boolean {
    return this.places.isNear(
      state.self.actor.position,
      PlaceType.HomelessCamp,
      HOMELESS_CAMP_RADIUS
    );
  }

  /** Создаёт задачу дойти до бомжарни, ближайшей к NPC. Вызывается, только если бомжарни есть */
  private goToNearestCamp(state: NpcState): Task<NpcState, NpcContext> {
    const { npcTaskFactory } = this.deps;
    const camp = this.places.findNearest(state.self.actor.position, PlaceType.HomelessCamp);

    if (!camp) {
      throw new Error('Не из чего выбрать бомжарню');
    }

    return npcTaskFactory.goToCoords({
      coords: camp.position,
      completeRadius: HOMELESS_CAMP_COMPLETE_RADIUS,
    });
  }
}

/** Есть ли у NPC пойло */
function hasBooze(state: NpcState): boolean {
  return (state.self.inventory[Item.Booze] ?? 0) > 0;
}
