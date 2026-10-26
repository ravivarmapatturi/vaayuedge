import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../lib/storage';
import { SessionItem } from '../lib/api';

describe('Local Storage Session Manager', () => {
  beforeEach(() => {
    storage.clearAll();
  });

  it('saves and retrieves sessions accurately', () => {
    const mockSession: SessionItem = {
      id: 'sess-1',
      created_at: new Date().toISOString(),
      audio_duration_seconds: 4.2,
      transcript: 'Hello world',
      translation: 'నమస్కారం ప్రపంచం',
      processing_mode: 'local',
    };

    storage.saveSession(mockSession);
    const sessions = storage.getSessions();
    expect(sessions.length).toBe(1);
    expect(sessions[0].id).toBe('sess-1');
    expect(sessions[0].transcript).toBe('Hello world');
    expect(sessions[0].translation).toBe('నమస్కారం ప్రపంచం');
  });

  it('deletes an individual session by ID', () => {
    const session1: SessionItem = {
      id: 'sess-1',
      created_at: new Date().toISOString(),
      audio_duration_seconds: 3.0,
      transcript: 'One',
      translation: 'ఒకటి',
      processing_mode: 'local',
    };
    const session2: SessionItem = {
      id: 'sess-2',
      created_at: new Date().toISOString(),
      audio_duration_seconds: 2.0,
      transcript: 'Two',
      translation: 'రెండు',
      processing_mode: 'local',
    };

    storage.saveSession(session1);
    storage.saveSession(session2);
    expect(storage.getSessions().length).toBe(2);

    storage.deleteSession('sess-1');
    const remaining = storage.getSessions();
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe('sess-2');
  });

  it('clears all sessions completely', () => {
    storage.saveSession({
      id: 'sess-test',
      created_at: new Date().toISOString(),
      audio_duration_seconds: 1.0,
      transcript: 'Test',
      translation: 'పరీక్ష',
      processing_mode: 'local',
    });

    storage.clearAll();
    expect(storage.getSessions().length).toBe(0);
  });
});
