import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { BaseNeed, NeedCategory } from '../src';
import type { INeed, INeedFactory, NeedContributors, NeedRecord } from '../src';

import { createMockedNeedsValidator } from './needs';

/**
 * Потребность для тестов общей логики BaseNeed: падает до нуля за сутки, срочная ниже
 * TestNeed.URGENT_BELOW и спокойная выше TestNeed.CALM_ABOVE. Вклад занятий передаётся в
 * конструктор, а валидатор пропускает любые значения
 */
export class TestNeed extends BaseNeed {
  static readonly URGENT_BELOW = 25;
  static readonly CALM_ABOVE = 60;

  readonly category = NeedCategory.Vital;

  protected readonly depletionMinutes = 24 * 60;
  protected readonly urgentBelow = TestNeed.URGENT_BELOW;
  protected readonly calmAbove = TestNeed.CALM_ABOVE;
  protected readonly contributors: NeedContributors;

  constructor(record: NeedRecord, contributors: NeedContributors = {}) {
    super(record, { validator: createMockedNeedsValidator() });
    this.contributors = contributors;
  }
}

/** Создаёт мок потребности. Значение всегда 0, потребность не срочная и не спокойная */
export function createMockedNeed(record: NeedRecord = createRecord()): Mocked<INeed> {
  return {
    category: NeedCategory.Vital,
    get: vi.fn(() => 0),
    isUrgent: vi.fn(() => false),
    isCalm: vi.fn(() => false),
    getState: vi.fn(() => record),
    perform: vi.fn(),
  };
}

/** Создаёт фабрику, которая всегда возвращает переданную потребность */
export function createMockedNeedFactory(need: INeed = createMockedNeed()): Mocked<INeedFactory> {
  return { create: vi.fn(() => need) };
}

function createRecord(): NeedRecord {
  return {
    value: BaseNeed.MAX_NEED,
    since: {
      day: 1,
      hours: 0,
      minutes: 0,
    },
  };
}
