"use client";

import type { Product } from "@/lib/api";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";
import { formatPrice } from "@/lib/formatPrice";

export default function QuickViewModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar vista rapida"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          ✕
        </button>

        <div className="grid gap-6 sm:grid-cols-2">
          <ProductGallery images={product.images} alt={product.name} />
          <div>
            {product.subcategory ?? product.category ? (
              <span className="text-xs font-semibold uppercase tracking-wide text-pink-500">
                {product.subcategory ?? product.category}
              </span>
            ) : null}
            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              {product.name}
            </h2>
            <p className="mt-3 text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </p>
            {product.description ? (
              <p className="mt-3 text-gray-600">{product.description}</p>
            ) : null}
            <p className="mt-4 text-sm text-gray-500">
              {product.stock > 0
                ? `${product.stock} unidades disponibles`
                : "Sin stock por el momento"}
            </p>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
