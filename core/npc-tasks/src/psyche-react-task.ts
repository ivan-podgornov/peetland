import type { PrimitiveTask, TaskResult } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';
import type { Deed } from '@peetland/psyche';

export type PsycheReactTaskOptions = {
  /** Поступок, о котором задача сообщает психике */
  deed: Deed;
};

/**
 * Отреагировать на поступок: сообщить психике NPC о поступке, чтобы поменялись чувства. Задача
 * мгновенная: завершается прямо в start. О чертах задача не знает, как поступок меняет чувства,
 * решает психика
 */
export class PsycheReactTask implements PrimitiveTask<NpcState, NpcContext> {
  readonly name = 'psyche-react';

  private readonly options: PsycheReactTaskOptions;

  constructor(options: PsycheReactTaskOptions) {
    this.options = options;
  }

  canExecute(): boolean {
    return true;
  }

  /** Сообщает о поступке копии психики из состояния и кладёт копию в новое состояние */
  applyEffects(state: NpcState): NpcState {
    const psyche = state.self.psyche.clone();
    psyche.react(this.options.deed);

    return {
      ...state,
      self: {
        ...state.self,
        psyche,
      },
    };
  }

  /** Сообщает психике из контекста о поступке и возвращает 'success' */
  start(_state: NpcState, context: NpcContext): TaskResult {
    context.psyche.react(this.options.deed);

    return 'success';
  }

  /** Задача завершается в start, поэтому, если до update всё же дошло, возвращает 'failed' */
  update(): TaskResult {
    return 'failed';
  }

  /** Задача мгновенная, останавливать нечего */
  stop(): void {}
}
