import { describe, expect, it } from 'vitest';

import {
  createControlledCommand,
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
  });
});
