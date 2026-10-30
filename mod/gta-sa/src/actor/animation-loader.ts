import { AbortController, Observable } from '@peetland/events';
import type { ISubscriber } from '@peetland/events';
import type { IAnimationLoader } from '@peetland/game';
import { hasAnimationLoaded, removeAnimation, requestAnimation } from '@peetland/moonloader';
import type { ITimer } from '@peetland/timings';

import { ALWAYS_LOADED_BLOCK } from './animations';
import type { GtaAnimation } from './animations';

export type GtaAnimationLoaderDeps = {
  timer: ITimer;
};

/** Как часто загрузчик проверяет, загрузился ли блок, в миллисекундах */
const CHECK_PERIOD = 100;

/**
 * Загружает блоки анимаций GTA SA. Анимации одного блока загружаются одной загрузкой. Блок PED
 * всегда загружен, поэтому его загрузчик не загружает и не выгружает
 */
export class GtaAnimationLoader implements IAnimationLoader<GtaAnimation> {
  private readonly timer: ITimer;

  constructor(deps: GtaAnimationLoaderDeps) {
    this.timer = deps.timer;
  }

  key(animation: GtaAnimation): string {
    return animation.block;
  }

  load(animation: GtaAnimation): Observable<void> {
    const { block } = animation;

    return new Observable((subscriber: ISubscriber<void>) => {
      if (block === ALWAYS_LOADED_BLOCK) {
        subscriber.next();
        return;
      }

      requestAnimation(block);
      subscriber.addTeardown(() => removeAnimation(block));

      if (hasAnimationLoaded(block)) {
        subscriber.next();
        return;
      }

      // Проверку останавливаем, как только блок загрузился, а выгружаем блок — по отписке
      const checking = new AbortController();
      subscriber.addTeardown(() => checking.abort());

      this.timer.interval(CHECK_PERIOD).subscribe(
        () => {
          if (hasAnimationLoaded(block)) {
            checking.abort();
            subscriber.next();
          }
        },
        { signal: checking.signal }
      );
    });
  }
}
