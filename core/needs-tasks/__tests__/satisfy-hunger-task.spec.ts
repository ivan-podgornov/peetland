import { planNames } from '@peetland/htn/dev';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { SatisfyHungerTask } from '../src/satisfy-hunger-task';

describe('SatisfyHungerTask', () => {
  it('Пока способов поесть нет, план не составляется', () => {
    const names = planNames(new SatisfyHungerTask(), NpcStateBuilder.default());

    expect(names).toBeNull();
  });
});
