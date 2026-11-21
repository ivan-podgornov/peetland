import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { ActorRegistry } from '../../src';

describe('ActorRegistry', () => {
  describe('При деспавне зарегистрированного актора', () => {
    it('Убирает актора из реестра: в реестре не бывает призраков', () => {
      const registry = new ActorRegistry();
      const actor = createActor();
      registry.register(actor);

      actor.despawn();

      expect(registry.getAll()).toStrictEqual([]);
    });

    it('Убирает только деспавненного актора', () => {
      const registry = new ActorRegistry();
      const actor = createActor();
      const otherActor = createActor();
      registry.register(actor);
      registry.register(otherActor);

      actor.despawn();

      expect(registry.getAll()).toStrictEqual([otherActor]);
    });
  });
});
