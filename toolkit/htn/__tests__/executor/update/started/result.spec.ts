import { describe, expect, it, vi } from 'vitest';

import { primitive, testContext, testState, toSteps } from '../../../../dev';
import { Executor } from '../../../../src/executor';

describe('Executor', () => {
  describe('#update', () => {
    describe('Если задачи уже начали выполняться', () => {
      it('Возвращает "success", если задача была единственной и выполнилась', () => {
        const task = primitive('Primitive Task');
        vi.spyOn(task, 'start').mockReturnValue('running');
        vi.spyOn(task, 'update').mockReturnValue('success');

        const executor = new Executor(toSteps([task]));
        executor.update(testState, testContext);
        const result = executor.update(testState, testContext);

        expect(result).toBe('success');
      });

      it('Возвращает "running", если задача была единственной и требует ещё времени на выполнение', () => {
        const task = primitive('Primitive Task');
        vi.spyOn(task, 'start').mockReturnValue('running');
        vi.spyOn(task, 'update').mockReturnValue('running');

        const executor = new Executor(toSteps([task]));
        const result = executor.update(testState, testContext);

        expect(result).toBe('running');
      });

      it('Возвращает "running", если задача выполнилась, но есть ещё задачи на выполнение', () => {
        const successTask = primitive('Success Task');
        vi.spyOn(successTask, 'start').mockReturnValue('running');
        vi.spyOn(successTask, 'update').mockReturnValue('success');

        const executor = new Executor(toSteps([successTask, primitive('Another Task')]));
        executor.update(testState, testContext);
        const result = executor.update(testState, testContext);

        expect(result).toBe('running');
      });

      it('Возвращает "failed", если задача была единственной и выполнение завершилось с ошибкой', () => {
        const failedTask = primitive('Failed Task');
        vi.spyOn(failedTask, 'start').mockReturnValue('running');
        vi.spyOn(failedTask, 'update').mockReturnValue('failed');

        const executor = new Executor(toSteps([failedTask]));
        executor.update(testState, testContext);
        const result = executor.update(testState, testContext);

        expect(result).toBe('failed');
      });

      it('Возвращает "failed", если выполнение задачи завершилось с ошибкой и есть ещё задачи на выполнение', () => {
        const failedTask = primitive('Failed Task');
        vi.spyOn(failedTask, 'start').mockReturnValue('running');
        vi.spyOn(failedTask, 'update').mockReturnValue('failed');

        const executor = new Executor(toSteps([failedTask, primitive('Another Task')]));
        executor.update(testState, testContext);
        const result = executor.update(testState, testContext);

        expect(result).toBe('failed');
      });

      it('Возвращает "failed", если предыдущая задача выполнилась, а следующую задачу невозможно выполнить при текущем состоянии мира', () => {
        const successTask = primitive('Success Task');
        vi.spyOn(successTask, 'start').mockReturnValue('success');

        const failedTask = primitive('Failed Task');
        vi.spyOn(failedTask, 'canExecute').mockReturnValue(false);

        const executor = new Executor(toSteps([successTask, failedTask]));
        executor.update(testState, testContext);
        const result = executor.update(testState, testContext);

        expect(result).toBe('failed');
      });
    });
  });
});
