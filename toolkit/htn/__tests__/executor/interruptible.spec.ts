import { describe, expect, it } from 'vitest';

import { primitive, testContext, testState, toSteps } from '../../dev';
import { Executor } from '../../src/executor';

describe('Executor', () => {
  describe('#interruptible', () => {
    it('Если текущая задача вне транзакции и началась, возвращает true', () => {
      const executor = new Executor(toSteps([primitive('Walk')]));

      executor.update(testState, testContext);

      expect(executor.interruptible).toBe(true);
    });

    it('Если текущая задача в транзакции и началась, возвращает false', () => {
      const executor = new Executor(toSteps([primitive('Pay')], 0));

      executor.update(testState, testContext);

      expect(executor.interruptible).toBe(false);
    });

    it('Если с текущей задачи транзакция только начинается и задача ещё не началась, возвращает true', () => {
      const executor = new Executor(toSteps([primitive('Pay')], 0));

      expect(executor.interruptible).toBe(true);
    });

    it('Если задача транзакции завершилась и следующая задача той же транзакции ещё не началась, возвращает false', () => {
      const pay = {
        ...primitive('Pay'),
        start: () => 'success' as const,
      };
      const executor = new Executor(toSteps([pay, primitive('Take')], 0));

      executor.update(testState, testContext);

      expect(executor.interruptible).toBe(false);
    });

    it('Если транзакция завершилась и следующая задача вне транзакции ещё не началась, возвращает true', () => {
      const pay = {
        ...primitive('Pay'),
        start: () => 'success' as const,
      };
      const executor = new Executor([...toSteps([pay], 0), ...toSteps([primitive('Go home')])]);

      executor.update(testState, testContext);

      expect(executor.interruptible).toBe(true);
    });

    it('Если транзакция завершилась и следующая задача из другой транзакции ещё не началась, возвращает true', () => {
      const payForBeer = {
        ...primitive('Pay for beer'),
        start: () => 'success' as const,
      };
      const executor = new Executor([
        ...toSteps([payForBeer], 0),
        ...toSteps([primitive('Pay for chips')], 1),
      ]);

      executor.update(testState, testContext);

      expect(executor.interruptible).toBe(true);
    });
  });
});
