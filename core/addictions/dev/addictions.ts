import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { Addiction, Addictions, AddictionStatus } from '../src';
import type {
  AddictionsData,
  AddictionsDeps,
  AddictionsState,
  AddictionCravings,
  IAddictions,
  IAddictionsValidator,
} from '../src';
import { AddictionFactory } from '../src/addiction-factory';

/** Создаёт валидатор, который пропускает любые тягу и силу */
export function createMockedAddictionsValidator(): Mocked<IAddictionsValidator> {
  return {
    validateCraving: vi.fn(),
    validateStrength: vi.fn(),
  };
}

/** Создаёт зависимости коллекции с настоящей фабрикой, валидатор которой пропускает любые тягу и силу */
export function createAddictionsDeps(deps: Partial<AddictionsDeps> = {}): AddictionsDeps {
  return {
    addictionFactory: new AddictionFactory({ validator: createMockedAddictionsValidator() }),
    ...deps,
  };
}

/** Создаёт тягу зависимостей. У зависимостей, которые не переданы, тяги нет */
export function createAddictionCravings(
  values: Partial<AddictionCravings> = {}
): AddictionCravings {
  return {
    [Addiction.Alcoholism]: Addictions.MIN_CRAVING,
    ...values,
  };
}

/**
 * Создаёт начальные данные зависимостей. Зависимостей, которые не переданы, нет: их сила —
 * Addictions.MIN_STRENGTH, и тяги нет
 */
export function createAddictionsData(data: Partial<AddictionsData> = {}): AddictionsData {
  return {
    [Addiction.Alcoholism]: {
      craving: Addictions.MIN_CRAVING,
      strength: Addictions.MIN_STRENGTH,
    },
    ...data,
  };
}

/**
 * Создаёт состояние зависимостей. Зависимостей, которые не переданы, нет, и с полуночи первого дня
 * тяги нет
 */
export function createAddictionsState(state: Partial<AddictionsState> = {}): AddictionsState {
  return {
    [Addiction.Alcoholism]: {
      craving: Addictions.MIN_CRAVING,
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
    get: vi.fn(() => Addictions.MIN_CRAVING),
    getAll: vi.fn(() => createAddictionCravings()),
    getStatus: vi.fn(() => AddictionStatus.Calm),
    getState: vi.fn(() => createAddictionsState()),
    getRelief: vi.fn(() => 0),
    clone: vi.fn(() => createMockedAddictions()),
    consume: vi.fn(),
  };
}
