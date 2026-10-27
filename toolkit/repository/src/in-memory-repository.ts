import { matches } from './matches';
import type { Criteria, Entity, IRepository } from './types';

export class InMemoryRepository<T extends Entity<Id>, Id = string> implements IRepository<T, Id> {
  constructor(private readonly entities: readonly T[]) {}

  getAll(): Promise<T[]> {
    return Promise.resolve([...this.entities]);
  }

  getById(id: Id): Promise<T | undefined> {
    return Promise.resolve(this.entities.find((entity) => entity.id === id));
  }

  find(criteria: Criteria<T>): Promise<T[]> {
    // Ошибка в критериях отклоняет промис, а не выбрасывается синхронно
    return new Promise((resolve) => {
      resolve(this.entities.filter((entity) => matches(entity, criteria)));
    });
  }
}
