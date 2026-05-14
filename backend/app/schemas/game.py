from typing import Optional

from pydantic import BaseModel


class GameOut(BaseModel):
    id: int
    name: str
    slug: str
    thumbnail_url: Optional[str] = None
    description: Optional[str] = None
    developer: Optional[str] = None
    genre: Optional[str] = None

    model_config = {"from_attributes": True}
