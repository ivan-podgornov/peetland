import { NeedCategory, Need } from '../src';
import type { NeedsDeps } from '../src';

/** Сколько минут в тестовых описаниях потребность падает от максимума до минимума */
export const TEST_DEPLETION_MINUTES = 100;

/**
 * Создаёт зависимости потребностей с тестовыми описаниями: каждая потребность жизненная и падает
 * на 1 за игровую минуту, от максимума до нуля за TEST_DEPLETION_MINUTES минут
 */
export function createNeedsDeps(deps: Partial<NeedsDeps> = {}): NeedsDeps {
  return {
    definitions: {
      [Need.Satiety]: {
        category: NeedCategory.Vital,
        depletionMinutes: TEST_DEPLETION_MINUTES,
      },
    },
    ...deps,
  };
}
