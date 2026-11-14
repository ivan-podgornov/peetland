import { describe, expect, it } from 'vitest';

import { compound, method, node, primitive, transaction } from '../../dev';
import { findTransaction } from '../../src';

describe('findTransaction', () => {
  it('Если шаг не часть составной задачи, возвращает null', () => {
    const step = {
      task: primitive('Walk'),
      isPartOf: null,
    };

    expect(findTransaction(step)).toBeNull();
  });

  it('Если ни одна задача в цепочке не транзакция, возвращает null', () => {
    const root = node(compound('Root', method('Live')));
    const step = {
      task: primitive('Walk'),
      isPartOf: node(compound('Go', method('Walk')), root),
    };

    expect(findTransaction(step)).toBeNull();
  });

  it('Возвращает узел транзакции, частью которой запланирован шаг', () => {
    const purchase = node(transaction('Purchase', method('Pay')));
    const step = {
      task: primitive('Pay'),
      isPartOf: purchase,
    };

    expect(findTransaction(step)).toBe(purchase);
  });

  it('Если транзакция выше по цепочке, возвращает её узел', () => {
    const purchase = node(transaction('Purchase', method('Pay')));
    const step = {
      task: primitive('Give money'),
      isPartOf: node(compound('Pay', method('Give')), purchase),
    };

    expect(findTransaction(step)).toBe(purchase);
  });

  it('Если транзакция внутри транзакции, возвращает узел внешней', () => {
    const purchase = node(transaction('Purchase', method('Pay')));
    const step = {
      task: primitive('Give money'),
      isPartOf: node(transaction('Pay', method('Give')), purchase),
    };

    expect(findTransaction(step)).toBe(purchase);
  });
});
