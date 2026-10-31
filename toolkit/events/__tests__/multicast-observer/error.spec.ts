import { describe, expect, it } from 'vitest';

import { createMockedObserver } from '../../dev';
import { MulticastObserver } from '../../src/multicast-observer';

import { describeBehaviourOnErrorInObserver } from './describe-behaviour-on-error-in-observer';
import { describeBehaviourWhenMethodAbsent } from './describe-behaviour-when-method-absent';
import { describeRecallObserver } from './describe-recall-observers';
import { describeSignalFinish } from './describe-signal-finish';

import { getDefaultObserveOptions } from './helpers';

describe('MulticastObserver', () => {
  describe('#error', () => {
    describeRecallObserver({ method: 'error' });
    describeBehaviourOnErrorInObserver({ method: 'error' });
    describeBehaviourWhenMethodAbsent({ method: 'error', observerAsFunction: false });
    describeBehaviourWhenMethodAbsent({ method: 'error', observerAsFunction: true });
    describeSignalFinish({ method: 'error', reason: 'subscriber failed' });

    describe('При отсутствии error в наблюдателях', () => {
      it('Если один из добавленных наблюдателей является функцией, ошибка уходит в reportError', () => {
        const error = new Error();
        const multicast = new MulticastObserver();

        multicast.add(() => {}, getDefaultObserveOptions());
        multicast.error(error);

        expect(reportError).toHaveBeenCalledWith(error);
      });

      it('Если добавлено несколько наблюдателей без обработчика ошибки, reportError вызывается для каждого такого наблюдателя', () => {
        const error = new Error();
        const multicast = new MulticastObserver();

        multicast.add(() => {}, getDefaultObserveOptions());
        multicast.add(() => {}, getDefaultObserveOptions());
        multicast.error(error);

        expect(reportError).toHaveBeenCalledTimes(2);
      });

      it('Если обработчик error наблюдателя отработал успешно, ошибка в reportError не уходит', () => {
        const error = new Error();
        const multicast = new MulticastObserver();

        multicast.add(createMockedObserver(), getDefaultObserveOptions());
        multicast.error(error);

        expect(reportError).not.toHaveBeenCalled();
      });

      it('Если один из добавленных наблюдателей указан как undefined, ошибка передаётся в reportError', () => {
        const error = new Error();
        const multicast = new MulticastObserver();

        multicast.add();
        multicast.error(error);

        expect(reportError).toHaveBeenCalledWith(error);
      });
    });
  });
});
