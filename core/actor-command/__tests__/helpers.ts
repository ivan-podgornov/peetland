import { AbortController, Observable } from '@peetland/events';
import type { IAbortSignal, IObserver, ObserveOptions } from '@peetland/events';
import type { IActor, IActorCommand } from '@peetland/game';
import type { Vector3 } from '@peetland/geometry';
import { ManualTimer } from '@peetland/timings';
import type { ITimer } from '@peetland/timings';

import { Command } from '../src';
import type { CommandDeps, CommandResult, CommandStatus } from '../src';

/** Как часто тестовая команда обновляется, в миллисекундах */
export const UPDATE_PERIOD = 100;

/** Актор, которого получает тестовая команда. Умеет только деспавниться */
export class TestActor implements IActor {
  private readonly controller = new AbortController();

  get signal(): IAbortSignal {
    return this.controller.signal;
  }

  getPosition(): Vector3 {
    return { x: 0, y: 0, z: 0 };
  }

  setPosition(): void {}

  goToCoords(): IActorCommand<Vector3> {
    return createIdleCommand();
  }

  playAnimation(): IActorCommand<void> {
    return createIdleCommand();
  }

  despawn(): void {
    this.controller.abort(new Error('Актор деспавнен'));
  }
}

/** Защищённые методы команды, которые тест может вызвать из хуков */
export type TestCommandControls = {
  emit(value: number): void;
  fail(reason: unknown): void;
};

/** Хуки тестовой команды. Если onUpdate не указан, команда выполняется бесконечно */
export type TestCommandHooks = {
  onStart?: (controls: TestCommandControls) => void;
  onUpdate?: (elapsed: number, controls: TestCommandControls) => CommandStatus;
  onFinish?: (result: CommandResult) => void;
};

/** Команда, хуки которой задаёт тест */
export class TestCommand extends Command<number, TestCommandHooks> {
  constructor(actor: IActor, hooks: TestCommandHooks, deps: CommandDeps) {
    super({ name: 'test', updatePeriod: UPDATE_PERIOD }, actor, hooks, deps);
  }

  /** Защищённый сигнал команды, открытый для тестов */
  get lifetimeSignal(): IAbortSignal {
    return this.signal;
  }

  protected override onStart(): void {
    this.options.onStart?.(this.getControls());
  }

  protected override onUpdate(elapsed: number): CommandStatus {
    return this.options.onUpdate?.(elapsed, this.getControls()) ?? 'running';
  }

  protected override onFinish(result: CommandResult): void {
    this.options.onFinish?.(result);
  }

  private getControls(): TestCommandControls {
    return {
      emit: (value) => this.emit(value),
      fail: (reason) => this.fail(reason),
    };
  }
}

type CreateCommandOptions = {
  actor?: TestActor;
  hooks?: TestCommandHooks;
  timer?: ITimer;
};

/**
 * Создаёт тестовую команду. Если таймер не указан, время для команды не идёт. Если актор не указан,
 * команда получает нового заспавненного актора
 */
export function createCommand(options: CreateCommandOptions = {}): TestCommand {
  return new TestCommand(options.actor ?? new TestActor(), options.hooks ?? {}, {
    timer: options.timer ?? new ManualTimer(),
  });
}

type ExecuteCommandOptions = CreateCommandOptions & {
  observer?: IObserver<number>;
  observeOptions?: ObserveOptions;
};

/** Создаёт тестовую команду, подписывается на её Observable и возвращает её */
export function executeCommand(options: ExecuteCommandOptions = {}): TestCommand {
  const command = createCommand(options);

  command.execute().subscribe(options.observer, options.observeOptions);

  return command;
}

/** Создаёт команду, которая ничего не делает и не завершается */
function createIdleCommand<TValue>(): IActorCommand<TValue> {
  return {
    name: 'idle',
    execute: () => new Observable(() => {}),
    cancel: () => {},
  };
}
