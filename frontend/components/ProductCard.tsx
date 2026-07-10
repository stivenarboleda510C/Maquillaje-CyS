import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/api";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/producto/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-pink-100 bg-white transition hover:shadow-lg"
    >
      <div className="relative aspect-square w-full bg-pink-50">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.subcategory ?? product.category ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-pink-500">
            {product.subcategory ?? product.category}
          </span>
        ) : null}
        <h2 className="font-semibold text-gray-900">{product.name}</h2>
        <p className="mt-auto text-lg font-bold text-gray-900">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
