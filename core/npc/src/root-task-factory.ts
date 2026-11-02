import type { Task } from '@peetland/htn';

import type { NpcContext } from './context';
import type { NpcKind } from './kind';
import type { NpcState } from './state';

/**
 * Создаёт корневые задачи, которые планируют HTN-агенты NPC. NPC объявляет, какая фабрика ему
 * нужна, а реализуют её задачи, поэтому NPC не зависит от задач
 */
export interface IRootTaskFactory {
  /** Создаёт корневую задачу NPC указанного типа */
  create(kind: NpcKind): Task<NpcState, NpcContext>;
}

/** Создаёт корневые задачи NPC одного типа. Реализует её пакет с задачами этого типа */
export interface IKindRootTaskFactory {
  /** Создаёт корневую задачу NPC */
  create(): Task<NpcState, NpcContext>;
}

/** Фабрика корневой задачи для каждого типа NPC */
export type KindRootTaskFactories = Readonly<Record<NpcKind, IKindRootTaskFactory>>;

export type RootTaskFactoryDeps = {
  /** Фабрики, которыми создаются корневые задачи NPC каждого типа */
  kindFactories: KindRootTaskFactories;
};

/** Создаёт корневую задачу NPC фабрикой его типа */
export class RootTaskFactory implements IRootTaskFactory {
  private readonly deps: RootTaskFactoryDeps;

  constructor(deps: RootTaskFactoryDeps) {
    this.deps = deps;
  }

  create(kind: NpcKind): Task<NpcState, NpcContext> {
    const { kindFactories } = this.deps;

    return kindFactories[kind].create();
  }
}
