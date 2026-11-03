import { describe } from 'vitest';

import { describeBehaviourOnErrorInObserver } from '../../dev';
import { describeBehaviourWhenMethodAbsent } from '../../dev';
import { describeRecallObserver } from '../../dev';
import { describeSignalFinish } from '../../dev';

describe('MulticastObserver', () => {
  describe('#complete', () => {
    describeRecallObserver({ method: 'complete' });
    describeBehaviourOnErrorInObserver({ method: 'complete' });
    describeBehaviourWhenMethodAbsent({
      method: 'complete',
      observerAsFunction: false,
    });
    describeBehaviourWhenMethodAbsent({
      method: 'complete',
      observerAsFunction: true,
    });
    describeSignalFinish({
      method: 'complete',
      reason: 'subscriber success',
    });
  });
});
