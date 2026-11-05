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

      task.stop();

      expect(command.cancel).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
    });

    it("После остановки #update возвращает 'failed'", () => {
      const { command } = createControlledCommand();
      const task = new TestCommandTask(() => command);
      const context = createNpcContext();
      task.start(NpcStateBuilder.default(), context);

      task.stop();
      const result = task.update();

      expect(result).toBe('failed');
    });

    it('Если задачу не начинали, не выбрасывает ошибку', () => {
      const task = new TestCommandTask(() => createControlledCommand().command);

      expect(() => task.stop()).not.toThrow();
    });
  });
});
