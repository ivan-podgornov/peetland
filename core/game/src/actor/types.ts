import type { Observable } from '@peetland/events';
import type { Vector3 } from '@peetland/geometry';

import type { AnimationId } from './animation';

export interface IActor {
  /** Возвращает позицию персонажа в игре */
  getPosition(): Vector3;

  /** Устанавливает позицию персонажа в игре */
  setPosition(position: Vector3): void;

  /**
   * Возвращает команду идти к определённым координатам. Её Observable будет выполнен, когда
   * персонаж окажется в ожидаемом радиусе от нужных координат, и будет сообщать всем наблюдателям
   * текущие координаты персонажа по мере приближения к точке.
   * @param coords - координаты к которым нужно прийти
   * @param completeRadius - радиус, при котором можно считать, что персонаж пришел к нужным координатам
   */
  goToCoords(coords: Vector3, completeRadius: number): IActorCommand<Vector3>;

  /**
   * Возвращает команду проиграть анимацию. Её Observable завершается, когда анимация закончилась,
   * и значений не сообщает. Зацикленная анимация (см. ANIMATIONS) повторяется, пока не
   * пройдёт duration; для незацикленной duration не передаётся, она идёт свою длительность.
   * Выбрасывает ошибку, если duration не соответствует анимации (см. assertPlaybackDuration)
   * @param animation - какую анимацию проиграть
   * @param duration - сколько проигрывать зацикленную анимацию, в миллисекундах
   */
  playAnimation(animation: AnimationId, duration?: number): IActorCommand<void>;

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

/**
 * Команда, которую выполняет актор, например, движение к точке или проигрывание анимации.
 * Методы актора только создают команду. Выполняться она начинает, когда подписываются на
 * Observable из execute: тогда она прерывает текущую команду актора и становится текущей
 */
export interface IActorCommand<TValue = unknown> {
  /** Название команды, например, go-to-coords или play-animation */
  readonly name: string;

  /** Возвращает Observable команды. Команда начинает выполняться, когда на него подписываются */
  execute(): Observable<TValue>;

  /**
   * Прерывает команду и завершает её Observable ошибкой reason. Если команду прервали до подписки,
   * при подписке Observable сразу завершится ошибкой
   */
  cancel(reason: unknown): void;
}
