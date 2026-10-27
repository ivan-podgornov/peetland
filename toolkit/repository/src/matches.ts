import type { Condition } from './types';

type Operator = (value: unknown, operand: unknown) => boolean;

const operators: Record<string, Operator> = {
  eq: (value, operand) => value === operand,
};

/** Проверяет, что запись подходит под все критерии */
export function matches(
  entity: Readonly<Record<string, unknown>>,
  criteria: Readonly<Record<string, Condition<unknown> | undefined>>
): boolean {
  return Object.entries(criteria).every(([field, condition]) => {
    const value = entity[field];

    return Object.entries(condition ?? {}).every(([name, operand]) => {
      const operator = operators[name];
      if (!operator) {
        throw new Error(`Unsupported operator: ${name}`);
      }

      return operator(value, operand);
    });
  });
}
