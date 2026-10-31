import { describe, expect, it } from 'vitest';

import { HTN, getDefaultDeps } from '../../../src/htn';
import type { TaskResult } from '../../../src/task';
import {
  getDummyExecutor,
  getDummyPlanner,
  primitive,
  testContext,
  testState,
} from '../../helpers';

describe('HTN', () => {
  describe('#update', () => {
    describe('При последующих вызовах', () => {
      it('Если при предыдущем вызове задачи не начали выполняться, перепланирует root задачу с состоянием, с которым вызвался update', () => {
        const root = primitive('Primitive Task');
        const planner = getDummyPlanner(null);
        const htn = new HTN(root, { ...getDefaultDeps(), plannerFactory: () => planner });

        htn.update(testState, testContext); // Первый вызов, задачи выполняться не начали
        htn.update(testState, testContext); // Второй вызов, должна произойти новая попытка планирования

        expect(planner.plan).toHaveBeenNthCalledWith(2, root, testState);
      });

      it('Если перепланирование, после неудачного прошлого планирования удалось, начинает выполнение с состоянием и контекстом, с которыми вызывался update', () => {
        const root = primitive('Primitive Task');
        const executor = getDummyExecutor('running');
        const planner = getDummyPlanner(null, [root]);
        const htn = new HTN(root, {
          ...getDefaultDeps(),
          executorFactory: () => executor,
          plannerFactory: () => planner,
        });

        htn.update(testState, testContext); // Первый вызов, задачи выполняться не начали
        htn.update(testState, testContext); // Второй вызов, должна произойти новая удачная попытка планирования и начало выполнения

        expect(executor.update).toHaveBeenCalledExactlyOnceWith(testState, testContext);
      });

      it.each([
        ['success', 'успешно'],
        ['failed', 'с ошибкой'],
      ] as [TaskResult, string][])(
        'Если при предыдущем вызове задача была выполнена $1, перепланирует root задачу с состоянием, с которым вызвался update',
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

          expect(planner.plan).toHaveBeenNthCalledWith(2, root, testState);
        }
      );

      it.each([
        ['success', 'успешно'],
        ['failed', 'с ошибкой'],
      ] as [TaskResult, string][])(
        'Если при предыдущем вызове задача была выполнена $1, и если перепланирование удалось, начинает выполнять root задачу с состоянием и контекстом, с которыми вызвался update',
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
          htn.update(testState, testContext); // Второй вызов, должна произойти новая попытка планирования и выполнение

          expect(executor.update).toHaveBeenNthCalledWith(2, testState, testContext);
        }
      );

      it('Если при предыдущем вызове, выполнение не завершилось, перепланирование не происходит', () => {
        const root = primitive('Primitive Task');
        const executor = getDummyExecutor('running');
        const planner = getDummyPlanner([root]);
        const htn = new HTN(root, {
          ...getDefaultDeps(),
          executorFactory: () => executor,
          plannerFactory: () => planner,
        });

        htn.update(testState, testContext); // Первый вызов, задачи запланировались, начали выполняться
        htn.update(testState, testContext); // Второй вызов, перепланирование не происходит, выполнение продолжается

        expect(planner.plan).toHaveBeenCalledTimes(1);
      });

      it('Если при предыдущем вызове, выполнение не завершилось, продолжает выполнение', () => {
        const root = primitive('Primitive Task');
        const executor = getDummyExecutor('running');
        const planner = getDummyPlanner([root]);
        const htn = new HTN(root, {
          ...getDefaultDeps(),
          executorFactory: () => executor,
          plannerFactory: () => planner,
        });

        htn.update(testState, testContext); // Первый вызов, задачи запланировались, начали выполняться
        htn.update(testState, testContext); // Второй вызов, перепланирование не происходит, выполнение продолжается

        expect(executor.update).toHaveBeenCalledTimes(2);
        expect(executor.update).toHaveBeenLastCalledWith(testState, testContext);
      });
    });
  });
});
