import { ManualTimer } from '@peetland/timings';
import { describe, expect, it } from 'vitest';

import { createActor, WALKING_SPEED } from '../../dev';

describe('VirtualActor', () => {
  describe('#goToCoords', () => {
    describe('При движении к точке', () => {
      it('Раз в секунду сдвигает актора к точке со скоростью пешехода 5 км/ч', () => {
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
              x: 10,
              y: 0,
              z: 0,
            },
            1
          )
          .execute()
          .subscribe();

        timer.advance(1000);
        timer.advance(1000);

        expect(actor.getPosition().x).toBeCloseTo(WALKING_SPEED * 2);
      });

      it('Не сдвигает актора, пока не прошла секунда', () => {
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
              x: 10,
              y: 0,
              z: 0,
            },
            1
          )
          .execute()
          .subscribe();

        timer.advance(999);

        expect(actor.getPosition()).toStrictEqual({
          x: 0,
          y: 0,
          z: 0,
        });
      });

      it('Отсчитывает секунду от подписки', () => {
        const timer = new ManualTimer();
        const actor = createActor({
          position: {
            x: 0,
            y: 0,
            z: 0,
          },
          timer,
        });
        timer.advance(500);
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
          .subscribe();

        timer.advance(500);

        expect(actor.getPosition()).toStrictEqual({
          x: 0,
          y: 0,
          z: 0,
        });
      });
    });
  });
});
