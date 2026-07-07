import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

type Filters = {
  category?: string;
  q?: string;
  sort?: string;
};

function buildQuery(filters: Filters, overrides: Filters) {
  const merged = { ...filters, ...overrides };
  const params = new URLSearchParams();
  if (merged.category) params.set("category", merged.category);
  if (merged.q) params.set("q", merged.q);
  if (merged.sort) params.set("sort", merged.sort);
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const { category, q, sort } = await searchParams;
  const filters: Filters = { category, q, sort };

  const [products, categories] = await Promise.all([
    getProducts({ category, search: q, sort }),
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

      <form
        method="GET"
        action="/"
        className="mt-6 flex max-w-md items-center gap-2"
      >
        {category ? <input type="hidden" name="category" value={category} /> : null}
        {sort ? <input type="hidden" name="sort" value={sort} /> : null}
        <input
          type="text"
          name="q"
          defaultValue={q}
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildQuery(filters, { category: undefined })}
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
              href={buildQuery(filters, { category: cat })}
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

        <div className="flex gap-2 text-sm">
          <Link
            href={buildQuery(filters, { sort: "price_asc" })}
            className={`hover:underline ${
              sort === "price_asc" ? "font-bold text-pink-600" : "text-gray-600"
            }`}
          >
            Menor precio
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            href={buildQuery(filters, { sort: "price_desc" })}
            className={`hover:underline ${
              sort === "price_desc" ? "font-bold text-pink-600" : "text-gray-600"
            }`}
          >
            Mayor precio
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-gray-500">
          No hay productos que coincidan con tu busqueda.
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
