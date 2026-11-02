import { Geometry } from '@peetland/geometry';
import { createNpcContext, createNpcState } from '@peetland/npc/dev';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { AchieveAngleTask } from '../src/achieve-angle-task';

describe('AchieveAngleTask', () => {
  describe('#start', () => {
    it('Отдаёт актору команду повернуться на угол', () => {
      const actor = createActor();
      const achieveAngle = vi.spyOn(actor, 'achieveAngle');
      const task = new AchieveAngleTask(
        {
          angle: 90,
          tolerance: 5,
        },
        { geometry: new Geometry() }
      );

      task.start(createNpcState(), createNpcContext(actor));

      expect(achieveAngle).toHaveBeenCalledExactlyOnceWith(90, 5);
    });

    it("Возвращает 'success', если актор уже повёрнут на угол", () => {
      const context = createNpcContext(createActor({ angle: 90 }));
      const task = new AchieveAngleTask(
        {
          angle: 90,
          tolerance: 5,
        },
        { geometry: new Geometry() }
      );

      const result = task.start(createNpcState(), context);

      expect(result).toBe('success');
    });
  });

  describe('#applyEffects', () => {
    it('Поворачивает актора в состоянии на угол', () => {
      const task = new AchieveAngleTask(
        {
          angle: 90,
          tolerance: 5,
        },
        { geometry: new Geometry() }
      );

      const state = task.applyEffects(
        createNpcState({
          self: {
            actor: {
              position: {
                x: 1,
                y: 2,
                z: 3,
              },
              angle: 0,
            },
          },
        })
      );

      expect(state.self.actor).toEqual({
        position: {
          x: 1,
          y: 2,
          z: 3,
        },
        angle: 90,
      });
    });

    it('Не меняет то, что NPC знает о мире', () => {
      const task = new AchieveAngleTask(
        {
          angle: 90,
          tolerance: 5,
        },
        { geometry: new Geometry() }
      );

      const state = task.applyEffects(createNpcState({ world: { time: 20 * 60 } }));

      expect(state.world).toStrictEqual({ time: 20 * 60 });
    });

    it('Приводит угол к [0, 360)', () => {
      const task = new AchieveAngleTask(
        {
          angle: -90,
          tolerance: 5,
        },
        { geometry: new Geometry() }
      );

      const state = task.applyEffects(createNpcState());

      expect(state.self.actor.angle).toBe(270);
    });
  });
});
