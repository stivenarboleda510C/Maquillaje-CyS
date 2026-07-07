"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart/CartContext";
import type { Product } from "@/lib/api";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (product.stock <= 0) {
    return null;
  }

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="mt-6 flex items-center gap-3">
      <div className="flex items-center rounded-full border border-gray-300">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3 py-1.5 text-gray-600"
        >
          -
        </button>
        <span className="w-8 text-center text-sm">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          className="px-3 py-1.5 text-gray-600"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="rounded-full bg-pink-600 px-5 py-2 text-sm font-semibold text-white"
      >
        {added ? "Agregado!" : "Agregar al carrito"}
      </button>
    </div>
  );
}
