import { describe, expect, it } from 'vitest';

import { createMockedNeedsValidator } from '../dev';
import { Need, NeedFactory, Satiety } from '../src';

const record = {
  value: 80,
  since: {
    day: 1,
    hours: 10,
    minutes: 0,
  },
};

describe('NeedFactory', () => {
  describe('#create', () => {
    it('Для сытости возвращает экземпляр Satiety', () => {
      const factory = new NeedFactory({ validator: createMockedNeedsValidator() });

      expect(factory.create(Need.Satiety, record)).toBeInstanceOf(Satiety);
    });

    it('Создаёт потребность из переданной записи', () => {
      const factory = new NeedFactory({ validator: createMockedNeedsValidator() });

      expect(factory.create(Need.Satiety, record).getState()).toBe(record);
    });

    it('Передаёт потребности валидатор', () => {
      const validator = createMockedNeedsValidator();

      new NeedFactory({ validator }).create(Need.Satiety, record);

      expect(validator.validateValue).toHaveBeenCalled();
    });
  });
});
