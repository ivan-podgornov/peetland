import type { IPlaces, PlacesDeps, PlacesOptions } from './places';
import { Places } from './places';

export interface IPlacesFactory {
  /** Создаёт запросы к загруженным местам мира (см. Places) */
  create(options: PlacesOptions): IPlaces;
}

export class PlacesFactory implements IPlacesFactory {
  private readonly deps: PlacesDeps;

  constructor(deps: PlacesDeps) {
    this.deps = deps;
  }

  create(options: PlacesOptions): Places {
    return new Places(options, this.deps);
  }
}
