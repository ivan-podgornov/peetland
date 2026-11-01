import { Geometry } from '@peetland/geometry';
import { describe, expect, it } from 'vitest';

import { findNearestPlace } from '../../src';
import { createPlace } from '../tasks/helpers';

describe('findNearestPlace', () => {
  it('Возвращает место, ближайшее к позиции', () => {
    const near = createPlace({ id: 'near', position: { x: 5, y: 0, z: 0 } });
    const far = createPlace({ id: 'far', position: { x: -10, y: 0, z: 0 } });

    expect(findNearestPlace([far, near], { x: 0, y: 0, z: 0 }, new Geometry())).toBe(near);
  });

  it('Если ближайших мест несколько, возвращает первое из них', () => {
    const first = createPlace({ id: 'first', position: { x: 5, y: 0, z: 0 } });
    const second = createPlace({ id: 'second', position: { x: -5, y: 0, z: 0 } });

    expect(findNearestPlace([first, second], { x: 0, y: 0, z: 0 }, new Geometry())).toBe(first);
  });

  it('Если мест нет, возвращает undefined', () => {
    expect(findNearestPlace([], { x: 0, y: 0, z: 0 }, new Geometry())).toBeUndefined();
  });
});
