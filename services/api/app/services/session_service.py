from typing import Dict, List, Optional
from app.schemas.contracts import SessionRecord


class LocalSessionService:
    """
    Manages transient session records on the local host.
    Ensures user data can be explicitly listed, exported, and purged on demand.
    """

    def __init__(self):
        self._sessions: Dict[str, SessionRecord] = {}

    def add_session(self, session: SessionRecord) -> SessionRecord:
        self._sessions[session.id] = session
        return session

    def list_sessions(self) -> List[SessionRecord]:
        # Return sessions sorted newest first
        return sorted(self._sessions.values(), key=lambda s: s.created_at, reverse=True)

    def get_session(self, session_id: str) -> Optional[SessionRecord]:
        return self._sessions.get(session_id)

    def delete_session(self, session_id: str) -> bool:
        if session_id in self._sessions:
            del self._sessions[session_id]
            return True
        return False

    def clear_all(self) -> int:
        count = len(self._sessions)
        self._sessions.clear()
        return count


session_service = LocalSessionService()
