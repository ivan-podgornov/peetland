import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { AddictionStatus, AddictionsValidator } from '../src';
import type { AddictionRecord } from '../src';
import type { IAddictionFactory } from '../src/addiction-factory';
import { BaseAddiction } from '../src/base-addiction';
import type { AddictionDeps, AddictionOptions, IAddiction } from '../src/base-addiction';

/** Запись зависимости максимальной силы: с полуночи первого дня совсем не тянет */
export const DEFAULT_RECORD: AddictionRecord = {
  satisfaction: BaseAddiction.MAX_SATISFACTION,
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
 * Зависимость для тестов общей логики BaseAddiction. При максимальной силе удовлетворённость падает от
 * MAX_SATISFACTION до нуля за сутки, а любое употребление прибавляет ей TestAddiction.GAIN
 */
export class TestAddiction extends BaseAddiction {
  static readonly OPTIONS: AddictionOptions = {
    // До порога срочности — три четверти суток, значит, до нуля — сутки
    cravingMinutes: 18 * 60,
  };

  /** Сколько прибавляет любое употребление */
  static readonly GAIN = 10;

  constructor(record: AddictionRecord, deps: AddictionDeps = DEFAULT_ADDICTION_DEPS) {
    super(record, TestAddiction.OPTIONS, deps);
  }

  getGain(): number {
    return TestAddiction.GAIN;
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
    getGain: vi.fn<IAddiction['getGain']>(() => 0),
    consume: vi.fn(),
  };
}

/** Создаёт фабрику, которая всегда возвращает переданную зависимость */
export function createMockedAddictionFactory(
  addiction: IAddiction = createMockedAddiction()
): Mocked<IAddictionFactory> {
  return { create: vi.fn(() => addiction) };
}
