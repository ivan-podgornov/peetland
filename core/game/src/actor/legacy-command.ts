import { Observable } from '@peetland/events';
import type { ISubscriber } from '@peetland/events';

import type { IActorCommand } from './types';

/** Создаёт команду в старом формате для подписчика Observable */
export type CreateLegacyCommand<TValue> = (
  this: void,
  subscriber: ISubscriber<TValue>
) => ILegacyActorCommand;

/** Команда в старом формате: получает подписчика в конструкторе и запускается методом start */
export interface ILegacyActorCommand {
  start(): void;
  cancel(reason: unknown): void;
}

/**
 * Временный адаптер, который превращает команду в старом формате в IActorCommand. Нужен, пока
 * команды не переведены на Command из @peetland/actor-command (#46, #47)
 */
export class LegacyCommand<TValue> implements IActorCommand<TValue> {
  readonly name: string;
  private readonly create: CreateLegacyCommand<TValue>;
  /** Команда в старом формате. null, пока на Observable не подписались */
  private command: ILegacyActorCommand | null;
  /** Причина, по которой команду прервали до подписки. null, если не прерывали */
  private cancelled: { reason: unknown } | null;

  /**
   * @param name - название команды
   * @param create - создаёт команду в старом формате для подписчика Observable
   */
  constructor(name: string, create: CreateLegacyCommand<TValue>) {
    this.name = name;
    this.create = create;
    this.command = null;
    this.cancelled = null;
  }

  execute(): Observable<TValue> {
    return new Observable((subscriber: ISubscriber<TValue>) => {
      if (this.cancelled) {
        subscriber.error(this.cancelled.reason);
        return;
      }

      this.command = this.create(subscriber);
      this.command.start();
    });
  }

  cancel(reason: unknown): void {
    if (this.command) {
      this.command.cancel(reason);
    } else {
      this.cancelled = { reason };
    }
  }
}
