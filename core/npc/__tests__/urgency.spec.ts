import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTN, createMockedHTNFactory } from '@peetland/htn/dev';
import { createMockedUrgencyWatcher, createMockedUrgencyWatcherFactory } from '@peetland/needs/dev';
import { describe, expect, it, vi } from 'vitest';

import { createNpcData, createNpcDeps } from '../dev';
import { Npc } from '../src';
import type { NpcContext, NpcState } from '../src';

describe('Npc', () => {
  describe('Срочные потребности', () => {
    it('Создаёт наблюдателя срочности фабрикой urgencyWatcherFactory', () => {
      const urgencyWatcherFactory = createMockedUrgencyWatcherFactory();

      new Npc(createNpcData(), createNpcDeps({ urgencyWatcherFactory }));

      expect(urgencyWatcherFactory.create).toHaveBeenCalledOnce();
    });

    it('На каждый тик проверяет потребности и время из состояния NPC', () => {
      const ticks = createControlledObservable();
      const watcher = createMockedUrgencyWatcher();
      const npc = new Npc(
        createNpcData(),
        createNpcDeps({
          ticks: ticks.observable,
          urgencyWatcherFactory: createMockedUrgencyWatcherFactory(watcher),
        })
      );

      ticks.subscriber.next(undefined);

      const { self, world } = npc.getState();
      expect(watcher.check).toHaveBeenCalledExactlyOnceWith(self.needs, world.time);
    });

    it('Если потребность стала срочной, мягко останавливает план до того, как продвинуть агента', () => {
      const ticks = createControlledObservable();
      const htn = createMockedHTN<NpcState, NpcContext>();
      new Npc(
        createNpcData(),
        createNpcDeps({
          htnFactory: createMockedHTNFactory(htn),
          ticks: ticks.observable,
          urgencyWatcherFactory: createMockedUrgencyWatcherFactory(
            createMockedUrgencyWatcher(true)
          ),
        })
      );

      ticks.subscriber.next(undefined);

      expect(vi.mocked(htn.softStop)).toHaveBeenCalledBefore(vi.mocked(htn.update));
    });

    it('Если ни одна потребность не стала срочной, не останавливает план', () => {
      const ticks = createControlledObservable();
      const htn = createMockedHTN<NpcState, NpcContext>();
      new Npc(
        createNpcData(),
        createNpcDeps({
          htnFactory: createMockedHTNFactory(htn),
          ticks: ticks.observable,
          urgencyWatcherFactory: createMockedUrgencyWatcherFactory(
            createMockedUrgencyWatcher(false)
          ),
        })
      );

      ticks.subscriber.next(undefined);

      expect(htn.softStop).not.toHaveBeenCalled();
    });
  });
});
