import Link from "next/link";
import { getAds, getCategories, getProducts } from "@/lib/api";
import ProductCatalog from "@/components/ProductCatalog";

type Filters = {
  subcategory?: string;
  q?: string;
  sort?: string;
};

function buildQuery(filters: Filters, overrides: Filters) {
  const merged = { ...filters, ...overrides };
  const params = new URLSearchParams();
  if (merged.subcategory) params.set("subcategory", merged.subcategory);
  if (merged.q) params.set("q", merged.q);
  if (merged.sort) params.set("sort", merged.sort);
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ subcategory?: string; q?: string; sort?: string }>;
}) {
  const { subcategory, q, sort } = await searchParams;
  const filters: Filters = { subcategory, q, sort };

  const [products, categories, ads] = await Promise.all([
    getProducts({ subcategory, search: q, sort }),
    getCategories(),
    getAds(),
  ]);

  const subcategoryNames = Array.from(
    new Set(categories.flatMap((c) => c.subcategories.map((s) => s.name)))
  ).sort();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900">
        Catalogo de maquillaje
      </h1>
      <p className="mt-1 text-gray-600">
        Encuentra tus productos favoritos de maquillaje.
      </p>

      <ProductCatalog
        products={products}
        ads={ads}
        initialQuery={q}
        subcategory={subcategory}
        sort={sort}
      >
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildQuery(filters, { subcategory: undefined })}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                !subcategory
                  ? "bg-pink-600 text-white"
                  : "bg-white text-gray-700 border border-pink-200"
              }`}
            >
              Todas
            </Link>
            {subcategoryNames.map((name) => (
              <Link
                key={name}
                href={buildQuery(filters, { subcategory: name })}
                className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                  subcategory === name
                    ? "bg-pink-600 text-white"
                    : "bg-white text-gray-700 border border-pink-200"
                }`}
              >
                {name}
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
      </ProductCatalog>
    </div>
  );
}
