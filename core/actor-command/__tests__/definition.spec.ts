import { describe, expect, it } from 'vitest';

import { createCommand } from './helpers';

describe('Command', () => {
  it('Берёт название из описания команды', () => {
    const command = createCommand();

    expect(command.name).toBe('test');
  });
});
