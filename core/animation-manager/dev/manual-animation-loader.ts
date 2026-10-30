import { Observable } from '@peetland/events';
import type { ISubscriber } from '@peetland/events';

import type { AnimationRecord, IAnimationLoader } from '../src';

export type ManualAnimationLoaderOptions<TAnimation extends AnimationRecord> = {
  /** Ключ загрузки анимации (см. IAnimationLoader.key) */
  key: (animation: TAnimation) => string;
};

/** Загрузчик, который загружает анимации с одним ключом, только когда это скажет тест */
export class ManualAnimationLoader<
  TAnimation extends AnimationRecord,
> implements IAnimationLoader<TAnimation> {
  /** Сколько раз загрузчик начинал загрузку */
  loads = 0;
  /** Сколько раз загрузчик выгружал анимации */
  unloads = 0;
  private readonly options: ManualAnimationLoaderOptions<TAnimation>;
  /** Подписчики загрузок, которые ещё не выгружены, по ключам */
  private readonly subscribers = new Map<string, ISubscriber<void>>();

  constructor(options: ManualAnimationLoaderOptions<TAnimation>) {
    this.options = options;
  }

  key(animation: TAnimation): string {
    return this.options.key(animation);
  }

  load(animation: TAnimation): Observable<void> {
    const key = this.key(animation);

    return new Observable((subscriber: ISubscriber<void>) => {
      this.loads += 1;
      this.subscribers.set(key, subscriber);
      subscriber.addTeardown(() => {
        this.unloads += 1;
        this.subscribers.delete(key);
      });
    });
  }

  /** Завершает загрузку анимаций с ключом key */
  finish(key: string): void {
    this.subscribers.get(key)?.next();
  }
}
