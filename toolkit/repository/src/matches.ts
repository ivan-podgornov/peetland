import type { Criteria } from './types';

type Operator = (value: unknown, operand: unknown) => boolean;

const operators: Record<string, Operator> = {
  eq: (value, operand) => value === operand,
};

/** Проверяет, что запись подходит под все критерии */
export function matches<T>(entity: T, criteria: Criteria<T>): boolean {
  return Object.entries(criteria).every(([field, condition]) => {
    const value = (entity as Record<string, unknown>)[field];

    return Object.entries(condition as Record<string, unknown>).every(([name, operand]) => {
      const operator = operators[name];
      if (!operator) {
        throw new Error(`Unsupported operator: ${name}`);
      }

      return operator(value, operand);
    });
  });
}
