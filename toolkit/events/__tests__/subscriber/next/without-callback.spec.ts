import { describe, expect, it } from 'vitest';

import { getDefaultConstructorOptions, getCasesWithoutObserverNext } from '../../../dev';
import { Subscriber } from '../../../src/subscriber';

describe('Subscriber', () => {
  describe('#next', () => {
    describe('При отсутствии колбэка next в обсервере', () => {
      it.each(getCasesWithoutObserverNext())(
        '$description, вызов метода subscriber.next не приводит к ошибке',
        ({ createObserver }) => {
          const observer = createObserver();
          const subscriber = new Subscriber(observer, getDefaultConstructorOptions());

          expect(() => subscriber.next('some value')).not.toThrow();
        }
      );
    });
  });
});
