import { beforeEach, describe, expect, it } from 'vitest';
import { rememberLocalDaemon, shouldTryLocalDaemon } from '../lib/api';

describe('local daemon routing', () => {
  beforeEach(() => localStorage.clear());

  it('does not probe loopback from an unconfigured static deployment', () => {
    expect(shouldTryLocalDaemon()).toBe(false);
  });

  it('probes loopback only after the user selects Advanced native setup', () => {
    rememberLocalDaemon();
    expect(shouldTryLocalDaemon()).toBe(true);
  });
});
