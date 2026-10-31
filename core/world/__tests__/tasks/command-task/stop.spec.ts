import { describe, expect, it } from 'vitest';

import {
  createControlledCommand,
  createNpcContext,
  createNpcState,
  TestCommandTask,
} from '../helpers';

describe('CommandTask', () => {
  describe('#stop', () => {
    it('Прерывает команду', () => {
      const { command } = createControlledCommand();
      const task = new TestCommandTask(() => command);
      const context = createNpcContext();
      task.start(createNpcState(), context);

      task.stop(context);

      expect(command.cancel).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
    });

    it('Прерывает команду только того актора, который в контексте', () => {
      const first = createControlledCommand();
      const second = createControlledCommand();
      const commands = [first.command, second.command];
      const task = new TestCommandTask(() => commands.shift()!);
      const firstContext = createNpcContext();
      task.start(createNpcState(), firstContext);
      task.start(createNpcState(), createNpcContext());

      task.stop(firstContext);

      expect(second.command.cancel).not.toHaveBeenCalled();
    });

    it("После остановки #update возвращает 'failed'", () => {
      const { command } = createControlledCommand();
      const task = new TestCommandTask(() => command);
      const context = createNpcContext();
      task.start(createNpcState(), context);

      task.stop(context);
      const result = task.update(createNpcState(), context);

      expect(result).toBe('failed');
    });

    it('Если задачу этим актором не начинали, не выбрасывает ошибку', () => {
      const task = new TestCommandTask(() => createControlledCommand().command);

      expect(() => task.stop(createNpcContext())).not.toThrow();
    });
  });
});
