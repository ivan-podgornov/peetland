import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTN, createMockedHTNFactory } from '@peetland/htn/dev';
import { createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { NpcFactory } from '../../src';
import type { NpcState } from '../../src';

import { createMockedRootTaskFactory, createNpcData } from './helpers';

describe('NpcFactory', () => {
  describe('#create', () => {
    it('Создаёт NPC по переданным данным', () => {
      const factory = new NpcFactory({
        actorFactory: createMockedActorFactory(),
        htnFactory: createMockedHTNFactory(),
        rootTaskFactory: createMockedRootTaskFactory(),
        frames: createControlledObservable().observable,
      });

      const npc = factory.create(createNpcData({ id: 'peet' }));

      expect(npc.id).toBe('peet');
    });

    it('Создаёт актора NPC переданной фабрикой акторов', () => {
      const actorFactory = createMockedActorFactory();
      const factory = new NpcFactory({
        actorFactory,
        htnFactory: createMockedHTNFactory(),
        rootTaskFactory: createMockedRootTaskFactory(),
        frames: createControlledObservable().observable,
      });

      factory.create(createNpcData());

      expect(actorFactory.create).toHaveBeenCalledOnce();
    });

    it('Создаёт каждому NPC своего HTN-агента', () => {
      const firstHtn = createMockedHTN<NpcState>();
      const secondHtn = createMockedHTN<NpcState>();
      const htnFactory = createMockedHTNFactory<NpcState>();
      vi.mocked(htnFactory.create).mockReturnValueOnce(firstHtn).mockReturnValueOnce(secondHtn);
      const factory = new NpcFactory({
        actorFactory: createMockedActorFactory(),
        htnFactory,
        rootTaskFactory: createMockedRootTaskFactory(),
        frames: createControlledObservable().observable,
      });
      const first = factory.create(createNpcData({ id: 'first' }));
      factory.create(createNpcData({ id: 'second' }));

      first.despawn();

      expect(firstHtn.stop).toHaveBeenCalledOnce();
      expect(secondHtn.stop).not.toHaveBeenCalled();
    });

    it('Создаёт NPC, HTN-агент которого обновляется на кадры из переданного Observable', () => {
      const frames = createControlledObservable();
      const htn = createMockedHTN<NpcState>();
      const factory = new NpcFactory({
        actorFactory: createMockedActorFactory(),
        htnFactory: createMockedHTNFactory(htn),
        rootTaskFactory: createMockedRootTaskFactory(),
        frames: frames.observable,
      });
      factory.create(createNpcData());

      frames.subscriber.next(undefined);

      expect(htn.update).toHaveBeenCalledOnce();
    });
  });
});
