import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it } from 'vitest';

import { ActorRegistry } from '../../src';

describe('ActorRegistry', () => {
  describe('#register', () => {
    it('Добавляет актора в реестр', () => {
      const registry = new ActorRegistry();
      const actor = createActor();

      registry.register(actor);

      expect(registry.getAll()).toStrictEqual([actor]);
    });

    it('Не добавляет деспавненного актора', () => {
      const registry = new ActorRegistry();
      const actor = createActor();

      actor.despawn();
      registry.register(actor);

      expect(registry.getAll()).toStrictEqual([]);
    });

    it('Регистрирует актора только один раз', () => {
      const registry = new ActorRegistry();
      const actor = createActor();

      registry.register(actor);
      registry.register(actor);

      expect(registry.getAll()).toStrictEqual([actor]);
    });
  });
});
