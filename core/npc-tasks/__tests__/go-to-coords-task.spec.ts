import { createNpcContext, NpcStateBuilder } from '@peetland/npc/dev';
import { ManualTimer } from '@peetland/timings';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { GoToCoordsTask } from '../src/go-to-coords-task';

describe('GoToCoordsTask', () => {
  describe('#start', () => {
    it('Отдаёт актору команду идти к координатам', () => {
      const actor = createActor();
      const goToCoords = vi.spyOn(actor, 'goToCoords');
      const task = new GoToCoordsTask({
        coords: {
          x: 10,
          y: 0,
          z: 0,
        },
        completeRadius: 1,
      });

      task.start(new NpcStateBuilder().build(), createNpcContext(actor));

      expect(goToCoords).toHaveBeenCalledExactlyOnceWith(
        {
          x: 10,
          y: 0,
          z: 0,
        },
        1
      );
    });
  });

  describe('#update', () => {
    it("Возвращает 'success', когда актор дошёл", () => {
      const timer = new ManualTimer();
      const context = createNpcContext(createActor({ timer }));
      const task = new GoToCoordsTask({
        coords: {
          x: 2,
          y: 0,
          z: 0,
        },
        completeRadius: 1,
      });
      task.start(new NpcStateBuilder().build(), context);

      timer.advance(1000);
      const result = task.update(new NpcStateBuilder().build(), context);

      expect(result).toBe('success');
    });
  });

  describe('#stop', () => {
    it('Останавливает актора', () => {
      const timer = new ManualTimer();
      const actor = createActor({ timer });
      const context = createNpcContext(actor);
      const task = new GoToCoordsTask({
        coords: {
          x: 100,
          y: 0,
          z: 0,
        },
        completeRadius: 1,
      });
      task.start(new NpcStateBuilder().build(), context);

      task.stop(context);
      timer.advance(1000);

      expect(actor.getPosition()).toEqual({
        x: 0,
        y: 0,
        z: 0,
      });
    });
  });

  describe('#applyEffects', () => {
    it('Не меняет то, что NPC знает о мире', () => {
      const task = new GoToCoordsTask({
        coords: {
          x: 10,
          y: 5,
          z: 1,
        },
        completeRadius: 1,
      });

      const state = task.applyEffects(
        new NpcStateBuilder()
          .withTime({
            day: 1,
            hours: 20,
            minutes: 0,
          })
          .build()
      );

      expect(state.world).toStrictEqual({
        time: {
          day: 1,
          hours: 20,
          minutes: 0,
        },
      });
    });

    it('Перемещает актора в состоянии на координаты', () => {
      const task = new GoToCoordsTask({
        coords: {
          x: 10,
          y: 5,
          z: 1,
        },
        completeRadius: 1,
      });

      const state = task.applyEffects(
        new NpcStateBuilder()
          .withPosition({
            x: 0,
            y: 0,
            z: 0,
          })
          .withAngle(90)
          .build()
      );

      expect(state.self.actor).toEqual({
        position: {
          x: 10,
          y: 5,
          z: 1,
        },
        angle: 90,
      });
    });
  });
});
