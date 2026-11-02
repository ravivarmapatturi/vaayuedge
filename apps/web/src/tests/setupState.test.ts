import { describe, expect, it, vi } from 'vitest';
import { canRecordAudio, classifySetupFailure, formatBytes, setupFailureMessage, stopMediaTracks, summarizeSetupProgress } from '../lib/setupState';

describe('on-device setup state', () => {
  it('reports real aggregate bytes and never calls an in-progress download complete', () => {
    const files = new Map([
      ['asr/model.onnx', { loaded: 75, total: 100 }],
      ['mt/model.onnx', { loaded: 25, total: 100 }],
    ]);
    expect(summarizeSetupProgress(files, 'mt/model.onnx')).toEqual({
      percent: 50,
      loadedBytes: 100,
      totalBytes: 200,
      currentFile: 'mt/model.onnx',
    });
    expect(summarizeSetupProgress(new Map([['one', { loaded: 100, total: 100 }]])).percent).toBe(99);
  });

  it.each([
    [new Error('WebAssembly is not supported'), 'unsupported'],
    [new RangeError('Out of memory'), 'memory'],
    [new TypeError('Failed to fetch'), 'network'],
    [new Error('unexpected'), 'generic'],
  ] as const)('maps %s to a recoverable %s state', (error, expected) => {
    expect(classifySetupFailure(error)).toBe(expected);
    expect(setupFailureMessage(expected)).toMatch(/try|retry|use/i);
  });

  it('formats byte progress for people', () => {
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(0)).toBe('0 B');
  });

  it('rejects incomplete recording APIs and stops every acquired track after a startup failure', () => {
    expect(canRecordAudio({ hasGetUserMedia: true, hasMediaRecorder: false })).toBe(false);
    expect(canRecordAudio({ hasGetUserMedia: true, hasMediaRecorder: true })).toBe(true);
    const tracks = [{ stop: vi.fn() }, { stop: vi.fn() }];
    stopMediaTracks({ getTracks: () => tracks as unknown as MediaStreamTrack[] });
    tracks.forEach((track) => expect(track.stop).toHaveBeenCalledOnce());
  });
});
