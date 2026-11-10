import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { Need, Needs } from '../src';
import type { INeedsValidator, NeedsDeps, NeedsState, NeedValues } from '../src';

/** Создаёт валидатор, который пропускает любые значения */
export function createMockedNeedsValidator(): Mocked<INeedsValidator> {
  return { validateValue: vi.fn() };
}

/** Создаёт зависимости потребностей. Если валидатор не передан, он пропускает любые значения */
export function createNeedsDeps(deps: Partial<NeedsDeps> = {}): NeedsDeps {
  return {
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
