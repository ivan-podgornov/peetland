import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import {
  createAddictions,
  createMockedNeedFactory,
  createMockedNeedsValidator,
  createNeedsDeps,
  createNeedValues,
} from '../dev';
import { Need, Needs, NeedsFactory } from '../src';

describe('NeedsFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Needs', () => {
      const factory = new NeedsFactory(createNeedsDeps());

      expect(
        factory.create(createNeedValues(), createAddictions(), new ManualTime())
      ).toBeInstanceOf(Needs);
    });

    it('Выставляет начальные значения и силу зависимостей на момент переданного времени', () => {
      const factory = new NeedsFactory(createNeedsDeps());
      const since = {
        day: 2,
        hours: 9,
        minutes: 15,
      };

      const needs = factory.create(
        createNeedValues({
          [Need.Satiety]: 80,
          [Need.Alcoholism]: 30,
        }),
        createAddictions({ [Need.Alcoholism]: 70 }),
        new ManualTime(since)
      );

      expect(needs.getState()).toStrictEqual({
        [Need.Satiety]: {
          value: 80,
          since,
        },
        [Need.Alcoholism]: {
          value: 30,
          since,
          strength: 70,
        },
      });
    });

    it('Если валидатор не передан, проверяет значения NeedsValidator', () => {
      const factory = new NeedsFactory();
      function create() {
        return factory.create(
          createNeedValues({ [Need.Satiety]: -1 }),
          createAddictions(),
          new ManualTime()
        );
      }

      expect(create).toThrow(RangeError);
    });

    it('Если валидатор не передан, проверяет силу зависимостей NeedsValidator', () => {
      const factory = new NeedsFactory();
      function create() {
        return factory.create(
          createNeedValues(),
          createAddictions({ [Need.Alcoholism]: 101 }),
          new ManualTime()
        );
      }

      expect(create).toThrow(RangeError);
    });

    it('Собирает потребности переданной фабрикой потребностей', () => {
      const needFactory = createMockedNeedFactory();

      new NeedsFactory({ needFactory }).create(
        createNeedValues(),
        createAddictions(),
        new ManualTime()
      );

      expect(needFactory.create).toHaveBeenCalledTimes(Object.values(Need).length);
    });

    it('Проверяет значения переданным валидатором', () => {
      const validator = createMockedNeedsValidator();

      new NeedsFactory({ validator }).create(
        createNeedValues(),
        createAddictions(),
        new ManualTime()
      );

      expect(validator.validateValue).toHaveBeenCalled();
    });
  });
});
