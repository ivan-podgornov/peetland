import { createNpcContext, NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { createControlledCommand, TestCommandTask } from '../../dev';

describe('CommandTask', () => {
  describe('#update', () => {
    it("Если команда выполняется, возвращает 'running'", () => {
      const { command } = createControlledCommand();
      const task = new TestCommandTask(() => command);
      const context = createNpcContext();
      task.start(NpcStateBuilder.default(), context);

      const result = task.update();

      expect(result).toBe('running');
    });

    it("Если команда выполнена, возвращает 'success'", () => {
      const { command, subscriber } = createControlledCommand();
      const task = new TestCommandTask(() => command);
      const context = createNpcContext();
      task.start(NpcStateBuilder.default(), context);

      subscriber.complete();
      const result = task.update();

      expect(result).toBe('success');
    });

    it("Если команда завершилась ошибкой, возвращает 'failed'", () => {
      const { command, subscriber } = createControlledCommand();
      const task = new TestCommandTask(() => command);
      const context = createNpcContext();
      task.start(NpcStateBuilder.default(), context);

      subscriber.error(new Error('Не дошёл'));
      const result = task.update();

      expect(result).toBe('failed');
    });

    it("Если задачу не начинали, возвращает 'failed'", () => {
      const task = new TestCommandTask(() => createControlledCommand().command);

      const result = task.update();

      expect(result).toBe('failed');
    });

    it('Если задачу уже выполняли, возвращает результат новой команды', () => {
      const first = createControlledCommand();
      const second = createControlledCommand();
      const commands = [first.command, second.command];
      const task = new TestCommandTask(() => commands.shift()!);
      const context = createNpcContext();
      task.start(NpcStateBuilder.default(), context);
      first.subscriber.complete();
      task.update();
      task.start(NpcStateBuilder.default(), context);

      const result = task.update();

      expect(result).toBe('running');
    });
  });
});
