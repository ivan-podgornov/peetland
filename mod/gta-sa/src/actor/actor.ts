import { Actor } from '@peetland/game';
import type { CreateActorOptions, IActor } from '@peetland/game';
import type { IGeometry } from '@peetland/geometry';
import type { PedHandle } from '@peetland/moonloader';
import {
  createChar,
  dontRemoveChar,
  loadAllModelsNow,
  markModelAsNoLongerNeeded,
  requestModel,
} from '@peetland/moonloader';

import type { IGtaObjectFactory } from '../object';

import { GtaSpawnedActorState } from './spawned-state';

export type ActorDeps = {
  geometry: IGeometry;
  objectFactory: IGtaObjectFactory;
};

export interface IGtaActor extends IActor {
  readonly handle: PedHandle;
}

export class GtaActor extends Actor implements IGtaActor {
  readonly handle: PedHandle;

  constructor(options: CreateActorOptions, deps: ActorDeps) {
    const handle = spawnChar(options);
    super(new GtaSpawnedActorState(handle, deps));
    this.handle = handle;
  }
}

/** Создаёт персонажа в игре и возвращает его handle */
function spawnChar(options: CreateActorOptions): PedHandle {
  requestModel(options.modelId);
  loadAllModelsNow();

  const { x, y, z } = options.position;
  const handle = createChar(4, options.modelId, x, y, z);
  dontRemoveChar(handle);
  markModelAsNoLongerNeeded(options.modelId);

  return handle;
}
