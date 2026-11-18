import type { TimeState } from '@peetland/timings';

import type { Addiction } from './addiction';

/**
 * Значение каждой зависимости от Addictions.MIN_VALUE до Addictions.MAX_VALUE. Все зависимости
 * есть у всех NPC
 */
export type AddictionValues = Readonly<Record<Addiction, number>>;

/** Начальные значение и сила зависимости */
export type AddictionData = Readonly<{
  /** Насколько NPC не тянет, от Addictions.MIN_VALUE до Addictions.MAX_VALUE */
  value: number;
  /** Сила зависимости от Addictions.MIN_STRENGTH до Addictions.MAX_STRENGTH. 0 — зависимости нет */
  strength: number;
}>;

/** Начальные значение и сила каждой зависимости. Все зависимости есть у всех NPC */
export type AddictionsData = Readonly<Record<Addiction, AddictionData>>;

/** Значение зависимости, момент игрового времени, когда его выставили, и сила зависимости */
export type AddictionRecord = AddictionData &
  Readonly<{
    since: TimeState;
  }>;

/**
 * Состояние зависимостей: значение, момент и сила каждой зависимости. Содержит только данные и
 * полностью описывает зависимости
 */
export type AddictionsState = Readonly<Record<Addiction, AddictionRecord>>;
