import { SlotCommand } from './slot-command';
import type { IActorCommand } from './types';

/**
 * Текущая команда актора. Актор выполняет одну команду за раз, поэтому оборачивает в слот каждую
 * команду, которую возвращает. Когда на обёрнутую команду подписываются, она прерывает текущую и
 * становится текущей, а когда завершается, перестаёт ей быть
 */
export class ActorCommandSlot {
  private command: IActorCommand | null;

  constructor() {
    this.command = null;
  }

  /** Команда, которую актор выполняет сейчас */
  get current(): IActorCommand | null {
    return this.command;
  }

  /** Возвращает команду, которая при подписке прерывает текущую и становится текущей */
  bind<TValue>(command: IActorCommand<TValue>): IActorCommand<TValue> {
    return new SlotCommand(command, {
      occupy: (next) => this.occupy(next),
      release: (finished) => this.release(finished),
    });
  }

  /** Прерывает текущую команду. Если команды нет, ничего не делает */
  cancel(reason: unknown): void {
    this.command?.cancel(reason);
  }

  private occupy(command: IActorCommand): void {
    this.command?.cancel(new Error('Актор получил другую команду'));
    this.command = command;
  }

  private release(command: IActorCommand): void {
    if (this.command === command) {
      this.command = null;
    }
  }
}
