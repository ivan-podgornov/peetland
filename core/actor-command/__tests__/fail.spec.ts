import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { executeCommand, UPDATE_PERIOD } from './helpers';
import type { TestCommandControls } from './helpers';

describe('Command', () => {
  describe('#fail', () => {
    it('Завершает Observable ошибкой reason', () => {
      const reason = new Error('Не удалось');
      const error = vi.fn();

      executeCommand({
        hooks: { onStart: ({ fail }) => fail(reason) },
        observer: { error },
      });

      expect(error).toHaveBeenCalledExactlyOnceWith(reason);
    });

    it("Вызывает onFinish с 'failed'", () => {
      const onFinish = vi.fn();

      executeCommand({
        hooks: {
          onStart: ({ fail }) => fail(new Error()),
          onFinish,
        },
      });

      expect(onFinish).toHaveBeenCalledExactlyOnceWith('failed');
    });

    it("Если onUpdate вызвал fail и вернул 'failed', завершает Observable ошибкой reason", () => {
      const reason = new Error('Не удалось');
      const error = vi.fn();
      const onUpdate = vi.fn((_: number, { fail }: TestCommandControls) => {
        fail(reason);
        return 'failed' as const;
      });

      executeCommand({
        hooks: { onUpdate },
        observer: { error },
      });

      expect(error).toHaveBeenCalledExactlyOnceWith(reason);
    });

    it('Больше не вызывает onUpdate', () => {
      const timer = new ManualTimer();
      const onUpdate = vi.fn((_: number, { fail }: TestCommandControls) => {
        fail(new Error());
        return 'running' as const;
      });
      executeCommand({
        hooks: { onUpdate },
        timer,
      });

      timer.advance(UPDATE_PERIOD);

      expect(onUpdate).toHaveBeenCalledOnce();
    });
  });
});
