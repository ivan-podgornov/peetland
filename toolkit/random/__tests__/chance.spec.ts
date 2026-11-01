import { describe, expect, it, vi } from 'vitest';

import { Random } from '../src';

describe('Random', () => {
  describe('#chance', () => {
    it('Если случайное число меньше probability, возвращает true', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.2);
      const random = new Random();

      expect(random.chance(0.25)).toBe(true);
    });

    it('Если случайное число равно probability, возвращает false', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.25);
      const random = new Random();

      expect(random.chance(0.25)).toBe(false);
    });

    it('Если случайное число больше probability, возвращает false', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.3);
      const random = new Random();

      expect(random.chance(0.25)).toBe(false);
    });

    it('Если probability равно 0, возвращает false при наименьшем случайном числе', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const random = new Random();

      expect(random.chance(0)).toBe(false);
    });

    it('Если probability равно 1, возвращает true при наибольшем случайном числе', () => {
      vi.spyOn(Math, 'random').mockReturnValue(1 - Number.EPSILON);
      const random = new Random();

      expect(random.chance(1)).toBe(true);
    });

    it.each([-0.1, 1.1, Number.NaN])(
      'Если probability равно %s, выбрасывает RangeError',
      (probability) => {
        const random = new Random();

        expect(() => random.chance(probability)).toThrow(RangeError);
      }
    );
  });
});
