import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { createMockedActorNpcRegistry, createNpcData, createNpcDeps } from '../dev';
import { Npc } from '../src';

describe('Npc', () => {
  describe('#constructor', () => {
    it('Связывает своего актора с собой в реестре связей', () => {
      const actorNpcRegistry = createMockedActorNpcRegistry();
      const actor = createActor();
      const data = createNpcData();

      const npc = new Npc(
        data,
        createNpcDeps({
          actorNpcRegistry,
          actor,
        })
      );

      expect(actorNpcRegistry.register).toHaveBeenCalledExactlyOnceWith(actor, npc);
    });
  });
});
