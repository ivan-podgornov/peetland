import { Observable } from '@peetland/events';
import type { ISubscriber } from '@peetland/events';

import type { IActorCommand } from './types';

/** Что команда в слоте сообщает слоту о своём выполнении */
export type SlotCallbacks = {
  /** Команда начала выполняться и должна стать текущей */
  occupy(command: IActorCommand): void;
  /** Команда завершилась и больше не должна быть текущей */
  release(command: IActorCommand): void;
};

/** Команда в слоте. Передаёт вызовы обёрнутой команде и сообщает слоту, когда та выполняется */
export class SlotCommand<TValue> implements IActorCommand<TValue> {
  readonly name: string;
  private readonly command: IActorCommand<TValue>;
  private readonly callbacks: SlotCallbacks;
  /** Прервали ли команду. Прерванная команда не прерывает текущую и не становится текущей */
  private cancelled: boolean;

  constructor(command: IActorCommand<TValue>, callbacks: SlotCallbacks) {
    this.name = command.name;
    this.command = command;
    this.callbacks = callbacks;
    this.cancelled = false;
  }

  execute(): Observable<TValue> {
    return new Observable((subscriber: ISubscriber<TValue>) => {
      if (!this.cancelled) {
        this.callbacks.occupy(this);
        subscriber.addTeardown(() => this.callbacks.release(this));
      }

      this.command.execute().subscribe(
        {
          next: (value) => subscriber.next(value),
          error: (error) => subscriber.error(error),
          complete: () => subscriber.complete(),
        },
        { signal: subscriber.signal }
      );
    });
  }

  cancel(reason: unknown): void {
    this.cancelled = true;
    this.command.cancel(reason);
  }
}
