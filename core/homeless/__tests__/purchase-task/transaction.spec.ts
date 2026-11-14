import { describe, expect, it } from 'vitest';

import { createPurchaseTask } from '../../dev';

describe('PurchaseTask', () => {
  it('Является транзакцией: если NPC заплатил, он не уйдёт без предмета', () => {
    const task = createPurchaseTask();

    expect(task.transaction).toBe(true);
  });
});
