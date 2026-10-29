import { describe, expect, it, vi } from 'vitest';

import { startCommand } from './helpers';

describe('Command', () => {
  describe('#start', () => {
    it('Вызывает onStart', () => {
      const onStart = vi.fn();

      startCommand({ hooks: { onStart } });

      expect(onStart).toHaveBeenCalledOnce();
    });

    it('Сразу вызывает onUpdate с нулём', () => {
      const onUpdate = vi.fn(() => 'running' as const);

      startCommand({ hooks: { onUpdate } });

      expect(onUpdate).toHaveBeenCalledExactlyOnceWith(0, expect.anything());
    });

    it('Вызывает onStart раньше onUpdate', () => {
      const onStart = vi.fn();
      const onUpdate = vi.fn(() => 'running' as const);

      startCommand({ hooks: { onStart, onUpdate } });

      expect(onStart).toHaveBeenCalledBefore(onUpdate);
    });

    it('Если onStart вызвал fail, не вызывает onUpdate', () => {
      const onUpdate = vi.fn(() => 'running' as const);

      startCommand({ hooks: { onStart: ({ fail }) => fail(new Error()), onUpdate } });

      expect(onUpdate).not.toHaveBeenCalled();
    });

    it('Если команда прервана, ничего не делает', () => {
      const onStart = vi.fn();
      const command = startCommand({ hooks: { onStart } });
      command.cancel(new Error());

      command.start();

      expect(onStart).toHaveBeenCalledOnce();
    });
  });
});
