import { Observable } from '@peetland/events';
import { createControlledObservable } from '@peetland/events/dev';
import type { IActorCommand } from '@peetland/game';
import type { NpcState } from '@peetland/npc';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { CommandTask } from '../src';

/** Создаёт команду, завершением которой управляет тест */
export function createControlledCommand() {
  const { observable, subscriber } = createControlledObservable();
  const command: Mocked<IActorCommand> = {
    name: 'controlled',
    execute: vi.fn(() => observable),
    cancel: vi.fn((reason: unknown) => subscriber.error(reason)),
  };

  return {
    command,
    subscriber,
  };
}

/** Создаёт команду, Observable которой завершается сразу при подписке */
export function createImmediateCommand(finish: 'complete' | 'error'): IActorCommand {
  return {
    name: 'immediate',
    execute: () =>
      new Observable((subscriber) => {
        if (finish === 'complete') {
          subscriber.complete();
        } else {
          subscriber.error(new Error('Не выполнена'));
        }
      }),
    cancel: vi.fn(),
  };
}

/** Задача, которая отдаёт актору переданную команду. Нужна, чтобы проверить общее поведение задач-команд */
export class TestCommandTask extends CommandTask {
  readonly name = 'test';

  private readonly command: () => IActorCommand;

  constructor(command: () => IActorCommand) {
    super();
    this.command = command;
  }

  applyEffects(state: NpcState): NpcState {
    return state;
  }

  protected createCommand(): IActorCommand {
    return this.command();
  }
}
