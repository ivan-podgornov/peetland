import { Geometry } from '@peetland/geometry';
import { ManualTimer } from '@peetland/timings';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { GoToNearestPlaceTask } from '../../src';

import { createNpcContext, createNpcState, createPlace } from './helpers';

describe('GoToNearestPlaceTask', () => {
  describe('#canExecute', () => {
    it('Если мест нет, возвращает false', () => {
      const task = new GoToNearestPlaceTask(
        { places: [], completeRadius: 1 },
        { geometry: new Geometry() }
      );

      expect(task.canExecute(createNpcState())).toBe(false);
    });

    it('Если места есть, возвращает true', () => {
      const task = new GoToNearestPlaceTask(
        { places: [createPlace()], completeRadius: 1 },
        { geometry: new Geometry() }
      );

      expect(task.canExecute(createNpcState())).toBe(true);
    });
  });

  describe('#start', () => {
    it('Отдаёт актору команду идти к месту, ближайшему к актору', () => {
      const actor = createActor({ position: { x: 20, y: 0, z: 0 } });
      const goToCoords = vi.spyOn(actor, 'goToCoords');
      const places = [
        createPlace({ id: 'near-spawn', position: { x: 0, y: 0, z: 0 } }),
        createPlace({ id: 'near-actor', position: { x: 25, y: 0, z: 0 } }),
      ];
      const task = new GoToNearestPlaceTask(
        { places, completeRadius: 1 },
        { geometry: new Geometry() }
      );

      task.start(createNpcState(), createNpcContext(actor));

      expect(goToCoords).toHaveBeenCalledExactlyOnceWith({ x: 25, y: 0, z: 0 }, 1);
    });
  });

  describe('#update', () => {
    it("Возвращает 'success', когда актор дошёл", () => {
      const timer = new ManualTimer();
      const context = createNpcContext(createActor({ timer }));
      const places = [createPlace({ position: { x: 2, y: 0, z: 0 } })];
      const task = new GoToNearestPlaceTask(
        { places, completeRadius: 1 },
        { geometry: new Geometry() }
      );
      task.start(createNpcState(), context);

      timer.advance(1000);
      const result = task.update(createNpcState(), context);

      expect(result).toBe('success');
    });
  });

  describe('#applyEffects', () => {
    it('Перемещает актора в состоянии в место, ближайшее к позиции из состояния', () => {
      const places = [
        createPlace({ id: 'far', position: { x: 50, y: 0, z: 0 } }),
        createPlace({ id: 'near', position: { x: 5, y: 1, z: 0 } }),
      ];
      const task = new GoToNearestPlaceTask(
        { places, completeRadius: 1 },
        { geometry: new Geometry() }
      );

      const state = task.applyEffects(
        createNpcState({ actor: { position: { x: 0, y: 0, z: 0 }, angle: 90 } })
      );

      expect(state.actor).toEqual({ position: { x: 5, y: 1, z: 0 }, angle: 90 });
    });
  });
});
