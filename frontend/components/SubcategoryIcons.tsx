import Link from "next/link";

export default function SubcategoryIcons({
  subcategories,
  category,
  selected,
}: {
  subcategories: { id: number; name: string }[];
  category: string;
  selected?: string;
}) {
  if (subcategories.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-5">
      {subcategories.map((sub) => {
        const isSelected = selected === sub.name;
        return (
          <Link
            key={sub.id}
            href={`/?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(sub.name)}`}
            className="flex flex-col items-center gap-2"
          >
            <div
              className={`flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold text-white ${
                isSelected ? "ring-2 ring-pink-600" : ""
              }`}
              style={{
                background: "linear-gradient(135deg, #ec4899 0%, #2dd4bf 100%)",
              }}
            >
              {sub.name.charAt(0).toUpperCase()}
            </div>
            <span
              className={`text-sm font-medium ${
                isSelected ? "text-pink-600" : "text-gray-700"
              }`}
            >
              {sub.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
