import { Item } from '@peetland/inventory';
import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createNeedsDeps, createNeedsState, DEFAULT_RECORD } from '../dev';
import { ActivityType, Need, Needs } from '../src';

describe('Needs', () => {
  describe('#clone', () => {
    it('Возвращает потребности с тем же состоянием', () => {
      const needs = new Needs(
        createNeedsState({
          [Need.Satiety]: {
            ...DEFAULT_RECORD,
            value: 80,
          },
        }),
        createNeedsDeps()
      );

      expect(needs.clone().getState()).toStrictEqual(needs.getState());
    });

    it('Занятие в копии не меняет исходные потребности', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: 50,
      };
      const needs = new Needs(createNeedsState({ [Need.Satiety]: record }), createNeedsDeps());
      const time = new ManualTime(record.since);

      needs.clone().perform(
        {
          type: ActivityType.Eat,
          details: { food: Item.SmilePizza },
        },
        time
      );

      expect(needs.get(Need.Satiety, time)).toBe(50);
    });

    it('Занятие в исходных потребностях не меняет копию', () => {
      const record = {
        ...DEFAULT_RECORD,
        value: 50,
      };
      const needs = new Needs(createNeedsState({ [Need.Satiety]: record }), createNeedsDeps());
      const copy = needs.clone();
      const time = new ManualTime(record.since);

      needs.perform(
        {
          type: ActivityType.Eat,
          details: { food: Item.SmilePizza },
        },
        time
      );

      expect(copy.get(Need.Satiety, time)).toBe(50);
    });
  });
});
