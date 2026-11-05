import type { IActor, IActorCommand } from '@peetland/game';
import type { PrimitiveTask, TaskResult } from '@peetland/htn';

import type { NpcContext, NpcState } from '@peetland/npc';

/** Выполнение команды */
type Execution = {
  command: IActorCommand;
  result: TaskResult;
};

/**
 * Примитивная задача, которая отдаёт команду актору из контекста и выполняется, пока выполняется
 * команда: успешное завершение команды — 'success', ошибка — 'failed'. Наследнику остаётся описать,
 * какую команду отдать актору и какие эффекты применить к состоянию
 */
export abstract class CommandTask implements PrimitiveTask<NpcState, NpcContext> {
  abstract readonly name: string;

  private execution: Execution | null = null;

  canExecute(): boolean {
    return true;
  }

  abstract applyEffects(state: NpcState): NpcState;

  /**
   * Отдаёт команду актору из контекста и сразу начинает её выполнять. Если команда завершилась
   * сразу, возвращает её результат
   */
  start(_state: NpcState, context: NpcContext): TaskResult {
    const execution: Execution = {
      command: this.createCommand(context.actor),
      result: 'running',
    };
    this.execution = execution;

    execution.command.execute().subscribe({
      complete: () => {
        execution.result = 'success';
      },
      error: () => {
        execution.result = 'failed';
      },
    });

    return this.finishIfDone(execution);
  }

  /** Возвращает результат команды. Если задачу не начинали, возвращает 'failed' */
  update(): TaskResult {
    const { execution } = this;

    if (!execution) {
      return 'failed';
    }

    return this.finishIfDone(execution);
  }

  /** Прерывает команду. Если задачу не начинали, ничего не делает */
  stop(): void {
    const { execution } = this;

    if (!execution) {
      return;
    }

    this.execution = null;
    execution.command.cancel(new Error(`Задача ${this.name} остановлена`));
  }

  /** Создаёт команду, которую нужно отдать актору */
  protected abstract createCommand(actor: IActor): IActorCommand;

  /** Забывает выполнение, если команда завершилась, и возвращает результат */
  private finishIfDone(execution: Execution): TaskResult {
    if (execution.result !== 'running') {
      this.execution = null;
    }

    return execution.result;
  }
}
