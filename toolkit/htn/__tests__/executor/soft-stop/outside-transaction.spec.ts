import { describe, expect, it, vi } from 'vitest';

import { createMockedPrimitive, testContext, testState, toSteps } from '../../../dev';
import { Executor } from '../../../src/executor';

describe('Executor', () => {
  describe('#softStop', () => {
    describe('Если текущая задача вне транзакции', () => {
      it('На следующем update останавливает текущую задачу с контекстом update', () => {
        const walk = createMockedPrimitive();
        const executor = new Executor(toSteps([walk]));
        executor.update(testState, testContext); // Walk началась

        executor.softStop();
        executor.update(testState, testContext);

        expect(walk.stop).toHaveBeenCalledExactlyOnceWith(testContext);
      });

      it('На следующем update возвращает stopped', () => {
        const executor = new Executor(toSteps([createMockedPrimitive()]));
        executor.update(testState, testContext);

        executor.softStop();

        expect(executor.update(testState, testContext)).toBe('stopped');
      });

      it('Если задача ещё не началась, не начинает её', () => {
        const walk = createMockedPrimitive();
        const executor = new Executor(toSteps([walk]));

        executor.softStop();
        executor.update(testState, testContext);

        expect(walk.start).not.toHaveBeenCalled();
      });

      it('Если задача завершилась, не начинает следующую', () => {
        const walk = createMockedPrimitive({ start: vi.fn(() => 'success' as const) });
        const run = createMockedPrimitive();
        const executor = new Executor(toSteps([walk, run]));
        executor.update(testState, testContext); // Walk завершилась, Run ещё не началась

        executor.softStop();
        executor.update(testState, testContext);

        expect(run.start).not.toHaveBeenCalled();
      });
    });
  });
});
