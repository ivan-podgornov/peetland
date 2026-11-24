import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTN } from '@peetland/htn/dev';
import { createMockedUrgencyWatcher } from '@peetland/needs/dev';
import { describe, expect, it, vi } from 'vitest';

import { createNpcData, createNpcDeps } from '../dev';
import { Npc } from '../src';
import type { NpcContext, NpcState } from '../src';

describe('Npc', () => {
  describe('Срочные потребности', () => {
    it('На каждый тик проверяет потребности и время из состояния NPC', () => {
      const ticks = createControlledObservable();
      const watcher = createMockedUrgencyWatcher();
      const data = createNpcData();
      const npc = new Npc(
        data,
        createNpcDeps({
          ticks: ticks.observable,
          urgencyWatcher: watcher,
        })
      );

      ticks.subscriber.next(undefined);

      const { self, world } = npc.getState();
      expect(watcher.check).toHaveBeenCalledExactlyOnceWith(self.needs, world.time);
    });

    it('Если потребность стала срочной, мягко останавливает план до того, как продвинуть агента', () => {
      const ticks = createControlledObservable();
      const htn = createMockedHTN<NpcState, NpcContext>();
      const data = createNpcData();
      new Npc(
        data,
        createNpcDeps({
          htn,
          ticks: ticks.observable,
          urgencyWatcher: createMockedUrgencyWatcher(true),
        })
      );

      ticks.subscriber.next(undefined);

      expect(vi.mocked(htn.softStop)).toHaveBeenCalledBefore(vi.mocked(htn.update));
    });

    it('Если ни одна потребность не стала срочной, не останавливает план', () => {
      const ticks = createControlledObservable();
      const htn = createMockedHTN<NpcState, NpcContext>();
      const data = createNpcData();
      new Npc(
        data,
        createNpcDeps({
          htn,
          ticks: ticks.observable,
          urgencyWatcher: createMockedUrgencyWatcher(false),
        })
      );

      ticks.subscriber.next(undefined);

      expect(htn.softStop).not.toHaveBeenCalled();
    });
  });
});
