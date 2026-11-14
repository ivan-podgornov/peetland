import { describe, expect, it, vi } from 'vitest';

import { primitive, testContext, testState, toSteps } from '../../../dev';
import { Executor } from '../../../src/executor';

describe('Executor', () => {
  describe('#update', () => {
    describe('Если выполнение задач уже завершилось ранее', () => {
      it('Выбрасывает ошибку, если выполнение задач уже завершилось успешно', () => {
        const task = primitive('Primitive Task');
        vi.spyOn(task, 'start').mockReturnValue('success');
        const executor = new Executor(toSteps([task]));

        executor.update(testState, testContext);

        expect(() => executor.update(testState, testContext)).toThrow(
          "Can't update, because execution is already success"
        );
      });

      it('Выбрасывает ошибку, если выполнение задач уже завершилось с ошибкой', () => {
        const task = primitive('Primitive Task');
        vi.spyOn(task, 'start').mockReturnValue('failed');
        const executor = new Executor(toSteps([task]));

        executor.update(testState, testContext);

        expect(() => executor.update(testState, testContext)).toThrow(
          "Can't update, because execution is already failed"
        );
      });

      it('Выбрасывает ошибку, если выполнение задач было остановлено ранее', () => {
        const executor = new Executor(toSteps([primitive('Primitive Task')]));

        executor.stop(testContext);

        expect(() => executor.update(testState, testContext)).toThrow(
          "Can't update, because execution is already stopped"
        );
      });
    });
  });
});
