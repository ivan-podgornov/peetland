import { AbortController } from '../../src/abort-controller';
import type { ISubscriber } from '../../src/subscriber';
import type { SubscriberConstructorOptions } from '../../src/subscriber/subscriber';

export function getDefaultConstructorOptions(): SubscriberConstructorOptions {
  return {};
}

export type DeactivateMethod = 'complete' | 'error' | 'signal.abort';

export function createDeactivator(method: DeactivateMethod) {
  return (subscriber: ISubscriber<unknown>, controller: AbortController) => {
    if (method === 'complete') {
      subscriber.complete();
      return;
    }

    if (method === 'error') {
      subscriber.error('some error');
      return;
    }

    if (method === 'signal.abort') {
      controller.abort();
      return;
    }
  };
}
