import { describe, expect, it } from 'vitest';

import { createMockedNeedsValidator, DEFAULT_RECORD, DEFAULT_NEED_DEPS } from '../dev';
import { Need } from '../src';
import { NeedFactory } from '../src/need-factory';
import { Satiety } from '../src/satiety';

describe('NeedFactory', () => {
  describe('#create', () => {
    it('Для сытости возвращает экземпляр Satiety', () => {
      const factory = new NeedFactory(DEFAULT_NEED_DEPS);

      expect(factory.create(Need.Satiety, DEFAULT_RECORD)).toBeInstanceOf(Satiety);
    });

    it('Создаёт потребность из переданной записи', () => {
      const factory = new NeedFactory(DEFAULT_NEED_DEPS);

      expect(factory.create(Need.Satiety, DEFAULT_RECORD).getState()).toBe(DEFAULT_RECORD);
    });

    it('Передаёт потребности валидатор', () => {
      const validator = createMockedNeedsValidator();

      new NeedFactory({ validator }).create(Need.Satiety, DEFAULT_RECORD);

      expect(validator.validateValue).toHaveBeenCalled();
    });
  });
});
