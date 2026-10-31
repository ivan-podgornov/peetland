import { describe, expect, it, vi } from 'vitest';

import { createMockedObserver } from '../../../dev';
import { Observable } from '../../../src/observable';

import { getDefaultSubscribeOptions } from '../helpers';

describe('Observable', () => {
  describe('#subscribe', () => {
    describe('При ошибке в колбэк-executor', () => {
      it('Если наблюдатель не имеет обработчика ошибок, reportError вызывается с ошибкой, которую выбросил executor', () => {
        const error = new Error('executor failed');
        const executor = vi.fn().mockThrow(error);
        const observable = new Observable(executor);

        observable.subscribe({ next: vi.fn() }, getDefaultSubscribeOptions());

        expect(reportError).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('reportError вызывается по разу на каждого наблюдателя без обработчика ошибок', () => {
        const error = new Error('executor failed');
        const executor = vi.fn().mockThrow(error);
        const observable = new Observable(executor);

        observable.subscribe({ next: vi.fn() }, getDefaultSubscribeOptions());
        observable.subscribe({ next: vi.fn() }, getDefaultSubscribeOptions());

        expect(reportError).toHaveBeenCalledTimes(2);
      });

      it('Если у наблюдателя есть обработчик ошибок, reportError не вызывается', () => {
        const error = new Error('executor failed');
        const executor = vi.fn().mockThrow(error);
        const observable = new Observable(executor);

        observable.subscribe(createMockedObserver(), getDefaultSubscribeOptions());

        expect(reportError).not.toHaveBeenCalled();
      });
    });
  });
});
