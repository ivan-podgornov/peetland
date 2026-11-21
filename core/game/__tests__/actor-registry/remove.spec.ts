import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { ActorRegistry } from '../../src';

describe('ActorRegistry', () => {
  describe('#remove', () => {
    it('Убирает актора из реестра', () => {
      const registry = new ActorRegistry();
      const actor = createActor();
      registry.register(actor);

      registry.remove(actor);

      expect(registry.getAll()).toStrictEqual([]);
    });

    it('Убирает только переданного актора', () => {
      const registry = new ActorRegistry();
      const actor = createActor();
      const otherActor = createActor();
      registry.register(actor);
      registry.register(otherActor);

      registry.remove(actor);

      expect(registry.getAll()).toStrictEqual([otherActor]);
    });

    it('Ничего не делает с незарегистрированным актором', () => {
      const registry = new ActorRegistry();
      const actor = createActor();

      registry.remove(actor);

      expect(registry.getAll()).toStrictEqual([]);
    });

    it('После remove актора можно зарегистрировать заново', () => {
      const registry = new ActorRegistry();
      const actor = createActor();
      registry.register(actor);
      registry.remove(actor);

      registry.register(actor);

      expect(registry.getAll()).toStrictEqual([actor]);
    });
  });
});
