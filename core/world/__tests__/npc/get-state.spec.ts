import { createControlledObservable } from '@peetland/events/dev';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { Npc } from '../../src';

import { createActorFactory, createHtn, createNpcData } from './helpers';

describe('Npc', () => {
  describe('#getState', () => {
    it('Возвращает живой инвентарь NPC, а не копию', () => {
      const npc = new Npc(createNpcData(), {
        actorFactory: createActorFactory(),
        htn: createHtn(),
        frames: createControlledObservable().observable,
      });

      expect(npc.getState().inventory).toBe(npc.inventory);
    });

    it('Возвращает актора, которого создал NPC', () => {
      const actor = createActor();
      const npc = new Npc(createNpcData(), {
        actorFactory: createActorFactory(actor),
        htn: createHtn(),
        frames: createControlledObservable().observable,
      });

      expect(npc.getState().actor).toBe(actor);
    });

    it('Возвращает совестливость NPC', () => {
      const npc = new Npc(createNpcData({ traits: { conscientiousness: 80 } }), {
        actorFactory: createActorFactory(),
        htn: createHtn(),
        frames: createControlledObservable().observable,
      });

      expect(npc.getState().conscientiousness).toBe(80);
    });

    it('Возвращает стыд NPC', () => {
      const npc = new Npc(createNpcData({ feelings: { shame: 30 } }), {
        actorFactory: createActorFactory(),
        htn: createHtn(),
        frames: createControlledObservable().observable,
      });

      expect(npc.getState().shame).toBe(30);
    });
  });
});
