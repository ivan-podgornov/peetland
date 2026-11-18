import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { Need, NeedCategory, Needs, NeedStatus } from '../src';
import type {
  Addictions,
  INeeds,
  INeedsValidator,
  NeedsDeps,
  NeedsState,
  NeedValues,
} from '../src';
import { NeedFactory } from '../src/need-factory';

/** Создаёт валидатор, который пропускает любые значения */
export function createMockedNeedsValidator(): Mocked<INeedsValidator> {
  return {
    validateValue: vi.fn(),
    validateStrength: vi.fn(),
  };
}

/** Создаёт зависимости потребностей с настоящей фабрикой, валидатор которой пропускает любые значения */
export function createNeedsDeps(deps: Partial<NeedsDeps> = {}): NeedsDeps {
  return {
    needFactory: new NeedFactory({ validator: createMockedNeedsValidator() }),
    ...deps,
  };
}

/**
 * Создаёт значения потребностей. Потребности, которые не переданы, удовлетворены полностью
 */
export function createNeedValues(values: Partial<NeedValues> = {}): NeedValues {
  return {
    [Need.Satiety]: Needs.MAX_NEED,
    [Need.Alcoholism]: Needs.MAX_NEED,
    ...values,
  };
}

/** Создаёт зависимости NPC. Зависимостей, которые не переданы, нет: их сила — Needs.MIN_STRENGTH */
export function createAddictions(addictions: Partial<Addictions> = {}): Addictions {
  return {
    [Need.Alcoholism]: Needs.MIN_STRENGTH,
    ...addictions,
  };
}

/**
 * Создаёт состояние потребностей. Потребности, которые не переданы, удовлетворены полностью с
 * полуночи первого дня, а зависимостей нет
 */
export function createNeedsState(state: Partial<NeedsState> = {}): NeedsState {
  const since = {
    day: 1,
    hours: 0,
    minutes: 0,
  };

  return {
    [Need.Satiety]: {
      value: Needs.MAX_NEED,
      since,
    },
    [Need.Alcoholism]: {
      value: Needs.MAX_NEED,
      since,
      strength: Needs.MIN_STRENGTH,
    },
    ...state,
  };
}

/** Создаёт мок потребностей. Копия из clone() — новый такой же мок */
export function createMockedNeeds(): Mocked<INeeds> {
  return {
    get: vi.fn(() => Needs.MAX_NEED),
    getAll: vi.fn(() => createNeedValues()),
    getCategory: vi.fn(() => NeedCategory.Vital),
    getStatus: vi.fn(() => NeedStatus.Calm),
    getState: vi.fn(() => createNeedsState()),
    getGain: vi.fn(() => 0),
    clone: vi.fn(() => createMockedNeeds()),
    perform: vi.fn(),
  };
}
