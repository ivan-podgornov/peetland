import { describe, expect, it } from 'vitest';

import { InMemoryRepository } from '../src';

import { createPlace } from './helpers';

describe('InMemoryRepository', () => {
  describe('#getById', () => {
    it('Возвращает запись с указанным id', async () => {
      const target = createPlace({ id: 'target' });
      const repository = new InMemoryRepository([createPlace({ id: 'other' }), target]);

      const place = await repository.getById('target');

      expect(place).toBe(target);
    });

    it('Если записи с указанным id нет, возвращает undefined', async () => {
      const repository = new InMemoryRepository([createPlace({ id: 'other' })]);

      const place = await repository.getById('target');

      expect(place).toBeUndefined();
    });

    it('Если id не строка, находит запись по строгому равенству', async () => {
      const target = { id: 2 };
      const repository = new InMemoryRepository<{ id: number }, number>([{ id: 1 }, target]);

      const entity = await repository.getById(2);

      expect(entity).toBe(target);
    });
  });
});
