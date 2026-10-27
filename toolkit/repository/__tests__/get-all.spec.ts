import { describe, expect, it } from 'vitest';

import { InMemoryRepository } from '../src';

import { createPlace, mockedPlace } from './helpers';

describe('InMemoryRepository', () => {
  describe('#getAll', () => {
    it('Возвращает все записи, переданные в конструктор', async () => {
      const first = createPlace({ ...mockedPlace, id: 'first' });
      const second = createPlace({ ...mockedPlace, id: 'second' });
      const repository = new InMemoryRepository([first, second]);

      const places = await repository.getAll();

      expect(places).toStrictEqual([first, second]);
    });

    it('Если записей нет, возвращает пустой массив', async () => {
      const repository = new InMemoryRepository([]);

      const places = await repository.getAll();

      expect(places).toStrictEqual([]);
    });

    it('Если изменить возвращённый массив, не изменяет записи репозитория', async () => {
      const repository = new InMemoryRepository([createPlace(mockedPlace)]);

      const places = await repository.getAll();
      places.pop();

      expect(await repository.getAll()).toHaveLength(1);
    });
  });
});
