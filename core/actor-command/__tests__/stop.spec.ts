import { AbortController } from '@peetland/events';
import { describe, expect, it, vi } from 'vitest';

import { startCommand } from './helpers';

describe('Command', () => {
  describe('#stop', () => {
    it('Вызывает onFinish', () => {
      const onFinish = vi.fn();
      const command = startCommand({ hooks: { onFinish } });

      command.stop();

      expect(onFinish).toHaveBeenCalledOnce();
    });

    it('Успешно завершает Observable', () => {
      const complete = vi.fn();
      const command = startCommand({ observer: { complete } });

      command.stop();

      expect(complete).toHaveBeenCalledOnce();
    });

    it('Если команда уже выполнена, не вызывает onFinish повторно', () => {
      const onFinish = vi.fn();
      const command = startCommand({ hooks: { onFinish } });
      command.stop();

      command.stop();

      expect(onFinish).toHaveBeenCalledOnce();
    });

    it('Если команда прервана, не вызывает onFinish', () => {
      const onFinish = vi.fn();
      const command = startCommand({ hooks: { onFinish } });
      command.cancel(new Error());

      command.stop();

      expect(onFinish).not.toHaveBeenCalled();
    });

    it('Если от Observable отписались, не вызывает onFinish', () => {
      const controller = new AbortController();
      const onFinish = vi.fn();
      const command = startCommand({
        hooks: { onFinish },
        observeOptions: { signal: controller.signal },
      });
      controller.abort();

      command.stop();

      expect(onFinish).not.toHaveBeenCalled();
    });
  });
});
