import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import { NeedCategory, NeedModel } from '../src';
import type { INeedModel, NeedContributors } from '../src';

/**
 * Модель потребности для тестов общей логики NeedModel: падает до нуля за сутки, срочная ниже 25 и
 * спокойная выше 60. Вклад занятий передаётся в конструктор
 */
export class TestNeedModel extends NeedModel {
  readonly category = NeedCategory.Vital;
  readonly urgentBelow = 25;
  readonly calmAbove = 60;

  protected readonly depletionMinutes = 24 * 60;
  protected readonly contributors: NeedContributors;

  constructor(contributors: NeedContributors = {}) {
    super();
    this.contributors = contributors;
  }
}

/**
 * Создаёт мок модели потребности. Значение всегда 0, потребность не срочная и не спокойная, а
 * занятие возвращает ту же запись
 */
export function createMockedNeedModel(): Mocked<INeedModel> {
  return {
    category: NeedCategory.Vital,
    urgentBelow: 25,
    calmAbove: 60,
    get: vi.fn(() => 0),
    isUrgent: vi.fn(() => false),
    isCalm: vi.fn(() => false),
    perform: vi.fn((record) => record),
  };
}
