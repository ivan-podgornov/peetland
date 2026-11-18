import type { Activity } from '@peetland/addictions';
import type { PrimitiveTask, TaskResult } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';

/** Занятие, о котором задача сообщает зависимостям, и его детали */
export type AddictionsPerformTaskOptions = Activity;

/** Сообщить зависимостям о занятии, например что NPC выпил. Задача мгновенная */
export class AddictionsPerformTask implements PrimitiveTask<NpcState, NpcContext> {
  readonly name = 'addictions-perform';

  private readonly options: AddictionsPerformTaskOptions;

  constructor(options: AddictionsPerformTaskOptions) {
    this.options = options;
  }

  canExecute(): boolean {
    return true;
  }

  /** Сообщает о занятии копии зависимостей на время из состояния */
  applyEffects(state: NpcState): NpcState {
    const addictions = state.self.addictions.clone();
    addictions.perform(this.options, state.world.time);

    return {
      ...state,
      self: {
        ...state.self,
        addictions,
      },
    };
  }

  /** Сообщает о занятии зависимостям из контекста и возвращает 'success' */
  start(state: NpcState, context: NpcContext): TaskResult {
    context.addictions.perform(this.options, state.world.time);

    return 'success';
  }

  /** Задача завершается в start, поэтому, если до update всё же дошло, возвращает 'failed' */
  update(): TaskResult {
    return 'failed';
  }

  /** Задача мгновенная, останавливать нечего */
  stop(): void {}
}
