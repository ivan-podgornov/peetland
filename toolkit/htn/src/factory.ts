import { getDefaultDeps, HTN } from './htn';
import type { HTNDeps, IHTN } from './htn';
import type { Task } from './task';

export interface IHTNFactory<TState> {
  /** Создаёт HTN-агента, который планирует и исполняет корневую задачу */
  create(root: Task<TState>): IHTN<TState>;
}

export class HTNFactory<TState> implements IHTNFactory<TState> {
  private readonly deps: HTNDeps<TState>;

  constructor(deps: HTNDeps<TState> = getDefaultDeps<TState>()) {
    this.deps = deps;
  }

  create(root: Task<TState>): HTN<TState> {
    return new HTN(root, this.deps);
  }
}
