import { createActor, createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { createMockedActorNpcRegistry, createNpcData, createNpcDeps } from '../dev';
import { Npc } from '../src';

describe('Npc', () => {
  describe('#constructor', () => {
    it('Связывает своего актора с собой в реестре связей', () => {
      const actorNpcRegistry = createMockedActorNpcRegistry();
      const actor = createActor();

      const npc = new Npc(
        createNpcData(),
        createNpcDeps({
          actorNpcRegistry,
          actorFactory: createMockedActorFactory(actor),
        })
      );

      expect(actorNpcRegistry.register).toHaveBeenCalledExactlyOnceWith(
        actor,
        npc,
        expect.anything()
      );
    });
  });
});
