import type { ISubscriber, Observable } from '@peetland/events';
import type { Vector3 } from '@peetland/geometry';

export interface IActor {
  /** Возвращает позицию персонажа в игре */
  getPosition(): Vector3;

  /** Устанавливает позицию персонажа в игре */
  setPosition(position: Vector3): void;

  /**
   * Заставляет персонажа идти к определённым координатам. Возвращает observable, который будет
   * выполнен, когда персонаж окажется в ожидаемом радиусе от нужных координат. Observable будет
   * сообщать всем наблюдателям текущие координаты персонажа по мере приближения к точке.
   * @param coords - координаты к которым нужно прийти
   * @param completeRadius - радиус, при котором можно считать, что персонаж пришел к нужным координатам
   */
  goToCoords(coords: Vector3, completeRadius: number): Observable<Vector3>;

  /** Деспавнит игрового персонажа */
  despawn(): void;
}

export type CreateActorOptions = {
  /** ID игровой модели */
  modelId: number;
  /** Позиция, на которой нужно заспавнить персонажа */
  position: Vector3;
};

export interface IActorFactory {
  /** Создаёт игрового персонажа */
  create(options: CreateActorOptions): IActor;
}

export type GoToCoordsOptions = {
  /** Координаты, к которым нужно прийти */
  coords: Vector3;
  /** Радиус, при котором можно считать, что персонаж пришёл к нужным координатам */
  completeRadius: number;
};

/** Команда, которую выполняет актор, например, движение к точке или проигрывание анимации */
export interface IActorCommand {
  /** Начинает выполнение команды */
  start(): void;

  /** Успешно завершает команду. Команда вызывает его сама, когда выполнена */
  stop(): void;

  /** Прерывает команду, не дав ей выполниться. Завершает её Observable ошибкой reason */
  cancel(reason: unknown): void;
}

/** То, как актор устроен на самом деле. Actor делегирует ему свои методы */
export interface IActorState {
  /** Возвращает позицию персонажа */
  getPosition(): Vector3;

  /** Устанавливает позицию персонажа */
  setPosition(position: Vector3): void;

  /** Создаёт команду, которая ведёт персонажа к точке и сообщает о ходе движения в subscriber */
  createGoToCoordsCommand(
    actor: IActor,
    subscriber: ISubscriber<Vector3>,
    options: GoToCoordsOptions
  ): IActorCommand;

  /** Удаляет персонажа */
  despawn(): void;
}
