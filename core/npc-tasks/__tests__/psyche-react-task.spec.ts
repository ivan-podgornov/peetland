import { createNpcContext, NpcStateBuilder } from '@peetland/npc/dev';
import { Deed, Feeling } from '@peetland/psyche';
import {
  createMockedPsyche,
  createMockedPsycheFactory,
  createPsycheState,
} from '@peetland/psyche/dev';
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
      const task = new PsycheReactTask(
        { deed: Deed.BottleFound },
        { psycheFactory: createMockedPsycheFactory() }
      );

      task.start(new NpcStateBuilder().build(), context);

      expect(psyche.react).toHaveBeenCalledExactlyOnceWith(Deed.BottleFound);
    });

    it("Возвращает 'success'", () => {
      const task = new PsycheReactTask(
        { deed: Deed.BottleFound },
        { psycheFactory: createMockedPsycheFactory() }
      );

      const result = task.start(new NpcStateBuilder().build(), createNpcContext());

      expect(result).toBe('success');
    });
  });

  describe('#applyEffects', () => {
    it('Собирает психику фабрикой из слепка психики в состоянии', () => {
      const psycheFactory = createMockedPsycheFactory();
      const state = new NpcStateBuilder().withFeeling(Feeling.Shame, 30).build();
      const task = new PsycheReactTask({ deed: Deed.BottleFound }, { psycheFactory });

      task.applyEffects(state);

      expect(psycheFactory.create).toHaveBeenCalledExactlyOnceWith(state.self.psyche);
    });

    it('Сообщает собранной психике о поступке', () => {
      const psyche = createMockedPsyche();
      const task = new PsycheReactTask(
        { deed: Deed.BottleFound },
        { psycheFactory: createMockedPsycheFactory(psyche) }
      );

      task.applyEffects(new NpcStateBuilder().build());

      expect(psyche.react).toHaveBeenCalledExactlyOnceWith(Deed.BottleFound);
    });

    it('Не меняет то, что NPC знает о мире', () => {
      const task = new PsycheReactTask(
        { deed: Deed.BottleFound },
        { psycheFactory: createMockedPsycheFactory(createMockedPsyche()) }
      );

      const state = task.applyEffects(
        new NpcStateBuilder()
          .withTime({
            day: 1,
            hours: 20,
            minutes: 0,
          })
          .build()
      );

      expect(state.world).toStrictEqual({
        time: {
          day: 1,
          hours: 20,
          minutes: 0,
        },
      });
    });

    it('Кладёт в состояние слепок собранной психики', () => {
      const after = createPsycheState({
        feelings: { [Feeling.Shame]: 28 },
      });
      const task = new PsycheReactTask(
        { deed: Deed.BottleFound },
        { psycheFactory: createMockedPsycheFactory(createMockedPsyche(after)) }
      );

      const state = task.applyEffects(new NpcStateBuilder().build());

      expect(state.self.psyche).toBe(after);
    });
  });
});
