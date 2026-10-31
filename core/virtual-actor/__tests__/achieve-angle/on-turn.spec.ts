import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { createActor } from '../../dev';

describe('VirtualActor', () => {
  describe('#achieveAngle', () => {
    describe('До того как прошла секунда', () => {
      it('Не меняет угол актора', () => {
        const timer = new ManualTimer();
        const actor = createActor({ angle: 0, timer });
        actor.achieveAngle(90, 15).execute().subscribe();

        timer.advance(999);

        expect(actor.getAngle()).toBe(0);
      });

      it('Не завершает команду', () => {
        const timer = new ManualTimer();
        const actor = createActor({ angle: 0, timer });
        const complete = vi.fn();
        actor.achieveAngle(90, 15).execute().subscribe({ complete });

        timer.advance(999);

        expect(complete).not.toHaveBeenCalled();
      });

      it('Если команду прервали, угол актора не меняется', () => {
        const timer = new ManualTimer();
        const actor = createActor({ angle: 0, timer });
        const command = actor.achieveAngle(90, 15);
        command.execute().subscribe({ error: () => {} });

        timer.advance(500);
        command.cancel(new Error('Прервано'));
        timer.advance(1000);

        expect(actor.getAngle()).toBe(0);
      });
    });
  });
});
