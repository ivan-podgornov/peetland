import { Addiction, Addictions } from '@peetland/addictions';
import {
  createAddictionsData,
  createAddictionsDeps,
  createAddictionsState,
  createMockedAddictionsFactory,
} from '@peetland/addictions/dev';
import { AbortController } from '@peetland/events';
import { createControlledObservable } from '@peetland/events/dev';
import { createMockedHTN, createMockedHTNFactory } from '@peetland/htn/dev';
import { Inventory, Item } from '@peetland/inventory';
import { createMockedInventoryFactory } from '@peetland/inventory/dev';
import { Need, Needs } from '@peetland/needs';
import {
  createMockedNeedsFactory,
  createMockedUrgencyWatcherFactory,
  createNeedValues,
  createNeedsDeps,
  createNeedsState,
} from '@peetland/needs/dev';
import { Feeling, Psyche } from '@peetland/psyche';
import {
  createMockedPsycheFactory,
  createPsycheDeps,
  createPsycheState,
} from '@peetland/psyche/dev';
import { ManualTime } from '@peetland/timings';
import { createMockedActorFactory } from '@peetland/virtual-actor/dev';
import { describe, expect, it, vi } from 'vitest';

import { createMockedActorNpcRegistry, createMockedNpcWorldKnowledge, createNpcData } from '../dev';
import { Npc, NpcFactory } from '../src';
import type { NpcContext, NpcFactoryDeps, NpcState } from '../src';

/** Создаёт зависимости фабрики NPC, без которых она не собирается. Остальное — по умолчанию */
function createRequiredDeps(deps: Partial<NpcFactoryDeps> = {}): NpcFactoryDeps {
  return {
    actorFactory: createMockedActorFactory(),
    actorNpcRegistry: createMockedActorNpcRegistry(),
    ticks: createControlledObservable().observable,
    rootTaskFactory: {
      create: vi.fn(() => ({
        name: 'root',
        methods: [],
      })),
    },
    worldKnowledge: createMockedNpcWorldKnowledge(),
    gameSignal: new AbortController().signal,
    ...deps,
  };
}

