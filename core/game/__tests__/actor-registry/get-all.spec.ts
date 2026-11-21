import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { ActorRegistry } from '../../src';

describe('ActorRegistry', () => {
  describe('#getAll', () => {
    it('Возвращает всех зарегистрированных акторов', () => {
      const registry = new ActorRegistry();
      const actor = createActor();
      const otherActor = createActor();
      registry.register(actor);
      registry.register(otherActor);

      expect(registry.getAll()).toStrictEqual([actor, otherActor]);
    });

    it('Возвращает копию: изменение результата не влияет на реестр', () => {
      const registry = new ActorRegistry();
      const actor = createActor();
      registry.register(actor);

      registry.getAll().pop();

      expect(registry.getAll()).toStrictEqual([actor]);
    });
  });
});
