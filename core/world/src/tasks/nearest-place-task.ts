import type { IGeometry, Vector3 } from '@peetland/geometry';

import type { NpcState } from '../npc';
import { findNearestPlace } from '../places';
import type { PlaceData } from '../places';

import { CommandTask } from './command-task';

export type NearestPlaceTaskDeps = {
  geometry: IGeometry;
};

/**
 * Задача-команда, которая относится к месту, ближайшему к актору. Место выбирается заново при
 * каждом планировании и выполнении, поэтому одну задачу могут выполнять NPC в разных частях мира.
 * Если мест нет, задачу выполнить нельзя
 */
export abstract class NearestPlaceTask extends CommandTask {
  private readonly places: readonly PlaceData[];
  protected readonly deps: NearestPlaceTaskDeps;

  constructor(places: readonly PlaceData[], deps: NearestPlaceTaskDeps) {
    super();
    this.places = places;
    this.deps = deps;
  }

  override canExecute(_state: NpcState): boolean {
    return this.places.length > 0;
  }

  /** Возвращает место, ближайшее к позиции. Выбрасывает ошибку, если мест нет */
  protected findNearest(position: Vector3): PlaceData {
    const { geometry } = this.deps;
    const place = findNearestPlace(this.places, position, geometry);

    if (!place) {
      throw new Error(`Задаче ${this.name} не из чего выбрать место`);
    }

    return place;
  }
}
