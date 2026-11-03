import { describe, expect, it } from 'vitest';

import { createCommand } from '../dev';

describe('Command', () => {
  it('Берёт название из описания команды', () => {
    const command = createCommand();

    expect(command.name).toBe('test');
  });
});
