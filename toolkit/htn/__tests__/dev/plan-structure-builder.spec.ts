import { describe, expect, it } from 'vitest';

import { PlanStructureBuilder } from '../../dev';

describe('PlanStructureBuilder', () => {
  it('Если ничего не добавили, собирает пустую структуру', () => {
    expect(new PlanStructureBuilder().build()).toStrictEqual([]);
  });

  it('Собирает примитивные задачи по порядку их именами', () => {
    const structure = new PlanStructureBuilder().primitive('go').primitive('turn').build();

    expect(structure).toStrictEqual(['go', 'turn']);
  });

  it('Собирает составную задачу с методом и детьми из функции', () => {
    const structure = new PlanStructureBuilder()
      .compound('live', 'walk', (live) => live.primitive('go'))
      .build();

    expect(structure).toStrictEqual([
      {
        name: 'live',
        method: 'walk',
        transaction: false,
        children: ['go'],
      },
    ]);
  });

  it('Собирает транзакцию как составную задачу с пометкой транзакции', () => {
    const structure = new PlanStructureBuilder()
      .transaction('purchase', 'pay', (pay) => pay.primitive('give-money'))
      .build();

    expect(structure).toStrictEqual([
      {
        name: 'purchase',
        method: 'pay',
        transaction: true,
        children: ['give-money'],
      },
    ]);
  });
});
