import { Geometry } from '@peetland/geometry';
import { describe, expect, it } from 'vitest';

import { findNearestPlace } from '../../src';
import { createPlace } from '../tasks/helpers';

describe('findNearestPlace', () => {
  it('Возвращает место, ближайшее к позиции', () => {
    const far = createPlace({ id: 'far', position: { x: 10, y: 0, z: 0 } });
    const near = createPlace({ id: 'near', position: { x: 2, y: 0, z: 0 } });

    const place = findNearestPlace([far, near], { x: 0, y: 0, z: 0 }, new Geometry());

    expect(place).toBe(near);
  });

  it('Если ближайших мест несколько, возвращает первое', () => {
    const first = createPlace({ id: 'first', position: { x: 2, y: 0, z: 0 } });
    const second = createPlace({ id: 'second', position: { x: -2, y: 0, z: 0 } });

    const place = findNearestPlace([first, second], { x: 0, y: 0, z: 0 }, new Geometry());

    expect(place).toBe(first);
  });

  it('Если мест нет, возвращает undefined', () => {
    const place = findNearestPlace([], { x: 0, y: 0, z: 0 }, new Geometry());

    expect(place).toBeUndefined();
  });
});
