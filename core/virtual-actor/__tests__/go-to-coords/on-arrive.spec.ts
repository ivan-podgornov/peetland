import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { createActor, WALKING_SPEED } from '../helpers';

describe('VirtualActor', () => {
  describe('#goToCoords', () => {
    describe('При входе актора в радиус', () => {
      it('Завершается', () => {
        const timer = new ManualTimer();
        const actor = createActor({ position: { x: 0, y: 0, z: 0 }, timer });
        const complete = vi.fn();
        actor.goToCoords({ x: 2, y: 0, z: 0 }, 1).execute().subscribe({ complete });

        timer.advance(1000);

        expect(complete).toHaveBeenCalledOnce();
      });

      it('Больше не двигает актора', () => {
        const timer = new ManualTimer();
        const actor = createActor({ position: { x: 0, y: 0, z: 0 }, timer });
        actor.goToCoords({ x: 2, y: 0, z: 0 }, 1).execute().subscribe();

        timer.advance(1000);
        timer.advance(1000);

        expect(actor.getPosition().x).toBeCloseTo(WALKING_SPEED);
      });

      it('Если актор уже в радиусе, при подписке завершается', () => {
        const actor = createActor({ position: { x: 0, y: 0, z: 0 } });
        const complete = vi.fn();

        actor.goToCoords({ x: 1, y: 0, z: 0 }, 2).execute().subscribe({ complete });

        expect(complete).toHaveBeenCalledOnce();
      });

      it('Не учитывает высоту при проверке радиуса', () => {
        const actor = createActor({ position: { x: 0, y: 0, z: 0 } });
        const complete = vi.fn();

        actor.goToCoords({ x: 1, y: 0, z: 50 }, 2).execute().subscribe({ complete });

        expect(complete).toHaveBeenCalledOnce();
      });
    });
  });
});
