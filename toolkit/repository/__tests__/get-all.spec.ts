import { describe, expect, it } from 'vitest';

import { InMemoryRepository } from '../src';

import { createPlace } from './helpers';

describe('InMemoryRepository', () => {
  describe('#getAll', () => {
    it('Возвращает все записи, переданные в конструктор', async () => {
      const first = createPlace({ id: 'first' });
      const second = createPlace({ id: 'second' });
      const repository = new InMemoryRepository([first, second]);

      const places = await repository.getAll();

      expect(places).toEqual([first, second]);
    });

    it('Если записей нет, возвращает пустой массив', async () => {
      const repository = new InMemoryRepository([]);

      const places = await repository.getAll();

      expect(places).toEqual([]);
    });

    it('Если изменить возвращённый массив, не изменяет записи репозитория', async () => {
      const repository = new InMemoryRepository([createPlace()]);

      const places = await repository.getAll();
      places.pop();

      expect(await repository.getAll()).toHaveLength(1);
    });
  });
});
