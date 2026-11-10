import type { TimeState } from '@peetland/timings';

import type { NeedCategory } from './category';
import type { Need } from './need';

/** Описание потребности: её категория и то, как быстро она падает */
export type NeedDefinition = Readonly<{
  category: NeedCategory;
  /** За сколько игровых минут потребность падает от Needs.MAX_NEED до Needs.MIN_NEED */
  depletionMinutes: number;
}>;

/** Описание каждой потребности */
export type NeedDefinitions = Readonly<Record<Need, NeedDefinition>>;

/** Значение каждой потребности от Needs.MIN_NEED до Needs.MAX_NEED. Все потребности есть у всех NPC */
export type NeedValues = Readonly<Record<Need, number>>;

/** Значение потребности и момент игрового времени, когда его выставили */
export type NeedRecord = Readonly<{
  value: number;
  since: TimeState;
}>;

/**
 * Состояние потребностей: значение каждой потребности и момент, когда его выставили. Содержит
 * только данные и полностью описывает потребности
 */
export type NeedsState = Readonly<Record<Need, NeedRecord>>;
