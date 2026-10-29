import { describe, expect, it, vi } from 'vitest';

import { executeCommand } from './helpers';
import type { TestCommandControls } from './helpers';

describe('Command', () => {
  describe('#emit', () => {
    it('Сообщает значение подписчикам Observable', () => {
      const next = vi.fn();

      executeCommand({ hooks: { onStart: ({ emit }) => emit(42) }, observer: { next } });

      expect(next).toHaveBeenCalledExactlyOnceWith(42);
    });

    it('Если команда завершена, значение не сообщает', () => {
      const next = vi.fn();
      let controls: TestCommandControls | null = null;
      const command = executeCommand({
        hooks: { onStart: (startControls) => (controls = startControls) },
        observer: { next },
      });
      command.cancel(new Error());

      controls!.emit(42);

      expect(next).not.toHaveBeenCalled();
    });
  });
});
