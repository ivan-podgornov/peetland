import type { TimeState } from '@peetland/timings';

/** Значение шкалы и момент игрового времени, когда его выставили */
export type GaugeState = Readonly<{
  value: number;
  since: TimeState;
}>;

/** Как устроена шкала: пределы, скорость падения и пороги уровней */
export type GaugeOptions = Readonly<{
  /** Ниже этого значение не опускается */
  min: number;
  /** Выше этого значение не поднимается */
  max: number;
  /**
   * Скорость падения: на amount за minutes игровых минут. Задаётся дробью, чтобы не копить
   * погрешность: значение за прошедшее время считается умножением, а потом делением
   */
  depletion: Readonly<{
    amount: number;
    minutes: number;
  }>;
  /** Ниже этого значения уровень GaugeLevel.Low */
  lowBelow: number;
  /** Выше этого значения уровень GaugeLevel.High */
  highAbove: number;
}>;
