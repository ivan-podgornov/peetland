import { describe, expect, it, vi } from 'vitest';

import { Random } from '../src';

describe('Random', () => {
  describe('#pick', () => {
    it('Если случайное число наименьшее, возвращает первый элемент', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const random = new Random();

      expect(random.pick(['a', 'b', 'c'])).toBe('a');
    });

    it('Если случайное число наибольшее, возвращает последний элемент', () => {
      vi.spyOn(Math, 'random').mockReturnValue(1 - Number.EPSILON);
      const random = new Random();

      expect(random.pick(['a', 'b', 'c'])).toBe('c');
    });

    it('Возвращает элемент, на долю которого попало случайное число', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const random = new Random();

      expect(random.pick(['a', 'b', 'c'])).toBe('b');
    });

    it('Если список пустой, выбрасывает RangeError', () => {
      const random = new Random();

      expect(() => random.pick([])).toThrow(RangeError);
    });
  });
});
