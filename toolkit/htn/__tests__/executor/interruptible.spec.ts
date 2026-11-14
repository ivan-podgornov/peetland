import { describe, expect, it } from 'vitest';

import { method, node, primitive, testContext, testState, toSteps, transaction } from '../../dev';
import { Executor } from '../../src/executor';

/** Создаёт узел транзакции «покупка» */
function createPurchase() {
  return node(transaction('Purchase', method('Pay')));
}

/** Создаёт задачу, которая завершается сразу, как началась */
function instant(name: string) {
  return {
    ...primitive(name),
    start: () => 'success' as const,
  };
}

describe('Executor', () => {
  describe('#interruptible', () => {
    it('Если текущая задача вне транзакции и началась, возвращает true', () => {
      const executor = new Executor(toSteps([primitive('Walk')]));

      executor.update(testState, testContext);

      expect(executor.interruptible).toBe(true);
    });

    it('Если текущая задача в транзакции и началась, возвращает false', () => {
      const executor = new Executor(toSteps([primitive('Pay')], createPurchase()));

      executor.update(testState, testContext);

      expect(executor.interruptible).toBe(false);
    });

    it('Если с текущей задачи транзакция только начинается и задача ещё не началась, возвращает true', () => {
      const executor = new Executor(toSteps([primitive('Pay')], createPurchase()));

      expect(executor.interruptible).toBe(true);
    });

    it('Если следующая задача той же транзакции ещё не началась, возвращает false', () => {
      const executor = new Executor(toSteps([instant('Pay'), primitive('Take')], createPurchase()));

      executor.update(testState, testContext); // Pay завершилась, Take ещё не началась

      expect(executor.interruptible).toBe(false);
    });

    it('Если транзакция завершилась и следующая задача вне транзакции ещё не началась, возвращает true', () => {
      const executor = new Executor([
        ...toSteps([instant('Pay')], createPurchase()),
        ...toSteps([primitive('Go home')]),
      ]);

      executor.update(testState, testContext);

      expect(executor.interruptible).toBe(true);
    });

    it('Если транзакция завершилась и следующая задача из другой транзакции ещё не началась, возвращает true', () => {
      const executor = new Executor([
        ...toSteps([instant('Pay for beer')], createPurchase()),
        ...toSteps([primitive('Pay for chips')], createPurchase()),
      ]);

      executor.update(testState, testContext);

      expect(executor.interruptible).toBe(true);
    });
  });
});
