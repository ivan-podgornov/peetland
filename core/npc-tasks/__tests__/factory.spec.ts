import { ParallelTask } from '@peetland/htn';
import { Item } from '@peetland/inventory';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { Deed, Feeling, Trait } from '@peetland/psyche';
import { describe, expect, it } from 'vitest';

import { createNpcTaskFactoryDeps } from '../dev';
import { NpcTaskFactory } from '../src';
import { AchieveAngleTask } from '../src/achieve-angle-task';
import { AddItemTask } from '../src/add-item-task';
import { GoToCoordsTask } from '../src/go-to-coords-task';
import { PlayAnimationTask } from '../src/play-animation-task';
import { PsycheReactTask } from '../src/psyche-react-task';
import { RemoveItemTask } from '../src/remove-item-task';
import { TryLuckTask } from '../src/try-luck-task';

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

    it('Если psycheFactory не передана, эффекты задачи меняют чувства по чертам психики', () => {
      const { geometry, random, timer } = createNpcTaskFactoryDeps();
      const factory = new NpcTaskFactory({
        geometry,
        random,
        timer,
      });
      const task = factory.psycheReact({ deed: Deed.Begging });

      const state = task.applyEffects(
        new NpcStateBuilder().withTrait(Trait.Conscientiousness, 100).build()
      );

      expect(state.self.psyche.feelings[Feeling.Shame]).toBeGreaterThan(0);
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
