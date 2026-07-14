export type Product = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  images: string[];
  category?: string | null;
  subcategory?: string | null;
  stock: number;
};

export type CategoryWithSubcategories = {
  id: number;
  name: string;
  image_url?: string | null;
  subcategories: { id: number; name: string }[];
};

export type Ad = {
  id: number;
  image_url: string;
  sort_order: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getProducts(filters?: {
  category?: string;
  subcategory?: string;
  search?: string;
  sort?: string;
}): Promise<Product[]> {
  const url = new URL("/products", API_URL);
  if (filters?.category) url.searchParams.set("category", filters.category);
  if (filters?.subcategory)
    url.searchParams.set("subcategory", filters.subcategory);
  if (filters?.search) url.searchParams.set("search", filters.search);
  if (filters?.sort) url.searchParams.set("sort", filters.sort);
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

export async function getCategories(): Promise<CategoryWithSubcategories[]> {
  const res = await fetch(new URL("/categories", API_URL), {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("No se pudieron cargar las categorias");
  return res.json();
}

export async function getAds(): Promise<Ad[]> {
  const res = await fetch(new URL("/ads", API_URL), { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar los banners");
  return res.json();
}
