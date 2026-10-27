import { AbortController } from '@peetland/events';
import { describe, expect, it, vi } from 'vitest';

import { createActor, WALKING_SPEED } from '../helpers';

describe('VirtualActor', () => {
  describe('#goToCoords', () => {
    describe('При движении к точке', () => {
      it('Раз в секунду сдвигает актора к точке со скоростью пешехода 5 км/ч', () => {
        vi.useFakeTimers();
        const actor = createActor({ x: 0, y: 0, z: 0 });

        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();
        vi.advanceTimersByTime(2000);

        expect(actor.getPosition().x).toBeCloseTo(WALKING_SPEED * 2);
      });

      it('Не сдвигает актора, пока не прошла секунда', () => {
        vi.useFakeTimers();
        const actor = createActor({ x: 0, y: 0, z: 0 });

        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();
        vi.advanceTimersByTime(999);

        expect(actor.getPosition()).toStrictEqual({ x: 0, y: 0, z: 0 });
      });

      it('Сообщает новую позицию актора после каждого шага', () => {
        vi.useFakeTimers();
        const actor = createActor({ x: 0, y: 0, z: 0 });
        const next = vi.fn();

        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe({ next });
        vi.advanceTimersByTime(1000);

        expect(next).toHaveBeenLastCalledWith(actor.getPosition());
      });

      it('Если наблюдатель отписался, больше не двигает актора', () => {
        vi.useFakeTimers();
        const actor = createActor({ x: 0, y: 0, z: 0 });
        const controller = new AbortController();

        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe({}, { signal: controller.signal });
        vi.advanceTimersByTime(1000);
        controller.abort();
        vi.advanceTimersByTime(1000);

        expect(actor.getPosition().x).toBeCloseTo(WALKING_SPEED);
      });

      it('Если наблюдатель отписался, сбрасывает текущую команду', () => {
        vi.useFakeTimers();
        const actor = createActor({ x: 0, y: 0, z: 0 });
        const controller = new AbortController();

        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe({}, { signal: controller.signal });
        controller.abort();

        expect(actor.currentCommand).toBeNull();
      });
    });
  });
});
