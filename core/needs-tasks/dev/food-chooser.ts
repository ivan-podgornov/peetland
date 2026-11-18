import type { Food } from '@peetland/inventory';
import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { IFoodChooser } from '../src';

export type MockedFoodChooserOptions = {
  /** Что выбирает из инвентаря. По умолчанию — null: еды нет */
  fromInventory?: Food | null;
  /** Что выбирает купить. По умолчанию — null: денег нет */
  toBuy?: Food | null;
};

/** Создаёт мок выбора еды, который всегда выбирает переданную еду */
export function createMockedFoodChooser(
  options: MockedFoodChooserOptions = {}
): Mocked<IFoodChooser> {
  const { fromInventory = null, toBuy = null } = options;

  return {
    chooseFromInventory: vi.fn(() => fromInventory),
    chooseToBuy: vi.fn(() => toBuy),
  };
}
