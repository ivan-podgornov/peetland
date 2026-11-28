import { ConsumptionType } from '@peetland/addictions';
import { ParallelTask } from '@peetland/htn';
import { Item } from '@peetland/inventory';
import { ActivityType } from '@peetland/needs';
import { NpcStateBuilder } from '@peetland/npc/dev';
import { Deed, Feeling, Trait } from '@peetland/psyche';
import { describe, expect, it } from 'vitest';

import { createNpcTaskFactoryDeps } from '../dev';
import { NpcTaskFactory } from '../src';
import { AchieveAngleTask } from '../src/achieve-angle-task';
import { AddItemTask } from '../src/add-item-task';
import { AddictionsConsumeTask } from '../src/addictions-consume-task';
import { DrinkTask } from '../src/drink-task';
import { EatTask } from '../src/eat-task';
import { GoToCoordsTask } from '../src/go-to-coords-task';
import { NeedsPerformTask } from '../src/needs-perform-task';
import { PlayAnimationTask } from '../src/play-animation-task';
import { PsycheReactTask } from '../src/psyche-react-task';
import { PurchaseTask } from '../src/purchase-task';
import { RememberFactTask } from '../src/remember-fact-task';
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

  describe('#rememberFact', () => {
    it('Возвращает RememberFactTask', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      const task = factory.rememberFact({
        type: 'placeTaken',
        details: { placeId: 'begging-spot-1' },
      });

      expect(task).toBeInstanceOf(RememberFactTask);
    });
  });

  describe('#psycheReact', () => {
    it('Возвращает PsycheReactTask', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      const task = factory.psycheReact({ deed: Deed.BottleFound });

      expect(task).toBeInstanceOf(PsycheReactTask);
    });

    it('Эффекты задачи меняют чувства по чертам психики из состояния', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());
      const task = factory.psycheReact({ deed: Deed.Begging });

      const state = task.applyEffects(
        new NpcStateBuilder()
          .withPsyche((psyche) => psyche.withTrait(Trait.Conscientiousness, 100).build())
          .build()
      );

      expect(state.self.psyche.getState().feelings[Feeling.Shame]).toBeGreaterThan(0);
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

  describe('#purchase', () => {
    it('Возвращает PurchaseTask', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      const task = factory.purchase({
        item: Item.Booze,
        count: 1,
        price: 100,
      });

      expect(task).toBeInstanceOf(PurchaseTask);
    });
  });

  describe('#needsPerform', () => {
    it('Возвращает NeedsPerformTask', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      const task = factory.needsPerform({
        type: ActivityType.Eat,
        details: { food: Item.SmilePizza },
      });

      expect(task).toBeInstanceOf(NeedsPerformTask);
    });
  });

  describe('#addictionsConsume', () => {
    it('Возвращает AddictionsConsumeTask', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      const task = factory.addictionsConsume({
        type: ConsumptionType.Drink,
        details: { booze: Item.Booze },
      });

      expect(task).toBeInstanceOf(AddictionsConsumeTask);
    });
  });

  describe('#drink', () => {
    it('Возвращает DrinkTask', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      const task = factory.drink({ booze: Item.Booze });

      expect(task).toBeInstanceOf(DrinkTask);
    });
  });

  describe('#eat', () => {
    it('Возвращает EatTask', () => {
      const factory = new NpcTaskFactory(createNpcTaskFactoryDeps());

      const task = factory.eat({ food: Item.SmilePizza });

      expect(task).toBeInstanceOf(EatTask);
    });
  });
});
