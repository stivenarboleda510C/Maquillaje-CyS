"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import AdsCarousel from "@/components/AdsCarousel";
import CategoryIcons from "@/components/CategoryIcons";
import type { Ad, CategoryWithSubcategories, Product } from "@/lib/api";

export default function ProductCatalog({
  products,
  ads,
  categories,
  category,
  initialQuery,
  subcategory,
  sort,
  children,
}: {
  products: Product[];
  ads: Ad[];
  categories: CategoryWithSubcategories[];
  category?: string;
  initialQuery?: string;
  subcategory?: string;
  sort?: string;
  children?: React.ReactNode;
}) {
  const [query, setQuery] = useState(initialQuery ?? "");

  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(normalized)
    );
  }, [products, query]);

  return (
    <>
      <form
        method="GET"
        action="/"
        className="mt-6 flex max-w-md items-center gap-2"
      >
        {category ? (
          <input type="hidden" name="category" value={category} />
        ) : null}
        {subcategory ? (
          <input type="hidden" name="subcategory" value={subcategory} />
        ) : null}
        {sort ? <input type="hidden" name="sort" value={sort} /> : null}
        <input
          type="text"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full rounded-full border border-pink-200 px-4 py-1.5 text-sm"
        />
        <button
          type="submit"
          className="rounded-full bg-pink-600 px-4 py-1.5 text-sm font-medium text-white"
        >
          Buscar
        </button>
      </form>

      <AdsCarousel ads={ads} />

      {!category ? (
        <CategoryIcons categories={categories} selected={category} />
      ) : null}

      {children}

      {visibleProducts.length === 0 ? (
        <p className="mt-10 text-gray-500">
          No hay productos que coincidan con tu busqueda.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
