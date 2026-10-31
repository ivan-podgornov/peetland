import { describe, expect, it, vi } from 'vitest';

import { createMockedObserver } from '../../../dev';
import { Observable } from '../../../src/observable';

import { getDefaultSubscribeOptions } from '../helpers';

describe('Observable', () => {
  describe('#subscribe', () => {
    it('Если observer не задан, не выбрасывает ошибку', () => {
      const observable = new Observable(() => {});

      expect(() => observable.subscribe()).not.toThrow();
    });

    it('Вызывает колбэк-executor, переданный в конструктор, один раз', () => {
      const executor = vi.fn();
      const observable = new Observable(executor);

      observable.subscribe(createMockedObserver(), getDefaultSubscribeOptions());

      expect(executor).toHaveBeenCalledOnce();
    });
  });
});
