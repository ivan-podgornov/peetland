import { ManualTime } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import {
  createAddictionsData,
  createAddictionsDeps,
  createMockedAddictionFactory,
  createMockedAddictionsValidator,
} from '../dev';
import { Addiction, Addictions, AddictionsFactory } from '../src';

describe('AddictionsFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Addictions', () => {
      const factory = new AddictionsFactory(createAddictionsDeps());

      expect(factory.create(createAddictionsData(), new ManualTime())).toBeInstanceOf(Addictions);
    });

    it('Выставляет начальные тягу и силу на момент переданного времени', () => {
      const factory = new AddictionsFactory(createAddictionsDeps());
      const since = {
        day: 2,
        hours: 9,
        minutes: 15,
      };

      const addictions = factory.create(
        createAddictionsData({
          [Addiction.Alcoholism]: {
            craving: 30,
            strength: 70,
          },
        }),
        new ManualTime(since)
      );

      expect(addictions.getState()).toStrictEqual({
        [Addiction.Alcoholism]: {
          craving: 30,
          strength: 70,
          since,
        },
      });
    });

    it('Если валидатор не передан, проверяет тягу AddictionsValidator', () => {
      const factory = new AddictionsFactory();
      function create() {
        return factory.create(
          createAddictionsData({
            [Addiction.Alcoholism]: {
              craving: -1,
              strength: 0,
            },
          }),
          new ManualTime()
        );
      }

      expect(create).toThrow(RangeError);
    });

    it('Если валидатор не передан, проверяет силу AddictionsValidator', () => {
      const factory = new AddictionsFactory();
      function create() {
        return factory.create(
          createAddictionsData({
            [Addiction.Alcoholism]: {
              craving: 100,
              strength: 101,
            },
          }),
          new ManualTime()
        );
      }

      expect(create).toThrow(RangeError);
    });

    it('Собирает зависимости переданной фабрикой зависимостей', () => {
      const addictionFactory = createMockedAddictionFactory();

      new AddictionsFactory({ addictionFactory }).create(createAddictionsData(), new ManualTime());

      expect(addictionFactory.create).toHaveBeenCalledTimes(Object.values(Addiction).length);
    });

    it('Проверяет тягу переданным валидатором', () => {
      const validator = createMockedAddictionsValidator();

      new AddictionsFactory({ validator }).create(createAddictionsData(), new ManualTime());

      expect(validator.validateCraving).toHaveBeenCalled();
    });
  });
});
