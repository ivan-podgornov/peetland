import { Geometry } from '@peetland/geometry';

import { AlwaysClearLos } from '../../src';
import type { VisionSystemDeps } from '../../src';

/** Незначимые зависимости системы зрения: прозрачный мир и настоящая геометрия */
export const DEFAULT_DEPS: Omit<VisionSystemDeps, 'registry'> = {
  los: new AlwaysClearLos(),
  geometry: new Geometry(),
};
