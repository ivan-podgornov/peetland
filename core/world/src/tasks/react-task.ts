import type { PrimitiveTask, TaskResult } from '@peetland/htn';
import type { Deed, IPsycheFactory } from '@peetland/psyche';

import type { NpcContext, NpcState } from '../npc';

export type ReactTaskOptions = {
  /** Поступок, о котором задача сообщает психике */
  deed: Deed;
};

export type ReactTaskDeps = {
  /** Фабрика, которой задача собирает психику из слепка, чтобы предсказать её реакцию */
  psycheFactory: IPsycheFactory;
};

/**
 * Отреагировать на поступок: сообщить психике NPC о поступке, чтобы поменялись чувства. Задача
 * мгновенная: завершается прямо в start. О чертах задача не знает, как поступок меняет чувства,
 * решает психика
 */
export class ReactTask implements PrimitiveTask<NpcState, NpcContext> {
  readonly name = 'react';

  private readonly options: ReactTaskOptions;
  private readonly deps: ReactTaskDeps;

  constructor(options: ReactTaskOptions, deps: ReactTaskDeps) {
    this.options = options;
    this.deps = deps;
  }

  canExecute(_state: NpcState): boolean {
    return true;
  }

  /** Собирает психику из слепка в состоянии, сообщает ей о поступке и кладёт в состояние её новый слепок */
  applyEffects(state: NpcState): NpcState {
    const { psycheFactory } = this.deps;
    const psyche = psycheFactory.create(state.psyche);
    psyche.react(this.options.deed);

    return { ...state, psyche: psyche.getState() };
  }

  /** Сообщает психике из контекста о поступке и возвращает 'success' */
  start(_state: NpcState, context: NpcContext): TaskResult {
    context.psyche.react(this.options.deed);

    return 'success';
  }

  /** Задача завершается в start, поэтому, если до update всё же дошло, возвращает 'failed' */
  update(_state: NpcState, _context: NpcContext): TaskResult {
    return 'failed';
  }

  /** Задача мгновенная, останавливать нечего */
  stop(_context: NpcContext): void {}
}
