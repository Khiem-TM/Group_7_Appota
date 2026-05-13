import json
from typing import Dict, Set

import redis.asyncio as aioredis
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.rooms: Dict[int, Set[WebSocket]] = {}

    async def connect(self, ws: WebSocket, tournament_id: int):
        await ws.accept()
        if tournament_id not in self.rooms:
            self.rooms[tournament_id] = set()
        self.rooms[tournament_id].add(ws)

    def disconnect(self, ws: WebSocket, tournament_id: int):
        if tournament_id in self.rooms:
            self.rooms[tournament_id].discard(ws)
            if not self.rooms[tournament_id]:
                del self.rooms[tournament_id]

    async def broadcast(self, tournament_id: int, data: dict):
        if tournament_id not in self.rooms:
            return
        message = json.dumps(data)
        dead: Set[WebSocket] = set()
        for ws in list(self.rooms[tournament_id]):
            try:
                await ws.send_text(message)
            except Exception:
                dead.add(ws)
        for ws in dead:
            self.rooms[tournament_id].discard(ws)


manager = ConnectionManager()


async def publish_event(redis: aioredis.Redis, tournament_id: int, event: dict):
    channel = f"tournament:{tournament_id}"
    await redis.publish(channel, json.dumps(event))


async def redis_subscriber(redis_url: str):
    """Background task: listen Redis pub/sub and broadcast to WebSocket clients."""
    r = aioredis.from_url(redis_url, decode_responses=True)
    pubsub = r.pubsub()
    await pubsub.psubscribe("tournament:*")

    async for message in pubsub.listen():
        if message["type"] != "pmessage":
            continue
        try:
            channel: str = message["channel"]
            tournament_id = int(channel.split(":")[1])
            data = json.loads(message["data"])
            await manager.broadcast(tournament_id, data)
        except Exception:
            pass
