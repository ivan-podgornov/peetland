import { AbortController } from '@peetland/events';
import { describe, expect, it, vi } from 'vitest';

import { createActor, WALKING_SPEED } from './helpers';

describe('VirtualActor', () => {
  describe('#goToCoords', () => {
    it('При подписке сообщает текущую позицию актора', () => {
      vi.useFakeTimers();
      const actor = createActor({ x: 0, y: 0, z: 0 });
      const next = vi.fn();

      actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe({ next });

      expect(next).toHaveBeenCalledExactlyOnceWith({ x: 0, y: 0, z: 0 });
    });

    it('Не двигает актора до подписки', () => {
      vi.useFakeTimers();
      const actor = createActor({ x: 0, y: 0, z: 0 });

      actor.goToCoords({ x: 10, y: 0, z: 0 }, 1);
      vi.advanceTimersByTime(1000);

      expect(actor.getPosition()).toStrictEqual({ x: 0, y: 0, z: 0 });
    });

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

    it('Если актор вошёл в радиус, завершается', () => {
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

    it('После входа в радиус больше не двигает актора', () => {
      vi.useFakeTimers();
      const actor = createActor({ x: 0, y: 0, z: 0 });

      actor.goToCoords({ x: 2, y: 0, z: 0 }, 1).subscribe();
      vi.advanceTimersByTime(5000);

      expect(actor.getPosition().x).toBeCloseTo(WALKING_SPEED);
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

    it('Если актор деспавнен, выбрасывает ошибку', () => {
      vi.useFakeTimers();
      const actor = createActor();
      actor.despawn();

      expect(() => actor.goToCoords({ x: 10, y: 0, z: 0 }, 1)).toThrow(Error);
    });

    describe('Если актор уже идёт к другой точке', () => {
      it('Завершает предыдущее движение ошибкой', () => {
        vi.useFakeTimers();
        const actor = createActor({ x: 0, y: 0, z: 0 });
        const error = vi.fn();
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe({ error });

        actor.goToCoords({ x: -10, y: 0, z: 0 }, 1).subscribe();

        expect(error).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
      });

      it('Двигает актора только к новой точке', () => {
        vi.useFakeTimers();
        const actor = createActor({ x: 0, y: 0, z: 0 });
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();

        actor.goToCoords({ x: 0, y: 10, z: 0 }, 1).subscribe();
        vi.advanceTimersByTime(1000);

        expect(actor.getPosition()).toStrictEqual({ x: 0, y: WALKING_SPEED, z: 0 });
      });
    });
  });
});
