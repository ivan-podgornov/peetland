import type { TimeState } from '@peetland/timings';

import type { Addiction, Need } from './need';

/** Значение каждой потребности от Needs.MIN_NEED до Needs.MAX_NEED. Все потребности есть у всех NPC */
export type NeedValues = Readonly<Record<Need, number>>;

/** Значение потребности и момент игрового времени, когда его выставили */
export type NeedRecord = Readonly<{
  value: number;
  since: TimeState;
}>;

/** Запись зависимости: значение, момент, когда его выставили, и сила зависимости */
export type AddictionRecord = NeedRecord &
  Readonly<{
    /** Сила зависимости от Needs.MIN_STRENGTH до Needs.MAX_STRENGTH. 0 — зависимости нет */
    strength: number;
  }>;

/**
 * Зависимости NPC: сила каждой зависимости от Needs.MIN_STRENGTH до Needs.MAX_STRENGTH. Зависимости
 * есть у всех NPC: сила 0 — это отсутствие зависимости
 */
export type Addictions = Readonly<Record<Addiction, number>>;

/**
 * Состояние потребностей: значение каждой потребности и момент, когда его выставили, а у
 * зависимостей ещё и сила. Содержит только данные и полностью описывает потребности
 */
export type NeedsState = Readonly<{
  [N in Need]: N extends Addiction ? AddictionRecord : NeedRecord;
}>;
