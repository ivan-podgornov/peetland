import { Deed, Feeling } from '@peetland/psyche';
import {
  createMockedPsyche,
  createMockedPsycheFactory,
  createPsycheState,
} from '@peetland/psyche/dev';
import { describe, expect, it } from 'vitest';

import { PsycheReactTask } from '../../src';

import { createNpcContext, createNpcState } from './helpers';

describe('PsycheReactTask', () => {
  describe('#start', () => {
    it('Сообщает психике из контекста о поступке', () => {
      const psyche = createMockedPsyche();
      const context = { ...createNpcContext(), psyche };
      const task = new PsycheReactTask(
        { deed: Deed.BottleFound },
        { psycheFactory: createMockedPsycheFactory() }
      );

      task.start(createNpcState(), context);

      expect(psyche.react).toHaveBeenCalledExactlyOnceWith(Deed.BottleFound);
    });

    it("Возвращает 'success'", () => {
      const task = new PsycheReactTask(
        { deed: Deed.BottleFound },
        { psycheFactory: createMockedPsycheFactory() }
      );

      const result = task.start(createNpcState(), createNpcContext());

      expect(result).toBe('success');
    });
  });

  describe('#applyEffects', () => {
    it('Собирает психику фабрикой из слепка психики в состоянии', () => {
      const psycheFactory = createMockedPsycheFactory();
      const state = createNpcState({
        psyche: createPsycheState({
          feelings: { [Feeling.Shame]: 30 },
        }),
      });
      const task = new PsycheReactTask({ deed: Deed.BottleFound }, { psycheFactory });

      task.applyEffects(state);

      expect(psycheFactory.create).toHaveBeenCalledExactlyOnceWith(state.psyche);
    });

    it('Сообщает собранной психике о поступке', () => {
      const psyche = createMockedPsyche();
      const task = new PsycheReactTask(
        { deed: Deed.BottleFound },
        { psycheFactory: createMockedPsycheFactory(psyche) }
      );

      task.applyEffects(createNpcState());

      expect(psyche.react).toHaveBeenCalledExactlyOnceWith(Deed.BottleFound);
    });

    it('Кладёт в состояние слепок собранной психики', () => {
      const after = createPsycheState({
        feelings: { [Feeling.Shame]: 28 },
      });
      const task = new PsycheReactTask(
        { deed: Deed.BottleFound },
        { psycheFactory: createMockedPsycheFactory(createMockedPsyche(after)) }
      );

      const state = task.applyEffects(createNpcState());

      expect(state.psyche).toBe(after);
    });
  });
});
