import { describe, expect, it, vi } from 'vitest';

import {
  compound,
  createMockedPrimitive,
  method,
  node,
  testContext,
  testState,
  toSteps,
  transaction,
} from '../../../dev';
import { Executor } from '../../../src/executor';

/** Создаёт узел транзакции «покупка» */
function createPurchase() {
  return node(transaction('Purchase', method('Pay')));
}

/** Создаёт задачу, которая завершается сразу, как началась */
function createInstant() {
  return createMockedPrimitive({ start: vi.fn(() => 'success' as const) });
}

describe('Executor', () => {
  describe('#softStop', () => {
    describe('Если текущая задача в транзакции', () => {
      it('Продолжает задачу, которая идёт', () => {
        const pay = createMockedPrimitive();
        const executor = new Executor(toSteps([pay], createPurchase()));
        executor.update(testState, testContext); // Pay началась

        executor.softStop();
        executor.update(testState, testContext);

        expect(pay.update).toHaveBeenCalledExactlyOnceWith(testState, testContext);
      });

      it('Если транзакция выше по цепочке isPartOf, продолжает задачу, которая идёт', () => {
        const giveMoney = createMockedPrimitive();
        const pay = node(compound('Pay', method('Give')), createPurchase());
        const executor = new Executor(toSteps([giveMoney], pay));
        executor.update(testState, testContext);

        executor.softStop();
        executor.update(testState, testContext);

        expect(giveMoney.update).toHaveBeenCalledOnce();
      });

      it('Если следующая задача из той же транзакции, начинает её', () => {
        const take = createMockedPrimitive();
        const executor = new Executor(toSteps([createInstant(), take], createPurchase()));
        executor.update(testState, testContext); // Pay завершилась, Take ещё не началась

        executor.softStop();
        executor.update(testState, testContext);

        expect(take.start).toHaveBeenCalledOnce();
      });

      it('Если внутренняя транзакция кончилась, а внешняя нет, начинает следующую задачу внешней', () => {
        const purchase = createPurchase();
        const pay = node(transaction('Pay', method('Give')), purchase);
        const take = createMockedPrimitive();
        const executor = new Executor([
          ...toSteps([createInstant()], pay),
          ...toSteps([take], purchase),
        ]);
        executor.update(testState, testContext);

        executor.softStop();
        executor.update(testState, testContext);

        expect(take.start).toHaveBeenCalledOnce();
      });

      it('Если транзакция кончилась, не начинает следующую задачу вне транзакции', () => {
        const goHome = createMockedPrimitive();
        const executor = new Executor([
          ...toSteps([createInstant()], createPurchase()),
          ...toSteps([goHome]),
        ]);
        executor.update(testState, testContext);

        executor.softStop();
        executor.update(testState, testContext);

        expect(goHome.start).not.toHaveBeenCalled();
      });

      it('Если транзакция кончилась, не начинает следующую задачу другой транзакции', () => {
        const payForChips = createMockedPrimitive();
        const executor = new Executor([
          ...toSteps([createInstant()], createPurchase()),
          ...toSteps([payForChips], createPurchase()),
        ]);
        executor.update(testState, testContext);

        executor.softStop();
        executor.update(testState, testContext);

        expect(payForChips.start).not.toHaveBeenCalled();
      });

      it('Если транзакция ещё не началась, не начинает её', () => {
        const pay = createMockedPrimitive();
        const executor = new Executor(toSteps([pay], createPurchase()));

        executor.softStop();
        executor.update(testState, testContext);

        expect(pay.start).not.toHaveBeenCalled();
      });
    });
  });
});
