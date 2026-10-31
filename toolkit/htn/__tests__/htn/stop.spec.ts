import { describe, expect, it } from 'vitest';

import { HTN, getDefaultDeps } from '../../src/htn';
import type { TaskResult } from '../../src/task';
import { getDummyExecutor, getDummyPlanner, primitive, testContext, testState } from '../helpers';

describe('HTN', () => {
  describe('#stop', () => {
    it('Если задачи уже начали выполняться, останавливает выполнение с контекстом', () => {
      const root = primitive('Primitive Task');
      const executor = getDummyExecutor('running');
      const planner = getDummyPlanner([root]);
      const htn = new HTN(root, {
        ...getDefaultDeps(),
        executorFactory: () => executor,
        plannerFactory: () => planner,
      });

      htn.update(testState, testContext); // спланировали, начали выполнять
      htn.stop(testContext); // остановили выполнение

      expect(executor.stop).toHaveBeenCalledExactlyOnceWith(testContext);
    });

    it.each([
      ['success', 'успешно'],
      ['failed', 'с ошибкой'],
    ] as [TaskResult, string][])(
      'Если выполнение задач завершено $1, останавливать нечего - executor.stop не вызывается',
      (status) => {
        const root = primitive('Primitive Task');
        const executor = getDummyExecutor(status);
        const planner = getDummyPlanner([root]);
        const htn = new HTN(root, {
          ...getDefaultDeps(),
          executorFactory: () => executor,
          plannerFactory: () => planner,
        });

        htn.update(testState, testContext); // Первый вызов, задачи запланировались, начали выполняться и выполнение завершилось со статусом status
        htn.update(testState, testContext); // Второй вызов, должна произойти новая попытка планирования

        expect(executor.stop).not.toHaveBeenCalled();
      }
    );

    it('Если задачи ещё не начинали выполняться, останавливать нечего - executor.stop не вызывается', () => {
      const root = primitive('Primitive Task');
      const executor = getDummyExecutor('running');
      const planner = getDummyPlanner([root]);
      const htn = new HTN(root, {
        ...getDefaultDeps(),
        executorFactory: () => executor,
        plannerFactory: () => planner,
      });

      htn.stop(testContext); // остановили выполнение

      expect(executor.stop).not.toHaveBeenCalled();
    });
  });
});
