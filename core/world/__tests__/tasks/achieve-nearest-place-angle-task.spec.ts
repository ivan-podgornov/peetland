import { Geometry } from '@peetland/geometry';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { AchieveNearestPlaceAngleTask } from '../../src';

import { createNpcContext, createNpcState, createPlace } from './helpers';

describe('AchieveNearestPlaceAngleTask', () => {
  describe('#canExecute', () => {
    it('Если мест нет, возвращает false', () => {
      const task = new AchieveNearestPlaceAngleTask(
        { places: [], tolerance: 5 },
        { geometry: new Geometry() }
      );

      expect(task.canExecute(createNpcState())).toBe(false);
    });
  });

  describe('#start', () => {
    it('Отдаёт актору команду повернуться на угол места, ближайшего к актору', () => {
      const actor = createActor({ position: { x: 20, y: 0, z: 0 } });
      const achieveAngle = vi.spyOn(actor, 'achieveAngle');
      const places = [
        createPlace({ id: 'far', position: { x: 0, y: 0, z: 0 }, angle: 10 }),
        createPlace({ id: 'near', position: { x: 20, y: 0, z: 0 }, angle: 90 }),
      ];
      const task = new AchieveNearestPlaceAngleTask(
        { places, tolerance: 5 },
        { geometry: new Geometry() }
      );

      task.start(createNpcState(), createNpcContext(actor));

      expect(achieveAngle).toHaveBeenCalledExactlyOnceWith(90, 5);
    });
  });

  describe('#applyEffects', () => {
    it('Поворачивает актора в состоянии на угол ближайшего места, приведённый к [0, 360)', () => {
      const places = [
        createPlace({ id: 'near', position: { x: 1, y: 0, z: 0 }, angle: -90 }),
        createPlace({ id: 'far', position: { x: 50, y: 0, z: 0 }, angle: 10 }),
      ];
      const task = new AchieveNearestPlaceAngleTask(
        { places, tolerance: 5 },
        { geometry: new Geometry() }
      );

      const state = task.applyEffects(
        createNpcState({ actor: { position: { x: 0, y: 0, z: 0 }, angle: 0 } })
      );

      expect(state.actor).toEqual({ position: { x: 0, y: 0, z: 0 }, angle: 270 });
    });
  });
});
