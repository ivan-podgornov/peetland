import { describe, expect, it, vi } from 'vitest';

import { createActor } from './create-actor';

describe('VirtualActor', () => {
  describe('#despawn', () => {
    it('Завершает текущее движение актора ошибкой', () => {
      vi.useFakeTimers();
      const actor = createActor();
      const error = vi.fn();
      actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe({ error });

      actor.despawn();

      expect(error).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
    });

    it('Останавливает текущее движение актора', () => {
      vi.useFakeTimers();
      const actor = createActor();
      const next = vi.fn();
      actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe({ next });
      next.mockClear();

      actor.despawn();
      vi.advanceTimersByTime(1000);

      expect(next).not.toHaveBeenCalled();
    });

    it('Не влияет на завершённое движение', () => {
      vi.useFakeTimers();
      const actor = createActor({ position: { x: 0, y: 0, z: 0 } });
      const error = vi.fn();
      actor.goToCoords({ x: 1, y: 0, z: 0 }, 2).subscribe({ error });

      actor.despawn();

      expect(error).not.toHaveBeenCalled();
    });

    it('Если актор уже деспавнен, выбрасывает ошибку', () => {
      const actor = createActor();
      actor.despawn();

      expect(() => actor.despawn()).toThrow(Error);
    });
  });
});
