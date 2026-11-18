import type { TimeState } from '@peetland/timings';

import type { Addiction } from './addiction';

/**
 * Удовлетворённость каждой зависимости от Addictions.MIN_SATISFACTION до Addictions.MAX_SATISFACTION.
 * Все зависимости есть у всех NPC
 */
export type AddictionSatisfactions = Readonly<Record<Addiction, number>>;

/** Начальные удовлетворённость и сила зависимости */
export type AddictionData = Readonly<{
  /** Насколько NPC не тянет, от Addictions.MIN_SATISFACTION до Addictions.MAX_SATISFACTION */
  satisfaction: number;
  /** Сила зависимости от Addictions.MIN_STRENGTH до Addictions.MAX_STRENGTH. 0 — зависимости нет */
  strength: number;
}>;

/** Начальные удовлетворённость и сила каждой зависимости. Все зависимости есть у всех NPC */
export type AddictionsData = Readonly<Record<Addiction, AddictionData>>;

/** Удовлетворённость, момент игрового времени, когда её выставили, и сила зависимости */
export type AddictionRecord = AddictionData &
  Readonly<{
    since: TimeState;
  }>;

/**
 * Состояние зависимостей: удовлетворённость, момент и сила каждой зависимости. Содержит только данные и
 * полностью описывает зависимости
 */
export type AddictionsState = Readonly<Record<Addiction, AddictionRecord>>;
