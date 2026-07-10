import Image from "next/image";
import Link from "next/link";
import type { CategoryWithSubcategories } from "@/lib/api";

export default function CategoryIcons({
  categories,
  selected,
}: {
  categories: CategoryWithSubcategories[];
  selected?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-center gap-3">
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-pink-500">
          Elige una categoria
        </p>
        {selected ? (
          <Link href="/" className="text-xs text-gray-500 hover:underline">
            Ver todas
          </Link>
        ) : null}
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {categories.map((category) => {
          const isSelected = selected === category.name;
          return (
            <Link
              key={category.id}
              href={`/?category=${encodeURIComponent(category.name)}`}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`relative h-36 w-36 overflow-hidden rounded-full ${
                  isSelected ? "ring-2 ring-pink-600" : ""
                }`}
              >
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center text-3xl font-bold text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #ec4899 0%, #2dd4bf 100%)",
                    }}
                  >
                    {category.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  isSelected ? "text-pink-600" : "text-gray-700"
                }`}
              >
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
