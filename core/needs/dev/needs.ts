import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { NeedCategory, Need, Needs } from '../src';
import type { INeedsValidator, NeedsDeps, NeedsState, NeedValues } from '../src';

/** Сколько минут в тестовых описаниях потребность падает от максимума до минимума */
export const TEST_DEPLETION_MINUTES = 100;

/** Создаёт валидатор, который пропускает любые значения */
export function createMockedNeedsValidator(): Mocked<INeedsValidator> {
  return {
    validateValue: vi.fn(),
    validateDepletion: vi.fn(),
    validateAmount: vi.fn(),
  };
}

/**
 * Создаёт зависимости потребностей. Если не переданы, описания тестовые: каждая потребность
 * жизненная и падает на 1 за игровую минуту, от максимума до нуля за TEST_DEPLETION_MINUTES минут, а
 * валидатор пропускает любые значения
 */
export function createNeedsDeps(deps: Partial<NeedsDeps> = {}): NeedsDeps {
  return {
    definitions: {
      [Need.Satiety]: {
        category: NeedCategory.Vital,
        depletionMinutes: TEST_DEPLETION_MINUTES,
      },
    },
    validator: createMockedNeedsValidator(),
    ...deps,
  };
}

/**
 * Создаёт значения потребностей. Потребности, которые не переданы, удовлетворены полностью
 */
export function createNeedValues(values: Partial<NeedValues> = {}): NeedValues {
  return {
    [Need.Satiety]: Needs.MAX_NEED,
    ...values,
  };
}

/**
 * Создаёт состояние потребностей. Потребности, которые не переданы, удовлетворены полностью с
 * полуночи первого дня
 */
export function createNeedsState(state: Partial<NeedsState> = {}): NeedsState {
  return {
    [Need.Satiety]: {
      value: Needs.MAX_NEED,
      since: {
        day: 1,
        hours: 0,
        minutes: 0,
      },
    },
    ...state,
  };
}
