import { AbortController, Observable } from '@peetland/events';
import type { IAbortSignal } from '@peetland/events';
import type { Vector3 } from '@peetland/geometry';
import { describe, expect, it } from 'vitest';

import type { IActor, IActorCommand } from '../src';
import { ActorRegistry } from '../src';

/** Актор, который умеет только деспавниться: реестру больше ничего и не нужно */
class TestActor implements IActor {
  private readonly despawnController = new AbortController();

  get signal(): IAbortSignal {
    return this.despawnController.signal;
  }

  getPosition(): Vector3 {
    return {
      x: 0,
      y: 0,
      z: 0,
    };
  }

  getAngle(): number {
    return 0;
  }

  setPosition(): void {}

  setAngle(): void {}

  goToCoords(): IActorCommand<Vector3> {
    return createIdleCommand();
  }

  achieveAngle(): IActorCommand<number> {
    return createIdleCommand();
  }

  playAnimation(): IActorCommand<void> {
    return createIdleCommand();
  }

  despawn(): void {
    this.despawnController.abort(new Error('Актор деспавнен'));
  }
}

/** Создаёт команду, которая ничего не делает и не завершается */
function createIdleCommand<TValue>(): IActorCommand<TValue> {
  return {
    name: 'idle',
    execute: () => new Observable(() => {}),
    cancel: () => {},
  };
}

describe('ActorRegistry', () => {
  describe('#register', () => {
    it('Добавляет заспавненного актора в реестр', () => {
      const registry = new ActorRegistry();
      const actor = new TestActor();

      registry.register(actor);

      expect(registry.getAll()).toStrictEqual([actor]);
    });

    it('Не добавляет деспавненного актора', () => {
      const registry = new ActorRegistry();
      const actor = new TestActor();

      actor.despawn();
      registry.register(actor);

      expect(registry.getAll()).toStrictEqual([]);
    });

    it('Повторная регистрация не дублирует актора', () => {
      const registry = new ActorRegistry();
      const actor = new TestActor();

      registry.register(actor);
      registry.register(actor);

      expect(registry.getAll()).toStrictEqual([actor]);
    });
  });

  describe('#remove', () => {
    it('Убирает актора из реестра', () => {
      const registry = new ActorRegistry();
      const actor = new TestActor();
      registry.register(actor);

      registry.remove(actor);

      expect(registry.getAll()).toStrictEqual([]);
    });

    it('Убирает только переданного актора', () => {
      const registry = new ActorRegistry();
      const actor = new TestActor();
      const otherActor = new TestActor();
      registry.register(actor);
      registry.register(otherActor);

      registry.remove(actor);

      expect(registry.getAll()).toStrictEqual([otherActor]);
    });

    it('Ничего не делает с незарегистрированным актором', () => {
      const registry = new ActorRegistry();
      const actor = new TestActor();

      registry.remove(actor);

      expect(registry.getAll()).toStrictEqual([]);
    });

    it('Убирает актора из реестра без следа: после remove актора можно зарегистрировать заново', () => {
      const registry = new ActorRegistry();
      const actor = new TestActor();
      registry.register(actor);
      registry.remove(actor);

      registry.register(actor);

      expect(registry.getAll()).toStrictEqual([actor]);
    });
  });

  describe('#getAll', () => {
    it('Возвращает всех зарегистрированных акторов', () => {
      const registry = new ActorRegistry();
      const actor = new TestActor();
      const otherActor = new TestActor();
      registry.register(actor);
      registry.register(otherActor);

      const actors = registry.getAll();

      expect(actors).toHaveLength(2);
      expect(actors).toContain(actor);
      expect(actors).toContain(otherActor);
    });

    it('Возвращает копию: изменение результата не меняет реестр', () => {
      const registry = new ActorRegistry();
      const actor = new TestActor();
      registry.register(actor);

      registry.getAll().pop();

      expect(registry.getAll()).toStrictEqual([actor]);
    });
  });

  describe('Деспавн зарегистрированного актора', () => {
    it('Убирает актора из реестра: в реестре не бывает призраков', () => {
      const registry = new ActorRegistry();
      const actor = new TestActor();
      registry.register(actor);

      actor.despawn();

      expect(registry.getAll()).toStrictEqual([]);
    });

    it('Убирает только деспавненного актора', () => {
      const registry = new ActorRegistry();
      const actor = new TestActor();
      const otherActor = new TestActor();
      registry.register(actor);
      registry.register(otherActor);

      actor.despawn();

      expect(registry.getAll()).toStrictEqual([otherActor]);
    });
  });
});
