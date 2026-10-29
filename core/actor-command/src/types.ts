import type { ITimer } from '@peetland/timings';

/** Описание команды, одинаковое для всех её экземпляров */
export type CommandDefinition = {
  /** Название команды, например, go-to-coords или play-animation */
  name: string;
  /** Как часто вызывать onUpdate, в миллисекундах */
  updatePeriod: number;
};

/** Состояние команды после очередного обновления */
export type CommandStatus = 'running' | 'success' | 'failed';

/** Чем закончилась команда: выполнена, не удалось выполнить или прервана */
export type CommandResult = 'success' | 'failed' | 'cancelled';

/** Зависимости, которые нужны любой команде. Наследник может добавить свои */
export type CommandDeps = {
  timer: ITimer;
};
