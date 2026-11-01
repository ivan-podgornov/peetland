import { describe, expect, it } from 'vitest';

import { createPsycheDeps, createPsycheState } from '../dev';
import { Psyche, PsycheFactory } from '../src';

describe('PsycheFactory', () => {
  describe('#create', () => {
    it('Возвращает экземпляр Psyche', () => {
      const factory = new PsycheFactory(createPsycheDeps());

      const psyche = factory.create(createPsycheState());

      expect(psyche).toBeInstanceOf(Psyche);
    });
  });
});
