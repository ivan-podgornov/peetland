import { describe, expect, it } from 'vitest';

import { MAX_FEELING, MIN_FEELING, Psyche } from '../src';

import { createPsycheState, createTrait, createTraitFactory } from './helpers';

describe('Psyche', () => {
  describe('#react', () => {
    it('Передаёт поступок каждой черте', () => {
      const pride = createTrait();
      const kindness = createTrait();
      const psyche = new Psyche(createPsycheState({ traits: { pride: 50, kindness: 50 } }), {
        traitFactories: {
          pride: createTraitFactory(pride),
          kindness: createTraitFactory(kindness),
        },
      });

      psyche.react('begging');

      expect(pride.react).toHaveBeenCalledExactlyOnceWith('begging');
      expect(kindness.react).toHaveBeenCalledExactlyOnceWith('begging');
    });

    it('Меняет чувство на вклад черты', () => {
      const psyche = new Psyche(
        createPsycheState({ traits: { pride: 50 }, feelings: { shame: 30 } }),
        { traitFactories: { pride: createTraitFactory(createTrait({ shame: 5 })) } }
      );

      psyche.react('begging');

      expect(psyche.getState().feelings).toStrictEqual({ shame: 35 });
    });

    it('Складывает вклады черт в одно чувство', () => {
      const psyche = new Psyche(
        createPsycheState({ traits: { pride: 50, kindness: 50 }, feelings: { shame: 30 } }),
        {
          traitFactories: {
            pride: createTraitFactory(createTrait({ shame: 5 })),
            kindness: createTraitFactory(createTrait({ shame: -2 })),
          },
        }
      );

      psyche.react('begging');

      expect(psyche.getState().feelings).toStrictEqual({ shame: 33 });
    });

    it('Не меняет чувства, которых нет во вкладах', () => {
      const psyche = new Psyche(
        createPsycheState({ traits: { pride: 50 }, feelings: { shame: 30, joy: 10 } }),
        { traitFactories: { pride: createTraitFactory(createTrait({ shame: 5 })) } }
      );

      psyche.react('begging');

      expect(psyche.getState().feelings).toStrictEqual({ shame: 35, joy: 10 });
    });

    it('Если чувства ещё нет, отсчитывает вклад от MIN_FEELING', () => {
      const psyche = new Psyche(createPsycheState({ traits: { pride: 50 }, feelings: {} }), {
        traitFactories: { pride: createTraitFactory(createTrait({ shame: 5 })) },
      });

      psyche.react('begging');

      expect(psyche.getState().feelings).toStrictEqual({ shame: MIN_FEELING + 5 });
    });

    it('Если чувство превысило бы MAX_FEELING, устанавливает MAX_FEELING', () => {
      const psyche = new Psyche(
        createPsycheState({ traits: { pride: 50 }, feelings: { shame: 90 } }),
        { traitFactories: { pride: createTraitFactory(createTrait({ shame: 20 })) } }
      );

      psyche.react('begging');

      expect(psyche.getState().feelings).toStrictEqual({ shame: MAX_FEELING });
    });

    it('Если чувство опустилось бы ниже MIN_FEELING, устанавливает MIN_FEELING', () => {
      const psyche = new Psyche(
        createPsycheState({ traits: { pride: 50 }, feelings: { shame: 10 } }),
        { traitFactories: { pride: createTraitFactory(createTrait({ shame: -20 })) } }
      );

      psyche.react('begging');

      expect(psyche.getState().feelings).toStrictEqual({ shame: MIN_FEELING });
    });

    it('Применяет пределы к сумме вкладов, а не к каждому вкладу', () => {
      const psyche = new Psyche(
        createPsycheState({ traits: { pride: 50, kindness: 50 }, feelings: { shame: 50 } }),
        {
          traitFactories: {
            pride: createTraitFactory(createTrait({ shame: 80 })),
            kindness: createTraitFactory(createTrait({ shame: -50 })),
          },
        }
      );

      psyche.react('begging');

      expect(psyche.getState().feelings).toStrictEqual({ shame: 80 });
    });

    it('Если вклад не конечное число, выбрасывает RangeError и не меняет чувства', () => {
      const psyche = new Psyche(
        createPsycheState({ traits: { pride: 50, kindness: 50 }, feelings: { shame: 30 } }),
        {
          traitFactories: {
            pride: createTraitFactory(createTrait({ shame: 5 })),
            kindness: createTraitFactory(createTrait({ shame: Infinity })),
          },
        }
      );

      expect(() => psyche.react('begging')).toThrow(RangeError);
      expect(psyche.getState().feelings).toStrictEqual({ shame: 30 });
    });
  });
});
