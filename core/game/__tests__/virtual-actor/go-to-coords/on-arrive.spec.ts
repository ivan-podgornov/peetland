import { describe, expect, it, vi } from 'vitest';

import { createActor, WALKING_SPEED } from '../helpers';

describe('VirtualActor', () => {
  describe('#goToCoords', () => {
    describe('При входе актора в радиус', () => {
      it('Завершается', () => {
        vi.useFakeTimers();
        const actor = createActor({ x: 0, y: 0, z: 0 });
        const complete = vi.fn();

        actor.goToCoords({ x: 2, y: 0, z: 0 }, 1).subscribe({ complete });
        vi.advanceTimersByTime(1000);

        expect(complete).toHaveBeenCalledOnce();
      });

      it('Не завершается, пока актор не вошёл в радиус', () => {
        vi.useFakeTimers();
        const actor = createActor({ x: 0, y: 0, z: 0 });
        const complete = vi.fn();

        actor.goToCoords({ x: 3, y: 0, z: 0 }, 1).subscribe({ complete });
        vi.advanceTimersByTime(1000);

        expect(complete).not.toHaveBeenCalled();
      });

      it('Больше не двигает актора', () => {
        vi.useFakeTimers();
        const actor = createActor({ x: 0, y: 0, z: 0 });

        actor.goToCoords({ x: 2, y: 0, z: 0 }, 1).subscribe();
        vi.advanceTimersByTime(5000);

        expect(actor.getPosition().x).toBeCloseTo(WALKING_SPEED);
      });

      it('Сбрасывает текущую команду', () => {
        vi.useFakeTimers();
        const actor = createActor({ x: 0, y: 0, z: 0 });

        actor.goToCoords({ x: 2, y: 0, z: 0 }, 1).subscribe();
        vi.advanceTimersByTime(1000);

        expect(actor.currentCommand).toBeNull();
      });

      it('Не проскакивает точку, если до неё ближе, чем шаг', () => {
        vi.useFakeTimers();
        const actor = createActor({ x: 0, y: 0, z: 0 });

        actor.goToCoords({ x: 1, y: 0, z: 0 }, 0).subscribe();
        vi.advanceTimersByTime(1000);

        expect(actor.getPosition()).toStrictEqual({ x: 1, y: 0, z: 0 });
      });

      it('Если актор уже в радиусе, при подписке завершается', () => {
        vi.useFakeTimers();
        const actor = createActor({ x: 0, y: 0, z: 0 });
        const complete = vi.fn();

        actor.goToCoords({ x: 1, y: 0, z: 0 }, 2).subscribe({ complete });

        expect(complete).toHaveBeenCalledOnce();
      });

      it('Не учитывает высоту при проверке радиуса', () => {
        vi.useFakeTimers();
        const actor = createActor({ x: 0, y: 0, z: 0 });
        const complete = vi.fn();

        actor.goToCoords({ x: 1, y: 0, z: 50 }, 2).subscribe({ complete });

        expect(complete).toHaveBeenCalledOnce();
      });
    });
  });
});
