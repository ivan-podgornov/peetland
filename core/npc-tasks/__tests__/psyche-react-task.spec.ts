import { createNpcContext, NpcStateBuilder } from '@peetland/npc/dev';
import { Deed } from '@peetland/psyche';
import { createMockedPsyche } from '@peetland/psyche/dev';
import { describe, expect, it } from 'vitest';

import { PsycheReactTask } from '../src/psyche-react-task';

describe('PsycheReactTask', () => {
  describe('#start', () => {
    it('Сообщает психике из контекста о поступке', () => {
      const psyche = createMockedPsyche();
      const context = {
        ...createNpcContext(),
        psyche,
      };
      const task = new PsycheReactTask({ deed: Deed.BottleFound });

      task.start(NpcStateBuilder.default(), context);

      expect(psyche.react).toHaveBeenCalledExactlyOnceWith(Deed.BottleFound);
    });

    it("Возвращает 'success'", () => {
      const task = new PsycheReactTask({ deed: Deed.BottleFound });

      const result = task.start(NpcStateBuilder.default(), createNpcContext());

      expect(result).toBe('success');
    });
  });

  describe('#applyEffects', () => {
    it('Сообщает о поступке копии психики из состояния', () => {
      const copy = createMockedPsyche();
      const psyche = createMockedPsyche();
      psyche.clone.mockReturnValue(copy);
      const state = new NpcStateBuilder().withPsyche(() => psyche).build();
      const task = new PsycheReactTask({ deed: Deed.BottleFound });

      task.applyEffects(state);

      expect(copy.react).toHaveBeenCalledExactlyOnceWith(Deed.BottleFound);
    });

    it('Кладёт в состояние копию психики', () => {
      const copy = createMockedPsyche();
      const psyche = createMockedPsyche();
      psyche.clone.mockReturnValue(copy);
      const task = new PsycheReactTask({ deed: Deed.BottleFound });

      const state = task.applyEffects(new NpcStateBuilder().withPsyche(() => psyche).build());

      expect(state.self.psyche).toBe(copy);
    });

    it('Не меняет то, что NPC знает о мире', () => {
      const task = new PsycheReactTask({ deed: Deed.BottleFound });

      const state = NpcStateBuilder.default();

      expect(task.applyEffects(state).world).toBe(state.world);
    });
  });
});
