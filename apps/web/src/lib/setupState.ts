export type SetupFailureKind = 'unsupported' | 'memory' | 'network' | 'generic';

export interface SetupProgress {
  percent: number;
  loadedBytes: number;
  totalBytes: number;
  currentFile: string;
}

export function summarizeSetupProgress(
  files: ReadonlyMap<string, { loaded: number; total: number }>,
  currentFile = ''
): SetupProgress {
  let loadedBytes = 0;
  let totalBytes = 0;
  files.forEach((file) => {
    loadedBytes += Number.isFinite(file.loaded) ? Math.max(0, file.loaded) : 0;
    totalBytes += Number.isFinite(file.total) ? Math.max(0, file.total) : 0;
  });
  return {
    percent: totalBytes ? Math.min(99, Math.floor((loadedBytes / totalBytes) * 100)) : 0,
    loadedBytes,
    totalBytes,
    currentFile,
  };
}

export function classifySetupFailure(error: unknown): SetupFailureKind {
  const message = error instanceof Error ? `${error.name} ${error.message}` : String(error ?? '');
  if (/webassembly|worker|not supported|unsupported/i.test(message)) return 'unsupported';
  if (/out of memory|allocation failed|memory access out of bounds|oom/i.test(message)) return 'memory';
  if (/fetch|network|offline|load failed|failed to load/i.test(message)) return 'network';
  return 'generic';
}

export function setupFailureMessage(kind: SetupFailureKind): string {
  if (kind === 'unsupported') {
    return 'This browser cannot run the on-device engine. Try the latest Chrome, Edge, Firefox, or Safari, or use the text demo without setup.';
  }
  if (kind === 'memory') {
    return 'This device ran out of memory while loading the models. Close other tabs and apps, then retry. If it fails again, use the text demo without setup.';
  }
  if (kind === 'network') {
    return 'The model download did not finish. Check your connection and retry; files already cached by the browser do not need to be downloaded again.';
  }
  return 'The on-device engine could not be set up. Retry, or use the text demo without setup.';
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(index === 0 || value >= 100 ? 0 : 1)} ${units[index]}`;
}

export function canRecordAudio(environment: {
  hasGetUserMedia: boolean;
  hasMediaRecorder: boolean;
}): boolean {
  return environment.hasGetUserMedia && environment.hasMediaRecorder;
}

export function stopMediaTracks(stream: Pick<MediaStream, 'getTracks'>): void {
  stream.getTracks().forEach((track) => track.stop());
}
