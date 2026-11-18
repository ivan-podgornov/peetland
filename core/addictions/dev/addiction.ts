import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { AddictionStatus, AddictionsValidator } from '../src';
import type { AddictionRecord } from '../src';
import type { IAddictionFactory } from '../src/addiction-factory';
import { BaseAddiction } from '../src/base-addiction';
import type { AddictionDeps, AddictionOptions, IAddiction } from '../src/base-addiction';

/** Запись зависимости максимальной силы: в полночь первого дня тяги нет */
export const DEFAULT_RECORD: AddictionRecord = {
  craving: BaseAddiction.MIN_CRAVING,
  strength: BaseAddiction.MAX_STRENGTH,
  since: {
    day: 1,
    hours: 0,
    minutes: 0,
  },
};

/** Зависимости (deps) зависимости с настоящим валидатором */
export const DEFAULT_ADDICTION_DEPS: AddictionDeps = { validator: new AddictionsValidator() };

/**
 * Зависимость для тестов общей логики BaseAddiction. При максимальной силе тяга растёт от нуля до
 * MAX_CRAVING за сутки, а любое употребление снимает TestAddiction.RELIEF. setRecord выставляет
 * переданную запись через сеттер BaseAddiction
 */
export class TestAddiction extends BaseAddiction {
  static readonly OPTIONS: AddictionOptions = {
    // До порога тяги (75) — три четверти суток, значит, до максимума — сутки
    cravingMinutes: 18 * 60,
  };

  /** Сколько тяги снимает любое употребление */
  static readonly RELIEF = 10;

  constructor(record: AddictionRecord, deps: AddictionDeps = DEFAULT_ADDICTION_DEPS) {
    super(record, TestAddiction.OPTIONS, deps);
  }

  getRelief(): number {
    return TestAddiction.RELIEF;
  }

  /** Выставляет запись через сеттер BaseAddiction */
  setRecord(record: AddictionRecord): void {
    this.record = record;
  }
}

/** Создаёт мок зависимости со статусом AddictionStatus.Moderate */
export function createMockedAddiction(
  record: AddictionRecord = DEFAULT_RECORD
): Mocked<IAddiction> {
  return {
    get: vi.fn<IAddiction['get']>(() => 0),
    getStatus: vi.fn<IAddiction['getStatus']>(() => AddictionStatus.Moderate),
    getState: vi.fn(() => record),
    getRelief: vi.fn<IAddiction['getRelief']>(() => 0),
    consume: vi.fn(),
  };
}

/** Создаёт фабрику, которая всегда возвращает переданную зависимость */
export function createMockedAddictionFactory(
  addiction: IAddiction = createMockedAddiction()
): Mocked<IAddictionFactory> {
  return { create: vi.fn(() => addiction) };
}
