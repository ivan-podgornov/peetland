import type { ISubscriber } from '@peetland/events';
import type { IActor } from '@peetland/game';
import type { ITimer } from '@peetland/timings';

/** Состояние команды после очередного обновления */
export type CommandStatus = 'running' | 'success' | 'failed';

/** Контекст команды: актор, который её выполняет, и подписчик её Observable */
export type CommandContext<TValue> = {
  actor: IActor;
  subscriber: ISubscriber<TValue>;
};

/** Зависимости, которые нужны любой команде. Наследник может добавить свои */
export type CommandDeps = {
  timer: ITimer;
};
