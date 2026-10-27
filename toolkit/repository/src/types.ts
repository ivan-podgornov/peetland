/** Запись, которую можно хранить в репозитории */
export type Entity<Id = string> = { readonly id: Id };

/** Типы полей, которые можно сравнивать оператором `eq` */
export type Primitive = string | number | boolean | bigint | symbol | null | undefined;

/** Условие на одно поле записи. Оператор задаётся ключом */
export type Condition<V> = {
  /** Строгое равенство */
  eq: V;
};

/** Условия по полям записи, объединяются через И. Поля-объекты не поддерживаются */
export type Criteria<T> = {
  [K in keyof T as T[K] extends Primitive ? K : never]?: Condition<T[K]>;
};

export interface IRepository<T extends Entity<Id>, Id = string> {
  /** Возвращает промис со всеми записями */
  getAll(): Promise<T[]>;

  /** Возвращает промис с записью по id или `undefined`, если такой записи нет */
  getById(id: Id): Promise<T | undefined>;

  /** Возвращает промис с записями, подходящими под все критерии */
  find(criteria: Criteria<T>): Promise<T[]>;
}
