import { describe, expect, it } from 'vitest';

import {
  compound,
  method,
  planSteps,
  planTransactions,
  primitive,
  testState,
  transaction,
} from '../../dev';

describe('planTransactions', () => {
  it('Если транзакций нет, возвращает пустой список', () => {
    const root = compound('live', method('walk', primitive('go')));

    expect(planTransactions(planSteps(root, testState) ?? [])).toStrictEqual([]);
  });

  it('Возвращает имена задач транзакции по порядку, а задачи вне транзакций пропускает', () => {
    const purchase = transaction(
      'purchase',
      method('pay', primitive('give-money'), primitive('take'))
    );
    const root = compound('live', method('shop', primitive('go'), purchase, primitive('go-home')));

    expect(planTransactions(planSteps(root, testState) ?? [])).toStrictEqual([
      ['give-money', 'take'],
    ]);
  });

  it('Транзакцию внутри транзакции возвращает частью внешней', () => {
    const pay = transaction('pay', method('give', primitive('give-money')));
    const root = transaction('purchase', method('buy', pay, primitive('take')));

    expect(planTransactions(planSteps(root, testState) ?? [])).toStrictEqual([
      ['give-money', 'take'],
    ]);
  });

  it('Если транзакцию запланировали дважды подряд, возвращает две транзакции', () => {
    const purchase = transaction('purchase', method('pay', primitive('give-money')));
    const root = compound('live', method('shop', purchase, purchase));

    expect(planTransactions(planSteps(root, testState) ?? [])).toStrictEqual([
      ['give-money'],
      ['give-money'],
    ]);
  });
});
