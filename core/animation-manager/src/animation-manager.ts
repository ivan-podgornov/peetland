import { Observable } from '@peetland/events';
import type { ISubscriber } from '@peetland/events';

import { ANIMATIONS } from '@peetland/game';
import type { AnimationId } from '@peetland/game';

import type {
  AnimationPlayback,
  AnimationRecord,
  AnimationTable,
  IAnimationLoader,
  IAnimationManager,
} from './types';

export type AnimationManagerOptions<TAnimation extends AnimationRecord> = {
  /** Таблица анимаций */
  animations: AnimationTable<TAnimation>;
};

export type AnimationManagerDeps<TAnimation extends AnimationRecord> = {
  loader: IAnimationLoader<TAnimation>;
};

/** Общая на всех загрузка анимаций с одним ключом */
type SharedLoad = {
  /** Observable загрузки. Мультикастный: на всех подписчиков загрузка одна */
  observable: Observable<void>;
  /** Загружены ли анимации сейчас */
  loaded: boolean;
};

/**
 * Менеджер анимаций. Проверяет параметры по таблице анимаций и ANIMATIONS, а загрузку отдаёт
 * загрузчику. Анимации с одним ключом загрузки делят одну загрузку, поэтому менеджер должен быть
 * один на игру
 */
export class AnimationManager<
  TAnimation extends AnimationRecord,
> implements IAnimationManager<TAnimation> {
  private readonly animations: AnimationTable<TAnimation>;
  private readonly loader: IAnimationLoader<TAnimation>;
  private readonly loads: Map<string, SharedLoad>;

  constructor(
    options: AnimationManagerOptions<TAnimation>,
    deps: AnimationManagerDeps<TAnimation>
  ) {
    this.animations = { ...options.animations };
    this.loader = deps.loader;
    this.loads = new Map();
  }

  resolve(animation: AnimationId, playbackDuration?: number): AnimationPlayback<TAnimation> {
    const { loop } = ANIMATIONS[animation];
    assertPlaybackDuration(animation, loop, playbackDuration);

    const record = this.getRecord(animation);
    const { duration }: Partial<AnimationRecord> = record;

    if (playbackDuration === undefined && duration === undefined) {
      throw new Error(`Не задана длительность анимации ${animation}`);
    }

    return { animation: record, duration: playbackDuration ?? record.duration, loop };
  }

  acquire(animation: AnimationId): Observable<void> {
    const record = this.getRecord(animation);

    return new Observable((subscriber: ISubscriber<void>) => {
      const load = this.getLoad(record);
      // Если анимация уже загружена, общий Observable значение больше не сообщит, поэтому
      // подписчику оно сообщается здесь
      const loaded = load.loaded;

      load.observable.subscribe(
        {
          next: () => subscriber.next(),
          error: (error) => subscriber.error(error),
        },
        { signal: subscriber.signal }
      );

      if (loaded) {
        subscriber.next();
      }
    });
  }

  /** Возвращает запись из таблицы. Выбрасывает ошибку, если анимации в таблице нет */
  private getRecord(animation: AnimationId): TAnimation {
    const record: TAnimation | undefined = this.animations[animation];

    if (!record) {
      throw new Error(`Анимации ${animation} нет в таблице анимаций`);
    }

    return record;
  }

  /** Возвращает общую загрузку для ключа записи. Если её ещё нет, создаёт */
  private getLoad(record: TAnimation): SharedLoad {
    const key = this.loader.key(record);
    const existing = this.loads.get(key);

    if (existing) {
      return existing;
    }

    const load: SharedLoad = {
      loaded: false,
      observable: new Observable((subscriber: ISubscriber<void>) => {
        subscriber.addTeardown(() => (load.loaded = false));

        this.loader.load(record).subscribe(
          {
            next: () => {
              load.loaded = true;
              subscriber.next();
            },
            error: (error) => subscriber.error(error),
          },
          { signal: subscriber.signal }
        );
      }),
    };

    this.loads.set(key, load);

    return load;
  }
}

/**
 * Выбрасывает ошибку, если время проигрывания передано для незацикленной анимации, и RangeError,
 * если время не положительное конечное число
 */
function assertPlaybackDuration(animation: AnimationId, loop: boolean, duration?: number): void {
  if (!loop && duration !== undefined) {
    throw new Error(`Для незацикленной анимации ${animation} нельзя передать время проигрывания`);
  }

  if (duration !== undefined && (!Number.isFinite(duration) || duration <= 0)) {
    throw new RangeError('Время проигрывания должно быть положительным конечным числом');
  }
}
