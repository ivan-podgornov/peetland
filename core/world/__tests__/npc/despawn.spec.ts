import { createControlledObservable } from '@peetland/events/dev';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { Npc } from '../../src';

import { createActorFactory, createHtn, createNpcData } from './helpers';

describe('Npc', () => {
  describe('#despawn', () => {
    it('Останавливает HTN-агента', () => {
      const htn = createHtn();
      const npc = new Npc(createNpcData(), {
        actorFactory: createActorFactory(),
        htn,
        frames: createControlledObservable().observable,
      });

      npc.despawn();

      expect(htn.stop).toHaveBeenCalledOnce();
    });

    it('Деспавнит актора', () => {
      const actor = createActor();
      const npc = new Npc(createNpcData(), {
        actorFactory: createActorFactory(actor),
        htn: createHtn(),
        frames: createControlledObservable().observable,
      });

      npc.despawn();

      expect(actor.signal.aborted).toBe(true);
    });

    it('После деспавна кадры не вызывают htn.update', () => {
      const frames = createControlledObservable();
      const htn = createHtn();
      const npc = new Npc(createNpcData(), {
        actorFactory: createActorFactory(),
        htn,
        frames: frames.observable,
      });

      npc.despawn();
      frames.subscriber.next(undefined);

      expect(htn.update).not.toHaveBeenCalled();
    });
  });
});
