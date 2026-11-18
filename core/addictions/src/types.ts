import type { TimeState } from '@peetland/timings';

import type { Addiction } from './addiction';

/** Тяга каждой зависимости от Addictions.MIN_CRAVING до Addictions.MAX_CRAVING */
export type AddictionCravings = Readonly<Record<Addiction, number>>;

/** Начальные тяга и сила зависимости */
export type AddictionData = Readonly<{
  /** Насколько NPC тянет, от Addictions.MIN_CRAVING (0, не тянет) до Addictions.MAX_CRAVING */
  craving: number;
  /** Сила зависимости от Addictions.MIN_STRENGTH до Addictions.MAX_STRENGTH. 0 — зависимости нет */
  strength: number;
}>;

/** Начальные тяга и сила каждой зависимости. Все зависимости есть у всех NPC */
export type AddictionsData = Readonly<Record<Addiction, AddictionData>>;

/** Тяга, момент игрового времени, когда её выставили, и сила зависимости */
export type AddictionRecord = AddictionData &
  Readonly<{
    since: TimeState;
  }>;

/**
 * Состояние зависимостей: тяга, момент и сила каждой зависимости. Содержит только данные и
 * полностью описывает зависимости
 */
export type AddictionsState = Readonly<Record<Addiction, AddictionRecord>>;
