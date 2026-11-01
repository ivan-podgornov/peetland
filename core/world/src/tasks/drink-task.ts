import type { IGeometry } from '@peetland/geometry';
import type { CompoundTask, Method, PrimitiveTask, Task } from '@peetland/htn';
import { Item } from '@peetland/inventory';

import type { NpcContext, NpcState } from '../npc';
import { findNearestPlace, PlaceType } from '../places';
import type { PlaceData } from '../places';

import type { ITaskFactory } from './task-factory';

/** Сколько NPC пьёт одну бутылку пойла, в миллисекундах */
export const DRINK_DURATION = 10000;

/** На каком расстоянии от бомжарни NPC считается в бомжарне, в метрах */
export const HOMELESS_CAMP_RADIUS = 3;

/** На каком расстоянии от бомжарни можно считать, что NPC до неё дошёл, в метрах */
const HOMELESS_CAMP_COMPLETE_RADIUS = 0.5;

export type DrinkTaskOptions = {
  /** Места мира. Пьёт NPC в местах типа PlaceType.HomelessCamp */
  places: readonly PlaceData[];
};

export type DrinkTaskDeps = {
  geometry: IGeometry;
  taskFactory: ITaskFactory;
};

/**
 * Бухать: выпить бутылку пойла в бомжарне, если пойло есть. Если NPC не в бомжарне, сначала он
 * идёт к ближайшей. Когда NPC допил, пойло отнимается, а пустая бутылка остаётся в инвентаре
 */
export class DrinkTask implements CompoundTask<NpcState, NpcContext> {
  readonly name = 'drink';

  readonly methods: Method<NpcState, NpcContext>[];

  private readonly camps: readonly PlaceData[];
  private readonly deps: DrinkTaskDeps;

  constructor(options: DrinkTaskOptions, deps: DrinkTaskDeps) {
    const { taskFactory } = deps;
    const drink: PrimitiveTask<NpcState, NpcContext>[] = [
      taskFactory.playAnimation({ animation: 'drink-standing-1', duration: DRINK_DURATION }),
      taskFactory.removeItem({ item: Item.Booze, count: 1 }),
      taskFactory.addItem({ item: Item.Bottles, count: 1 }),
    ];

    this.camps = options.places.filter((place) => place.type === PlaceType.HomelessCamp);
    this.deps = deps;
    this.methods = [
      {
        name: 'drink-in-camp',
        preconditions: (state) => hasBooze(state) && this.isInCamp(state),
        tasks: drink,
      },
      {
        name: 'go-to-camp-and-drink',
        preconditions: (state) => hasBooze(state) && this.camps.length > 0,
        tasks: (state) => [this.goToNearestCamp(state), ...drink],
      },
    ];
  }

  /** Находится ли NPC в радиусе HOMELESS_CAMP_RADIUS от какой-нибудь бомжарни */
  private isInCamp(state: NpcState): boolean {
    const { geometry } = this.deps;
    const { position } = state.actor;

    return this.camps.some((camp) =>
      geometry.isWithinRadius3d(position, camp.position, HOMELESS_CAMP_RADIUS)
    );
  }

  /** Создаёт задачу дойти до бомжарни, ближайшей к NPC. Вызывается, только если бомжарни есть */
  private goToNearestCamp(state: NpcState): Task<NpcState, NpcContext> {
    const { geometry, taskFactory } = this.deps;
    const camp = findNearestPlace(this.camps, state.actor.position, geometry);

    if (!camp) {
      throw new Error('Не из чего выбрать бомжарню');
    }

    return taskFactory.goToCoords({
      coords: camp.position,
      completeRadius: HOMELESS_CAMP_COMPLETE_RADIUS,
    });
  }
}

/** Есть ли у NPC пойло */
function hasBooze(state: NpcState): boolean {
  return (state.inventory[Item.Booze] ?? 0) > 0;
}
