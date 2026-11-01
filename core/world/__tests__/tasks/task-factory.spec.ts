import { Item } from '@peetland/inventory';
import { describe, expect, it } from 'vitest';

import {
  AchieveAngleTask,
  AddItemTask,
  GoToCoordsTask,
  PlayAnimationTask,
  RemoveItemTask,
} from '../../src';

import { createTaskFactory } from './helpers';

describe('TaskFactory', () => {
  it('#goToCoords возвращает GoToCoordsTask', () => {
    const task = createTaskFactory().goToCoords({
      coords: { x: 0, y: 0, z: 0 },
      completeRadius: 1,
    });

    expect(task).toBeInstanceOf(GoToCoordsTask);
  });

  it('#achieveAngle возвращает AchieveAngleTask', () => {
    const task = createTaskFactory().achieveAngle({ angle: 0, tolerance: 1 });

    expect(task).toBeInstanceOf(AchieveAngleTask);
  });

  it('#playAnimation возвращает PlayAnimationTask', () => {
    const task = createTaskFactory().playAnimation({ animation: 'pay' });

    expect(task).toBeInstanceOf(PlayAnimationTask);
  });

  it('#addItem возвращает AddItemTask', () => {
    const task = createTaskFactory().addItem({ item: Item.Booze, count: 1 });

    expect(task).toBeInstanceOf(AddItemTask);
  });

  it('#removeItem возвращает RemoveItemTask', () => {
    const task = createTaskFactory().removeItem({ item: Item.Booze, count: 1 });

    expect(task).toBeInstanceOf(RemoveItemTask);
  });
});
