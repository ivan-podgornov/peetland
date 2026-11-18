import { Need, NeedStatus } from '@peetland/needs';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { EATING_SATIETY } from '../src/constants';

/** Возвращает статус сытости NPC с переданной сытостью */
function satietyStatus(satiety: number): NeedStatus {
  const state = new NpcStateBuilder()
    .withNeeds((needs) => needs.withValue(Need.Satiety, satiety).build())
    .build();

  return state.self.needs.getStatus(Need.Satiety, state.world.time);
}

describe('EATING_SATIETY', () => {
  it('Совпадает с порогом срочности сытости', () => {
    expect(satietyStatus(EATING_SATIETY)).not.toBe(NeedStatus.Urgent);
    expect(satietyStatus(EATING_SATIETY - 0.01)).toBe(NeedStatus.Urgent);
  });
});
