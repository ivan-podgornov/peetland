import type { Observable } from '@peetland/events';

/** Observable, который время от времени сообщает, сколько миллисекунд прошло с прошлого значения */
export type Interval = Observable<number>;
