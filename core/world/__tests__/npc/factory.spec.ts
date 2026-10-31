import { createControlledObservable } from '@peetland/events/dev';
import { describe, expect, it, vi } from 'vitest';

import { NpcFactory } from '../../src';

import { createActorFactory, createHtn, createNpcData } from './helpers';

describe('NpcFactory', () => {
  describe('#create', () => {
    it('Создаёт NPC по переданным данным', () => {
      const factory = new NpcFactory({
        actorFactory: createActorFactory(),
        frames: createControlledObservable().observable,
        createHtn,
      });

      const npc = factory.create(createNpcData({ id: 'peet' }));

      expect(npc.id).toBe('peet');
    });

    it('Создаёт актора NPC переданной фабрикой акторов', () => {
      const actorFactory = createActorFactory();
      const factory = new NpcFactory({
        actorFactory,
        frames: createControlledObservable().observable,
        createHtn,
      });

      factory.create(createNpcData());

      expect(actorFactory.create).toHaveBeenCalledOnce();
    });

    it('Создаёт каждому NPC своего HTN-агента', () => {
      const firstHtn = createHtn();
      const secondHtn = createHtn();
      const factory = new NpcFactory({
        actorFactory: createActorFactory(),
        frames: createControlledObservable().observable,
        createHtn: vi.fn().mockReturnValueOnce(firstHtn).mockReturnValueOnce(secondHtn),
      });
      const first = factory.create(createNpcData({ id: 'first' }));
      factory.create(createNpcData({ id: 'second' }));

      first.despawn();

      expect(firstHtn.stop).toHaveBeenCalledOnce();
      expect(secondHtn.stop).not.toHaveBeenCalled();
    });

    it('Создаёт NPC, HTN-агент которого обновляется на кадры из переданного Observable', () => {
      const frames = createControlledObservable();
      const htn = createHtn();
      const factory = new NpcFactory({
        actorFactory: createActorFactory(),
        frames: frames.observable,
        createHtn: () => htn,
      });
      factory.create(createNpcData());

      frames.subscriber.next(undefined);

      expect(htn.update).toHaveBeenCalledOnce();
    });
  });
});
