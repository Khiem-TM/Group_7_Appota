import asyncio
from contextlib import asynccontextmanager, suppress
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.redis import close_redis, init_redis
from app.database import create_tables
from app.routers import (
    announcements,
    auth,
    explore,
    games,
    invitations,
    matches,
    standings,
    tournaments,
    users,
    websocket,
)
from app.services.realtime import redis_subscriber

UPLOAD_ROOT = Path("uploads")
UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)

OPENAPI_TAGS = [
    {
        "name": "auth",
        "description": "Đăng ký, đăng nhập, làm mới token và đăng xuất. "
                       "Sau khi login, copy `access_token` rồi bấm **Authorize** (🔒) ở trên để dùng các endpoint cần xác thực.",
    },
    {
        "name": "users",
        "description": "Xem và cập nhật hồ sơ cá nhân, đổi mật khẩu.",
    },
    {
        "name": "tournaments",
        "description": "Tạo và quản lý giải đấu. Hỗ trợ các thể thức: **single_elimination**, "
                       "**double_elimination**, **round_robin**, **swiss**. "
                       "Bao gồm đăng ký tham gia, tạo bracket và chuyển trạng thái giải.",
    },
    {
        "name": "matches",
        "description": "Xem chi tiết trận đấu và báo cáo kết quả (chỉ HOST/ADMIN).",
    },
    {
        "name": "standings",
        "description": "Bảng xếp hạng của giải đấu, được cache Redis và cập nhật realtime sau mỗi trận.",
    },
    {
        "name": "explore",
        "description": "Khám phá giải đấu đang diễn ra, tìm kiếm theo tên/thể loại, xem trending.",
    },
    {
        "name": "announcements",
        "description": "Thông báo của ban tổ chức trong giải đấu, đẩy realtime qua WebSocket.",
    },
    {
        "name": "websocket",
        "description": "Kết nối WebSocket tại `ws://<host>/ws/tournament/{tournament_id}` "
                       "để nhận cập nhật realtime (kết quả trận, bảng xếp hạng, thông báo). "
                       "Gửi `ping` để giữ kết nối, server trả về `pong`.",
    },
    {
        "name": "health",
        "description": "Kiểm tra trạng thái server.",
    },
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_redis()
    await create_tables()
    subscriber_task = asyncio.create_task(redis_subscriber(settings.REDIS_URL))
    try:
        yield
    finally:
        subscriber_task.cancel()
        with suppress(asyncio.CancelledError):
            await subscriber_task
        await close_redis()


app = FastAPI(
    title="Tournament Platform API",
    description="""
## Nền tảng tổ chức giải đấu realtime

Hỗ trợ các giải eSports, cộng đồng và học đường với đầy đủ tính năng:

- **Xác thực JWT** — access token (15 phút) + refresh token (7 ngày)
- **4 thể thức thi đấu** — Single/Double Elimination, Round Robin, Swiss
- **Realtime** — WebSocket + Redis Pub/Sub cho kết quả và bảng xếp hạng
- **Phân quyền** — PLAYER / HOST / ADMIN

### Cách xác thực
1. Gọi `POST /auth/register` hoặc `POST /auth/login`
2. Copy giá trị `access_token` từ response
3. Bấm nút **Authorize** 🔒 ở trên, dán token vào ô **Value** (không cần tiền tố `Bearer`)
4. Bấm **Authorize** rồi **Close** — tất cả request sẽ tự động đính kèm token
""",
    version="1.0.0",
    lifespan=lifespan,
    openapi_tags=OPENAPI_TAGS,
    swagger_ui_parameters={
        "persistAuthorization": True,
        "displayRequestDuration": True,
        "filter": True,
        "syntaxHighlight.theme": "obsidian",
    },
    contact={
        "name": "Group 7 – Appota Backend",
        "email": "khiemlistss@gmail.com",
    },
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_ROOT)), name="uploads")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(tournaments.router)
app.include_router(matches.router)
app.include_router(standings.router)
app.include_router(explore.router)
app.include_router(explore.router2)
app.include_router(announcements.router)
app.include_router(games.router)
app.include_router(invitations.router)
app.include_router(websocket.router)


@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok", "version": "1.0.0"}
