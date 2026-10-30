import { AbortController, Observable } from '@peetland/events';
import type { IAbortSignal, ISubscriber } from '@peetland/events';
import type { IActor, IActorCommand } from '@peetland/game';

import type { CommandDefinition, CommandDeps, CommandResult, CommandStatus } from './types';

/**
 * Команда актора, которая раз в период обновления вызывает onUpdate, пока он не вернёт 'success'
 * или 'failed'. Сама подписывается на таймер, завершает Observable команды и не даёт завершить или
 * прервать её повторно. Наследнику остаётся описать в хуках, что команда делает
 */
export abstract class Command<
  TValue,
  TOptions,
  TDeps extends CommandDeps = CommandDeps,
> implements IActorCommand<TValue> {
  readonly name: string;
  protected readonly actor: IActor;
  protected readonly options: TOptions;
  protected readonly deps: TDeps;
  /** Как часто вызывать onUpdate, в миллисекундах */
  private readonly updatePeriod: number;
  /** Переходит в состояние aborted, когда команда завершена */
  private readonly controller: AbortController;
  /** Переходит в состояние aborted, когда команда закончилась и onFinish уже вызван */
  private readonly lifetime: AbortController;
  /** Подписчик Observable команды. null, пока на него не подписались */
  private subscriber: ISubscriber<TValue> | null;
  /** Чем закончилась команда. null, пока она не завершена */
  private result: CommandResult | null;

  /**
   * @param definition - название команды и период обновления
   * @param actor - актор, который выполняет команду
   * @param options - параметры команды
   * @param deps - зависимости команды
   */
  protected constructor(
    definition: CommandDefinition,
    actor: IActor,
    options: TOptions,
    deps: TDeps
  ) {
    this.name = definition.name;
    this.updatePeriod = definition.updatePeriod;
    this.actor = actor;
    this.options = options;
    this.deps = deps;
    this.controller = new AbortController();
    this.lifetime = new AbortController();
    this.subscriber = null;
    this.result = null;
  }

  /**
   * Возвращает Observable команды. Команда начинает выполняться, когда на него подписываются:
   * вызывает onStart и сразу первый onUpdate, а если команда не выполнена, подписывается на таймер.
   * Если команду прервали до подписки, Observable сразу завершается ошибкой
   */
  execute(): Observable<TValue> {
    return new Observable((subscriber: ISubscriber<TValue>) => {
      const { signal } = this.controller;

      if (signal.aborted) {
        subscriber.error(signal.reason);
        return;
      }

      this.subscriber = subscriber;
      subscriber.addTeardown(() => this.teardown());

      this.onStart();
      this.update(0);

      if (signal.aborted) {
        return;
      }

      this.deps.timer
        .interval(this.updatePeriod)
        .subscribe((elapsed) => this.update(elapsed), { signal });
    });
  }

  /** Прерывает команду и завершает её Observable ошибкой reason. Если команда завершена, ничего не делает */
  cancel(reason: unknown): void {
    this.finish('cancelled', reason);
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

  /**
   * Вызывается один раз, когда команда закончилась, как бы она ни закончилась. Нужен, чтобы
   * освободить ресурсы. Если от Observable отписались, команда считается прерванной
   * @param result - чем закончилась команда
   */
  protected onFinish(_result: CommandResult): void {}

  /**
   * Сигнал, который переходит в состояние aborted, когда команда закончилась, как бы она ни
   * закончилась, и уже после вызова onFinish. С ним удобно подписываться на Observable на время
   * выполнения команды: подписка остаётся активной и в onFinish
   */
  protected get signal(): IAbortSignal {
    return this.lifetime.signal;
  }

  /** Сообщает значение подписчикам Observable команды */
  protected emit(value: TValue): void {
    this.subscriber?.next(value);
  }

  /** Завершает Observable ошибкой reason. Если команда завершена, ничего не делает */
  protected fail(reason: unknown): void {
    this.finish('failed', reason);
  }

  /** Вызывает onUpdate и завершает команду, если она выполнена или выполнить её не удалось */
  private update(elapsed: number): void {
    if (this.controller.signal.aborted) {
      return;
    }

    const status = this.onUpdate(elapsed);

    if (status === 'success') {
      this.finish('success');
    } else if (status === 'failed') {
      this.fail(new Error(`Команда ${this.name} не выполнена`));
    }
  }

  /** Завершает команду и её Observable. Если команда уже завершена, ничего не делает */
  private finish(result: CommandResult, reason?: unknown): void {
    if (this.controller.signal.aborted) {
      return;
    }

    this.result = result;
    this.controller.abort(reason);

    if (result === 'success') {
      this.subscriber?.complete();
    } else {
      this.subscriber?.error(reason);
    }
  }

  /** Освобождает ресурсы команды, когда её Observable завершился или от него отписались */
  private teardown(): void {
    const result = this.result ?? 'cancelled';

    this.controller.abort();
    this.onFinish(result);
    this.lifetime.abort();
  }
}
