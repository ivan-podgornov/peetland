import { describe, expect, it, vi } from 'vitest';

import { createControlledObservable, createMockedObserver } from '../../../dev';
import { getDefaultSubscribeOptions } from '../helpers';

describe('Observable', () => {
  describe('#subscribe', () => {
    describe('При ошибке которую отправляет subscriber.error', () => {
      it('Если наблюдатель не имеет обработчика ошибок, reportError вызывается с параметром, с которым вызывался subscriber.error', () => {
        const error = new Error('subscriber failed');
        const { observable, subscriber } = createControlledObservable();

        observable.subscribe({ next: vi.fn() }, getDefaultSubscribeOptions());
        subscriber.error(error);

        expect(reportError).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('reportError вызывается по разу на каждого наблюдателя без обработчика ошибок', () => {
        const { observable, subscriber } = createControlledObservable();

        observable.subscribe({ next: vi.fn() }, getDefaultSubscribeOptions());
        observable.subscribe({ next: vi.fn() }, getDefaultSubscribeOptions());
        subscriber.error(new Error('Subscriber failed'));

        expect(reportError).toHaveBeenCalledTimes(2);
      });

      it('Если у наблюдателя есть обработчик ошибок, reportError не вызывается', () => {
        const { observable, subscriber } = createControlledObservable();

        observable.subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        subscriber.error(new Error('subscriber failed'));

        expect(reportError).not.toHaveBeenCalled();
      });
    });
  });
});
