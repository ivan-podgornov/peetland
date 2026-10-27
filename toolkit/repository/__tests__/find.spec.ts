import { describe, expect, it } from 'vitest';

import { InMemoryRepository } from '../src';
import type { Criteria } from '../src';

import { createPlace, PlaceType } from './helpers';
import type { Place } from './helpers';

describe('InMemoryRepository', () => {
  describe('#find', () => {
    it('Возвращает записи, у которых поле строго равно значению eq', async () => {
      const trashBin = createPlace({ id: 'trash-bin', type: PlaceType.TrashBin });
      const shop = createPlace({ id: 'shop', type: PlaceType.Shop });
      const repository = new InMemoryRepository([trashBin, shop]);

      const places = await repository.find({ type: { eq: PlaceType.TrashBin } });

      expect(places).toEqual([trashBin]);
    });

    it('Не приводит типы при сравнении через eq', async () => {
      const entity = { id: 'entity', count: 0 as number | string };
      const repository = new InMemoryRepository([entity]);

      const entities = await repository.find({ count: { eq: '0' } });

      expect(entities).toEqual([]);
    });

    it('Если указано несколько полей, возвращает записи, подходящие под все условия', async () => {
      const openTrashBin = createPlace({ id: 'open', type: PlaceType.TrashBin, isOpen: true });
      const closedTrashBin = createPlace({ id: 'closed', type: PlaceType.TrashBin, isOpen: false });
      const openShop = createPlace({ id: 'shop', type: PlaceType.Shop, isOpen: true });
      const repository = new InMemoryRepository([openTrashBin, closedTrashBin, openShop]);

      const places = await repository.find({
        type: { eq: PlaceType.TrashBin },
        isOpen: { eq: true },
      });

      expect(places).toEqual([openTrashBin]);
    });

    it('Если ни одна запись не подходит, возвращает пустой массив', async () => {
      const repository = new InMemoryRepository([createPlace({ type: PlaceType.Shop })]);

      const places = await repository.find({ type: { eq: PlaceType.TrashBin } });

      expect(places).toEqual([]);
    });

    it('Если критерии пустые, возвращает все записи', async () => {
      const first = createPlace({ id: 'first' });
      const second = createPlace({ id: 'second' });
      const repository = new InMemoryRepository([first, second]);

      const places = await repository.find({});

      expect(places).toEqual([first, second]);
    });

    it('Если оператор не поддерживается, выбрасывает ошибку', async () => {
      const repository = new InMemoryRepository([createPlace()]);
      const criteria = { capacity: { gt: 0 } } as unknown as Criteria<Place>;

      await expect(repository.find(criteria)).rejects.toThrow('Unsupported operator: gt');
    });
  });

  describe('Criteria', () => {
    it('Не позволяет указать условие без оператора', () => {
      // @ts-expect-error -- оператор всегда пишется явно
      const criteria: Criteria<Place> = { type: PlaceType.TrashBin };

      expect(criteria).toBeDefined();
    });

    it('Не позволяет указать условие на поле-объект', () => {
      const position = { x: 0, y: 0, z: 0 };
      // @ts-expect-error -- поля-объекты не поддерживаются
      const criteria: Criteria<Place> = { position: { eq: position } };

      expect(criteria).toBeDefined();
    });
  });
});
