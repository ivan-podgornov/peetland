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
