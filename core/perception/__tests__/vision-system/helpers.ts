import { createMockedGeometry } from '@peetland/geometry/dev';

import { createMockedLos } from '../../dev/los';
import type { VisionSystemDeps } from '../../src';

/** Незначимые зависимости системы зрения: геометрия, где все проверки попадания true, и чистая прямая видимость */
export const DEFAULT_DEPS: Omit<VisionSystemDeps, 'registry'> = {
  geometry: createMockedGeometry(),
  los: createMockedLos(),
};
