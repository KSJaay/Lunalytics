import { describe, it, expect } from 'vitest';

import randomId from '../../../server/utils/randomId.js';

const UUID_V7 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('server/utils/randomId', () => {
  it('returns a valid UUID v7 string', () => {
    expect(randomId()).toMatch(UUID_V7);
  });

  it('does not collide across many invocations', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 1000; i++) seen.add(randomId());
    expect(seen.size).toBe(1000);
  });
});
