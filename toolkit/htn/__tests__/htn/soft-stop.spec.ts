import { describe, expect, it } from 'vitest';

import { getDummyExecutor, getDummyPlanner, primitive, testContext, testState } from '../../dev';
import { HTN, getDefaultDeps } from '../../src/htn';

describe('HTN', () => {
  describe('#softStop', () => {
    it('Просит исполнителя текущего плана мягко остановиться', () => {
      const root = primitive('Walk');
      const executor = getDummyExecutor('running');
      const htn = new HTN(root, {
        ...getDefaultDeps(),
        executorFactory: () => executor,
        plannerFactory: () => getDummyPlanner([root]),
      });
      htn.update(testState, testContext); // План составлен и начал исполняться

      htn.softStop();

      expect(executor.softStop).toHaveBeenCalledOnce();
    });

    it('Если плана нет, ничего не делает', () => {
      const htn = new HTN(primitive('Walk'), getDefaultDeps());

      expect(() => htn.softStop()).not.toThrow();
    });

    it('Если исполнитель мягко остановился, в том же update составляет новый план с состоянием update', () => {
      const root = primitive('Walk');
      const planner = getDummyPlanner([root]);
      const stopped = getDummyExecutor('running');
      stopped.update.mockReturnValueOnce('running').mockReturnValueOnce('stopped');
      const htn = new HTN(root, {
        ...getDefaultDeps(),
        executorFactory: () => stopped,
        plannerFactory: () => planner,
      });
      htn.update(testState, testContext); // План составлен и начал исполняться
      const state = {
        ...testState,
        counter: 1,
      };

      htn.update(state, testContext); // Исполнитель мягко остановился

      expect(planner.plan).toHaveBeenNthCalledWith(2, root, state);
    });

    it('Если исполнитель мягко остановился, в том же update начинает исполнять новый план', () => {
      const root = primitive('Walk');
      const stopped = getDummyExecutor('stopped');
      const next = getDummyExecutor('running');
      const executors = [stopped, next];
      const htn = new HTN(root, {
        ...getDefaultDeps(),
        executorFactory: () => executors.shift() ?? next,
        plannerFactory: () => getDummyPlanner([root]),
      });

      htn.update(testState, testContext);

      expect(next.update).toHaveBeenCalledExactlyOnceWith(testState, testContext);
    });
  });
});
