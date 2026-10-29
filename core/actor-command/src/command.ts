import type { IActorCommand } from '@peetland/game';

import type { CommandContext, CommandDeps, CommandStatus } from './types';

/**
 * Команда актора, которая раз в период обновления вызывает onUpdate, пока он не вернёт 'success'
 * или 'failed'. Сама подписывается на таймер, завершает Observable команды и не даёт завершить или
 * прервать её повторно. Наследнику остаётся описать в хуках, что команда делает
 */
export abstract class Command<
  TValue,
  TOptions,
  TDeps extends CommandDeps = CommandDeps,
> implements IActorCommand {
  abstract readonly name: string;
  protected readonly context: CommandContext<TValue>;
  protected readonly options: TOptions;
  protected readonly deps: TDeps;
  /** Как часто вызывать onUpdate, в миллисекундах */
  private readonly updatePeriod: number;
  private finished: boolean;

  /**
   * @param context - актор, который выполняет команду, и подписчик её Observable
   * @param options - параметры команды
   * @param deps - зависимости команды
   * @param updatePeriod - как часто вызывать onUpdate, в миллисекундах
   */
  protected constructor(
    context: CommandContext<TValue>,
    options: TOptions,
    deps: TDeps,
    updatePeriod: number
  ) {
    this.context = context;
    this.options = options;
    this.deps = deps;
    this.updatePeriod = updatePeriod;
    this.finished = false;
  }

  /** Вызывает onStart и сразу первый onUpdate. Если команда не выполнена, подписывается на таймер */
  start(): void {
    if (this.isFinished()) {
      return;
    }

    this.onStart();
    this.update(0);

    if (this.isFinished()) {
      return;
    }

    this.deps.timer
      .interval(this.updatePeriod)
      .subscribe((elapsed) => this.update(elapsed), { signal: this.context.subscriber.signal });
  }

  /** Вызывает onFinish и успешно завершает Observable. Если команда уже завершена, ничего не делает */
  stop(): void {
    if (this.isFinished()) {
      return;
    }

    this.finished = true;
    this.onFinish();
    this.context.subscriber.complete();
  }

  /** Вызывает onCancel и завершает Observable ошибкой reason. Если команда уже завершена, ничего не делает */
  cancel(reason: unknown): void {
    if (this.isFinished()) {
      return;
    }

    this.finished = true;
    this.onCancel();
    this.context.subscriber.error(reason);
  }

  /** Вызывается, когда команда начинает выполняться, до первого onUpdate */
  protected onStart(): void {}

  /**
   * Вызывается сразу после onStart, а потом раз в период обновления. Возвращает 'success', если
   * команда выполнена, 'failed', если выполнить её не удалось, и 'running', если она ещё
   * выполняется
   * @param elapsed - сколько миллисекунд прошло с прошлого вызова, для первого вызова — 0
   */
  protected abstract onUpdate(elapsed: number): CommandStatus;

  /** Вызывается, когда команда выполнена, перед тем как Observable завершится */
  protected onFinish(): void {}

  /** Вызывается, когда команду прервали, перед тем как Observable завершится ошибкой */
  protected onCancel(): void {}

  /** Сообщает значение подписчикам Observable команды */
  protected emit(value: TValue): void {
    this.context.subscriber.next(value);
  }

  /**
   * Завершает Observable ошибкой reason, не вызывая onFinish и onCancel. Если команда уже
   * завершена, ничего не делает
   */
  protected fail(reason: unknown): void {
    if (this.isFinished()) {
      return;
    }

    this.finished = true;
    this.context.subscriber.error(reason);
  }

  /** Возвращает true, если команда завершена или от её Observable отписались */
  private isFinished(): boolean {
    return this.finished || !this.context.subscriber.active;
  }

  /** Вызывает onUpdate и завершает команду, если она выполнена или выполнить её не удалось */
  private update(elapsed: number): void {
    if (this.isFinished()) {
      return;
    }

    const status = this.onUpdate(elapsed);

    if (status === 'success') {
      this.stop();
    } else if (status === 'failed') {
      this.fail(new Error(`Команда ${this.name} не выполнена`));
    }
  }
}
