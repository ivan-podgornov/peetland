import type { Consumption } from '@peetland/addictions';
import type { PrimitiveTask, TaskResult } from '@peetland/htn';
import type { NpcContext, NpcState } from '@peetland/npc';

/** Употребление, о котором задача сообщает зависимостям, и его детали */
export type AddictionsConsumeTaskOptions = Consumption;

/** Сообщить зависимостям об употреблении, например что NPC выпил. Задача мгновенная */
export class AddictionsConsumeTask implements PrimitiveTask<NpcState, NpcContext> {
  readonly name = 'addictions-consume';

  private readonly options: AddictionsConsumeTaskOptions;

  constructor(options: AddictionsConsumeTaskOptions) {
    this.options = options;
  }

  canExecute(): boolean {
    return true;
  }

  /** Сообщает об употреблении копии зависимостей на время из состояния */
  applyEffects(state: NpcState): NpcState {
    const addictions = state.self.addictions.clone();
    addictions.consume(this.options, state.world.time);

    return {
      ...state,
      self: {
        ...state.self,
        addictions,
      },
    };
  }

  /** Сообщает об употреблении зависимостям из контекста и возвращает 'success' */
  start(state: NpcState, context: NpcContext): TaskResult {
    context.addictions.consume(this.options, state.world.time);

    return 'success';
  }

  /** Задача завершается в start, поэтому, если до update всё же дошло, возвращает 'failed' */
  update(): TaskResult {
    return 'failed';
  }

  /** Задача мгновенная, останавливать нечего */
  stop(): void {}
}
