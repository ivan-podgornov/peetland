import { describe, expect, it } from 'vitest';

import { InMemoryRepository } from '../src';
import type { Criteria } from '../src';

import { createPlace, mockedPlace, PlaceType } from './helpers';
import type { Place } from './helpers';

describe('InMemoryRepository', () => {
  describe('#find', () => {
    it('Возвращает записи, у которых поле строго равно значению eq', async () => {
      const trashBin = createPlace({ ...mockedPlace, id: 'trash-bin', type: PlaceType.TrashBin });
      const shop = createPlace({ ...mockedPlace, id: 'shop', type: PlaceType.Shop });
      const repository = new InMemoryRepository([trashBin, shop]);

      const places = await repository.find({ type: { eq: PlaceType.TrashBin } });

      expect(places).toStrictEqual([trashBin]);
    });

    it('Не приводит типы при сравнении через eq', async () => {
      const entity: { id: string; count: number | string } = { id: 'entity', count: 0 };
      const repository = new InMemoryRepository([entity]);

      const entities = await repository.find({ count: { eq: '0' } });

      expect(entities).toStrictEqual([]);
    });

    it('Если указано несколько полей, возвращает записи, подходящие под все условия', async () => {
      const openTrashBin = createPlace({
        ...mockedPlace,
        id: 'open',
        type: PlaceType.TrashBin,
        isOpen: true,
      });
      const closedTrashBin = createPlace({
        ...mockedPlace,
        id: 'closed',
        type: PlaceType.TrashBin,
        isOpen: false,
      });
      const openShop = createPlace({
        ...mockedPlace,
        id: 'shop',
        type: PlaceType.Shop,
        isOpen: true,
      });
      const repository = new InMemoryRepository([openTrashBin, closedTrashBin, openShop]);

      const places = await repository.find({
        type: { eq: PlaceType.TrashBin },
        isOpen: { eq: true },
      });

      expect(places).toStrictEqual([openTrashBin]);
    });

    it('Если ни одна запись не подходит, возвращает пустой массив', async () => {
      const repository = new InMemoryRepository([
        createPlace({ ...mockedPlace, type: PlaceType.Shop }),
      ]);

      const places = await repository.find({ type: { eq: PlaceType.TrashBin } });

      expect(places).toStrictEqual([]);
    });

    it('Если критерии пустые, возвращает все записи', async () => {
      const first = createPlace({ ...mockedPlace, id: 'first' });
      const second = createPlace({ ...mockedPlace, id: 'second' });
      const repository = new InMemoryRepository([first, second]);

      const places = await repository.find({});

      expect(places).toStrictEqual([first, second]);
    });

    it('Если оператор не поддерживается, выбрасывает ошибку', async () => {
      const repository = new InMemoryRepository([createPlace(mockedPlace)]);
      const criteria = { capacity: { gt: 0 } } as unknown as Criteria<Place>;

      await expect(repository.find(criteria)).rejects.toThrow('Unsupported operator: gt');
    });
  });
});
