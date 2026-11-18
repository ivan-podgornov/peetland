import { Addiction } from './addiction';
import { Alcoholism } from './alcoholism';
import type { AddictionDeps, IAddiction } from './base-addiction';
import type { AddictionRecord } from './types';

export interface IAddictionFactory {
  /** Создаёт зависимость из её записи */
  create(addiction: Addiction, record: AddictionRecord): IAddiction;
}

export class AddictionFactory implements IAddictionFactory {
  private readonly deps: AddictionDeps;

  constructor(deps: AddictionDeps) {
    this.deps = deps;
  }

  create(addiction: Addiction, record: AddictionRecord): IAddiction {
    switch (addiction) {
      case Addiction.Alcoholism:
        return new Alcoholism(record, this.deps);
    }
  }
}
