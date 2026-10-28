import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { DespawnableActor } from '../../src';
import { createActor } from '../helpers';

describe('DespawnableActor', () => {
  describe('До деспавна', () => {
    it('currentCommand возвращает текущую команду обёрнутого актора', () => {
      const inner = createActor();
      const actor = new DespawnableActor(inner);

      actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();

      expect(actor.currentCommand).toBe(inner.currentCommand);
    });

    it('getPosition возвращает позицию обёрнутого актора', () => {
      const inner = createActor({ position: { x: 1, y: 2, z: 3 } });
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

    it('goToCoords ведёт обёрнутого актора к точке', () => {
      const timer = new ManualTimer();
      const inner = createActor({ position: { x: 0, y: 0, z: 0 }, timer });
      const actor = new DespawnableActor(inner);
      actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();

      timer.advance(1000);

      expect(inner.getPosition().x).toBeGreaterThan(0);
    });

    it('playAnimation проигрывает анимацию обёрнутым актором', () => {
      const inner = createActor();
      const actor = new DespawnableActor(inner);

      actor.playAnimation('pay').subscribe();

      expect(inner.currentCommand?.name).toBe('play-animation');
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
