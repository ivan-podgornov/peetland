import type { IObserver, ObserveOptions } from '@peetland/events';
import { VIRTUAL_ANIMATIONS, VirtualActor } from '@peetland/game';
import { Geometry } from '@peetland/geometry';
import { ManualTimer } from '@peetland/timings';
import type { ITimer } from '@peetland/timings';

import { Command } from '../src';
import type { CommandDeps, CommandResult, CommandStatus } from '../src';

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
  onFinish?: (result: CommandResult) => void;
};

/** Команда, хуки которой задаёт тест */
export class TestCommand extends Command<number, TestCommandHooks> {
  constructor(hooks: TestCommandHooks, deps: CommandDeps) {
    super({ name: 'test', updatePeriod: UPDATE_PERIOD }, createActor(), hooks, deps);
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
  hooks?: TestCommandHooks;
  timer?: ITimer;
};

/** Создаёт тестовую команду. Если таймер не указан, время для команды не идёт */
export function createCommand(options: CreateCommandOptions = {}): TestCommand {
  return new TestCommand(options.hooks ?? {}, { timer: options.timer ?? new ManualTimer() });
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

/** Создаёт виртуального актора в начале координат */
function createActor(): VirtualActor {
  return new VirtualActor(
    { position: { x: 0, y: 0, z: 0 }, animations: VIRTUAL_ANIMATIONS },
    { geometry: new Geometry(), timer: new ManualTimer() }
  );
}
