"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";

export default function CartBadge() {
  const { totalCount } = useCart();

  return (
    <Link href="/carrito" className="relative text-gray-700 hover:text-pink-600">
      <span className="text-xl">🛒</span>
      {totalCount > 0 ? (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white">
          {totalCount}
        </span>
      ) : null}
    </Link>
  );
}
