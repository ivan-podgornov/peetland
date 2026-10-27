import { AbortController } from '@peetland/events';
import { ManualIntervalObservable } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { createActor, WALKING_SPEED } from '../../helpers';

describe('VirtualActor', () => {
  describe('#goToCoords', () => {
    describe('При движении к точке', () => {
      it('На каждое значение интервала сдвигает актора к точке со скоростью пешехода 5 км/ч', () => {
        const interval = new ManualIntervalObservable();
        const actor = createActor({ position: { x: 0, y: 0, z: 0 }, interval });
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();

        interval.tick(1000);
        interval.tick(1000);

        expect(actor.getPosition().x).toBeCloseTo(WALKING_SPEED * 2);
      });

      it('Сдвигает актора на расстояние, которое он проходит за время из значения интервала', () => {
        const interval = new ManualIntervalObservable();
        const actor = createActor({ position: { x: 0, y: 0, z: 0 }, interval });
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe();

        interval.tick(500);

        expect(actor.getPosition().x).toBeCloseTo(WALKING_SPEED / 2);
      });

      it('Сообщает новую позицию актора после каждого шага', () => {
        const interval = new ManualIntervalObservable();
        const actor = createActor({ position: { x: 0, y: 0, z: 0 }, interval });
        const next = vi.fn();
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe({ next });

        interval.tick(1000);

        expect(next).toHaveBeenLastCalledWith(actor.getPosition());
      });

      it('Не проскакивает точку, если до неё ближе, чем шаг', () => {
        const interval = new ManualIntervalObservable();
        const actor = createActor({ position: { x: 0, y: 0, z: 0 }, interval });
        actor.goToCoords({ x: 1, y: 0, z: 0 }, 0).subscribe();

        interval.tick(1000);

        expect(actor.getPosition()).toStrictEqual({ x: 1, y: 0, z: 0 });
      });

      it('Не завершается, пока актор не вошёл в радиус', () => {
        const interval = new ManualIntervalObservable();
        const actor = createActor({ position: { x: 0, y: 0, z: 0 }, interval });
        const complete = vi.fn();
        actor.goToCoords({ x: 3, y: 0, z: 0 }, 1).subscribe({ complete });

        interval.tick(1000);

        expect(complete).not.toHaveBeenCalled();
      });

      it('Если наблюдатель отписался, больше не двигает актора', () => {
        const interval = new ManualIntervalObservable();
        const actor = createActor({ position: { x: 0, y: 0, z: 0 }, interval });
        const controller = new AbortController();
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe({}, { signal: controller.signal });

        controller.abort();
        interval.tick(1000);

        expect(actor.getPosition()).toStrictEqual({ x: 0, y: 0, z: 0 });
      });

      it('Если наблюдатель отписался, сбрасывает текущую команду', () => {
        const actor = createActor();
        const controller = new AbortController();
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).subscribe({}, { signal: controller.signal });

        controller.abort();

        expect(actor.currentCommand).toBeNull();
      });
    });
  });
});
