import { Item } from '@peetland/inventory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createAddictionsDeps, createAddictionsState, DEFAULT_RECORD } from '../dev';
import { ConsumptionType, Addiction, Addictions } from '../src';

describe('Addictions', () => {
  describe('#clone', () => {
    it('Возвращает зависимости с тем же состоянием', () => {
      const addictions = new Addictions(
        createAddictionsState({
          [Addiction.Alcoholism]: {
            ...DEFAULT_RECORD,
            satisfaction: 80,
          },
        }),
        createAddictionsDeps()
      );

      expect(addictions.clone().getState()).toStrictEqual(addictions.getState());
    });

    it('Употребление в копии не меняет исходные зависимости', () => {
      const record = {
        ...DEFAULT_RECORD,
        satisfaction: 50,
      };
      const addictions = new Addictions(
        createAddictionsState({ [Addiction.Alcoholism]: record }),
        createAddictionsDeps()
      );
      const time = new ManualTime(record.since);

      addictions.clone().consume(
        {
          type: ConsumptionType.Drink,
          details: { booze: Item.Booze },
        },
        time
      );

      expect(addictions.get(Addiction.Alcoholism, time)).toBe(50);
    });

    it('Употребление в исходных зависимостях не меняет копию', () => {
      const record = {
        ...DEFAULT_RECORD,
        satisfaction: 50,
      };
      const addictions = new Addictions(
        createAddictionsState({ [Addiction.Alcoholism]: record }),
        createAddictionsDeps()
      );
      const copy = addictions.clone();
      const time = new ManualTime(record.since);

      addictions.consume(
        {
          type: ConsumptionType.Drink,
          details: { booze: Item.Booze },
        },
        time
      );

      expect(copy.get(Addiction.Alcoholism, time)).toBe(50);
    });
  });
});
