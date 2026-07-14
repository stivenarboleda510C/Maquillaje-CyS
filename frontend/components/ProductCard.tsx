"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/api";
import QuickViewModal from "@/components/QuickViewModal";
import { formatPrice } from "@/lib/formatPrice";

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const [showQuickView, setShowQuickView] = useState(false);
  const cover = product.images[0];

  return (
    <>
      <Link
        href={`/producto/${product.id}`}
        className="group flex flex-col overflow-hidden rounded-xl border border-pink-100 bg-white transition hover:shadow-lg"
      >
        <div className="relative aspect-square w-full bg-pink-50">
          {cover ? (
            <Image
              src={cover}
              alt={product.name}
              fill
              className="object-cover transition group-hover:scale-105"
            />
          ) : null}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowQuickView(true);
            }}
            aria-label="Vista rapida"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
          >
            <EyeIcon />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          {product.subcategory ?? product.category ? (
            <span className="text-xs font-semibold uppercase tracking-wide text-pink-500">
              {product.subcategory ?? product.category}
            </span>
          ) : null}
          <h2 className="font-semibold text-gray-900">{product.name}</h2>
          <p className="mt-auto text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>

      {showQuickView ? (
        <QuickViewModal
          product={product}
          onClose={() => setShowQuickView(false)}
        />
      ) : null}
    </>
  );
}
