import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { ItemClassifier } from '../src';
import type { Food, IItemClassifier, Item } from '../src';

/** Создаёт мок классификатора, который отвечает как настоящий */
export function createMockedItemClassifier(): Mocked<IItemClassifier> {
  const real = new ItemClassifier();

  // Мок vitest теряет предикат типа, поэтому приводим явно
  return {
    isFood: vi.fn((item: Item): item is Food => real.isFood(item)),
  } as unknown as Mocked<IItemClassifier>;
}
