import { ActivityType } from '@peetland/addictions';
import { createMockedAddictions } from '@peetland/addictions/dev';
import { Item } from '@peetland/inventory';
import { createNpcContext, NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { AddictionsPerformTask } from '../src/addictions-perform-task';

describe('AddictionsPerformTask', () => {
  describe('#start', () => {
    it('Сообщает о занятии зависимостям из контекста на время из состояния', () => {
      const addictions = createMockedAddictions();
      const context = {
        ...createNpcContext(),
        addictions,
      };
      const state = NpcStateBuilder.default();
      const details = { booze: Item.Booze } as const;
      const task = new AddictionsPerformTask({
        type: ActivityType.Drink,
        details,
      });

      task.start(state, context);

      expect(addictions.perform).toHaveBeenCalledExactlyOnceWith(
        {
          type: ActivityType.Drink,
          details,
        },
        state.world.time
      );
    });

    it("Возвращает 'success'", () => {
      const task = new AddictionsPerformTask({
        type: ActivityType.Drink,
        details: { booze: Item.Booze },
      });

      const result = task.start(NpcStateBuilder.default(), createNpcContext());

      expect(result).toBe('success');
    });
  });

  describe('#applyEffects', () => {
    it('Сообщает о занятии копии зависимостей из состояния на время из состояния', () => {
      const copy = createMockedAddictions();
      const addictions = createMockedAddictions();
      addictions.clone.mockReturnValue(copy);
      const state = new NpcStateBuilder().withAddictions(() => addictions).build();
      const details = { booze: Item.Booze } as const;
      const task = new AddictionsPerformTask({
        type: ActivityType.Drink,
        details,
      });

      task.applyEffects(state);

      expect(copy.perform).toHaveBeenCalledExactlyOnceWith(
        {
          type: ActivityType.Drink,
          details,
        },
        state.world.time
      );
    });

    it('Кладёт в состояние копию зависимостей', () => {
      const copy = createMockedAddictions();
      const addictions = createMockedAddictions();
      addictions.clone.mockReturnValue(copy);
      const task = new AddictionsPerformTask({
        type: ActivityType.Drink,
        details: { booze: Item.Booze },
      });

      const state = task.applyEffects(
        new NpcStateBuilder().withAddictions(() => addictions).build()
      );

      expect(state.self.addictions).toBe(copy);
    });

    it('Не меняет то, что NPC знает о мире', () => {
      const task = new AddictionsPerformTask({
        type: ActivityType.Drink,
        details: { booze: Item.Booze },
      });
      const state = NpcStateBuilder.default();

      expect(task.applyEffects(state).world).toBe(state.world);
    });
  });
});
