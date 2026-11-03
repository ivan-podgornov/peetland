import { createNpcContext, NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { createControlledCommand, TestCommandTask } from '../helpers';

describe('CommandTask', () => {
  describe('#update', () => {
    it("Если команда выполняется, возвращает 'running'", () => {
      const { command } = createControlledCommand();
      const task = new TestCommandTask(() => command);
      const context = createNpcContext();
      task.start(NpcStateBuilder.default(), context);

      const result = task.update(NpcStateBuilder.default(), context);

      expect(result).toBe('running');
    });

    it("Если команда выполнена, возвращает 'success'", () => {
      const { command, subscriber } = createControlledCommand();
      const task = new TestCommandTask(() => command);
      const context = createNpcContext();
      task.start(NpcStateBuilder.default(), context);

      subscriber.complete();
      const result = task.update(NpcStateBuilder.default(), context);

      expect(result).toBe('success');
    });

    it("Если команда завершилась ошибкой, возвращает 'failed'", () => {
      const { command, subscriber } = createControlledCommand();
      const task = new TestCommandTask(() => command);
      const context = createNpcContext();
      task.start(NpcStateBuilder.default(), context);

      subscriber.error(new Error('Не дошёл'));
      const result = task.update(NpcStateBuilder.default(), context);

      expect(result).toBe('failed');
    });

    it("Если задачу этим актором не начинали, возвращает 'failed'", () => {
      const task = new TestCommandTask(() => createControlledCommand().command);

      const result = task.update(NpcStateBuilder.default(), createNpcContext());

      expect(result).toBe('failed');
    });

    it('Возвращает результат команды того актора, который в контексте', () => {
      const first = createControlledCommand();
      const second = createControlledCommand();
      const commands = [first.command, second.command];
      const task = new TestCommandTask(() => commands.shift()!);
      const firstContext = createNpcContext();
      const secondContext = createNpcContext();
      task.start(NpcStateBuilder.default(), firstContext);
      task.start(NpcStateBuilder.default(), secondContext);

      first.subscriber.complete();
      const result = task.update(NpcStateBuilder.default(), secondContext);

      expect(result).toBe('running');
    });

    it('Если задачу этим актором уже выполняли, возвращает результат новой команды', () => {
      const first = createControlledCommand();
      const second = createControlledCommand();
      const commands = [first.command, second.command];
      const task = new TestCommandTask(() => commands.shift()!);
      const context = createNpcContext();
      task.start(NpcStateBuilder.default(), context);
      first.subscriber.complete();
      task.update(NpcStateBuilder.default(), context);
      task.start(NpcStateBuilder.default(), context);

      const result = task.update(NpcStateBuilder.default(), context);

      expect(result).toBe('running');
    });
  });
});
