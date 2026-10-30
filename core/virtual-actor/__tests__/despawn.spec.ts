import { ManualTimer } from '@peetland/timings';
import { describe, expect, it, vi } from 'vitest';

import { createActor } from '../dev';

describe('VirtualActor', () => {
  describe('#signal', () => {
    it('Пока актор заспавнен, не прерван', () => {
      const actor = createActor();

      expect(actor.signal.aborted).toBe(false);
    });
  });

  describe('#despawn', () => {
    it('Прерывает сигнал актора', () => {
      const actor = createActor();

      actor.despawn();

      expect(actor.signal.aborted).toBe(true);
    });

    it('Прерывает сигнал с ошибкой', () => {
      const actor = createActor();

      actor.despawn();

      expect(actor.signal.reason).toBeInstanceOf(Error);
    });

    it('Повторный деспавн не меняет причину', () => {
      const actor = createActor();
      actor.despawn();
      const { reason } = actor.signal;

      actor.despawn();

      expect(actor.signal.reason).toBe(reason);
    });

    it('Команда, на которую подписались после деспавна, завершается ошибкой', () => {
      const actor = createActor();
      const error = vi.fn();
      actor.despawn();

      actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).execute().subscribe({ error });

      expect(error).toHaveBeenCalledExactlyOnceWith(actor.signal.reason);
    });

    describe('При движении к определённым координатам', () => {
      it('Завершает движение ошибкой', () => {
        const actor = createActor();
        const error = vi.fn();
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).execute().subscribe({ error });

        actor.despawn();

        expect(error).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
      });

      it('Останавливает движение', () => {
        const timer = new ManualTimer();
        const actor = createActor({ timer });
        actor.goToCoords({ x: 10, y: 0, z: 0 }, 1).execute().subscribe();

        actor.despawn();
        timer.advance(1000);

        expect(actor.getPosition()).toStrictEqual({ x: 0, y: 0, z: 0 });
      });
    });

    describe('При проигрывании анимации', () => {
      it('Завершает анимацию ошибкой', () => {
        const actor = createActor();
        const error = vi.fn();
        actor.playAnimation('pay').execute().subscribe({ error });

        actor.despawn();

        expect(error).toHaveBeenCalledExactlyOnceWith(expect.any(Error));
      });
    });

    it('Не влияет на завершённое движение', () => {
      const actor = createActor({ position: { x: 0, y: 0, z: 0 } });
      const error = vi.fn();
      actor.goToCoords({ x: 1, y: 0, z: 0 }, 2).execute().subscribe({ error });

      actor.despawn();

      expect(error).not.toHaveBeenCalled();
    });
  });
});
