"use client";

import { useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import AdsCarousel from "@/components/AdsCarousel";
import CategoryIcons from "@/components/CategoryIcons";
import { useSearch } from "@/lib/search/SearchContext";
import type { Ad, CategoryWithSubcategories, Product } from "@/lib/api";

export default function ProductCatalog({
  products,
  ads,
  categories,
  category,
  children,
}: {
  products: Product[];
  ads: Ad[];
  categories: CategoryWithSubcategories[];
  category?: string;
  children?: React.ReactNode;
}) {
  const { query } = useSearch();

  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(normalized)
    );
  }, [products, query]);

  return (
    <>
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
