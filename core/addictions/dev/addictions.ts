import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { Addiction, Addictions, AddictionStatus } from '../src';
import type {
  AddictionsData,
  AddictionsDeps,
  AddictionsState,
  AddictionSatisfactions,
  IAddictions,
  IAddictionsValidator,
} from '../src';
import { AddictionFactory } from '../src/addiction-factory';

/** Создаёт валидатор, который пропускает любые удовлетворённость и силу */
export function createMockedAddictionsValidator(): Mocked<IAddictionsValidator> {
  return {
    validateSatisfaction: vi.fn(),
    validateStrength: vi.fn(),
  };
}

/** Создаёт зависимости коллекции с настоящей фабрикой, валидатор которой пропускает любые удовлетворённость и силу */
export function createAddictionsDeps(deps: Partial<AddictionsDeps> = {}): AddictionsDeps {
  return {
    addictionFactory: new AddictionFactory({ validator: createMockedAddictionsValidator() }),
    ...deps,
  };
}

/** Создаёт удовлетворённость зависимостей. Зависимости, которые не переданы, удовлетворены полностью */
export function createAddictionSatisfactions(
  values: Partial<AddictionSatisfactions> = {}
): AddictionSatisfactions {
  return {
    [Addiction.Alcoholism]: Addictions.MAX_SATISFACTION,
    ...values,
  };
}

/**
 * Создаёт начальные данные зависимостей. Зависимостей, которые не переданы, нет: их сила —
 * Addictions.MIN_STRENGTH, и совсем не тянет
 */
export function createAddictionsData(data: Partial<AddictionsData> = {}): AddictionsData {
  return {
    [Addiction.Alcoholism]: {
      satisfaction: Addictions.MAX_SATISFACTION,
      strength: Addictions.MIN_STRENGTH,
    },
    ...data,
  };
}

/**
 * Создаёт состояние зависимостей. Зависимостей, которые не переданы, нет, и с полуночи первого дня
 * совсем не тянет
 */
export function createAddictionsState(state: Partial<AddictionsState> = {}): AddictionsState {
  return {
    [Addiction.Alcoholism]: {
      satisfaction: Addictions.MAX_SATISFACTION,
      strength: Addictions.MIN_STRENGTH,
      since: {
        day: 1,
        hours: 0,
        minutes: 0,
      },
    },
    ...state,
  };
}

/** Создаёт мок зависимостей. Копия из clone() — новый такой же мок */
export function createMockedAddictions(): Mocked<IAddictions> {
  return {
    get: vi.fn(() => Addictions.MAX_SATISFACTION),
    getAll: vi.fn(() => createAddictionSatisfactions()),
    getStatus: vi.fn(() => AddictionStatus.Calm),
    getState: vi.fn(() => createAddictionsState()),
    getGain: vi.fn(() => 0),
    clone: vi.fn(() => createMockedAddictions()),
    consume: vi.fn(),
  };
}
