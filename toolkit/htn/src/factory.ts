import { getDefaultDeps, HTN } from './htn';
import type { HTNDeps, IHTN } from './htn';
import type { Task } from './task';

export interface IHTNFactory<TState, TContext> {
  /** Создаёт HTN-агента, который планирует и исполняет корневую задачу */
  create(root: Task<TState, TContext>): IHTN<TState, TContext>;
}

export class HTNFactory<TState, TContext> implements IHTNFactory<TState, TContext> {
  private readonly deps: HTNDeps<TState, TContext>;

  constructor(deps: HTNDeps<TState, TContext> = getDefaultDeps<TState, TContext>()) {
    this.deps = deps;
  }

  create(root: Task<TState, TContext>): HTN<TState, TContext> {
    return new HTN(root, this.deps);
  }
}
