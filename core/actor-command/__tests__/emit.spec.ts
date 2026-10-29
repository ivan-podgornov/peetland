import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { startCommand, UPDATE_PERIOD } from './helpers';
import type { TestCommandControls } from './helpers';

describe('Command', () => {
  describe('#emit', () => {
    it('Сообщает значение подписчикам Observable', () => {
      const next = vi.fn();

      startCommand({ hooks: { onStart: ({ emit }) => emit(42) }, observer: { next } });

      expect(next).toHaveBeenCalledExactlyOnceWith(42);
    });

    it('Если команда завершена, значение не сообщает', () => {
      const timer = new ManualTimer();
      const next = vi.fn();
      let controls: TestCommandControls | null = null;
      const command = startCommand({
        hooks: { onStart: (startControls) => (controls = startControls) },
        observer: { next },
        timer,
      });
      command.stop();

      controls!.emit(42);
      timer.advance(UPDATE_PERIOD);

      expect(next).not.toHaveBeenCalled();
    });
  });
});
