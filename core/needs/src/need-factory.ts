import type { INeed, NeedDeps } from './base-need';
import { Need } from './need';
import { Satiety } from './satiety';
import type { NeedRecord } from './types';

export interface INeedFactory {
  /** Создаёт потребность из её записи */
  create(need: Need, record: NeedRecord): INeed;
}

export class NeedFactory implements INeedFactory {
  private readonly deps: NeedDeps;

  constructor(deps: NeedDeps) {
    this.deps = deps;
  }

  create(need: Need, record: NeedRecord): INeed {
    switch (need) {
      case Need.Satiety:
        return new Satiety(record, this.deps);
    }
  }
}
