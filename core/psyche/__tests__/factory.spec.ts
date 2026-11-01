import { describe, expect, it } from 'vitest';

import { Psyche, PsycheFactory } from '../src';

import { createPsycheDeps, createPsycheState } from './helpers';

describe('PsycheFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Psyche', () => {
      const factory = new PsycheFactory(createPsycheDeps());

      const psyche = factory.create(createPsycheState());

      expect(psyche).toBeInstanceOf(Psyche);
    });
  });
});
