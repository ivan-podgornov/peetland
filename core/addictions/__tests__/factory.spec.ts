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
      const factory = new AddictionsFactory({
        time: new ManualTime(),
        ...createAddictionsDeps(),
      });

      expect(factory.create(createAddictionsData())).toBeInstanceOf(Addictions);
    });

    it('Выставляет начальные удовлетворённость и силу на момент времени фабрики', () => {
      const factory = new AddictionsFactory({
        time: new ManualTime({
          day: 2,
          hours: 9,
          minutes: 15,
        }),
        ...createAddictionsDeps(),
      });
      const since = {
        day: 2,
        hours: 9,
        minutes: 15,
      };

      const addictions = factory.create(
        createAddictionsData({
          [Addiction.Alcoholism]: {
            satisfaction: 30,
            strength: 70,
          },
        })
      );

      expect(addictions.getState()).toStrictEqual({
        [Addiction.Alcoholism]: {
          satisfaction: 30,
          strength: 70,
          since,
        },
      });
    });

    it('Если валидатор не передан, проверяет удовлетворённость AddictionsValidator', () => {
      const factory = new AddictionsFactory({ time: new ManualTime() });
      function create() {
        return factory.create(
          createAddictionsData({
            [Addiction.Alcoholism]: {
              satisfaction: -1,
              strength: 0,
            },
          })
        );
      }

      expect(create).toThrow(RangeError);
    });

    it('Если валидатор не передан, проверяет силу AddictionsValidator', () => {
      const factory = new AddictionsFactory({ time: new ManualTime() });
      function create() {
        return factory.create(
          createAddictionsData({
            [Addiction.Alcoholism]: {
              satisfaction: 100,
              strength: 101,
            },
          })
        );
      }

      expect(create).toThrow(RangeError);
    });

    it('Собирает зависимости переданной фабрикой зависимостей', () => {
      const addictionFactory = createMockedAddictionFactory();

      new AddictionsFactory({
        time: new ManualTime(),
        addictionFactory,
      }).create(createAddictionsData());

      expect(addictionFactory.create).toHaveBeenCalledTimes(Object.values(Addiction).length);
    });

    it('Проверяет удовлетворённость переданным валидатором', () => {
      const validator = createMockedAddictionsValidator();

      new AddictionsFactory({
        time: new ManualTime(),
        validator,
      }).create(createAddictionsData());

      expect(validator.validateSatisfaction).toHaveBeenCalled();
    });
  });
});
