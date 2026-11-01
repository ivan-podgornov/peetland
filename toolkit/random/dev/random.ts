import { vi } from 'vitest';
import type { Mock } from 'vitest';

import type { IRandom } from '../src';

/**
 * Создаёт источник случайных чисел, методы которого — моки. По умолчанию chance всегда выпадает или
 * всегда не выпадает, в зависимости от isLucky, а pick возвращает первый элемент списка. Через моки
 * можно проверить, с чем их вызвали, и переопределить результат
 */
export function createMockedRandom(isLucky: boolean) {
  return {
    chance: vi.fn((_probability: number) => isLucky),
    // Мок vitest теряет параметр типа, поэтому его сигнатуру возвращаем пересечением с IRandom['pick']
    pick: vi.fn((items: readonly unknown[]) => items[0]) as Mock<
      (items: readonly unknown[]) => unknown
    > &
      IRandom['pick'],
  } satisfies IRandom;
}
