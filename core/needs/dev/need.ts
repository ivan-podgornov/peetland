import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { NeedCategory, NeedStatus, NeedsValidator } from '../src';
import type { NeedRecord } from '../src';
import { BaseNeed } from '../src/base-need';
import type { INeed, NeedDeps, NeedOptions } from '../src/base-need';
import type { INeedFactory } from '../src/need-factory';

/** Запись потребности: удовлетворена полностью с полуночи первого дня */
export const DEFAULT_RECORD: NeedRecord = {
  value: BaseNeed.MAX_NEED,
  since: {
    day: 1,
    hours: 0,
    minutes: 0,
  },
};

/** Зависимости потребности с настоящим валидатором */
export const DEFAULT_NEED_DEPS: NeedDeps = { validator: new NeedsValidator() };

/**
 * Потребность для тестов общей логики BaseNeed. Падает до нуля за сутки, а любое занятие прибавляет
 * ей TestNeed.GAIN. setRecord выставляет переданную запись через сеттер BaseNeed
 */
export class TestNeed extends BaseNeed {
  static readonly OPTIONS: NeedOptions = {
    category: NeedCategory.Vital,
    depletionMinutes: 24 * 60,
  };

  /** Сколько прибавляет любое занятие */
  static readonly GAIN = 10;

  constructor(record: NeedRecord, deps: NeedDeps = DEFAULT_NEED_DEPS) {
    super(record, TestNeed.OPTIONS, deps);
  }

  getGain(): number {
    return TestNeed.GAIN;
  }

  /** Выставляет запись через сеттер BaseNeed */
  setRecord(record: NeedRecord): void {
    this.record = record;
  }
}

/** Создаёт мок потребности со статусом NeedStatus.Moderate */
export function createMockedNeed(record: NeedRecord = DEFAULT_RECORD): Mocked<INeed> {
  return {
    category: NeedCategory.Vital,
    get: vi.fn<INeed['get']>(() => 0),
    getStatus: vi.fn<INeed['getStatus']>(() => NeedStatus.Moderate),
    getState: vi.fn(() => record),
    getGain: vi.fn<INeed['getGain']>(() => 0),
    perform: vi.fn(),
  };
}

/** Создаёт фабрику, которая всегда возвращает переданную потребность */
export function createMockedNeedFactory(need: INeed = createMockedNeed()): Mocked<INeedFactory> {
  return { create: vi.fn(() => need) };
}
