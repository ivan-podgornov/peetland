import { describe, expect, it } from 'vitest';

import { Observable } from '../../../src/observable';

import { getDefaultObservableOptions } from '../helpers';

const unsupportedValues = [
  { description: 'число', value: 42 },
  { description: 'обычный объект', value: { key: 'value' } },
  { description: 'null', value: null },
  { description: 'undefined', value: undefined },
];

describe('Observable', () => {
  describe('.from', () => {
    describe('При передаче неподдерживаемого значения', () => {
      it.each(unsupportedValues)(
        'Если передано $description, выбрасывает TypeError',
        ({ value }) => {
          // Типы такие значения запрещают, но проверяется поведение в рантайме
          function callFrom() {
            return Observable.from(value as never, getDefaultObservableOptions());
          }

          expect(callFrom).toThrow(TypeError);
        }
      );
    });
  });
});
