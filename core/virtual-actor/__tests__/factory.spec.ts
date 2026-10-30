import { Geometry } from '@peetland/geometry';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { VIRTUAL_ANIMATIONS, VirtualActorFactory } from '../src';

import { createAnimationManager } from './helpers';

describe('VirtualActorFactory', () => {
  describe('#create', () => {
    it('Создаёт актора на переданной позиции', () => {
      const factory = new VirtualActorFactory({
        animations: createAnimationManager(),
        geometry: new Geometry(),
        timer: new ManualTimer(),
      });

      const actor = factory.create({ modelId: 230, position: { x: 1, y: 2, z: 3 } });

      expect(actor.getPosition()).toStrictEqual({ x: 1, y: 2, z: 3 });
    });

    it('Создаёт актора, который двигается по времени переданного таймера', () => {
      const timer = new ManualTimer();
      const factory = new VirtualActorFactory({
        animations: createAnimationManager(),
        geometry: new Geometry(),
        timer,
      });
      const actor = factory.create({ modelId: 230, position: { x: 0, y: 0, z: 0 } });
      actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).execute().subscribe();

      timer.advance(1000);

      expect(actor.getPosition().x).toBeGreaterThan(0);
    });

    it('Создаёт актора, анимации которого длятся по таблице переданного менеджера анимаций', () => {
      const timer = new ManualTimer();
      const factory = new VirtualActorFactory({
        animations: createAnimationManager({ ...VIRTUAL_ANIMATIONS, pay: { duration: 3000 } }),
        geometry: new Geometry(),
        timer,
      });
      const actor = factory.create({ modelId: 230, position: { x: 0, y: 0, z: 0 } });
      const complete = vi.fn();
      actor.playAnimation('pay').execute().subscribe({ complete });

      timer.advance(3000);

      expect(complete).toHaveBeenCalledOnce();
    });
  });
});
