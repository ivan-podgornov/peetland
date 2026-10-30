import { Observable } from '@peetland/events';
import type { ISubscriber } from '@peetland/events';

import { AnimationManager } from '../src';
import type { AnimationTable, IAnimationLoader } from '../src';

/** Анимация для тестов менеджера анимаций. Анимации одной группы загружаются одной загрузкой */
export type TestAnimation = {
  duration: number;
  group: string;
};

/** Таблица анимаций для тестов: у pay и item-give одна группа, у остальных — своя */
export const TEST_ANIMATIONS: AnimationTable<TestAnimation> = {
  'trash-search-start': { duration: 1000, group: 'trash-search-start' },
  'trash-search': { duration: 2000, group: 'trash-search' },
  'trash-search-look-1': { duration: 2000, group: 'trash-search-look-1' },
  'trash-search-look-2': { duration: 3000, group: 'trash-search-look-2' },
  'trash-search-pocket': { duration: 2330, group: 'trash-search-pocket' },
  'trash-search-end': { duration: 1330, group: 'trash-search-end' },
  'beg-sitting': { duration: 3500, group: 'beg-sitting' },
  'item-give': { duration: 5330, group: 'money' },
  'item-receive': { duration: 5330, group: 'item-receive' },
  pay: { duration: 4670, group: 'money' },
  'drink-standing-1': { duration: 2330, group: 'drink-standing-1' },
  'drink-standing-2': { duration: 2330, group: 'drink-standing-2' },
};

/** Загрузчик, который загружает группу анимаций, только когда это скажет тест */
export class ManualAnimationLoader implements IAnimationLoader<TestAnimation> {
  /** Сколько раз загрузчик начинал загрузку */
  loads = 0;
  /** Сколько раз загрузчик выгружал анимации */
  unloads = 0;
  /** Подписчики загрузок, которые ещё не выгружены, по группам */
  private readonly subscribers = new Map<string, ISubscriber<void>>();

  key(animation: TestAnimation): string {
    return animation.group;
  }

  load(animation: TestAnimation): Observable<void> {
    return new Observable((subscriber: ISubscriber<void>) => {
      this.loads += 1;
      this.subscribers.set(animation.group, subscriber);
      subscriber.addTeardown(() => {
        this.unloads += 1;
        this.subscribers.delete(animation.group);
      });
    });
  }

  /** Завершает загрузку группы анимаций */
  finish(group: string): void {
    this.subscribers.get(group)?.next();
  }
}

/** Создаёт менеджер анимаций с TEST_ANIMATIONS и переданным загрузчиком */
export function createAnimationManager(
  loader: IAnimationLoader<TestAnimation> = new ManualAnimationLoader()
): AnimationManager<TestAnimation> {
  return new AnimationManager({ animations: TEST_ANIMATIONS }, { loader });
}
