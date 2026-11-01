import type { IHTNFactory, Task } from '@peetland/htn';
import { createMockedHTNFactory } from '@peetland/htn/dev';
import { Item } from '@peetland/inventory';
import { describe, expect, it, vi } from 'vitest';

import { BOOZE_PRICE, Npc, NpcFactory, RootTask } from '../../src';
import type { NpcContext, NpcState } from '../../src';
import { createNpcState, createPlace, planNames } from '../tasks/helpers';

import { createNpcData, createNpcFactoryDeps } from './helpers';

/** Возвращает корневую задачу, с которой фабрика создала HTN-агента */
function getRootTask(htnFactory: IHTNFactory<NpcState, NpcContext>): Task<NpcState, NpcContext> {
  const root = vi.mocked(htnFactory.create).mock.calls[0]?.[0];

  if (!root) {
    throw new Error('HTN-агент не создавался');
  }

  return root;
}

describe('NpcFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Npc', () => {
      const factory = new NpcFactory(createNpcFactoryDeps());

      const npc = factory.create(createNpcData(), { places: [] });

      expect(npc).toBeInstanceOf(Npc);
    });

    it('Создаёт HTN-агента NPC с корневой задачей RootTask', () => {
      const htnFactory = createMockedHTNFactory<NpcState, NpcContext>();
      const factory = new NpcFactory(createNpcFactoryDeps({ htnFactory }));

      factory.create(createNpcData(), { places: [] });

      expect(htnFactory.create).toHaveBeenCalledExactlyOnceWith(expect.any(RootTask));
    });

    it('Если среди переданных мест есть магазин, корневая задача планирует купить в нём пойло', () => {
      const htnFactory = createMockedHTNFactory<NpcState, NpcContext>();
      const factory = new NpcFactory(createNpcFactoryDeps({ htnFactory }));
      const state = createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE } });

      factory.create(createNpcData(), { places: [createPlace()] });

      expect(planNames(getRootTask(htnFactory), state)).toContain('go-to-coords');
    });

    it('Если мест не передано, корневая задача не планирует купить пойло', () => {
      const htnFactory = createMockedHTNFactory<NpcState, NpcContext>();
      const factory = new NpcFactory(createNpcFactoryDeps({ htnFactory }));
      const state = createNpcState({ inventory: { [Item.Money]: BOOZE_PRICE } });

      factory.create(createNpcData(), { places: [] });

      expect(planNames(getRootTask(htnFactory), state)).toBeNull();
    });
  });
});
