import { SessionItem } from './api';

const SESSIONS_KEY = 'vayyuedge_sessions';

export const storage = {
  getSessions(): SessionItem[] {
    try {
      const data = localStorage.getItem(SESSIONS_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveSession(session: SessionItem): void {
    const sessions = this.getSessions();
    const updated = [session, ...sessions.filter((s) => s.id !== session.id)].slice(0, 50);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
  },

  deleteSession(id: string): void {
    const sessions = this.getSessions().filter((s) => s.id !== id);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  },

  clearAll(): void {
    localStorage.removeItem(SESSIONS_KEY);
  },
};
