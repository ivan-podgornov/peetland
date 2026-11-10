import { describe, expect, it } from 'vitest';

import { getDummyExecutor, getDummyPlanner, primitive, testContext, testState } from '../../dev';
import { HTN, getDefaultDeps } from '../../src/htn';

describe('HTN', () => {
  describe('#requestReplan', () => {
    it('Если текущая задача вне транзакции, на следующем update останавливает план с контекстом update', () => {
      const root = primitive('Walk');
      const executor = getDummyExecutor('running');
      const htn = new HTN(root, {
        ...getDefaultDeps(),
        executorFactory: () => executor,
        plannerFactory: () => getDummyPlanner([root]),
      });
      htn.update(testState, testContext); // План составлен и начал исполняться

      htn.requestReplan();
      htn.update(testState, testContext);

      expect(executor.stop).toHaveBeenCalledExactlyOnceWith(testContext);
    });

    it('Если текущая задача вне транзакции, в том же update перепланирует с состоянием update', () => {
      const root = primitive('Walk');
      const planner = getDummyPlanner([root]);
      const htn = new HTN(root, {
        ...getDefaultDeps(),
        executorFactory: () => getDummyExecutor('running'),
        plannerFactory: () => planner,
      });
      htn.update(testState, testContext); // План составлен и начал исполняться
      const state = {
        ...testState,
        counter: 1,
      };

      htn.requestReplan();
      htn.update(state, testContext);

      expect(planner.plan).toHaveBeenNthCalledWith(2, root, state);
    });

    it('Если текущая задача в транзакции, не останавливает план, а исполняет его дальше', () => {
      const root = primitive('Pay');
      const executor = getDummyExecutor('running');
      const planner = getDummyPlanner([root]);
      const htn = new HTN(root, {
        ...getDefaultDeps(),
        executorFactory: () => executor,
        plannerFactory: () => planner,
      });
      htn.update(testState, testContext); // План составлен и начал исполняться
      executor.interruptible = false;

      htn.requestReplan();
      htn.update(testState, testContext);

      expect(executor.stop).not.toHaveBeenCalled();
      expect(executor.update).toHaveBeenCalledTimes(2);
    });

    it('Если транзакция кончилась, на следующем update перепланирует', () => {
      const root = primitive('Pay');
      const executor = getDummyExecutor('running');
      const planner = getDummyPlanner([root]);
      const htn = new HTN(root, {
        ...getDefaultDeps(),
        executorFactory: () => executor,
        plannerFactory: () => planner,
      });
      htn.update(testState, testContext); // План составлен и начал исполняться
      executor.interruptible = false;
      htn.requestReplan();
      htn.update(testState, testContext); // Транзакция ещё идёт

      executor.interruptible = true; // Транзакция кончилась
      htn.update(testState, testContext);

      expect(planner.plan).toHaveBeenCalledTimes(2);
    });

    it('Если задача транзакции упала, перепланирует на следующем update', () => {
      const root = primitive('Pay');
      const executor = getDummyExecutor('failed');
      executor.interruptible = false;
      const planner = getDummyPlanner([root]);
      const htn = new HTN(root, {
        ...getDefaultDeps(),
        executorFactory: () => executor,
        plannerFactory: () => planner,
      });
      htn.requestReplan();
      htn.update(testState, testContext); // План составлен, а задача транзакции упала

      htn.update(testState, testContext);

      expect(planner.plan).toHaveBeenCalledTimes(2);
    });

    it('После перепланирования не перепланирует снова, пока не попросят', () => {
      const root = primitive('Walk');
      const planner = getDummyPlanner([root]);
      const htn = new HTN(root, {
        ...getDefaultDeps(),
        executorFactory: () => getDummyExecutor('running'),
        plannerFactory: () => planner,
      });
      htn.update(testState, testContext); // План составлен и начал исполняться
      htn.requestReplan();
      htn.update(testState, testContext); // Перепланировал

      htn.update(testState, testContext);

      expect(planner.plan).toHaveBeenCalledTimes(2);
    });

    it('Повторные просьбы до перепланирования перепланируют один раз', () => {
      const root = primitive('Walk');
      const planner = getDummyPlanner([root]);
      const htn = new HTN(root, {
        ...getDefaultDeps(),
        executorFactory: () => getDummyExecutor('running'),
        plannerFactory: () => planner,
      });
      htn.update(testState, testContext); // План составлен и начал исполняться

      htn.requestReplan();
      htn.requestReplan();
      htn.update(testState, testContext);
      htn.update(testState, testContext);

      expect(planner.plan).toHaveBeenCalledTimes(2);
    });
  });
});
