from typing import Optional

from pydantic import BaseModel


class Product(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    images: list[str] = []
    category: Optional[str] = None
    subcategory: Optional[str] = None
    stock: int = 0
