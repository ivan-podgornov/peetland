import { describe, expect, it } from 'vitest';

import { Psyche } from '../src';

import { createPsycheState, createTraitFactory } from './helpers';

describe('Psyche', () => {
  describe('#getState', () => {
    it('Возвращает черты из начального состояния', () => {
      const psyche = new Psyche(createPsycheState({ traits: { pride: 70 } }), {
        traitFactories: { pride: createTraitFactory() },
      });

      expect(psyche.getState().traits).toStrictEqual({ pride: 70 });
    });

    it('Возвращает чувства из начального состояния', () => {
      const psyche = new Psyche(createPsycheState({ feelings: { shame: 30 } }), {
        traitFactories: {},
      });

      expect(psyche.getState().feelings).toStrictEqual({ shame: 30 });
    });

    it('Изменение переданного состояния не меняет психику', () => {
      const feelings = { shame: 30 };
      const psyche = new Psyche(createPsycheState({ feelings }), { traitFactories: {} });

      feelings.shame = 50;

      expect(psyche.getState().feelings).toStrictEqual({ shame: 30 });
    });
  });
});
