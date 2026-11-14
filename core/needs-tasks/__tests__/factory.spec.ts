import { Need } from '@peetland/needs';
import { describe, expect, it } from 'vitest';

import { SatisfyHungerTask, SatisfyNeedTaskFactory } from '../src';

describe('SatisfyNeedTaskFactory', () => {
  describe('#create', () => {
    it('Для сытости возвращает экземпляр SatisfyHungerTask', () => {
      const factory = new SatisfyNeedTaskFactory();

      expect(factory.create(Need.Satiety)).toBeInstanceOf(SatisfyHungerTask);
    });

    it('На каждый вызов возвращает новую задачу', () => {
      const factory = new SatisfyNeedTaskFactory();

      expect(factory.create(Need.Satiety)).not.toBe(factory.create(Need.Satiety));
    });
  });
});
