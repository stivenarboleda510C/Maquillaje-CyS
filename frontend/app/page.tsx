import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(category),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900">
        Catalogo de maquillaje
      </h1>
      <p className="mt-1 text-gray-600">
        Encuentra tus productos favoritos de maquillaje.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/"
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            !category
              ? "bg-pink-600 text-white"
              : "bg-white text-gray-700 border border-pink-200"
          }`}
        >
          Todas
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/?category=${encodeURIComponent(cat)}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              category === cat
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-700 border border-pink-200"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-gray-500">
          No hay productos en esta categoria todavia.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
