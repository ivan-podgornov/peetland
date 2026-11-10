import { describe, expect, it } from 'vitest';

import { createNeedsDeps } from '../dev';
import { Need, Needs } from '../src';

describe('Needs', () => {
  describe('#has', () => {
    it('Если потребность есть в состоянии, возвращает true', () => {
      const needs = new Needs(
        {
          [Need.Satiety]: {
            value: 0,
            since: {
              day: 1,
              hours: 0,
              minutes: 0,
            },
          },
        },
        createNeedsDeps()
      );

      expect(needs.has(Need.Satiety)).toBe(true);
    });

    it('Если потребности нет в состоянии, возвращает false', () => {
      const needs = new Needs({}, createNeedsDeps());

      expect(needs.has(Need.Satiety)).toBe(false);
    });
  });
});
