import { describe, expect, it, vi } from 'vitest';

import {
  createControlledObservable,
  createMockedObserver,
  getDefaultSubscribeOptions,
} from '../helpers';

describe('Observable', () => {
  describe('#switchMap', () => {
    describe('Вызов mapper', () => {
      it('Вызывает mapper со значением исходного observable и индексом 0 для первого значения', () => {
        const source = createControlledObservable();
        const mapper = vi.fn(() => createControlledObservable().observable);

        source.observable
          .switchMap(mapper)
          .subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        source.subscriber.next('value');

        expect(mapper).toHaveBeenCalledExactlyOnceWith('value', 0);
      });

      it('С каждым следующим значением исходного observable увеличивает индекс, переданный в mapper, на единицу', () => {
        const source = createControlledObservable();
        const mapper = vi.fn(() => createControlledObservable().observable);

        source.observable
          .switchMap(mapper)
          .subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        source.subscriber.next('first value');
        source.subscriber.next('second value');

        expect(mapper).toHaveBeenNthCalledWith(2, 'second value', 1);
      });

      it('Если mapper выбросил исключение, вызывает observer.error с этим исключением', () => {
        const error = new Error('mapper error');
        const source = createControlledObservable();
        const observer = createMockedObserver();

        source.observable
          .switchMap(vi.fn().mockThrow(error))
          .subscribe(observer, getDefaultSubscribeOptions());
        source.subscriber.next('value');

        expect(observer.error).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('Если mapper выбросил исключение, отписывается от исходного observable', () => {
        const source = createControlledObservable();

        source.observable
          .switchMap(vi.fn().mockThrow(new Error('mapper error')))
          .subscribe(createMockedObserver(), getDefaultSubscribeOptions());
        source.subscriber.next('value');

        expect(source.subscriber.active).toBe(false);
      });

      it('Если mapper вернул массив, вызывает observer.next с его элементами', () => {
        const source = createControlledObservable();
        const observer = createMockedObserver();

        source.observable.switchMap(() => [1, 2]).subscribe(observer, getDefaultSubscribeOptions());
        source.subscriber.next('value');

        expect(observer.next).toHaveBeenNthCalledWith(1, 1);
        expect(observer.next).toHaveBeenNthCalledWith(2, 2);
      });

      it('Если mapper вернул значение, которое нельзя превратить в observable, вызывает observer.error с TypeError', () => {
        const source = createControlledObservable();
        const observer = createMockedObserver();

        source.observable
          // Типы такие значения запрещают, но проверяется поведение в рантайме
          .switchMap(() => 42 as never)
          .subscribe(observer, getDefaultSubscribeOptions());
        source.subscriber.next('value');

        expect(observer.error).toHaveBeenCalledExactlyOnceWith(expect.any(TypeError));
      });
    });
  });
});
