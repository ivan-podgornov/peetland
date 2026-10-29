import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { startCommand, UPDATE_PERIOD } from './helpers';

describe('Command', () => {
  describe("Если onUpdate вернул 'failed'", () => {
    it('Завершает Observable ошибкой', () => {
      const error = vi.fn();

      startCommand({ hooks: { onUpdate: () => 'failed' }, observer: { error } });

      expect(error).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
    });

    it('Больше не вызывает onUpdate', () => {
      const timer = new ManualTimer();
      const onUpdate = vi.fn(() => 'failed' as const);
      startCommand({ hooks: { onUpdate }, timer });

      timer.advance(UPDATE_PERIOD);

      expect(onUpdate).toHaveBeenCalledOnce();
    });

    it('Не вызывает onFinish', () => {
      const onFinish = vi.fn();

      startCommand({ hooks: { onUpdate: () => 'failed', onFinish } });

      expect(onFinish).not.toHaveBeenCalled();
    });

    it('Не вызывает onCancel', () => {
      const onCancel = vi.fn();

      startCommand({ hooks: { onUpdate: () => 'failed', onCancel } });

      expect(onCancel).not.toHaveBeenCalled();
    });
  });
});
