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


@app.get("/products", response_model=list[Product])
def list_products(category: str | None = None):
    query = supabase.table("products").select("*")
    if category:
        query = query.eq("category", category)
    result = query.execute()
    return result.data


@app.get("/products/{product_id}", response_model=Product)
def get_product(product_id: int):
    result = supabase.table("products").select("*").eq("id", product_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return result.data[0]


@app.get("/categories")
def list_categories():
    result = supabase.table("products").select("category").execute()
    categories = sorted({row["category"] for row in result.data if row["category"]})
    return categories
