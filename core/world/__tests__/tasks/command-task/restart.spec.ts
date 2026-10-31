import { describe, expect, it } from 'vitest';

import {
  createControlledCommand,
  createNpcContext,
  createNpcState,
  TestCommandTask,
} from '../helpers';

describe('CommandTask', () => {
  describe('При повторном выполнении тем же актором', () => {
    it('#start отдаёт актору новую команду', () => {
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

    it('#update возвращает результат новой команды, а не прошлой', () => {
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
