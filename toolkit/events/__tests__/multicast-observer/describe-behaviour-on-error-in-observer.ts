import { describe, expect, it } from 'vitest';

import { createMockedObserver } from '../../dev';
import { MulticastObserver } from '../../src/multicast-observer';

import { callMethod, createObserverWithThrowsMethod, getDefaultObserveOptions } from './helpers';

import type { CreateMockedObserverOptions } from './helpers';

export function describeBehaviourOnErrorInObserver(options: CreateMockedObserverOptions) {
  const { method } = options;
  const methodName = options.observerAsFunction ? 'observer' : `observer.${method}`;

  describe(`При ошибке при вызове ${methodName}`, () => {
    it(`Вызывает обработчик ${method} остальных наблюдателей с параметрами, которые были переданы в multicastObserver.${method}`, () => {
      const multicast = new MulticastObserver();
      const firstObserver = createMockedObserver();
      const secondObserver = createObserverWithThrowsMethod(options, new Error('observer error'));
      const thirdObserver = createMockedObserver();

      multicast.add(firstObserver, getDefaultObserveOptions());
      multicast.add(secondObserver, getDefaultObserveOptions());
      multicast.add(thirdObserver, getDefaultObserveOptions());
      const params = callMethod(multicast, method);

      expect(firstObserver[method]).toHaveBeenCalledWith(...params);
      expect(thirdObserver[method]).toHaveBeenCalledWith(...params);
    });

    it(`Выброс ошибки из ${methodName}, не приводит к выбросу ошибки`, () => {
      const observer = createObserverWithThrowsMethod(options, new Error('observer error'));
      const multicast = new MulticastObserver();

      multicast.add(observer);

      expect(() => callMethod(multicast, method)).not.toThrow();
    });

    it('Передаёт ошибку в reportError', () => {
      const error = new Error('observer error');
      const observer = createObserverWithThrowsMethod(options, error);
      const multicast = new MulticastObserver();

      multicast.add(observer);
      callMethod(multicast, method);

      expect(reportError).toHaveBeenCalledWith(error);
    });
  });
}
