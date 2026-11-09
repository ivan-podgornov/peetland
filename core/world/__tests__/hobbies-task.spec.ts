import { planNames } from '@peetland/htn/dev';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { HobbiesTask } from '../src/hobbies-task';

describe('HobbiesTask', () => {
  describe('Порядок методов', () => {
    it('Пока хобби нет, план не составляется', () => {
      const names = planNames(new HobbiesTask(), NpcStateBuilder.default());

      expect(names).toBeNull();
    });
  });
});
