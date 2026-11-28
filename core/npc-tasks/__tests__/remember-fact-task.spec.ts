import { Memory } from '@peetland/memory';
import { createNpcContext, NpcStateBuilder } from '@peetland/npc/dev';
import { describe, expect, it } from 'vitest';

import { RememberFactTask } from '../src/remember-fact-task';

describe('RememberFactTask', () => {
  describe('#start', () => {
    it('Запоминает факт в память из контекста с моментом из времени мира', () => {
      const time = {
        day: 2,
        hours: 14,
        minutes: 30,
      };
      const memory = new Memory();
      const context = {
        ...createNpcContext(),
        memory,
      };
      const state = new NpcStateBuilder().withTime(time).build();
      const task = new RememberFactTask({
        type: 'placeTaken',
        details: { placeId: 'begging-spot-1' },
      });

      task.start(state, context);

      expect(memory.recall('placeTaken')).toStrictEqual([
        {
          type: 'placeTaken',
          details: { placeId: 'begging-spot-1' },
          rememberedAt: time,
        },
      ]);
    });

    it("Возвращает 'success'", () => {
      const task = new RememberFactTask({
        type: 'binSearched',
        details: { placeId: 'trash-bin-1' },
      });

      const result = task.start(NpcStateBuilder.default(), createNpcContext());

      expect(result).toBe('success');
    });
  });

  describe('#applyEffects', () => {
    it('Запоминает факт копии памяти из состояния с моментом из времени мира', () => {
      const time = {
        day: 2,
        hours: 14,
        minutes: 30,
      };
      const state = new NpcStateBuilder().withTime(time).build();
      const task = new RememberFactTask({
        type: 'placeTaken',
        details: { placeId: 'begging-spot-1' },
      });

      const newState = task.applyEffects(state);

      expect(newState.self.memory.recall('placeTaken')).toStrictEqual([
        {
          type: 'placeTaken',
          details: { placeId: 'begging-spot-1' },
          rememberedAt: time,
        },
      ]);
    });

    it('Не меняет память исходного состояния', () => {
      const state = new NpcStateBuilder().build();
      const task = new RememberFactTask({
        type: 'binSearched',
        details: { placeId: 'trash-bin-1' },
      });

      task.applyEffects(state);

      expect(state.self.memory.recall('binSearched')).toStrictEqual([]);
    });

    it('Не меняет то, что NPC знает о мире', () => {
      const task = new RememberFactTask({
        type: 'placeTaken',
        details: { placeId: 'begging-spot-1' },
      });

      const state = NpcStateBuilder.default();

      expect(task.applyEffects(state).world).toBe(state.world);
    });
  });
});
