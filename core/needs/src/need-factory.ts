import { Alcoholism } from './alcoholism';
import type { INeed, NeedDeps } from './base-need';
import { Need } from './need';
import { Satiety } from './satiety';
import type { NeedsState } from './types';

export interface INeedFactory {
  /** Создаёт потребность из её записи */
  create<N extends Need>(need: N, record: NeedsState[N]): INeed;
}

/** Как создать каждую потребность из её записи */
type NeedCreators = {
  [N in Need]: (record: NeedsState[N]) => INeed;
};

export class NeedFactory implements INeedFactory {
  private readonly creators: NeedCreators;

  constructor(deps: NeedDeps) {
    this.creators = {
      [Need.Satiety]: (record) => new Satiety(record, deps),
      [Need.Alcoholism]: (record) => new Alcoholism(record, deps),
    };
  }

  create<N extends Need>(need: N, record: NeedsState[N]): INeed {
    return this.creators[need](record);
  }
}
