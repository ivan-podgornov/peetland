import { describe, expect, it, vi } from 'vitest';

import { DespawnableActor } from '../../src';
import type { IActorCommand } from '../../src';

import { createActorMock } from './helpers';

describe('DespawnableActor', () => {
  describe('После деспавна', () => {
    it('currentCommand возвращает null', () => {
      const command: IActorCommand = { start: vi.fn(), stop: vi.fn(), cancel: vi.fn() };
      const actor = new DespawnableActor({ ...createActorMock(), currentCommand: command });
      actor.despawn();

      expect(actor.currentCommand).toBeNull();
    });

    it('getPosition выбрасывает ошибку', () => {
      const actor = new DespawnableActor(createActorMock());
      actor.despawn();

      expect(() => actor.getPosition()).toThrow(Error);
    });

    it('setPosition выбрасывает ошибку', () => {
      const actor = new DespawnableActor(createActorMock());
      actor.despawn();

      expect(() => actor.setPosition({ x: 1, y: 2, z: 3 })).toThrow(Error);
    });

    it('goToCoords выбрасывает ошибку', () => {
      const actor = new DespawnableActor(createActorMock());
      actor.despawn();

      expect(() => actor.goToCoords({ x: 1, y: 2, z: 3 }, 5)).toThrow(Error);
    });

    it('despawn выбрасывает ошибку', () => {
      const actor = new DespawnableActor(createActorMock());
      actor.despawn();

      expect(() => actor.despawn()).toThrow(Error);
    });

    it('Больше не вызывает обёрнутого актора', () => {
      const inner = createActorMock();
      const actor = new DespawnableActor(inner);
      actor.despawn();

      expect(() => actor.getPosition()).toThrow(Error);
      expect(inner.getPosition).not.toHaveBeenCalled();
    });

    it('Не вызывает despawn обёрнутого актора повторно', () => {
      const inner = createActorMock();
      const actor = new DespawnableActor(inner);
      actor.despawn();

      expect(() => actor.despawn()).toThrow(Error);
      expect(inner.despawn).toHaveBeenCalledOnce();
    });
  });
});
