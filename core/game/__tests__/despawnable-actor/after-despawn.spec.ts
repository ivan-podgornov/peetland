import { describe, expect, it, vi } from 'vitest';

import { DespawnableActor } from '../../src';
import { createActor, TestCommand } from '../helpers';

describe('DespawnableActor', () => {
  describe('После деспавна', () => {
    it('currentCommand возвращает null', () => {
      const inner = createActor();
      inner.currentCommand = new TestCommand();
      const actor = new DespawnableActor(inner);

      actor.despawn();

      expect(actor.currentCommand).toBeNull();
    });

    it('getPosition выбрасывает ошибку', () => {
      const actor = new DespawnableActor(createActor());
      actor.despawn();

      expect(() => actor.getPosition()).toThrow(Error);
    });

    it('setPosition выбрасывает ошибку', () => {
      const actor = new DespawnableActor(createActor());
      actor.despawn();

      expect(() => actor.setPosition({ x: 1, y: 2, z: 3 })).toThrow(Error);
    });

    it('goToCoords выбрасывает ошибку', () => {
      const actor = new DespawnableActor(createActor());
      actor.despawn();

      expect(() => actor.goToCoords({ x: 1, y: 2, z: 3 }, 5)).toThrow(Error);
    });

    it('playAnimation выбрасывает ошибку', () => {
      const actor = new DespawnableActor(createActor());
      actor.despawn();

      expect(() => actor.playAnimation('pay')).toThrow(Error);
    });

    it('despawn выбрасывает ошибку', () => {
      const actor = new DespawnableActor(createActor());
      actor.despawn();

      expect(() => actor.despawn()).toThrow(Error);
    });

    it('Больше не вызывает обёрнутого актора', () => {
      const inner = createActor();
      const getPosition = vi.spyOn(inner, 'getPosition');
      const actor = new DespawnableActor(inner);
      actor.despawn();

      expect(() => actor.getPosition()).toThrow(Error);
      expect(getPosition).not.toHaveBeenCalled();
    });

    it('Не деспавнит обёрнутого актора повторно', () => {
      const inner = createActor();
      const despawn = vi.spyOn(inner, 'despawn');
      const actor = new DespawnableActor(inner);
      actor.despawn();

      expect(() => actor.despawn()).toThrow(Error);
      expect(despawn).toHaveBeenCalledOnce();
    });
  });
});
