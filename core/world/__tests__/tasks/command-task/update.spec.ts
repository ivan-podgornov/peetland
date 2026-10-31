import { describe, expect, it } from 'vitest';

import {
  createControlledCommand,
  createNpcContext,
  createNpcState,
  TestCommandTask,
} from '../helpers';

describe('CommandTask', () => {
  describe('#update', () => {
    it("Если команда выполняется, возвращает 'running'", () => {
      const { command } = createControlledCommand();
      const task = new TestCommandTask(() => command);
      const context = createNpcContext();
      task.start(createNpcState(), context);

      const result = task.update(createNpcState(), context);

      expect(result).toBe('running');
    });

    it("Если команда выполнена, возвращает 'success'", () => {
      const { command, subscriber } = createControlledCommand();
      const task = new TestCommandTask(() => command);
      const context = createNpcContext();
      task.start(createNpcState(), context);

      subscriber.complete();
      const result = task.update(createNpcState(), context);

      expect(result).toBe('success');
    });

    it("Если команда завершилась ошибкой, возвращает 'failed'", () => {
      const { command, subscriber } = createControlledCommand();
      const task = new TestCommandTask(() => command);
      const context = createNpcContext();
      task.start(createNpcState(), context);

      subscriber.error(new Error('Не дошёл'));
      const result = task.update(createNpcState(), context);

      expect(result).toBe('failed');
    });

    it("Если задачу этим актором не начинали, возвращает 'failed'", () => {
      const task = new TestCommandTask(() => createControlledCommand().command);

      const result = task.update(createNpcState(), createNpcContext());

      expect(result).toBe('failed');
    });

    it('Возвращает результат команды того актора, который в контексте', () => {
      const first = createControlledCommand();
      const second = createControlledCommand();
      const commands = [first.command, second.command];
      const task = new TestCommandTask(() => commands.shift()!);
      const firstContext = createNpcContext();
      const secondContext = createNpcContext();
      task.start(createNpcState(), firstContext);
      task.start(createNpcState(), secondContext);

      first.subscriber.complete();
      const result = task.update(createNpcState(), secondContext);

      expect(result).toBe('running');
    });

    it('Если задачу этим актором уже выполняли, возвращает результат новой команды', () => {
      const first = createControlledCommand();
      const second = createControlledCommand();
      const commands = [first.command, second.command];
      const task = new TestCommandTask(() => commands.shift()!);
      const context = createNpcContext();
      task.start(createNpcState(), context);
      first.subscriber.complete();
      task.update(createNpcState(), context);
      task.start(createNpcState(), context);

      const result = task.update(createNpcState(), context);

      expect(result).toBe('running');
    });
  });
});
