import { describe, expect, it } from 'vitest';

import { SatisfyHungerTask, SatisfyNeedsTask, SatisfyNeedsTaskFactory } from '../src';

describe('SatisfyNeedsTaskFactory', () => {
  describe('#satisfyNeeds', () => {
    it('Возвращает экземпляр SatisfyNeedsTask', () => {
      const factory = new SatisfyNeedsTaskFactory();

      expect(factory.satisfyNeeds()).toBeInstanceOf(SatisfyNeedsTask);
    });

    it('На каждый вызов возвращает новую задачу', () => {
      const factory = new SatisfyNeedsTaskFactory();

      expect(factory.satisfyNeeds()).not.toBe(factory.satisfyNeeds());
    });
  });

  describe('#satisfyHunger', () => {
    it('Возвращает экземпляр SatisfyHungerTask', () => {
      const factory = new SatisfyNeedsTaskFactory();

      expect(factory.satisfyHunger()).toBeInstanceOf(SatisfyHungerTask);
    });

    it('На каждый вызов возвращает новую задачу', () => {
      const factory = new SatisfyNeedsTaskFactory();

      expect(factory.satisfyHunger()).not.toBe(factory.satisfyHunger());
    });
  });
});
