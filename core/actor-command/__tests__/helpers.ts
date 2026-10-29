import { Observable } from '@peetland/events';
import type { IObserver, ISubscriber, ObserveOptions } from '@peetland/events';
import type { IActor } from '@peetland/game';
import { ManualTimer } from '@peetland/timings';
import type { ITimer } from '@peetland/timings';
import { vi } from 'vitest';

import { Command } from '../src';
import type { CommandContext, CommandDeps, CommandStatus } from '../src';

/** Как часто тестовая команда обновляется, в миллисекундах */
export const UPDATE_PERIOD = 100;

/** Защищённые методы команды, которые тест может вызвать из хуков */
export type TestCommandControls = {
  emit(value: number): void;
  fail(reason: unknown): void;
};

/** Хуки тестовой команды. Если onUpdate не указан, команда выполняется бесконечно */
export type TestCommandHooks = {
  onStart?: (controls: TestCommandControls) => void;
  onUpdate?: (elapsed: number, controls: TestCommandControls) => CommandStatus;
  onFinish?: () => void;
  onCancel?: () => void;
};

/** Команда, хуки которой задаёт тест */
export class TestCommand extends Command<number, TestCommandHooks> {
  readonly name = 'test';

  constructor(context: CommandContext<number>, hooks: TestCommandHooks, deps: CommandDeps) {
    super(context, hooks, deps, UPDATE_PERIOD);
  }

  protected override onStart(): void {
    this.options.onStart?.(this.getControls());
  }

  protected override onUpdate(elapsed: number): CommandStatus {
    return this.options.onUpdate?.(elapsed, this.getControls()) ?? 'running';
  }

  protected override onFinish(): void {
    this.options.onFinish?.();
  }

  protected override onCancel(): void {
    this.options.onCancel?.();
  }

  private getControls(): TestCommandControls {
    return {
      emit: (value) => this.emit(value),
      fail: (reason) => this.fail(reason),
    };
  }
}

type StartCommandOptions = {
  hooks?: TestCommandHooks;
  observer?: IObserver<number>;
  observeOptions?: ObserveOptions;
  timer?: ITimer;
};

/**
 * Подписывается на Observable, который создаёт и запускает тестовую команду, и возвращает её.
 * Если таймер не указан, время для команды не идёт
 */
export function startCommand(options: StartCommandOptions = {}): TestCommand {
  let command: TestCommand | null = null;

  new Observable((subscriber: ISubscriber<number>) => {
    command = new TestCommand({ actor: createActor(), subscriber }, options.hooks ?? {}, {
      timer: options.timer ?? new ManualTimer(),
    });

    command.start();
  }).subscribe(options.observer, options.observeOptions);

  if (!command) {
    throw new Error('Команда не создана');
  }

  return command;
}

/** Создаёт актора, методы которого ничего не делают */
function createActor(): IActor {
  return {
    currentCommand: null,
    getPosition: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
    setPosition: vi.fn(),
    goToCoords: vi.fn(),
    playAnimation: vi.fn(),
    despawn: vi.fn(),
  };
}
