import { describe, expect, it, vi } from 'vitest';

import { Executor } from '../../../src/executor';
import { primitive, testContext, testState } from '../../helpers';

describe('Executor', () => {
  describe('#update', () => {
    describe('Если выполнение задач уже завершилось ранее', () => {
      it('Выбрасывает ошибку, если выполнение задач уже завершилось успешно', () => {
        const task = primitive('Primitive Task');
        vi.spyOn(task, 'start').mockReturnValue('success');
        const executor = new Executor([task]);

        executor.update(testState, testContext);

        expect(() => executor.update(testState, testContext)).toThrow(
          "Can't update, because execution is already success"
        );
      });

      it('Выбрасывает ошибку, если выполнение задач уже завершилось с ошибкой', () => {
        const task = primitive('Primitive Task');
        vi.spyOn(task, 'start').mockReturnValue('failed');
        const executor = new Executor([task]);

        executor.update(testState, testContext);

        expect(() => executor.update(testState, testContext)).toThrow(
          "Can't update, because execution is already failed"
        );
      });

      it('Выбрасывает ошибку, если выполнение задач было остановлено ранее', () => {
        const executor = new Executor([primitive('Primitive Task')]);

        executor.stop(testContext);

        expect(() => executor.update(testState, testContext)).toThrow(
          "Can't update, because execution is already stopped"
        );
      });
    });
  });
});
