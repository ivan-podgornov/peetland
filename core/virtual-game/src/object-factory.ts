import type { CreateObjectOptions, IObjectFactory } from '@peetland/game';

import { VirtualObject } from './object';

export class VirtualObjectFactory implements IObjectFactory {
  create(options: CreateObjectOptions): VirtualObject {
    return new VirtualObject(options);
  }
}
