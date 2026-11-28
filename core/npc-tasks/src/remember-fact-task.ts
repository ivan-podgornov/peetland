import type { PrimitiveTask, TaskResult } from '@peetland/htn';
import type { MemoryMap } from '@peetland/memory';
import type { NpcContext, NpcState } from '@peetland/npc';

/**
 * Факт, который задача запомнит: тип и детали. Момент запоминания задача берёт из времени мира,
 * поэтому его в опциях нет (см. Fact)
 */
export type RememberFactTaskOptions = {
  [K in keyof MemoryMap]: Readonly<{
    /** Тип факта (см. MemoryMap) */
    type: K;
    /** Детали факта своего типа (см. MemoryMap) */
    details: MemoryMap[K];
  }>;
}[keyof MemoryMap];

/**
 * Запомнить факт: записывает факт в память NPC, например что место занято или мусорка исследована.
 * Момент запоминания — текущее время из состояния. Задача мгновенная: завершается прямо в start
 */
export class RememberFactTask implements PrimitiveTask<NpcState, NpcContext> {
  readonly name = 'remember-fact';

  private readonly options: RememberFactTaskOptions;

  constructor(options: RememberFactTaskOptions) {
    this.options = options;
  }

  canExecute(): boolean {
    return true;
  }

  /** Запоминает факт копии памяти из состояния на время из состояния */
  applyEffects(state: NpcState): NpcState {
    const memory = state.self.memory.clone();
    memory.remember({
      ...this.options,
      rememberedAt: state.world.time.getState(),
    });

    return {
      ...state,
      self: {
        ...state.self,
        memory,
      },
    };
  }

  /** Запоминает факт памяти из контекста и возвращает 'success' */
  start(state: NpcState, context: NpcContext): TaskResult {
    context.memory.remember({
      ...this.options,
      rememberedAt: state.world.time.getState(),
    });

    return 'success';
  }

  /** Задача завершается в start, поэтому, если до update всё же дошло, возвращает 'failed' */
  update(): TaskResult {
    return 'failed';
  }

  /** Задача мгновенная, останавливать нечего */
  stop(): void {}
}
