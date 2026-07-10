"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { CategoryWithSubcategories } from "@/lib/api";

export default function CategoriesManager({
  categories,
}: {
  categories: CategoryWithSubcategories[];
}) {
  const router = useRouter();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("categories")
      .insert({ name: newCategoryName.trim() });
    setLoading(false);

    if (insertError) {
      setError("No se pudo crear la categoria: " + insertError.message);
      return;
    }

    setNewCategoryName("");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleCreateCategory}
        className="flex items-end gap-3 rounded-xl border border-gray-200 bg-white p-4"
      >
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">
            Nueva categoria
          </label>
          <input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Ej: Ropa"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Crear categoria
        </button>
      </form>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}

      {categories.length === 0 ? (
        <p className="text-gray-500">Todavia no hay categorias.</p>
      ) : null}
    </div>
  );
}

function CategoryCard({ category }: { category: CategoryWithSubcategories }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const [addingSubcategory, setAddingSubcategory] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleRename() {
    if (!editName.trim() || editName === category.name) {
      setIsEditing(false);
      return;
    }
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("categories")
      .update({ name: editName.trim() })
      .eq("id", category.id);

    if (updateError) {
      setError("No se pudo renombrar: " + updateError.message);
      return;
    }
    setIsEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    if (
      !confirm(
        `Borrar la categoria "${category.name}" y todas sus subcategorias? Los productos que la usaban quedaran sin categoria.`
      )
    ) {
      return;
    }
    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);

    if (deleteError) {
      alert("No se pudo borrar la categoria: " + deleteError.message);
      return;
    }
    router.refresh();
  }

  async function handleAddSubcategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newSubcategoryName.trim()) return;

    const supabase = createClient();
    const { error: insertError } = await supabase.from("subcategories").insert({
      category_id: category.id,
      name: newSubcategoryName.trim(),
    });

    if (insertError) {
      setError("No se pudo crear la subcategoria: " + insertError.message);
      return;
    }
    setNewSubcategoryName("");
    setAddingSubcategory(false);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        {isEditing ? (
          <div className="flex flex-1 items-center gap-2">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
              autoFocus
            />
            <button
              type="button"
              onClick={handleRename}
              className="text-sm font-medium text-pink-600 hover:underline"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditName(category.name);
              }}
              className="text-sm text-gray-500 hover:underline"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <h2 className="text-lg font-bold text-gray-900">{category.name}</h2>
        )}

        {!isEditing ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-sm font-medium text-pink-600 hover:underline"
            >
              Renombrar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </div>
        ) : null}
      </div>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <div className="mt-3 flex flex-col gap-1">
        {category.subcategories.map((sub) => (
          <SubcategoryRow key={sub.id} subcategory={sub} />
        ))}
        {category.subcategories.length === 0 && !addingSubcategory ? (
          <p className="text-sm text-gray-500">Sin subcategorias todavia.</p>
        ) : null}
      </div>

      {addingSubcategory ? (
        <form
          onSubmit={handleAddSubcategory}
          className="mt-3 flex items-center gap-2"
        >
          <input
            value={newSubcategoryName}
            onChange={(e) => setNewSubcategoryName(e.target.value)}
            placeholder="Nombre de la subcategoria"
            className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
            autoFocus
          />
          <button
            type="submit"
            className="text-sm font-medium text-pink-600 hover:underline"
          >
            Agregar
          </button>
          <button
            type="button"
            onClick={() => setAddingSubcategory(false)}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancelar
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAddingSubcategory(true)}
          className="mt-3 text-sm font-medium text-pink-600 hover:underline"
        >
          + Nueva subcategoria
        </button>
      )}
    </div>
  );
}

function SubcategoryRow({
  subcategory,
}: {
  subcategory: { id: number; name: string };
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(subcategory.name);

  async function handleRename() {
    if (!editName.trim() || editName === subcategory.name) {
      setIsEditing(false);
      return;
    }
    const supabase = createClient();
    const { error } = await supabase
      .from("subcategories")
      .update({ name: editName.trim() })
      .eq("id", subcategory.id);

    if (error) {
      alert("No se pudo renombrar: " + error.message);
      return;
    }
    setIsEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    if (
      !confirm(
        `Borrar la subcategoria "${subcategory.name}"? Los productos que la usaban quedaran sin subcategoria.`
      )
    ) {
      return;
    }
    const supabase = createClient();
    const { error } = await supabase
      .from("subcategories")
      .delete()
      .eq("id", subcategory.id);

    if (error) {
      alert("No se pudo borrar la subcategoria: " + error.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-gray-50">
      {isEditing ? (
        <div className="flex flex-1 items-center gap-2">
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
            autoFocus
          />
          <button
            type="button"
            onClick={handleRename}
            className="text-sm font-medium text-pink-600 hover:underline"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditName(subcategory.name);
            }}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <span className="text-sm text-gray-700">{subcategory.name}</span>
      )}

      {!isEditing ? (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-sm text-pink-600 hover:underline"
          >
            Renombrar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm text-red-600 hover:underline"
          >
            Eliminar
          </button>
        </div>
      ) : null}
    </div>
  );
}
