import { AbortController } from '@peetland/events';
import { describe, expect, it } from 'vitest';

import { createCommand, executeCommand } from './helpers';
import type { TestCommand } from './helpers';

describe('Command', () => {
  describe('#signal', () => {
    it('Пока команда выполняется, не прерван', () => {
      const command = executeCommand();

      expect(command.lifetimeSignal.aborted).toBe(false);
    });

    it('Когда команда выполнена, прерван', () => {
      const command = executeCommand({ hooks: { onUpdate: () => 'success' } });

      expect(command.lifetimeSignal.aborted).toBe(true);
    });

    it('Когда команду прервали, прерван', () => {
      const command = executeCommand();

      command.cancel(new Error());

      expect(command.lifetimeSignal.aborted).toBe(true);
    });

    it('Когда от Observable отписались, прерван', () => {
      const controller = new AbortController();
      const command = executeCommand({ observeOptions: { signal: controller.signal } });

      controller.abort();

      expect(command.lifetimeSignal.aborted).toBe(true);
    });

    it('В onFinish ещё не прерван', () => {
      let abortedInOnFinish: boolean | null = null;
      let command: TestCommand | null = null;
      command = createCommand({
        hooks: { onFinish: () => (abortedInOnFinish = command!.lifetimeSignal.aborted) },
      });
      command.execute().subscribe();

      command.cancel(new Error());

      expect(abortedInOnFinish).toBe(false);
    });
  });
});
