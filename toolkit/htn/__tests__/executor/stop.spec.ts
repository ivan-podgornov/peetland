import { describe, expect, it, vi } from 'vitest';

import { Executor } from '../../src/executor';
import { primitive, testContext, testState } from '../helpers';

describe('Executor', () => {
  describe('#stop', () => {
    it('Выбрасывает ошибку, если выполнение задач уже завершилось успешно', () => {
      const task = primitive('Primitive Task');
      vi.spyOn(task, 'start').mockReturnValue('success');
      const executor = new Executor([task]);

      executor.update(testState, testContext);

      expect(() => executor.stop(testContext)).toThrow(
        "Can't stop, because execution is already success"
      );
    });

    it('Выбрасывает ошибку, если выполнение задач ранее завершилось с ошибкой', () => {
      const task = primitive('Primitive Task');
      vi.spyOn(task, 'start').mockReturnValue('failed');
      const executor = new Executor([task]);

      executor.update(testState, testContext);

      expect(() => executor.stop(testContext)).toThrow(
        "Can't stop, because execution is already failed"
      );
    });

    it('Выбрасывает ошибку, если выполнее задач было остановлено ранее', () => {
      const task = primitive('Primitive Task');
      const executor = new Executor([task]);

      executor.stop(testContext);

      expect(() => executor.stop(testContext)).toThrow(
        "Can't stop, because execution is already stopped"
      );
    });

    it('Завершает выполнение в целом, но не пытается завершить задачу, если её выполнение ещё не началось', () => {
      const task = primitive('Primitive Task');
      const stopSpy = vi.spyOn(task, 'stop');

      const executor = new Executor([task]);
      executor.stop(testContext);

      expect(stopSpy).not.toHaveBeenCalled();
    });

    it('Завершает выполнение в целом и выполнение текущей задачи с контекстом, если её выполнение уже началось', () => {
      const task = primitive('Primitive Task');
      const stopSpy = vi.spyOn(task, 'stop');

      const executor = new Executor([task]);
      executor.update(testState, testContext);
      executor.stop(testContext);

      expect(stopSpy).toHaveBeenCalledExactlyOnceWith(testContext);
    });

    it('Если на момент завершения выполнения, одна задача уже была выполнена, а вторая ещё не начала выполняться, завершает выполнение в целом, но не пытается завершить выполнение ни одной из задач', () => {
      // arrange
      const firstTask = primitive('First task');
      vi.spyOn(firstTask, 'start').mockReturnValue('success');
      const firstTaskStopSpy = vi.spyOn(firstTask, 'stop');

      const unreachableTask = primitive('Unreachable task');
      const unreachableTaskStopSpy = vi.spyOn(unreachableTask, 'stop');

      // act
      const executor = new Executor([firstTask, unreachableTask]);
      executor.update(testState, testContext);
      executor.stop(testContext);

      // assert
      expect(firstTaskStopSpy).not.toHaveBeenCalled();
      expect(unreachableTaskStopSpy).not.toHaveBeenCalled();
    });
  });
});
