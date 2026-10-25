import { describe, expect, it } from 'vitest';

import { Observable } from '../../../src/observable';

import { getDefaultObservableOptions } from '../helpers';

describe('Observable', () => {
  describe('.from', () => {
    describe('При передаче Observable', () => {
      it('Возвращает тот же экземпляр Observable, который был передан', () => {
        const source = new Observable(() => {}, getDefaultObservableOptions());

        const result = Observable.from(source, getDefaultObservableOptions());

        expect(result).toBe(source);
      });
    });
  });
});
