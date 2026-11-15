import type { INeed, NeedDeps } from './base-need';
import { Need } from './need';
import { Satiety } from './satiety';
import type { NeedRecord } from './types';

/** Создаёт потребности по их виду */
export interface INeedFactory {
  /**
   * Создаёт потребность из её записи
   * @param need - какую потребность создать
   * @param record - значение и момент, когда его выставили
   */
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
