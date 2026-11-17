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

/** Зависимости сытости с настоящим валидатором */
export const DEFAULT_SATIETY_DEPS: NeedDeps = { validator: new NeedsValidator() };

/**
 * Потребность для тестов общей логики BaseNeed. Падает до нуля за сутки. perform выставляет
 * переданную запись через сеттер BaseNeed
 */
export class TestNeed extends BaseNeed {
  static readonly OPTIONS: NeedOptions = {
    category: NeedCategory.Vital,
    depletionMinutes: 24 * 60,
    urgentBelow: 25,
    calmAbove: 60,
  };

  constructor(record: NeedRecord, deps: NeedDeps = DEFAULT_SATIETY_DEPS) {
    super(record, TestNeed.OPTIONS, deps);
  }

  perform(): void {}

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
    perform: vi.fn(),
  };
}

/** Создаёт фабрику, которая всегда возвращает переданную потребность */
export function createMockedNeedFactory(need: INeed = createMockedNeed()): Mocked<INeedFactory> {
  return { create: vi.fn(() => need) };
}
