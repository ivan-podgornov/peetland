import { createMockedHTNFactory } from '@peetland/htn/dev';
import { describe, expect, it, vi } from 'vitest';

import { createNpcData } from '../../dev';
import { NpcFactory } from '../../src';
import type { NpcContext, NpcState } from '../../src';

import { createRequiredDeps } from './helpers';

describe('NpcFactory', () => {
  describe('#create', () => {
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
  });
});
