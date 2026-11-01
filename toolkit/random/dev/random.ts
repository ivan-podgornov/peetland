import { vi } from 'vitest';

import type { IRandom } from '../src';

/**
 * Создаёт источник случайных чисел, у которого chance — мок. По умолчанию шанс всегда выпадает или
 * всегда не выпадает, в зависимости от isLucky. Через мок можно проверить, с какой вероятностью
 * бросали шанс, и переопределить результат
 */
export function createMockedRandom(isLucky: boolean) {
  return { chance: vi.fn((_probability: number) => isLucky) } satisfies IRandom;
}
