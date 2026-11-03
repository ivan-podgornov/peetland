import { AbortController } from '@peetland/events';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { createActor } from '../../dev';

describe('VirtualActor', () => {
  describe('#goToCoords', () => {
    describe('При движении к точке', () => {
      it('Сообщает новую позицию актора после каждого шага', () => {
        const timer = new ManualTimer();
        const actor = createActor({
          position: {
            x: 0,
            y: 0,
            z: 0,
          },
          timer,
        });
        const next = vi.fn();
        actor
          .goToCoords(
            {
              x: 10,
              y: 0,
              z: 0,
            },
            1
          )
          .execute()
          .subscribe({ next });

        timer.advance(1000);

        expect(next).toHaveBeenLastCalledWith(actor.getPosition());
      });

      it('Не проскакивает точку, если до неё ближе, чем шаг', () => {
        const timer = new ManualTimer();
        const actor = createActor({
          position: {
            x: 0,
            y: 0,
            z: 0,
          },
          timer,
        });
        actor
          .goToCoords(
            {
              x: 1,
              y: 0,
              z: 0,
            },
            0
          )
          .execute()
          .subscribe();

        timer.advance(1000);

        expect(actor.getPosition()).toStrictEqual({
          x: 1,
          y: 0,
          z: 0,
        });
      });

      it('Не завершается, пока актор не вошёл в радиус', () => {
        const timer = new ManualTimer();
        const actor = createActor({
          position: {
            x: 0,
            y: 0,
            z: 0,
          },
          timer,
        });
        const complete = vi.fn();
        actor
          .goToCoords(
            {
              x: 3,
              y: 0,
              z: 0,
            },
            1
          )
          .execute()
          .subscribe({ complete });

        timer.advance(1000);

        expect(complete).not.toHaveBeenCalled();
      });

      it('Если наблюдатель отписался, больше не двигает актора', () => {
        const timer = new ManualTimer();
        const actor = createActor({
          position: {
            x: 0,
            y: 0,
            z: 0,
          },
          timer,
        });
        const controller = new AbortController();
        actor
          .goToCoords(
            {
              x: 10,
              y: 0,
              z: 0,
            },
            1
          )
          .execute()
          .subscribe({}, { signal: controller.signal });

        controller.abort();
        timer.advance(1000);

        expect(actor.getPosition()).toStrictEqual({
          x: 0,
          y: 0,
          z: 0,
        });
      });
    });
  });
});
