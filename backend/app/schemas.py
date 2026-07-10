from typing import Optional

from pydantic import BaseModel


class Product(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    stock: int = 0
