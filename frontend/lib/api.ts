export type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  category?: string | null;
  stock: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getProducts(category?: string): Promise<Product[]> {
  const url = new URL("/products", API_URL);
  if (category) url.searchParams.set("category", category);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar los productos");
  return res.json();
}

export async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(new URL(`/products/${id}`, API_URL), {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("No se pudo cargar el producto");
  return res.json();
}

export async function getCategories(): Promise<string[]> {
  const res = await fetch(new URL("/categories", API_URL), {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("No se pudieron cargar las categorias");
  return res.json();
}
