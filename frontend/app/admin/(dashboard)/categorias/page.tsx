import { getCategories } from "@/lib/api";
import CategoriesManager from "@/components/admin/CategoriesManager";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
      <p className="mt-1 text-sm text-gray-600">
        Organiza el catalogo en categorias (ej. Maquillaje, Ropa) y sus
        subcategorias.
      </p>

      <div className="mt-6">
        <CategoriesManager categories={categories} />
      </div>
    </div>
  );
}
