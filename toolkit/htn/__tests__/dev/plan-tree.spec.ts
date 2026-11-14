import { describe, expect, it } from 'vitest';

import {
  PlanStructureBuilder,
  compound,
  method,
  planSteps,
  planTree,
  primitive,
  testState,
  transaction,
} from '../../dev';

describe('planTree', () => {
  it('Если корневая задача примитивная, возвращает её имя', () => {
    const steps = planSteps(primitive('walk'), testState) ?? [];

    expect(planTree(steps)).toStrictEqual(['walk']);
  });

  it('Возвращает составную задачу с выбранным методом и её задачами', () => {
    const root = compound('live', method('walk', primitive('go'), primitive('turn')));

    const tree = planTree(planSteps(root, testState) ?? []);

    expect(tree).toStrictEqual(
      new PlanStructureBuilder()
        .compound('live', 'walk', (live) => live.primitive('go').primitive('turn'))
        .build()
    );
  });

  it('Вкладывает составную задачу в ту, частью которой она запланирована, а задачи после неё — в родителя', () => {
    const purchase = compound('purchase', method('pay', primitive('give-money')));
    const root = compound('live', method('shop', primitive('go'), purchase, primitive('go-home')));

    const tree = planTree(planSteps(root, testState) ?? []);

    expect(tree).toStrictEqual(
      new PlanStructureBuilder()
        .compound('live', 'shop', (live) =>
          live
            .primitive('go')
            .compound('purchase', 'pay', (pay) => pay.primitive('give-money'))
            .primitive('go-home')
        )
        .build()
    );
  });

  it('Помечает транзакции', () => {
    const root = transaction('purchase', method('pay', primitive('give-money')));

    const tree = planTree(planSteps(root, testState) ?? []);

    expect(tree).toStrictEqual(
      new PlanStructureBuilder()
        .transaction('purchase', 'pay', (pay) => pay.primitive('give-money'))
        .build()
    );
  });

  it('Если составную задачу запланировали дважды подряд, возвращает её дважды', () => {
    const purchase = compound('purchase', method('pay', primitive('give-money')));
    const root = compound('live', method('shop', purchase, purchase));

    const tree = planTree(planSteps(root, testState) ?? []);

    expect(tree).toStrictEqual(
      new PlanStructureBuilder()
        .compound('live', 'shop', (live) =>
          live
            .compound('purchase', 'pay', (pay) => pay.primitive('give-money'))
            .compound('purchase', 'pay', (pay) => pay.primitive('give-money'))
        )
        .build()
    );
  });
});
