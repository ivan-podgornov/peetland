import { describe, expect, it } from 'vitest';

import { FOOD, isFood, Item } from '../src';

describe('isFood', () => {
  it.each(FOOD)('Если предмет — еда (%s), возвращает true', (item) => {
    expect(isFood(item)).toBe(true);
  });

  it.each([Item.Money, Item.Bottles, Item.Booze])(
    'Если предмет не еда (%s), возвращает false',
    (item) => {
      expect(isFood(item)).toBe(false);
    }
  );
});
