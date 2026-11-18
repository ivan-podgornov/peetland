import type { PrimitiveTask, TaskResult } from '@peetland/htn';
import type { PerformedActivity } from '@peetland/needs';
import type { NpcContext, NpcState } from '@peetland/npc';

/** Занятие, о котором задача сообщает потребностям, и его детали */
export type NeedsPerformTaskOptions = PerformedActivity;

/** Сообщить потребностям о занятии, например что NPC поел. Задача мгновенная */
export class NeedsPerformTask implements PrimitiveTask<NpcState, NpcContext> {
  readonly name = 'needs-perform';

  private readonly options: NeedsPerformTaskOptions;

  constructor(options: NeedsPerformTaskOptions) {
    this.options = options;
  }

  canExecute(): boolean {
    return true;
  }

  /** Сообщает о занятии копии потребностей на время из состояния */
  applyEffects(state: NpcState): NpcState {
    const needs = state.self.needs.clone();
    needs.perform(this.options, state.world.time);

    return {
      ...state,
      self: {
        ...state.self,
        needs,
      },
    };
  }

  /** Сообщает о занятии потребностям из контекста и возвращает 'success' */
  start(state: NpcState, context: NpcContext): TaskResult {
    context.needs.perform(this.options, state.world.time);

    return 'success';
  }

  /** Задача завершается в start, поэтому, если до update всё же дошло, возвращает 'failed' */
  update(): TaskResult {
    return 'failed';
  }

  /** Задача мгновенная, останавливать нечего */
  stop(): void {}
}
