import type { Observable } from '@peetland/events';

export interface ITimer {
  /**
   * Возвращает новый Observable, который раз в period миллисекунд сообщает, сколько миллисекунд
   * прошло с прошлого значения, а для первого значения — с подписки. Каждый вызов создаёт
   * отдельный Observable со своим отсчётом времени, поэтому его не нужно делить с другими
   * @param period - как часто сообщать о прошедшем времени, в миллисекундах
   */
  interval(period: number): Observable<number>;
}

/** Текущее время суток */
export interface ITime {
  /** Час, от 0 до 23 */
  readonly hours: number;
  /** Минуты текущего часа, от 0 до 59 */
  readonly minutes: number;
  /** Сколько минут прошло с полуночи, от 0 до 1439 */
  readonly minutesSinceMidnight: number;
}
