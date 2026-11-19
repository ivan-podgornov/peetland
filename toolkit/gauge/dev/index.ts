import type { GaugeOptions, GaugeState } from '../src';

/** Шкала от 0 до 100, которая падает на 100 за сутки, с порогами 25 и 60 */
export const DEFAULT_OPTIONS: GaugeOptions = {
  min: 0,
  max: 100,
  depletion: {
    amount: 100,
    minutes: 24 * 60,
  },
  lowBelow: 25,
  highAbove: 60,
};

/** Значение 100, выставленное в полночь первого дня */
export const DEFAULT_STATE: GaugeState = {
  value: 100,
  since: {
    day: 1,
    hours: 0,
    minutes: 0,
  },
};
