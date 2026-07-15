import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.database import supabase
from app.schemas import Product

load_dotenv()

app = FastAPI(title="Maquillaje CyS API")

frontend_origin = os.environ.get("FRONTEND_ORIGIN", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "service": "Maquillaje CyS API"}


def _flatten_category_fields(product: dict) -> dict:
    category = product.get("category")
    subcategory = product.get("subcategory")
    images = product.get("images") or []
    product["category"] = category["name"] if category else None
    product["subcategory"] = subcategory["name"] if subcategory else None
    product["images"] = [
        img["image_url"]
        for img in sorted(images, key=lambda img: img["sort_order"])
    ]
    return product


PRODUCT_SELECT = (
    "*, category:categories(name), subcategory:subcategories(name),"
    " images:product_images(image_url, sort_order)"
)


@app.get("/products", response_model=list[Product])
def list_products(
    category: str | None = None,
    subcategory: str | None = None,
    search: str | None = None,
    sort: str | None = None,
):
    query = supabase.table("products").select(PRODUCT_SELECT)
    if search:
        query = query.ilike("name", f"%{search}%")
    if sort == "price_asc":
        query = query.order("price")
    elif sort == "price_desc":
        query = query.order("price", desc=True)
    else:
        query = query.order("sort_order")
    result = query.execute()
    products = [_flatten_category_fields(p) for p in result.data]
    if category:
        products = [p for p in products if p["category"] == category]
    if subcategory:
        products = [p for p in products if p["subcategory"] == subcategory]
    return products


@app.get("/products/{product_id}", response_model=Product)
def get_product(product_id: int):
    result = (
        supabase.table("products")
        .select(PRODUCT_SELECT)
        .eq("id", product_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return _flatten_category_fields(result.data[0])


@app.get("/categories")
def list_categories():
    result = (
        supabase.table("categories")
        .select("id, name, image_url, subcategories(id, name)")
        .order("name")
        .execute()
    )
    return result.data


@app.get("/ads")
def list_ads():
    result = supabase.table("ads").select("*").order("sort_order").execute()
    return result.data