describe('NpcFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Npc', () => {
      const factory = new NpcFactory(createRequiredDeps());

      const npc = factory.create(createNpcData());

      expect(npc).toBeInstanceOf(Npc);
    });

    it('Создаёт актора с моделью, позицией и углом спавна из данных', () => {
      const actorFactory = createMockedActorFactory();
      const data = createNpcData({
        modelId: 78,
        spawnPosition: {
          x: 1,
          y: 2,
          z: 3,
        },
        spawnAngle: 90,
      });
      const factory = new NpcFactory(createRequiredDeps({ actorFactory }));

      factory.create(data);

      expect(actorFactory.create).toHaveBeenCalledExactlyOnceWith({
        modelId: data.modelId,
        position: data.spawnPosition,
        angle: data.spawnAngle,
      });
    });

    it('Вызывает inventoryFactory.create с начальным содержимым инвентаря из данных', () => {
      const inventoryFactory = createMockedInventoryFactory();
      const factory = new NpcFactory(createRequiredDeps({ inventoryFactory }));
      const data = createNpcData({ inventory: { [Item.Money]: 150 } });

      factory.create(data);

      expect(inventoryFactory.create).toHaveBeenCalledExactlyOnceWith(data.inventory);
    });

    it('Передаёт NPC инвентарь, который вернула inventoryFactory', () => {
      const inventory = new Inventory();
      const factory = new NpcFactory(
        createRequiredDeps({ inventoryFactory: createMockedInventoryFactory(inventory) })
      );

      const npc = factory.create(createNpcData());

      expect(npc.inventory).toBe(inventory);
    });

    it('Вызывает psycheFactory.create с начальным состоянием психики из данных', () => {
      const psycheFactory = createMockedPsycheFactory();
      const data = createNpcData({
        psyche: createPsycheState({
          feelings: { [Feeling.Shame]: 30 },
        }),
      });
      const factory = new NpcFactory(createRequiredDeps({ psycheFactory }));

      factory.create(data);

      expect(psycheFactory.create).toHaveBeenCalledExactlyOnceWith(data.psyche);
    });

    it('Передаёт NPC психику, которую вернула psycheFactory', () => {
      const psyche = new Psyche(createPsycheState(), createPsycheDeps());
      const factory = new NpcFactory(
        createRequiredDeps({ psycheFactory: createMockedPsycheFactory(psyche) })
      );

      const npc = factory.create(createNpcData());

      expect(npc.psyche).toBe(psyche);
    });

    it('Вызывает needsFactory.create с начальными потребностями из данных и временем мира', () => {
      const needsFactory = createMockedNeedsFactory();
      const time = new ManualTime({
        day: 3,
        hours: 8,
        minutes: 0,
      });
      const data = createNpcData({ needs: createNeedValues({ [Need.Satiety]: 70 }) });
      const factory = new NpcFactory(
        createRequiredDeps({
          needsFactory,
          worldKnowledge: createMockedNpcWorldKnowledge({ time }),
        })
      );

      factory.create(data);

      expect(needsFactory.create).toHaveBeenCalledExactlyOnceWith(data.needs, time);
    });

    it('Передаёт NPC потребности, которые вернула needsFactory', () => {
      const needs = new Needs(createNeedsState(), createNeedsDeps());
      const factory = new NpcFactory(
        createRequiredDeps({ needsFactory: createMockedNeedsFactory(needs) })
      );

      const npc = factory.create(createNpcData());

      expect(npc.needs).toBe(needs);
    });

    it('Вызывает addictionsFactory.create с начальными зависимостями из данных и временем мира', () => {
      const addictionsFactory = createMockedAddictionsFactory();
      const time = new ManualTime({
        day: 3,
        hours: 8,
        minutes: 0,
      });
      const data = createNpcData({
        addictions: createAddictionsData({
          [Addiction.Alcoholism]: {
            satisfaction: 70,
            strength: 40,
          },
        }),
      });
      const factory = new NpcFactory(
        createRequiredDeps({
          addictionsFactory,
          worldKnowledge: createMockedNpcWorldKnowledge({ time }),
        })
      );

      factory.create(data);

      expect(addictionsFactory.create).toHaveBeenCalledExactlyOnceWith(data.addictions, time);
    });

    it('Передаёт NPC зависимости, которые вернула addictionsFactory', () => {
      const addictions = new Addictions(createAddictionsState(), createAddictionsDeps());
      const factory = new NpcFactory(
        createRequiredDeps({ addictionsFactory: createMockedAddictionsFactory(addictions) })
      );

      const npc = factory.create(createNpcData());

      expect(npc.addictions).toBe(addictions);
    });

    it('Создаёт наблюдателя срочности фабрикой urgencyWatcherFactory из зависимостей', () => {
      const urgencyWatcherFactory = createMockedUrgencyWatcherFactory();
      const factory = new NpcFactory(createRequiredDeps({ urgencyWatcherFactory }));

      factory.create(createNpcData());

      expect(urgencyWatcherFactory.create).toHaveBeenCalledOnce();
    });

    it('Вызывает rootTaskFactory.create с типом NPC из данных', () => {
      const rootTaskFactory = {
        create: vi.fn(() => ({
          name: 'root',
          methods: [],
        })),
      };
      const data = createNpcData();
      const factory = new NpcFactory(createRequiredDeps({ rootTaskFactory }));

      factory.create(data);

      expect(rootTaskFactory.create).toHaveBeenCalledExactlyOnceWith(data.kind);
    });

    it('Создаёт HTN-агента с корневой задачей, которую вернула rootTaskFactory', () => {
      const rootTask = {
        name: 'root',
        methods: [],
      };
      const htnFactory = createMockedHTNFactory<NpcState, NpcContext>();
      const factory = new NpcFactory(
        createRequiredDeps({
          htnFactory,
          rootTaskFactory: { create: () => rootTask },
        })
      );

      factory.create(createNpcData());

      expect(htnFactory.create).toHaveBeenCalledExactlyOnceWith(rootTask);
    });

    it('Если inventoryFactory не передана, NPC получает экземпляр Inventory', () => {
      const factory = new NpcFactory(createRequiredDeps());

      const npc = factory.create(createNpcData());

      expect(npc.inventory).toBeInstanceOf(Inventory);
    });

    it('Если psycheFactory не передана, NPC получает экземпляр Psyche', () => {
      const factory = new NpcFactory(createRequiredDeps());

      const npc = factory.create(createNpcData());

      expect(npc.psyche).toBeInstanceOf(Psyche);
    });

    it('Если needsFactory не передана, NPC получает экземпляр Needs', () => {
      const factory = new NpcFactory(createRequiredDeps());

      const npc = factory.create(createNpcData());

      expect(npc.needs).toBeInstanceOf(Needs);
    });

    it('Если addictionsFactory не передана, NPC получает экземпляр Addictions', () => {
      const factory = new NpcFactory(createRequiredDeps());

      const npc = factory.create(createNpcData());

      expect(npc.addictions).toBeInstanceOf(Addictions);
    });

    it('Если urgencyWatcherFactory не передана, при срочной потребности NPC мягко останавливает план', () => {
      const ticks = createControlledObservable();
      const htn = createMockedHTN<NpcState, NpcContext>();
      const factory = new NpcFactory(
        createRequiredDeps({
          ticks: ticks.observable,
          htnFactory: createMockedHTNFactory(htn),
        })
      );
      factory.create(
        createNpcData({
          needs: createNeedValues({
            [Need.Satiety]: 0,
          }),
        })
      );

      ticks.subscriber.next(undefined);

      expect(htn.softStop).toHaveBeenCalledOnce();
    });
  });
});
