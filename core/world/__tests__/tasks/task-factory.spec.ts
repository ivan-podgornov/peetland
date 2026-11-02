import { Item } from '@peetland/inventory';
import { createMockedNpcTaskFactory, createStubPrimitiveTask } from '@peetland/npc-tasks/dev';
import { createMockedPlaces } from '@peetland/places/dev';
import { Deed } from '@peetland/psyche';
import { describe, expect, it } from 'vitest';

import {
  BegTask,
  BuyBoozeTask,
  CollectBottlesTask,
  DrinkTask,
  PurchaseTask,
  SellBottlesTask,
  TaskFactory,
} from '../../src';

import { createTaskFactoryDeps } from './helpers';

describe('TaskFactory', () => {
  describe('#goToCoords', () => {
    it('Вызывает npcTaskFactory.goToCoords с параметрами', () => {
      const npcTaskFactory = createMockedNpcTaskFactory();
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));
      const options = {
        coords: {
          x: 0,
          y: 0,
          z: 0,
        },
        completeRadius: 1,
      };

      factory.goToCoords(options);

      expect(npcTaskFactory.goToCoords).toHaveBeenCalledExactlyOnceWith(options);
    });

    it('Возвращает задачу, которую создала npcTaskFactory.goToCoords', () => {
      const npcTaskFactory = createMockedNpcTaskFactory();
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));

      const task = factory.goToCoords({
        coords: {
          x: 0,
          y: 0,
          z: 0,
        },
        completeRadius: 1,
      });

      expect(task).toBe(npcTaskFactory.goToCoords.mock.results[0]?.value);
    });
  });

  describe('#achieveAngle', () => {
    it('Вызывает npcTaskFactory.achieveAngle с параметрами', () => {
      const npcTaskFactory = createMockedNpcTaskFactory();
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));
      const options = {
        angle: 0,
        tolerance: 1,
      };

      factory.achieveAngle(options);

      expect(npcTaskFactory.achieveAngle).toHaveBeenCalledExactlyOnceWith(options);
    });

    it('Возвращает задачу, которую создала npcTaskFactory.achieveAngle', () => {
      const npcTaskFactory = createMockedNpcTaskFactory();
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));

      const task = factory.achieveAngle({
        angle: 0,
        tolerance: 1,
      });

      expect(task).toBe(npcTaskFactory.achieveAngle.mock.results[0]?.value);
    });
  });

  describe('#playAnimation', () => {
    it('Вызывает npcTaskFactory.playAnimation с параметрами', () => {
      const npcTaskFactory = createMockedNpcTaskFactory();
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));
      const options = { animation: 'pay' as const };

      factory.playAnimation(options);

      expect(npcTaskFactory.playAnimation).toHaveBeenCalledExactlyOnceWith(options);
    });

    it('Возвращает задачу, которую создала npcTaskFactory.playAnimation', () => {
      const npcTaskFactory = createMockedNpcTaskFactory();
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));

      const task = factory.playAnimation({ animation: 'pay' });

      expect(task).toBe(npcTaskFactory.playAnimation.mock.results[0]?.value);
    });
  });

  describe('#addItem', () => {
    it('Вызывает npcTaskFactory.addItem с параметрами', () => {
      const npcTaskFactory = createMockedNpcTaskFactory();
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));
      const options = {
        item: Item.Booze,
        count: 1,
      };

      factory.addItem(options);

      expect(npcTaskFactory.addItem).toHaveBeenCalledExactlyOnceWith(options);
    });

    it('Возвращает задачу, которую создала npcTaskFactory.addItem', () => {
      const npcTaskFactory = createMockedNpcTaskFactory();
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));

      const task = factory.addItem({
        item: Item.Booze,
        count: 1,
      });

      expect(task).toBe(npcTaskFactory.addItem.mock.results[0]?.value);
    });
  });

  describe('#removeItem', () => {
    it('Вызывает npcTaskFactory.removeItem с параметрами', () => {
      const npcTaskFactory = createMockedNpcTaskFactory();
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));
      const options = {
        item: Item.Booze,
        count: 1,
      };

      factory.removeItem(options);

      expect(npcTaskFactory.removeItem).toHaveBeenCalledExactlyOnceWith(options);
    });

    it('Возвращает задачу, которую создала npcTaskFactory.removeItem', () => {
      const npcTaskFactory = createMockedNpcTaskFactory();
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));

      const task = factory.removeItem({
        item: Item.Booze,
        count: 1,
      });

      expect(task).toBe(npcTaskFactory.removeItem.mock.results[0]?.value);
    });
  });

  describe('#psycheReact', () => {
    it('Вызывает npcTaskFactory.psycheReact с параметрами', () => {
      const npcTaskFactory = createMockedNpcTaskFactory();
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));
      const options = { deed: Deed.BottleFound };

      factory.psycheReact(options);

      expect(npcTaskFactory.psycheReact).toHaveBeenCalledExactlyOnceWith(options);
    });

    it('Возвращает задачу, которую создала npcTaskFactory.psycheReact', () => {
      const npcTaskFactory = createMockedNpcTaskFactory();
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));

      const task = factory.psycheReact({ deed: Deed.BottleFound });

      expect(task).toBe(npcTaskFactory.psycheReact.mock.results[0]?.value);
    });
  });

  describe('#tryLuck', () => {
    it('Вызывает npcTaskFactory.tryLuck с параметрами', () => {
      const npcTaskFactory = createMockedNpcTaskFactory();
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));
      const options = { chance: 1 / 60 };

      factory.tryLuck(options);

      expect(npcTaskFactory.tryLuck).toHaveBeenCalledExactlyOnceWith(options);
    });

    it('Возвращает задачу, которую создала npcTaskFactory.tryLuck', () => {
      const npcTaskFactory = createMockedNpcTaskFactory();
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));

      const task = factory.tryLuck({ chance: 1 / 60 });

      expect(task).toBe(npcTaskFactory.tryLuck.mock.results[0]?.value);
    });
  });

  describe('#parallel', () => {
    it('Вызывает npcTaskFactory.parallel с параметрами', () => {
      const npcTaskFactory = createMockedNpcTaskFactory();
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));
      const options = {
        main: createStubPrimitiveTask('main'),
        background: createStubPrimitiveTask('background'),
      };

      factory.parallel(options);

      expect(npcTaskFactory.parallel).toHaveBeenCalledExactlyOnceWith(options);
    });

    it('Возвращает задачу, которую создала npcTaskFactory.parallel', () => {
      const npcTaskFactory = createMockedNpcTaskFactory();
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));

      const task = factory.parallel({
        main: createStubPrimitiveTask('main'),
        background: createStubPrimitiveTask('background'),
      });

      expect(task).toBe(npcTaskFactory.parallel.mock.results[0]?.value);
    });
  });

  describe('#purchase', () => {
    it('Возвращает PurchaseTask', () => {
      const factory = new TaskFactory(createTaskFactoryDeps());

      const task = factory.purchase({
        item: Item.Booze,
        count: 1,
        price: 100,
      });

      expect(task).toBeInstanceOf(PurchaseTask);
    });
  });

  describe('#buyBooze', () => {
    it('Возвращает BuyBoozeTask', () => {
      const factory = new TaskFactory(createTaskFactoryDeps());

      const task = factory.buyBooze({ places: createMockedPlaces() });

      expect(task).toBeInstanceOf(BuyBoozeTask);
    });
  });

  describe('#drink', () => {
    it('Возвращает DrinkTask', () => {
      const factory = new TaskFactory(createTaskFactoryDeps());

      const task = factory.drink({ places: createMockedPlaces() });

      expect(task).toBeInstanceOf(DrinkTask);
    });
  });

  describe('#sellBottles', () => {
    it('Возвращает SellBottlesTask', () => {
      const factory = new TaskFactory(createTaskFactoryDeps());

      const task = factory.sellBottles({ places: createMockedPlaces() });

      expect(task).toBeInstanceOf(SellBottlesTask);
    });
  });

  describe('#collectBottles', () => {
    it('Возвращает CollectBottlesTask', () => {
      const factory = new TaskFactory(createTaskFactoryDeps());

      const task = factory.collectBottles({ places: createMockedPlaces() });

      expect(task).toBeInstanceOf(CollectBottlesTask);
    });
  });

  describe('#beg', () => {
    it('Возвращает BegTask', () => {
      const factory = new TaskFactory(createTaskFactoryDeps());

      const task = factory.beg({ places: createMockedPlaces() });

      expect(task).toBeInstanceOf(BegTask);
    });
  });
});
