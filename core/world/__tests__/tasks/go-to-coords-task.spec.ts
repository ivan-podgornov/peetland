import { ManualTimer } from '@peetland/timings';
import { createActor } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { GoToCoordsTask } from '../../src';

import { createNpcContext, createNpcState } from './helpers';

describe('GoToCoordsTask', () => {
  it('#start отдаёт актору команду идти к координатам', () => {
    const actor = createActor();
    const goToCoords = vi.spyOn(actor, 'goToCoords');
    const task = new GoToCoordsTask({ coords: { x: 10, y: 0, z: 0 }, completeRadius: 1 });

    task.start(createNpcState(), createNpcContext(actor));

    expect(goToCoords).toHaveBeenCalledExactlyOnceWith({ x: 10, y: 0, z: 0 }, 1);
  });

  it("#update возвращает 'success', когда актор дошёл", () => {
    const timer = new ManualTimer();
    const context = createNpcContext(createActor({ timer }));
    const task = new GoToCoordsTask({ coords: { x: 2, y: 0, z: 0 }, completeRadius: 1 });
    task.start(createNpcState(), context);

    timer.advance(1000);
    const result = task.update(createNpcState(), context);

    expect(result).toBe('success');
  });

  it('#stop останавливает актора', () => {
    const timer = new ManualTimer();
    const actor = createActor({ timer });
    const context = createNpcContext(actor);
    const task = new GoToCoordsTask({ coords: { x: 100, y: 0, z: 0 }, completeRadius: 1 });
    task.start(createNpcState(), context);

    task.stop(context);
    timer.advance(1000);

    expect(actor.getPosition()).toEqual({ x: 0, y: 0, z: 0 });
  });

  it('#applyEffects перемещает актора в состоянии на координаты', () => {
    const task = new GoToCoordsTask({ coords: { x: 10, y: 5, z: 1 }, completeRadius: 1 });

    const state = task.applyEffects(
      createNpcState({ actor: { position: { x: 0, y: 0, z: 0 }, angle: 90 } })
    );

    expect(state.actor).toEqual({ position: { x: 10, y: 5, z: 1 }, angle: 90 });
  });
});
