import logging

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self):
        self.active_connections: set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)

    async def broadcast(self, data: dict):
        dead = set()
        for ws in self.active_connections.copy():
            try:
                await ws.send_json(data)
            except Exception as exc:
                logger.debug("Removing dead WebSocket (%s: %s)", type(exc).__name__, exc)
                dead.add(ws)
        for ws in dead:
            self.active_connections.discard(ws)


manager = ConnectionManager()
