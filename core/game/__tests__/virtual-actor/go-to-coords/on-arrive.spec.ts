import { ManualIntervalObservable } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { createActor, WALKING_SPEED } from '../../helpers';

describe('VirtualActor', () => {
  describe('#goToCoords', () => {
    describe('При входе актора в радиус', () => {
      it('Завершается', () => {
        const interval = new ManualIntervalObservable();
        const actor = createActor({ position: { x: 0, y: 0, z: 0 }, interval });
        const complete = vi.fn();
        actor.goToCoords({ x: 2, y: 0, z: 0 }, 1).subscribe({ complete });

        interval.tick(1000);

        expect(complete).toHaveBeenCalledOnce();
      });

      it('Больше не двигает актора', () => {
        const interval = new ManualIntervalObservable();
        const actor = createActor({ position: { x: 0, y: 0, z: 0 }, interval });
        actor.goToCoords({ x: 2, y: 0, z: 0 }, 1).subscribe();

        interval.tick(1000);
        interval.tick(1000);

        expect(actor.getPosition().x).toBeCloseTo(WALKING_SPEED);
      });

      it('Сбрасывает текущую команду', () => {
        const interval = new ManualIntervalObservable();
        const actor = createActor({ position: { x: 0, y: 0, z: 0 }, interval });
        actor.goToCoords({ x: 2, y: 0, z: 0 }, 1).subscribe();

        interval.tick(1000);

        expect(actor.currentCommand).toBeNull();
      });

      it('Если актор уже в радиусе, при подписке завершается', () => {
        const actor = createActor({ position: { x: 0, y: 0, z: 0 } });
        const complete = vi.fn();

        actor.goToCoords({ x: 1, y: 0, z: 0 }, 2).subscribe({ complete });

        expect(complete).toHaveBeenCalledOnce();
      });

      it('Не учитывает высоту при проверке радиуса', () => {
        const actor = createActor({ position: { x: 0, y: 0, z: 0 } });
        const complete = vi.fn();

        actor.goToCoords({ x: 1, y: 0, z: 50 }, 2).subscribe({ complete });

        expect(complete).toHaveBeenCalledOnce();
      });
    });
  });
});
