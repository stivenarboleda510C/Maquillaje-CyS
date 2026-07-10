import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";
import AddToCartButton from "@/components/AddToCartButton";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-pink-50">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : null}
        </div>
        <div>
          {product.subcategory ?? product.category ? (
            <span className="text-sm font-semibold uppercase tracking-wide text-pink-500">
              {product.subcategory ?? product.category}
            </span>
          ) : null}
          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
          {product.description ? (
            <p className="mt-4 text-gray-600">{product.description}</p>
          ) : null}
          <p className="mt-6 text-sm text-gray-500">
            {product.stock > 0
              ? `${product.stock} unidades disponibles`
              : "Sin stock por el momento"}
          </p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
