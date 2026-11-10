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

/**
 * Значение каждой потребности, которая есть у NPC, от Needs.MIN_NEED до Needs.MAX_NEED.
 * Потребностей, которых у NPC нет, в объекте нет
 */
export type NeedValues = Readonly<Partial<Record<Need, number>>>;

/** Значение потребности и момент игрового времени, когда его выставили */
export type NeedRecord = Readonly<{
  value: number;
  since: TimeState;
}>;

/**
 * Состояние потребностей: значение каждой потребности, которая есть у NPC, и момент, когда его
 * выставили. Содержит только данные и полностью описывает потребности
 */
export type NeedsState = Readonly<Partial<Record<Need, NeedRecord>>>;
