import { describe, expect, it } from 'vitest';

import { Observable } from '../../../src/observable';

describe('Observable', () => {
  describe('.from', () => {
    describe('При передаче Observable', () => {
      it('Возвращает тот же экземпляр Observable, который был передан', () => {
        const source = new Observable(() => {});

        const result = Observable.from(source);

        expect(result).toBe(source);
      });
    });
  });
});
