import { describe, expect, it } from 'vitest';

import { createMockedAddictionsValidator, DEFAULT_RECORD, DEFAULT_ADDICTION_DEPS } from '../dev';
import { Addiction } from '../src';
import { AddictionFactory } from '../src/addiction-factory';
import { Alcoholism } from '../src/alcoholism';

describe('AddictionFactory', () => {
  describe('#create', () => {
    it('Для алкоголизма возвращает экземпляр Alcoholism', () => {
      const factory = new AddictionFactory(DEFAULT_ADDICTION_DEPS);

      expect(factory.create(Addiction.Alcoholism, DEFAULT_RECORD)).toBeInstanceOf(Alcoholism);
    });

    it('Создаёт зависимость из переданной записи', () => {
      const factory = new AddictionFactory(DEFAULT_ADDICTION_DEPS);

      expect(factory.create(Addiction.Alcoholism, DEFAULT_RECORD).getState()).toBe(DEFAULT_RECORD);
    });

    it('Передаёт зависимости валидатор', () => {
      const validator = createMockedAddictionsValidator();

      new AddictionFactory({ validator }).create(Addiction.Alcoholism, DEFAULT_RECORD);

      expect(validator.validateSatisfaction).toHaveBeenCalled();
    });
  });
});
