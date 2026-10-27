import type { ISubscriber } from '@peetland/events';

import type { IActorCommand } from './types';

/** Команда, которая сообщает о ходе выполнения через subscriber */
export abstract class ActorCommand<T> implements IActorCommand {
  protected readonly subscriber: ISubscriber<T>;

  constructor(subscriber: ISubscriber<T>) {
    this.subscriber = subscriber;
  }

  abstract start(): void;

  stop(): void {
    this.subscriber.complete();
  }

  cancel(reason: unknown): void {
    this.subscriber.error(reason);
  }
}
