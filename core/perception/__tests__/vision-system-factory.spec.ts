import { createMockedRegistry } from '@peetland/game/dev';
import { createMockedGeometry } from '@peetland/geometry/dev';
import { describe, expect, it } from 'vitest';

import { createMockedLos } from '../dev/los';
import { VisionSystem, VisionSystemFactory } from '../src';

describe('VisionSystemFactory', () => {
  it('Возвращает систему зрения из переданных зависимостей', () => {
    const factory = new VisionSystemFactory();

    const system = factory.create({
      registry: createMockedRegistry(),
      los: createMockedLos(),
      geometry: createMockedGeometry(),
    });

    expect(system).toBeInstanceOf(VisionSystem);
  });
});
