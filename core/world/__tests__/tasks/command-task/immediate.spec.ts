import { Observable } from '@peetland/events';
import type { IActorCommand } from '@peetland/game';
import { describe, expect, it, vi } from 'vitest';

import { createNpcContext, createNpcState, TestCommandTask } from '../helpers';

/** Создаёт команду, Observable которой завершается сразу при подписке */
function createImmediateCommand(finish: 'complete' | 'error'): IActorCommand {
  return {
    name: 'immediate',
    execute: () =>
      new Observable((subscriber) => {
        if (finish === 'complete') {
          subscriber.complete();
        } else {
          subscriber.error(new Error('Не выполнена'));
        }
      }),
    cancel: vi.fn(),
  };
}

describe('CommandTask', () => {
  describe('Если команда завершилась сразу при подписке', () => {
    it("#start возвращает 'success', если команда выполнена", () => {
      const task = new TestCommandTask(() => createImmediateCommand('complete'));

      const result = task.start(createNpcState(), createNpcContext());

      expect(result).toBe('success');
    });

    it("#start возвращает 'failed', если команда завершилась ошибкой", () => {
      const task = new TestCommandTask(() => createImmediateCommand('error'));

      const result = task.start(createNpcState(), createNpcContext());

      expect(result).toBe('failed');
    });
  });
});
