import { createNpcContext, NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { createControlledCommand, TestCommandTask } from '../../dev';

describe('CommandTask', () => {
  describe('#stop', () => {
    it('Прерывает команду', () => {
      const { command } = createControlledCommand();
      const task = new TestCommandTask(() => command);
      const context = createNpcContext();
      task.start(NpcStateBuilder.default(), context);

      task.stop(context);

      expect(command.cancel).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
    });

    it('Прерывает команду только того актора, который в контексте', () => {
      const first = createControlledCommand();
      const second = createControlledCommand();
      const commands = [first.command, second.command];
      const task = new TestCommandTask(() => commands.shift()!);
      const firstContext = createNpcContext();
      task.start(NpcStateBuilder.default(), firstContext);
      task.start(NpcStateBuilder.default(), createNpcContext());

      task.stop(firstContext);

      expect(second.command.cancel).not.toHaveBeenCalled();
    });

    it("После остановки #update возвращает 'failed'", () => {
      const { command } = createControlledCommand();
      const task = new TestCommandTask(() => command);
      const context = createNpcContext();
      task.start(NpcStateBuilder.default(), context);

      task.stop(context);
      const result = task.update(NpcStateBuilder.default(), context);

      expect(result).toBe('failed');
    });

    it('Если задачу этим актором не начинали, не выбрасывает ошибку', () => {
      const task = new TestCommandTask(() => createControlledCommand().command);

      expect(() => task.stop(createNpcContext())).not.toThrow();
    });
  });
});
