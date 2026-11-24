import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTN, createMockedHTNFactory } from '@peetland/htn/dev';
import { Need } from '@peetland/needs';
import { createMockedUrgencyWatcherFactory, createNeedValues } from '@peetland/needs/dev';
import { describe, expect, it } from 'vitest';

import { createNpcData } from '../../dev';
import { NpcFactory } from '../../src';
import type { NpcContext, NpcState } from '../../src';

import { createRequiredDeps } from './helpers';

describe('NpcFactory', () => {
  describe('#create', () => {
    it('Создаёт наблюдателя срочности фабрикой urgencyWatcherFactory из зависимостей', () => {
      const urgencyWatcherFactory = createMockedUrgencyWatcherFactory();
      const factory = new NpcFactory(createRequiredDeps({ urgencyWatcherFactory }));

      factory.create(createNpcData());

      expect(urgencyWatcherFactory.create).toHaveBeenCalledOnce();
    });

    it('Если urgencyWatcherFactory не передана, при срочной потребности NPC мягко останавливает план', () => {
      const ticks = createControlledObservable();
      const htn = createMockedHTN<NpcState, NpcContext>();
      const factory = new NpcFactory(
        createRequiredDeps({
          ticks: ticks.observable,
          htnFactory: createMockedHTNFactory(htn),
        })
      );
      factory.create(
        createNpcData({
          needs: createNeedValues({
            [Need.Satiety]: 0,
          }),
        })
      );

      ticks.subscriber.next(undefined);

      expect(htn.softStop).toHaveBeenCalledOnce();
    });
  });
});
