/** Запись, которую можно хранить в репозитории */
export type Entity<Id = string> = { readonly id: Id };

/** Примитивные типы полей */
export type Primitive = string | number | boolean | bigint | symbol | null | undefined;

/** Типы полей, которые проверяет каждый оператор */
export type OperatorValues = {
  eq: Primitive;
};

/** Операнды операторов для поля типа `V` */
export type OperatorOperands<V> = {
  /** Строгое равенство */
  eq: V;
};

/** Имя оператора */
export type OperatorName = keyof OperatorValues;

/**
 * Условие на одно поле записи. Оператор задаётся ключом. В условие попадают только операторы,
 * которые подходят к типу поля. Несколько операторов объединяются через И
 */
export type Condition<V> = Partial<{
  [O in OperatorName as [V] extends [OperatorValues[O]] ? O : never]: OperatorOperands<V>[O];
}>;

/**
 * Тип поля записи. Для необязательного поля TypeScript внутри mapped type отдаёт тип без `undefined`,
 * поэтому `undefined` возвращается явно: так по необязательному полю можно искать через `eq: undefined`
 */
type FieldValue<T, K extends keyof T> = T[K] | (undefined extends T[K] ? undefined : never);

/**
 * Условия по полям записи, объединяются через И. По полю, к которому не подходит ни один оператор,
 * например, полю-объекту, условие задать нельзя
 */
export type Criteria<T> = {
  [K in keyof T]?: keyof Condition<FieldValue<T, K>> extends never
    ? never
    : Condition<FieldValue<T, K>>;
};

export interface IRepository<T extends Entity<Id>, Id = string> {
  /** Возвращает промис со всеми записями */
  getAll(): Promise<T[]>;

  /** Возвращает промис с записью по id или `undefined`, если такой записи нет */
  getById(id: Id): Promise<T | undefined>;

  /** Возвращает промис с записями, подходящими под все критерии */
  find(criteria: Criteria<T>): Promise<T[]>;
}
