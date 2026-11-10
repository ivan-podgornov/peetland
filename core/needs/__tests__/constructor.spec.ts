import { describe, expect, it } from 'vitest';

import { createNeedsDeps } from '../dev';
import { Need, Needs } from '../src';
import type { NeedsDeps } from '../src';

const since = {
  day: 1,
  hours: 0,
  minutes: 0,
};

/** Создаёт зависимости, в которых сытость падает за переданное число минут */
function createDepsWithDepletion(depletionMinutes: number): NeedsDeps {
  const deps = createNeedsDeps();

  return {
    definitions: {
      [Need.Satiety]: {
        ...deps.definitions[Need.Satiety],
        depletionMinutes,
      },
    },
  };
}

describe('Needs', () => {
  describe('#constructor', () => {
    it.each([-1, 101, Number.NaN, Number.POSITIVE_INFINITY])(
      'Если значение потребности %s, выбрасывает RangeError',
      (value) => {
        expect(
          () =>
            new Needs(
              {
                [Need.Satiety]: {
                  value,
                  since,
                },
              },
              createNeedsDeps()
            )
        ).toThrow(RangeError);
      }
    );

    it.each([Needs.MIN_NEED, Needs.MAX_NEED])(
      'Если значение потребности %s, не выбрасывает ошибку',
      (value) => {
        expect(
          () =>
            new Needs(
              {
                [Need.Satiety]: {
                  value,
                  since,
                },
              },
              createNeedsDeps()
            )
        ).not.toThrow();
      }
    );

    it.each([0, -10, Number.NaN, Number.POSITIVE_INFINITY])(
      'Если потребность в описаниях падает за %s минут, выбрасывает RangeError',
      (depletionMinutes) => {
        expect(
          () =>
            new Needs(
              {
                [Need.Satiety]: {
                  value: 50,
                  since,
                },
              },
              createDepsWithDepletion(depletionMinutes)
            )
        ).toThrow(RangeError);
      }
    );

    it('Не проверяет описания потребностей, которых у NPC нет', () => {
      expect(() => new Needs({}, createDepsWithDepletion(0))).not.toThrow();
    });
  });
});
