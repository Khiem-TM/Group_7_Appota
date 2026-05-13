from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.realtime import manager

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/tournament/{tournament_id}")
async def websocket_endpoint(ws: WebSocket, tournament_id: int):
    await manager.connect(ws, tournament_id)
    try:
        while True:
            data = await ws.receive_text()
            # Echo ping/pong for keepalive
            if data == "ping":
                await ws.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(ws, tournament_id)
