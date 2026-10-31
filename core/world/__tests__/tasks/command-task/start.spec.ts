import { describe, expect, it } from 'vitest';

import {
  createControlledCommand,
  createImmediateCommand,
  createNpcContext,
  createNpcState,
  TestCommandTask,
} from '../helpers';

describe('CommandTask', () => {
  describe('#start', () => {
    it('Начинает выполнять команду', () => {
      const { command } = createControlledCommand();
      const task = new TestCommandTask(() => command);

      task.start(createNpcState(), createNpcContext());

      expect(command.execute).toHaveBeenCalledOnce();
    });

    it("Если команда выполняется, возвращает 'running'", () => {
      const { command } = createControlledCommand();
      const task = new TestCommandTask(() => command);

      const result = task.start(createNpcState(), createNpcContext());

      expect(result).toBe('running');
    });

    it("Если команда выполнилась сразу при подписке, возвращает 'success'", () => {
      const task = new TestCommandTask(() => createImmediateCommand('complete'));

      const result = task.start(createNpcState(), createNpcContext());

      expect(result).toBe('success');
    });

    it("Если команда сразу при подписке завершилась ошибкой, возвращает 'failed'", () => {
      const task = new TestCommandTask(() => createImmediateCommand('error'));

      const result = task.start(createNpcState(), createNpcContext());

      expect(result).toBe('failed');
    });

    it('Если задачу этим актором уже выполняли, отдаёт актору новую команду', () => {
      const first = createControlledCommand();
      const second = createControlledCommand();
      const commands = [first.command, second.command];
      const task = new TestCommandTask(() => commands.shift()!);
      const context = createNpcContext();
      task.start(createNpcState(), context);
      first.subscriber.complete();
      task.update(createNpcState(), context);

      task.start(createNpcState(), context);

      expect(second.command.execute).toHaveBeenCalledOnce();
    });
  });
});
