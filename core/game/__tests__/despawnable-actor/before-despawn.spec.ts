import { describe, expect, it, vi } from 'vitest';

import { DespawnableActor } from '../../src';
import { createActor } from '../helpers';

describe('DespawnableActor', () => {
  describe('До деспавна', () => {
    it('getPosition возвращает позицию обёрнутого актора', () => {
      const inner = createActor();
      inner.setPosition({ x: 1, y: 2, z: 3 });
      const actor = new DespawnableActor(inner);

      const position = actor.getPosition();

      expect(position).toStrictEqual({ x: 1, y: 2, z: 3 });
    });

    it('setPosition переносит обёрнутого актора', () => {
      const inner = createActor();
      const actor = new DespawnableActor(inner);

      actor.setPosition({ x: 1, y: 2, z: 3 });

      expect(inner.getPosition()).toStrictEqual({ x: 1, y: 2, z: 3 });
    });

    it('goToCoords передаёт обёрнутому актору точку и радиус', () => {
      const inner = createActor();
      const goToCoords = vi.spyOn(inner, 'goToCoords');
      const actor = new DespawnableActor(inner);

      actor.goToCoords({ x: 10, y: 0, z: 0 }, 1);

      expect(goToCoords).toHaveBeenCalledExactlyOnceWith({ x: 10, y: 0, z: 0 }, 1);
    });

    it('goToCoords возвращает команду обёрнутого актора', () => {
      const inner = createActor();
      const command = inner.goToCoords();
      vi.spyOn(inner, 'goToCoords').mockReturnValue(command);
      const actor = new DespawnableActor(inner);

      const result = actor.goToCoords({ x: 10, y: 0, z: 0 }, 1);

      expect(result).toBe(command);
    });

    it('playAnimation передаёт обёрнутому актору анимацию', () => {
      const inner = createActor();
      const playAnimation = vi.spyOn(inner, 'playAnimation');
      const actor = new DespawnableActor(inner);

      actor.playAnimation('pay');

      expect(playAnimation).toHaveBeenCalledExactlyOnceWith('pay', undefined);
    });

    it('playAnimation возвращает команду обёрнутого актора', () => {
      const inner = createActor();
      const command = inner.playAnimation();
      vi.spyOn(inner, 'playAnimation').mockReturnValue(command);
      const actor = new DespawnableActor(inner);

      const result = actor.playAnimation('pay');

      expect(result).toBe(command);
    });

    it('playAnimation передаёт обёрнутому актору время проигрывания', () => {
      const inner = createActor();
      const playAnimation = vi.spyOn(inner, 'playAnimation');
      const actor = new DespawnableActor(inner);

      actor.playAnimation('trash-search', 5000);

      expect(playAnimation).toHaveBeenCalledExactlyOnceWith('trash-search', 5000);
    });

    it('despawn деспавнит обёрнутого актора', () => {
      const inner = createActor();
      const despawn = vi.spyOn(inner, 'despawn');
      const actor = new DespawnableActor(inner);

      actor.despawn();

      expect(despawn).toHaveBeenCalledOnce();
    });
  });
});
