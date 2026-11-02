import { describe, expect, it } from 'vitest';

import { createMockedTraitFactory, createPsycheDeps, createPsycheState } from '../dev';
import { Deed, Feeling, Psyche, PsycheFactory, Trait } from '../src';
import { BEGGING_SHAME } from '../src/traits/conscientiousness';

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
  });
});
