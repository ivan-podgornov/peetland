import { ParallelTask } from '@peetland/htn';
import { Item } from '@peetland/inventory';
import { Deed } from '@peetland/psyche';
import { describe, expect, it } from 'vitest';

import { createNpcTaskFactoryDeps } from '../dev';
import {
  AchieveAngleTask,
  AddItemTask,
  GoToCoordsTask,
  NpcTaskFactory,
  PlayAnimationTask,
  PsycheReactTask,
  RemoveItemTask,
  TryLuckTask,
} from '../src';

describe('NpcTaskFactory', () => {
  describe('#goToCoords', () => {
    it('Возвращает GoToCoordsTask', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      const task = factory.goToCoords({
        coords: {
          x: 0,
          y: 0,
          z: 0,
        },
        completeRadius: 1,
      });

      expect(task).toBeInstanceOf(GoToCoordsTask);
    });
  });

  describe('#achieveAngle', () => {
    it('Возвращает AchieveAngleTask', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      const task = factory.achieveAngle({
        angle: 0,
        tolerance: 1,
      });

      expect(task).toBeInstanceOf(AchieveAngleTask);
    });
  });

  describe('#playAnimation', () => {
    it('Возвращает PlayAnimationTask', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      const task = factory.playAnimation({ animation: 'pay' });

      expect(task).toBeInstanceOf(PlayAnimationTask);
    });
  });

  describe('#addItem', () => {
    it('Возвращает AddItemTask', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      const task = factory.addItem({
        item: Item.Booze,
        count: 1,
      });

      expect(task).toBeInstanceOf(AddItemTask);
    });
  });

  describe('#removeItem', () => {
    it('Возвращает RemoveItemTask', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      const task = factory.removeItem({
        item: Item.Booze,
        count: 1,
      });

      expect(task).toBeInstanceOf(RemoveItemTask);
    });
  });

  describe('#psycheReact', () => {
    it('Возвращает PsycheReactTask', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      const task = factory.psycheReact({ deed: Deed.BottleFound });

      expect(task).toBeInstanceOf(PsycheReactTask);
    });
  });

  describe('#tryLuck', () => {
    it('Возвращает TryLuckTask', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      const task = factory.tryLuck({ chance: 1 / 60 });

      expect(task).toBeInstanceOf(TryLuckTask);
    });
  });

  describe('#parallel', () => {
    it('Возвращает ParallelTask', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      const task = factory.parallel({
        main: factory.tryLuck({ chance: 1 / 60 }),
        background: factory.playAnimation({ animation: 'trash-search' }),
      });

      expect(task).toBeInstanceOf(ParallelTask);
    });
  });
});
