import { describe, expect, it } from 'vitest';

import { NeedsTask, NeedsTaskFactory } from '../src';
import { SatisfyHungerTask } from '../src/satisfy-hunger-task';

describe('NeedsTaskFactory', () => {
  describe('#satisfyNeeds', () => {
    it('Возвращает экземпляр NeedsTask', () => {
      const factory = new NeedsTaskFactory();

      expect(factory.satisfyNeeds()).toBeInstanceOf(NeedsTask);
    });

    it('На каждый вызов возвращает новую задачу', () => {
      const factory = new NeedsTaskFactory();

      expect(factory.satisfyNeeds()).not.toBe(factory.satisfyNeeds());
    });
  });

  describe('#satisfyHunger', () => {
    it('Возвращает экземпляр SatisfyHungerTask', () => {
      const factory = new NeedsTaskFactory();

      expect(factory.satisfyHunger()).toBeInstanceOf(SatisfyHungerTask);
    });

    it('На каждый вызов возвращает новую задачу', () => {
      const factory = new NeedsTaskFactory();

      expect(factory.satisfyHunger()).not.toBe(factory.satisfyHunger());
    });
  });
});
