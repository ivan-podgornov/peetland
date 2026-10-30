import type { Observable } from '@peetland/events';

import type { AnimationId } from '@peetland/game';

/** Запись таблицы анимаций. У каждой реализации актора она своя, но длительность есть у всех */
export type AnimationRecord = {
  /**
   * Сколько длится один проход анимации, в миллисекундах. Анимация проигрывается столько, если
   * время проигрывания не передали
   */
  duration: number;
};

/** Таблица анимаций: какой записью показывается каждая анимация актора */
export type AnimationTable<TAnimation extends AnimationRecord> = Record<AnimationId, TAnimation>;

/** Что и как проигрывать */
export type AnimationPlayback<TAnimation extends AnimationRecord> = {
  /** Запись из таблицы анимаций */
  animation: TAnimation;
  /** Сколько проигрывать анимацию, в миллисекундах */
  duration: number;
  /** Повторять ли анимацию, пока не пройдёт duration */
  loop: boolean;
};

/** Проверяет параметры анимаций и следит, чтобы нужные анимации были загружены */
export interface IAnimationManager<TAnimation extends AnimationRecord> {
  /**
   * Возвращает, что и как проигрывать. Время проигрывания — переданное, а если его не передали,
   * длительность из таблицы. Выбрасывает ошибку, если время передано для незацикленной анимации
   * или анимации нет в таблице, и RangeError, если время не положительное конечное число
   * @param animation - какую анимацию проиграть
   * @param playbackDuration - сколько проигрывать зацикленную анимацию, в миллисекундах
   */
  resolve(animation: AnimationId, playbackDuration?: number): AnimationPlayback<TAnimation>;

  /**
   * Возвращает Observable, подписка на который означает, что анимация нужна. Observable сообщает
   * значение, когда анимация загружена (если она уже загружена — сразу при подписке), и после этого
   * не завершается. Пока на анимацию подписан хоть кто-то, она остаётся загруженной. Когда
   * отписался последний, анимация выгружается
   * @param animation - какая анимация нужна
   */
  acquire(animation: AnimationId): Observable<void>;
}

/** Загружает и выгружает анимации конкретной реализации актора */
export interface IAnimationLoader<TAnimation extends AnimationRecord> {
  /**
   * Возвращает ключ загрузки. Анимации с одинаковым ключом загружаются одной загрузкой: например,
   * анимации GTA из одного блока
   */
  key(animation: TAnimation): string;

  /**
   * Возвращает Observable, который при подписке начинает загружать анимацию и сообщает значение,
   * когда она загружена. Когда от него отписались, выгружает анимацию
   */
  load(animation: TAnimation): Observable<void>;
}
