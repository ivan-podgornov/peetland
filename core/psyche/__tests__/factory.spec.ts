import { describe, expect, it } from 'vitest';

import { createMockedTraitFactory, createPsycheDeps, createPsycheState } from '../dev';
import { Deed, Feeling, Modifier, Psyche, PsycheFactory, Trait } from '../src';
import { BEGGING_SHAME } from '../src/traits/conscientiousness';
import { LUCK_CHANCE_SPREAD } from '../src/traits/luck';

describe('PsycheFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Psyche', () => {
      const factory = new PsycheFactory(createPsycheDeps());

      const psyche = factory.create(createPsycheState());

      expect(psyche).toBeInstanceOf(Psyche);
    });

    it('Создаёт черту фабрикой из traitFactories со значением черты из состояния', () => {
      const conscientiousnessFactory = createMockedTraitFactory();
      const factory = new PsycheFactory({
        traitFactories: { [Trait.Conscientiousness]: conscientiousnessFactory },
      });

      factory.create(
        createPsycheState({
          traits: {
            [Trait.Conscientiousness]: 70,
            [Trait.Luck]: 50,
          },
        })
      );

      expect(conscientiousnessFactory.create).toHaveBeenCalledExactlyOnceWith(70);
    });

    it('Если фабрика совестливости не передана, стыд растёт от клянчанья по совестливости', () => {
      const factory = new PsycheFactory({
        traitFactories: { [Trait.Luck]: createMockedTraitFactory() },
      });
      const psyche = factory.create(
        createPsycheState({
          traits: {
            [Trait.Conscientiousness]: 100,
            [Trait.Luck]: 50,
          },
        })
      );

      psyche.react(Deed.Begging);

      expect(psyche.getState().feelings[Feeling.Shame]).toBeCloseTo(BEGGING_SHAME * 1.5);
    });

    it('Если фабрика удачливости не передана, модификатор шанса меняется по удачливости', () => {
      const factory = new PsycheFactory({
        traitFactories: { [Trait.Conscientiousness]: createMockedTraitFactory() },
      });
      const psyche = factory.create(
        createPsycheState({
          traits: {
            [Trait.Conscientiousness]: 50,
            [Trait.Luck]: 100,
          },
        })
      );

      expect(psyche.getModifier(Modifier.Chance)).toBeCloseTo(LUCK_CHANCE_SPREAD);
    });
  });
});
