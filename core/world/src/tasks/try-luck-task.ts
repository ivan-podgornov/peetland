import { AbortController } from '@peetland/events';
import type { IActor } from '@peetland/game';
import type { PrimitiveTask, TaskResult } from '@peetland/htn';
import type { IRandom } from '@peetland/random';
import type { ITimer } from '@peetland/timings';

import type { NpcContext, NpcState } from '../npc';

/** Как часто NPC пытает удачу, в миллисекундах */
export const TRY_LUCK_PERIOD = 1000;

export type TryLuckTaskOptions = {
  /** Шанс, что попытка удастся, от 0 до 1, например, 1 / 60 */
  chance: number;
  /**
   * Условие остановки. Проверяется перед началом и каждый тик с актуальным состоянием. Если
   * выполнилось раньше, чем повезло, задача завершается с 'failed'. Если не передано, NPC пытает
   * удачу, пока не повезёт
   */
  stopWhen?: (state: NpcState) => boolean;
  /** Вызывается при каждой попытке, до броска шанса, независимо от того, повезёт ли */
  onAttempt?: (context: NpcContext) => void;
  /** Эффекты, которые планировщик применяет к состоянию. Если не переданы, состояние не меняется */
  applyEffects?: (state: NpcState) => NpcState;
};

export type TryLuckTaskDeps = {
  random: IRandom;
  timer: ITimer;
};

/** Попытки конкретного актора */
type Attempts = {
  lifetime: AbortController;
  isLucky: boolean;
};

/**
 * Пытать удачу: раз в TRY_LUCK_PERIOD бросать шанс, пока не повезёт. Когда повезло, задача
 * завершается с 'success', и план продолжается следующими задачами: что получил NPC, решают они.
 * Одну задачу могут выполнять разные NPC, поэтому попытки хранятся по акторам, а не в полях задачи
 */
export class TryLuckTask implements PrimitiveTask<NpcState, NpcContext> {
  readonly name = 'try-luck';

  private readonly options: TryLuckTaskOptions;
  private readonly deps: TryLuckTaskDeps;
  private readonly attempts = new Map<IActor, Attempts>();

  constructor(options: TryLuckTaskOptions, deps: TryLuckTaskDeps) {
    this.options = options;
    this.deps = deps;
  }

  /** Задачу можно выполнить, если условие остановки ещё не выполнилось */
  canExecute(state: NpcState): boolean {
    return !this.shouldStop(state);
  }

  applyEffects(state: NpcState): NpcState {
    const { applyEffects } = this.options;

    return applyEffects ? applyEffects(state) : state;
  }

  /** Начинает раз в TRY_LUCK_PERIOD пытать удачу и возвращает 'running' */
  start(_state: NpcState, context: NpcContext): TaskResult {
    const { random, timer } = this.deps;
    const { chance, onAttempt } = this.options;
    const { actor } = context;
    const attempts: Attempts = { lifetime: new AbortController(), isLucky: false };
    this.stopAttempts(actor);
    this.attempts.set(actor, attempts);

    timer.interval(TRY_LUCK_PERIOD).subscribe(
      () => {
        onAttempt?.(context);

        if (random.chance(chance)) {
          attempts.isLucky = true;
          attempts.lifetime.abort();
        }
      },
      { signal: attempts.lifetime.signal }
    );

    return 'running';
  }

  /**
   * Если повезло, возвращает 'success'. Если не повезло, но выполнилось условие остановки,
   * перестаёт пытать удачу и возвращает 'failed'. Иначе возвращает 'running'. Если задачу этим
   * актором не начинали, возвращает 'failed'
   */
  update(state: NpcState, context: NpcContext): TaskResult {
    const { actor } = context;
    const attempts = this.attempts.get(actor);

    if (!attempts) {
      return 'failed';
    }

    if (attempts.isLucky) {
      this.attempts.delete(actor);
      return 'success';
    }

    if (this.shouldStop(state)) {
      this.stopAttempts(actor);
      return 'failed';
    }

    return 'running';
  }

  /** Перестаёт пытать удачу. Если задачу этим актором не начинали, ничего не делает */
  stop(context: NpcContext): void {
    this.stopAttempts(context.actor);
  }

  private shouldStop(state: NpcState): boolean {
    const { stopWhen } = this.options;

    return stopWhen ? stopWhen(state) : false;
  }

  private stopAttempts(actor: IActor): void {
    this.attempts.get(actor)?.lifetime.abort();
    this.attempts.delete(actor);
  }
}
