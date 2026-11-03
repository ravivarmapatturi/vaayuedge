import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  calculateBackoffDelay,
  fetchCapabilities,
  rememberLocalDaemon,
  shouldTryLocalDaemon,
} from '../lib/api';

describe('local daemon routing & probing', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not probe loopback from an unconfigured static deployment', () => {
    expect(shouldTryLocalDaemon()).toBe(false);
  });

  it('probes loopback only after the user selects Advanced native setup', () => {
    rememberLocalDaemon();
    expect(shouldTryLocalDaemon()).toBe(true);
  });

  it('calculates exponential backoff capped at max interval', () => {
    expect(calculateBackoffDelay(0, 2000, 30000, 2)).toBe(2000);
    expect(calculateBackoffDelay(1, 2000, 30000, 2)).toBe(4000);
    expect(calculateBackoffDelay(2, 2000, 30000, 2)).toBe(8000);
    expect(calculateBackoffDelay(3, 2000, 30000, 2)).toBe(16000);
    expect(calculateBackoffDelay(4, 2000, 30000, 2)).toBe(30000);
    expect(calculateBackoffDelay(10, 2000, 30000, 2)).toBe(30000);
  });

  it('deduplicates simultaneous in-flight capability probes to probe once on load', async () => {
    rememberLocalDaemon();
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return new Response(JSON.stringify({ processing_mode: 'local' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    const [res1, res2] = await Promise.all([
      fetchCapabilities(),
      fetchCapabilities(),
    ]);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(res1.isConnected).toBe(true);
    expect(res2.isConnected).toBe(true);
  });

  it('probes on demand when user asks for the local engine with force=true', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
      return new Response(JSON.stringify({ processing_mode: 'local' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    const cap = await fetchCapabilities(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(cap.isConnected).toBe(true);
  });

  it('handles connection refusal gracefully and marks not connected without throwing', async () => {
    rememberLocalDaemon();
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

    const cap = await fetchCapabilities();
    expect(cap.isConnected).toBe(false);
    expect(cap.asr.is_ready).toBe(false);
  });
});
