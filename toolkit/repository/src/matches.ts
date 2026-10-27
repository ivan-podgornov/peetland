import type { Condition, Criteria, OperatorName, OperatorOperands, OperatorValues } from './types';

type Operator<O extends OperatorName> = <V extends OperatorValues[O]>(
  value: V,
  operand: OperatorOperands<V>[O]
) => boolean;

/** Реализации операторов. Каждая типизирована по своему типу поля и операнду */
const operators: { [O in OperatorName]: Operator<O> } = {
  eq: (value, operand) => value === operand,
};

/**
 * Оператор без привязки к типу поля. Его типы уже проверены в `Condition`: оператор попадает
 * в условие, только если подходит к типу поля
 */
type UntypedOperator = (value: unknown, operand: unknown) => boolean;

function getOperator(name: string): UntypedOperator {
  const operator = Object.entries(operators).find(([operatorName]) => operatorName === name);
  if (!operator) {
    throw new Error(`Unsupported operator: ${name}`);
  }

  return operator[1] as UntypedOperator;
}

function matchesCondition<V>(value: V, condition: Condition<V>): boolean {
  return Object.entries(condition).every(([name, operand]) => getOperator(name)(value, operand));
}

/** Проверяет, что запись подходит под все критерии */
export function matches<T>(entity: T, criteria: Criteria<T>): boolean {
  return keys(criteria).every((field) => {
    const condition = criteria[field];

    return condition === undefined || matchesCondition(entity[field], condition);
  });
}

/** Возвращает ключи объекта. `Object.keys` теряет их тип, поэтому он восстанавливается здесь */
function keys<T extends object>(object: T): (keyof T)[] {
  return Object.keys(object) as (keyof T)[];
}
