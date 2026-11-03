import { describe, expect, it, vi } from 'vitest';

import { primitive, testContext, testState } from '../../../../dev';
import { Executor } from '../../../../src/executor';

describe('Executor', () => {
  describe('#update', () => {
    describe('Если задачи уже начали выполняться', () => {
      it('Если при прошлом вызове задача не завершила своё выполнение, продолжает её выполнять с состоянием и контекстом', () => {
        const task = primitive('Primitive Task');
        vi.spyOn(task, 'start').mockReturnValue('running');
        const updateSpy = vi.spyOn(task, 'update').mockReturnValue('running');

        const executor = new Executor([task]);
        executor.update(testState, testContext); // Начинаем выполнять задачу
        executor.update(testState, testContext); // Продолжаем выполнять задачу

        expect(updateSpy).toHaveBeenCalledExactlyOnceWith(testState, testContext);
      });

      it('Если при прошлом вызове задача не завершила своё выполнение, больше не проверяет можно ли её выполнять при текущем состоянии мира', () => {
        const task = primitive('Primitive Task');
        vi.spyOn(task, 'start').mockReturnValue('running');
        vi.spyOn(task, 'update').mockReturnValue('running');
        const canExecuteSpy = vi.spyOn(task, 'canExecute').mockReturnValue(true);

        const executor = new Executor([task]);
        executor.update(testState, testContext); // Начинаем выполнять задачу
        executor.update(testState, testContext); // Продолжаем выполнять задачу

        expect(canExecuteSpy).toHaveBeenCalledExactlyOnceWith(testState);
      });

      it('Если при прошлом вызове, задача завершила своё выполнение успешно и есть ещё задачи на выполнение, проверяет можно ли начинать выполнять следующую задачу', () => {
        // arrange
        const successTask = primitive('Success Task');
        vi.spyOn(successTask, 'start').mockReturnValue('success');

        const nextTask = primitive('Next task');
        const canExecuteSpy = vi.spyOn(nextTask, 'canExecute').mockReturnValue(true);

        // act
        const executor = new Executor([successTask, nextTask]);
        executor.update(testState, testContext); // Начинаем выполнять первую задачу, она сразу же выполнилась успешно
        executor.update(testState, testContext); // Должна начать выполняться следующая задача

        // assert
        expect(canExecuteSpy).toHaveBeenCalledExactlyOnceWith(testState);
      });

      it('Если при прошлом вызове, задача завершила своё выполнение успешно, есть ещё задачи на выполнение и следущую задачу нельзя выполнять при текущем состоянии мира, не начинает её выполнять', () => {
        // arrange
        const successTask = primitive('Success Task');
        vi.spyOn(successTask, 'start').mockReturnValue('success');

        const nextTask = primitive('Next task');
        vi.spyOn(nextTask, 'canExecute').mockReturnValue(false);
        const startSpy = vi.spyOn(nextTask, 'start').mockReturnValue('failed');
        const updateSpy = vi.spyOn(nextTask, 'update').mockReturnValue('failed');

        // act
        const executor = new Executor([successTask, nextTask]);
        executor.update(testState, testContext); // Начинаем выполнять первую задачу, она сразу же выполнилась успешно
        executor.update(testState, testContext); // Должна начать выполняться следующая задача

        // assert
        expect(startSpy).not.toHaveBeenCalled();
        expect(updateSpy).not.toHaveBeenCalled();
      });

      it('Если при прошлом вызове, задача завершила своё выполнение успешно и есть ещё задачи на выполнение, начинает выполнять следующую задачу из списка с состоянием и контекстом', () => {
        // arrange
        const successTask = primitive('Success Task');
        vi.spyOn(successTask, 'start').mockReturnValue('success');

        const nextTask = primitive('Next task');
        const startSpy = vi.spyOn(nextTask, 'start').mockReturnValue('running');
        const updateSpy = vi.spyOn(nextTask, 'update').mockReturnValue('running');

        // act
        const executor = new Executor([successTask, nextTask]);
        executor.update(testState, testContext); // Начинаем выполнять первую задачу, она сразу же выполнилась успешно
        executor.update(testState, testContext); // Должна начать выполняться следующая задача

        // assert
        expect(startSpy).toHaveBeenCalledExactlyOnceWith(testState, testContext);
        expect(updateSpy).not.toHaveBeenCalled();
      });
    });
  });
});
