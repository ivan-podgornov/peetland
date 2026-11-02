import { createStubPrimitiveTask } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import type { NpcContext, NpcState } from '@peetland/npc';
import { createNpcTaskFactory } from '@peetland/npc-tasks/dev';
import { createMockedPlaces } from '@peetland/places/dev';
import { Deed } from '@peetland/psyche';
import { describe, expect, it, vi } from 'vitest';

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
      const goToCoords = vi.fn(() => createStubPrimitiveTask<NpcState, NpcContext>('go-to-coords'));
      const npcTaskFactory = createNpcTaskFactory({ goToCoords });
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

      expect(goToCoords).toHaveBeenCalledExactlyOnceWith(options);
    });

    it('Возвращает задачу, которую создала npcTaskFactory.goToCoords', () => {
      const primitive = createStubPrimitiveTask<NpcState, NpcContext>('go-to-coords');
      const npcTaskFactory = createNpcTaskFactory({ goToCoords: () => primitive });
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));

      const task = factory.goToCoords({
        coords: {
          x: 0,
          y: 0,
          z: 0,
        },
        completeRadius: 1,
      });

      expect(task).toBe(primitive);
    });
  });

  describe('#achieveAngle', () => {
    it('Вызывает npcTaskFactory.achieveAngle с параметрами', () => {
      const achieveAngle = vi.fn(() =>
        createStubPrimitiveTask<NpcState, NpcContext>('achieve-angle')
      );
      const npcTaskFactory = createNpcTaskFactory({ achieveAngle });
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));
      const options = {
        angle: 0,
        tolerance: 1,
      };

      factory.achieveAngle(options);

      expect(achieveAngle).toHaveBeenCalledExactlyOnceWith(options);
    });

    it('Возвращает задачу, которую создала npcTaskFactory.achieveAngle', () => {
      const primitive = createStubPrimitiveTask<NpcState, NpcContext>('achieve-angle');
      const npcTaskFactory = createNpcTaskFactory({ achieveAngle: () => primitive });
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));

      const task = factory.achieveAngle({
        angle: 0,
        tolerance: 1,
      });

      expect(task).toBe(primitive);
    });
  });

  describe('#playAnimation', () => {
    it('Вызывает npcTaskFactory.playAnimation с параметрами', () => {
      const playAnimation = vi.fn(() =>
        createStubPrimitiveTask<NpcState, NpcContext>('play-animation')
      );
      const npcTaskFactory = createNpcTaskFactory({ playAnimation });
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));
      const options = { animation: 'pay' as const };

      factory.playAnimation(options);

      expect(playAnimation).toHaveBeenCalledExactlyOnceWith(options);
    });

    it('Возвращает задачу, которую создала npcTaskFactory.playAnimation', () => {
      const primitive = createStubPrimitiveTask<NpcState, NpcContext>('play-animation');
      const npcTaskFactory = createNpcTaskFactory({ playAnimation: () => primitive });
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));

      const task = factory.playAnimation({ animation: 'pay' });

      expect(task).toBe(primitive);
    });
  });

  describe('#addItem', () => {
    it('Вызывает npcTaskFactory.addItem с параметрами', () => {
      const addItem = vi.fn(() => createStubPrimitiveTask<NpcState, NpcContext>('add-item'));
      const npcTaskFactory = createNpcTaskFactory({ addItem });
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));
      const options = {
        item: Item.Booze,
        count: 1,
      };

      factory.addItem(options);

      expect(addItem).toHaveBeenCalledExactlyOnceWith(options);
    });

    it('Возвращает задачу, которую создала npcTaskFactory.addItem', () => {
      const primitive = createStubPrimitiveTask<NpcState, NpcContext>('add-item');
      const npcTaskFactory = createNpcTaskFactory({ addItem: () => primitive });
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));

      const task = factory.addItem({
        item: Item.Booze,
        count: 1,
      });

      expect(task).toBe(primitive);
    });
  });

  describe('#removeItem', () => {
    it('Вызывает npcTaskFactory.removeItem с параметрами', () => {
      const removeItem = vi.fn(() => createStubPrimitiveTask<NpcState, NpcContext>('remove-item'));
      const npcTaskFactory = createNpcTaskFactory({ removeItem });
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));
      const options = {
        item: Item.Booze,
        count: 1,
      };

      factory.removeItem(options);

      expect(removeItem).toHaveBeenCalledExactlyOnceWith(options);
    });

    it('Возвращает задачу, которую создала npcTaskFactory.removeItem', () => {
      const primitive = createStubPrimitiveTask<NpcState, NpcContext>('remove-item');
      const npcTaskFactory = createNpcTaskFactory({ removeItem: () => primitive });
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));

      const task = factory.removeItem({
        item: Item.Booze,
        count: 1,
      });

      expect(task).toBe(primitive);
    });
  });

  describe('#psycheReact', () => {
    it('Вызывает npcTaskFactory.psycheReact с параметрами', () => {
      const psycheReact = vi.fn(() =>
        createStubPrimitiveTask<NpcState, NpcContext>('psyche-react')
      );
      const npcTaskFactory = createNpcTaskFactory({ psycheReact });
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));
      const options = { deed: Deed.BottleFound };

      factory.psycheReact(options);

      expect(psycheReact).toHaveBeenCalledExactlyOnceWith(options);
    });

    it('Возвращает задачу, которую создала npcTaskFactory.psycheReact', () => {
      const primitive = createStubPrimitiveTask<NpcState, NpcContext>('psyche-react');
      const npcTaskFactory = createNpcTaskFactory({ psycheReact: () => primitive });
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));

      const task = factory.psycheReact({ deed: Deed.BottleFound });

      expect(task).toBe(primitive);
    });
  });

  describe('#tryLuck', () => {
    it('Вызывает npcTaskFactory.tryLuck с параметрами', () => {
      const tryLuck = vi.fn(() => createStubPrimitiveTask<NpcState, NpcContext>('try-luck'));
      const npcTaskFactory = createNpcTaskFactory({ tryLuck });
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));
      const options = { chance: 1 / 60 };

      factory.tryLuck(options);

      expect(tryLuck).toHaveBeenCalledExactlyOnceWith(options);
    });

    it('Возвращает задачу, которую создала npcTaskFactory.tryLuck', () => {
      const primitive = createStubPrimitiveTask<NpcState, NpcContext>('try-luck');
      const npcTaskFactory = createNpcTaskFactory({ tryLuck: () => primitive });
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));

      const task = factory.tryLuck({ chance: 1 / 60 });

      expect(task).toBe(primitive);
    });
  });

  describe('#parallel', () => {
    it('Вызывает npcTaskFactory.parallel с параметрами', () => {
      const parallel = vi.fn(() => createStubPrimitiveTask<NpcState, NpcContext>('parallel'));
      const npcTaskFactory = createNpcTaskFactory({ parallel });
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));
      const options = {
        main: createStubPrimitiveTask<NpcState, NpcContext>('main'),
        background: createStubPrimitiveTask<NpcState, NpcContext>('background'),
      };

      factory.parallel(options);

      expect(parallel).toHaveBeenCalledExactlyOnceWith(options);
    });

    it('Возвращает задачу, которую создала npcTaskFactory.parallel', () => {
      const primitive = createStubPrimitiveTask<NpcState, NpcContext>('parallel');
      const npcTaskFactory = createNpcTaskFactory({ parallel: () => primitive });
      const factory = new TaskFactory(createTaskFactoryDeps({ npcTaskFactory }));

      const task = factory.parallel({
        main: createStubPrimitiveTask<NpcState, NpcContext>('main'),
        background: createStubPrimitiveTask<NpcState, NpcContext>('background'),
      });

      expect(task).toBe(primitive);
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
