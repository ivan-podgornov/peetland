import { AbortController } from '@peetland/events';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { executeCommand, UPDATE_PERIOD } from './helpers';

describe('Command', () => {
  describe('Если от Observable отписались', () => {
    it("Вызывает onFinish с 'cancelled'", () => {
      const controller = new AbortController();
      const onFinish = vi.fn();
      executeCommand({ hooks: { onFinish }, observeOptions: { signal: controller.signal } });

      controller.abort();

      expect(onFinish).toHaveBeenCalledExactlyOnceWith('cancelled');
    });

    it('Больше не вызывает onUpdate', () => {
      const timer = new ManualTimer();
      const controller = new AbortController();
      const onUpdate = vi.fn(() => 'running' as const);
      executeCommand({ hooks: { onUpdate }, timer, observeOptions: { signal: controller.signal } });

      controller.abort();
      timer.advance(UPDATE_PERIOD);

      expect(onUpdate).toHaveBeenCalledOnce();
    });

    it('Если потом команду прервали, не вызывает onFinish повторно', () => {
      const controller = new AbortController();
      const onFinish = vi.fn();
      const command = executeCommand({
        hooks: { onFinish },
        observeOptions: { signal: controller.signal },
      });
      controller.abort();

      command.cancel(new Error());

      expect(onFinish).toHaveBeenCalledOnce();
    });
  });
});
