import { Item } from '@peetland/inventory';
import { Activity } from '@peetland/needs';
import { createMockedNeeds } from '@peetland/needs/dev';
import { createNpcContext, NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { NeedsPerformTask } from '../src/needs-perform-task';

describe('NeedsPerformTask', () => {
  describe('#start', () => {
    it('Сообщает о занятии потребностям из контекста на время из состояния', () => {
      const needs = createMockedNeeds();
      const context = {
        ...createNpcContext(),
        needs,
      };
      const state = NpcStateBuilder.default();
      const details = { food: Item.SmilePizza } as const;
      const task = new NeedsPerformTask({
        activity: Activity.Eat,
        details,
      });

      task.start(state, context);

      expect(needs.perform).toHaveBeenCalledExactlyOnceWith(
        {
          activity: Activity.Eat,
          details,
        },
        state.world.time
      );
    });

    it("Возвращает 'success'", () => {
      const task = new NeedsPerformTask({
        activity: Activity.Eat,
        details: { food: Item.SmilePizza },
      });

      const result = task.start(NpcStateBuilder.default(), createNpcContext());

      expect(result).toBe('success');
    });
  });

  describe('#applyEffects', () => {
    it('Сообщает о занятии копии потребностей из состояния на время из состояния', () => {
      const copy = createMockedNeeds();
      const needs = createMockedNeeds();
      needs.clone.mockReturnValue(copy);
      const state = new NpcStateBuilder().withNeeds(() => needs).build();
      const details = { food: Item.RomashkaLoaf } as const;
      const task = new NeedsPerformTask({
        activity: Activity.Eat,
        details,
      });

      task.applyEffects(state);

      expect(copy.perform).toHaveBeenCalledExactlyOnceWith(
        {
          activity: Activity.Eat,
          details,
        },
        state.world.time
      );
    });

    it('Кладёт в состояние копию потребностей', () => {
      const copy = createMockedNeeds();
      const needs = createMockedNeeds();
      needs.clone.mockReturnValue(copy);
      const task = new NeedsPerformTask({
        activity: Activity.Eat,
        details: { food: Item.SmilePizza },
      });

      const state = task.applyEffects(new NpcStateBuilder().withNeeds(() => needs).build());

      expect(state.self.needs).toBe(copy);
    });

    it('Не меняет то, что NPC знает о мире', () => {
      const task = new NeedsPerformTask({
        activity: Activity.Eat,
        details: { food: Item.SmilePizza },
      });
      const state = NpcStateBuilder.default();

      expect(task.applyEffects(state).world).toBe(state.world);
    });
  });
});
