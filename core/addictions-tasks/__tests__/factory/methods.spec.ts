import { TEST_SHOP } from '@peetland/places/dev';
import { describe, expect, it } from 'vitest';

import { createAddictionsTaskFactoryDeps } from '../../dev';
import { AddictionsTask, AddictionsTaskFactory } from '../../src';
import { BuyBoozeTask } from '../../src/buy-booze-task';
import { SatisfyAlcoholismTask } from '../../src/satisfy-alcoholism-task';

describe('AddictionsTaskFactory', () => {
  describe('#satisfyAddictions', () => {
    it('Возвращает экземпляр AddictionsTask', () => {
      const factory = new AddictionsTaskFactory(createAddictionsTaskFactoryDeps());

      expect(factory.satisfyAddictions()).toBeInstanceOf(AddictionsTask);
    });

    it('На каждый вызов возвращает новую задачу', () => {
      const factory = new AddictionsTaskFactory(createAddictionsTaskFactoryDeps());

      expect(factory.satisfyAddictions()).not.toBe(factory.satisfyAddictions());
    });
  });

  describe('#satisfyAlcoholism', () => {
    it('Возвращает экземпляр SatisfyAlcoholismTask', () => {
      const factory = new AddictionsTaskFactory(createAddictionsTaskFactoryDeps());

      expect(factory.satisfyAlcoholism()).toBeInstanceOf(SatisfyAlcoholismTask);
    });

    it('На каждый вызов возвращает новую задачу', () => {
      const factory = new AddictionsTaskFactory(createAddictionsTaskFactoryDeps());

      expect(factory.satisfyAlcoholism()).not.toBe(factory.satisfyAlcoholism());
    });
  });

  describe('#buyBooze', () => {
    it('Возвращает экземпляр BuyBoozeTask', () => {
      const factory = new AddictionsTaskFactory(createAddictionsTaskFactoryDeps());

      expect(factory.buyBooze({ shop: TEST_SHOP })).toBeInstanceOf(BuyBoozeTask);
    });

    it('На каждый вызов возвращает новую задачу', () => {
      const factory = new AddictionsTaskFactory(createAddictionsTaskFactoryDeps());

      expect(factory.buyBooze({ shop: TEST_SHOP })).not.toBe(factory.buyBooze({ shop: TEST_SHOP }));
    });
  });
});
