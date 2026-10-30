import { Observable } from '@peetland/events';

import type { AnimationRecord, IAnimationLoader } from './types';

/** Загрузчик, у которого все анимации всегда загружены. Нужен, когда загружать нечего */
export class InstantAnimationLoader implements IAnimationLoader<AnimationRecord> {
  /** У всех анимаций один ключ: загружать их по отдельности незачем */
  key(): string {
    return 'instant';
  }

  load(): Observable<void> {
    return new Observable((subscriber) => subscriber.next());
  }
}
