import type { IActor, IActorCommand } from '@peetland/game';
import type { PrimitiveTask, TaskResult } from '@peetland/htn';

import type { NpcContext, NpcState } from '../npc';

/** Выполнение команды конкретным актором */
type Execution = {
  command: IActorCommand;
  result: TaskResult;
};

/**
 * Примитивная задача, которая отдаёт команду актору из контекста и выполняется, пока выполняется
 * команда: успешное завершение команды — 'success', ошибка — 'failed'. Одну задачу могут выполнять
 * разные NPC, поэтому выполнения хранятся по акторам, а не в полях задачи. Наследнику остаётся
 * описать, какую команду отдать актору и какие эффекты применить к состоянию
 */
export abstract class CommandTask implements PrimitiveTask<NpcState, NpcContext> {
  abstract readonly name: string;

  private readonly executions = new Map<IActor, Execution>();

  canExecute(_state: NpcState): boolean {
    return true;
  }

  abstract applyEffects(state: NpcState): NpcState;

  /**
   * Отдаёт команду актору из контекста и сразу начинает её выполнять. Если команда завершилась
   * сразу, возвращает её результат
   */
  start(_state: NpcState, context: NpcContext): TaskResult {
    const { actor } = context;
    const execution: Execution = { command: this.createCommand(actor), result: 'running' };
    this.executions.set(actor, execution);

    execution.command.execute().subscribe({
      complete: () => {
        execution.result = 'success';
      },
      error: () => {
        execution.result = 'failed';
      },
    });

    return this.finishIfDone(actor, execution);
  }

  /** Возвращает результат команды актора. Если задачу этим актором не начинали, возвращает 'failed' */
  update(_state: NpcState, context: NpcContext): TaskResult {
    const { actor } = context;
    const execution = this.executions.get(actor);

    if (!execution) {
      return 'failed';
    }

    return this.finishIfDone(actor, execution);
  }

  /** Прерывает команду актора. Если задачу этим актором не начинали, ничего не делает */
  stop(context: NpcContext): void {
    const { actor } = context;
    const execution = this.executions.get(actor);

    if (!execution) {
      return;
    }

    this.executions.delete(actor);
    execution.command.cancel(new Error(`Задача ${this.name} остановлена`));
  }

  /** Создаёт команду, которую нужно отдать актору */
  protected abstract createCommand(actor: IActor): IActorCommand;

  /** Забывает выполнение, если команда завершилась, и возвращает результат */
  private finishIfDone(actor: IActor, execution: Execution): TaskResult {
    if (execution.result !== 'running') {
      this.executions.delete(actor);
    }

    return execution.result;
  }
}
