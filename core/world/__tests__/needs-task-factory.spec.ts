import { createStubTask } from '@peetland/htn/dev';
import { Need } from '@peetland/needs';
import { SatisfyHungerTask } from '@peetland/needs-tasks';
import { createMockedSatisfyNeedTaskFactory } from '@peetland/needs-tasks/dev';
import { describe, expect, it } from 'vitest';

import { NeedsTask } from '../src/needs-task';
import { NeedsTaskFactory } from '../src/needs-task-factory';

describe('NeedsTaskFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр NeedsTask', () => {
      const factory = new NeedsTaskFactory();

      expect(factory.create()).toBeInstanceOf(NeedsTask);
    });

    it('Слой берёт задачи удовлетворения у satisfyNeedTaskFactory', () => {
      const satisfyNeedTaskFactory = createMockedSatisfyNeedTaskFactory(createStubTask('eat'));
      const factory = new NeedsTaskFactory({ satisfyNeedTaskFactory });

      factory.create();

      expect(satisfyNeedTaskFactory.create).toHaveBeenCalledWith(Need.Satiety);
    });

    it('Если satisfyNeedTaskFactory не передана, сытость удовлетворяет SatisfyHungerTask', () => {
      const factory = new NeedsTaskFactory();

      const [satiety] = factory.create().methods;

      expect(satiety?.tasks).toStrictEqual([expect.any(SatisfyHungerTask)]);
    });
  });
});
