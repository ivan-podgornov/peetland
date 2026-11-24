import { createAnimationManager } from '@peetland/animation-manager/dev';
import { ActorRegistry } from '@peetland/game';
import { Geometry } from '@peetland/geometry';
import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { VIRTUAL_ANIMATIONS, VirtualActorFactory } from '../src';

describe('VirtualActorFactory', () => {
  describe('#create', () => {
    it('Создаёт актора на переданной позиции', () => {
      const factory = new VirtualActorFactory({
        actorRegistry: new ActorRegistry(),
        animations: createAnimationManager(VIRTUAL_ANIMATIONS),
        geometry: new Geometry(),
        timer: new ManualTimer(),
      });

      const actor = factory.create({
        modelId: 230,
        position: Geometry.vector3(1, 2, 3),
        angle: 0,
      });

      expect(actor.getPosition()).toStrictEqual({
        x: 1,
        y: 2,
        z: 3,
      });
    });

    it('Создаёт актора, повёрнутого на переданный угол', () => {
      const factory = new VirtualActorFactory({
        actorRegistry: new ActorRegistry(),
        animations: createAnimationManager(VIRTUAL_ANIMATIONS),
        geometry: new Geometry(),
        timer: new ManualTimer(),
      });

      const actor = factory.create({
        modelId: 230,
        position: Geometry.vector3(0, 0, 0),
        angle: 180,
      });

      expect(actor.getAngle()).toBe(180);
    });

    it('Создаёт актора, который двигается по времени переданного таймера', () => {
      const timer = new ManualTimer();
      const factory = new VirtualActorFactory({
        actorRegistry: new ActorRegistry(),
        animations: createAnimationManager(VIRTUAL_ANIMATIONS),
        geometry: new Geometry(),
        timer,
      });
      const actor = factory.create({
        modelId: 230,
        position: Geometry.vector3(0, 0, 0),
        angle: 0,
      });
      actor
        .goToCoords(Geometry.vector3(10, 0, 0), 1)
        .execute()
        .subscribe();

      timer.advance(1000);

      expect(actor.getPosition().x).toBeGreaterThan(0);
    });

    it('Создаёт актора, анимации которого длятся по таблице переданного менеджера анимаций', () => {
      const timer = new ManualTimer();
      const factory = new VirtualActorFactory({
        actorRegistry: new ActorRegistry(),
        animations: createAnimationManager({
          ...VIRTUAL_ANIMATIONS,
          pay: { duration: 3000 },
        }),
        geometry: new Geometry(),
        timer,
      });
      const actor = factory.create({
        modelId: 230,
        position: Geometry.vector3(0, 0, 0),
        angle: 0,
      });
      const complete = vi.fn();
      actor.playAnimation('pay').execute().subscribe({ complete });

      timer.advance(3000);

      expect(complete).toHaveBeenCalledOnce();
    });

    it('Регистрирует созданного актора в реестре', () => {
      const actorRegistry = new ActorRegistry();
      const factory = new VirtualActorFactory({
        actorRegistry,
        animations: createAnimationManager(VIRTUAL_ANIMATIONS),
        geometry: new Geometry(),
        timer: new ManualTimer(),
      });
      const actor = factory.create({
        modelId: 230,
        position: Geometry.vector3(0, 0, 0),
        angle: 0,
      });

      expect(actorRegistry.getAll()).toStrictEqual([actor]);
    });

    it('Убирает актора из реестра при его деспавне', () => {
      const actorRegistry = new ActorRegistry();
      const factory = new VirtualActorFactory({
        actorRegistry,
        animations: createAnimationManager(VIRTUAL_ANIMATIONS),
        geometry: new Geometry(),
        timer: new ManualTimer(),
      });
      const actor = factory.create({
        modelId: 230,
        position: Geometry.vector3(0, 0, 0),
        angle: 0,
      });

      actor.despawn();

      expect(actorRegistry.getAll()).toStrictEqual([]);
    });
  });
});
