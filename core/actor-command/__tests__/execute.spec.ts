import { describe, expect, it, vi } from 'vitest';

import { createCommand, executeCommand } from './helpers';

describe('Command', () => {
  describe('#execute', () => {
    it('Пока на Observable не подписались, не вызывает onStart', () => {
      const onStart = vi.fn();
      const command = createCommand({ hooks: { onStart } });

      command.execute();

      expect(onStart).not.toHaveBeenCalled();
    });

    it('При подписке вызывает onStart', () => {
      const onStart = vi.fn();

      executeCommand({ hooks: { onStart } });

      expect(onStart).toHaveBeenCalledOnce();
    });

    it('При подписке сразу вызывает onUpdate с нулём', () => {
      const onUpdate = vi.fn(() => 'running' as const);

      executeCommand({ hooks: { onUpdate } });

      expect(onUpdate).toHaveBeenCalledExactlyOnceWith(0, expect.anything());
    });

    it('Вызывает onStart раньше onUpdate', () => {
      const onStart = vi.fn();
      const onUpdate = vi.fn(() => 'running' as const);

      executeCommand({
        hooks: {
          onStart,
          onUpdate,
        },
      });

      expect(onStart).toHaveBeenCalledBefore(onUpdate);
    });

    it('Если onStart вызвал fail, не вызывает onUpdate', () => {
      const onUpdate = vi.fn(() => 'running' as const);

      executeCommand({
        hooks: {
          onStart: ({ fail }) => fail(new Error()),
          onUpdate,
        },
      });

      expect(onUpdate).not.toHaveBeenCalled();
    });
  });
});
