"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { CategoryWithSubcategories } from "@/lib/api";

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9-4 1 1-4 9.9-9.9a2 2 0 012.828 0z"
      />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z"
      />
    </svg>
  );
}

function IconButton({
  onClick,
  variant,
  label,
}: {
  onClick: (e: React.MouseEvent) => void;
  variant: "edit" | "delete";
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      aria-label={label}
      className={`flex h-7 w-7 items-center justify-center rounded-md border ${
        variant === "edit"
          ? "border-pink-300 text-pink-600 hover:bg-pink-50"
          : "border-red-300 text-red-600 hover:bg-red-50"
      }`}
    >
      {variant === "edit" ? <EditIcon /> : <DeleteIcon />}
    </button>
  );
}

export default function CategoriesManager({
  categories,
}: {
  categories: CategoryWithSubcategories[];
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(
    categories[0]?.id ?? null
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<
    number | null
  >(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const selectedCategory =
    categories.find((c) => c.id === selectedId) ?? null;

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setError(null);

    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("categories")
      .insert({ name: newCategoryName.trim() });

    if (insertError) {
      setError("No se pudo crear la categoria: " + insertError.message);
      return;
    }
    setNewCategoryName("");
    router.refresh();
  }

  async function handleRenameCategory(id: number) {
    if (!editName.trim()) {
      setEditingCategoryId(null);
      return;
    }
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("categories")
      .update({ name: editName.trim() })
      .eq("id", id);

    if (updateError) {
      setError("No se pudo renombrar: " + updateError.message);
      return;
    }
    setEditingCategoryId(null);
    router.refresh();
  }

  async function handleDeleteCategory(category: CategoryWithSubcategories) {
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
    if (selectedId === category.id) setSelectedId(null);
    router.refresh();
  }

  async function handleCreateSubcategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newSubcategoryName.trim() || !selectedCategory) return;
    setError(null);

    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("subcategories")
      .insert({
        category_id: selectedCategory.id,
        name: newSubcategoryName.trim(),
      });

    if (insertError) {
      setError("No se pudo crear la subcategoria: " + insertError.message);
      return;
    }
    setNewSubcategoryName("");
    router.refresh();
  }

  async function handleRenameSubcategory(id: number) {
    if (!editName.trim()) {
      setEditingSubcategoryId(null);
      return;
    }
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("subcategories")
      .update({ name: editName.trim() })
      .eq("id", id);

    if (updateError) {
      setError("No se pudo renombrar: " + updateError.message);
      return;
    }
    setEditingSubcategoryId(null);
    router.refresh();
  }

  async function handleDeleteSubcategory(id: number, name: string) {
    if (
      !confirm(
        `Borrar la subcategoria "${name}"? Los productos que la usaban quedaran sin subcategoria.`
      )
    ) {
      return;
    }
    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("subcategories")
      .delete()
      .eq("id", id);

    if (deleteError) {
      alert("No se pudo borrar la subcategoria: " + deleteError.message);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-4 py-3">
            <h2 className="font-bold text-gray-900">Categorias</h2>
          </div>

          <ul>
            {categories.map((category) => (
              <li
                key={category.id}
                onClick={() => setSelectedId(category.id)}
                className={`flex cursor-pointer items-center justify-between border-b border-gray-50 px-4 py-2.5 ${
                  selectedId === category.id ? "bg-pink-50" : "hover:bg-gray-50"
                }`}
              >
                {editingCategoryId === category.id ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameCategory(category.id);
                      if (e.key === "Escape") setEditingCategoryId(null);
                    }}
                    autoFocus
                    className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
                  />
                ) : (
                  <span
                    className={`text-sm ${
                      selectedId === category.id
                        ? "font-semibold text-pink-600"
                        : "text-gray-700"
                    }`}
                  >
                    {category.name}
                  </span>
                )}

                <div className="flex items-center gap-1.5">
                  {editingCategoryId === category.id ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameCategory(category.id);
                      }}
                      className="text-xs font-medium text-pink-600 hover:underline"
                    >
                      Guardar
                    </button>
                  ) : (
                    <IconButton
                      variant="edit"
                      label="Renombrar categoria"
                      onClick={() => {
                        setEditingCategoryId(category.id);
                        setEditName(category.name);
                      }}
                    />
                  )}
                  <IconButton
                    variant="delete"
                    label="Eliminar categoria"
                    onClick={() => handleDeleteCategory(category)}
                  />
                </div>
              </li>
            ))}
          </ul>

          <form
            onSubmit={handleCreateCategory}
            className="flex gap-2 border-t border-gray-100 p-3"
          >
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nueva categoria"
              className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
            />
            <button
              type="submit"
              className="rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold text-white"
            >
              Agregar
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-4 py-3">
            <h2 className="font-bold text-gray-900">
              Subcategorias
              {selectedCategory ? ` de ${selectedCategory.name}` : ""}
            </h2>
          </div>

          {!selectedCategory ? (
            <p className="p-4 text-sm text-gray-500">
              Elige una categoria de la izquierda.
            </p>
          ) : (
            <>
              <ul>
                {selectedCategory.subcategories.map((sub) => (
                  <li
                    key={sub.id}
                    className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5"
                  >
                    {editingSubcategoryId === sub.id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRenameSubcategory(sub.id);
                          if (e.key === "Escape") setEditingSubcategoryId(null);
                        }}
                        autoFocus
                        className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
                      />
                    ) : (
                      <span className="text-sm text-gray-700">{sub.name}</span>
                    )}

                    <div className="flex items-center gap-1.5">
                      {editingSubcategoryId === sub.id ? (
                        <button
                          type="button"
                          onClick={() => handleRenameSubcategory(sub.id)}
                          className="text-xs font-medium text-pink-600 hover:underline"
                        >
                          Guardar
                        </button>
                      ) : (
                        <IconButton
                          variant="edit"
                          label="Renombrar subcategoria"
                          onClick={() => {
                            setEditingSubcategoryId(sub.id);
                            setEditName(sub.name);
                          }}
                        />
                      )}
                      <IconButton
                        variant="delete"
                        label="Eliminar subcategoria"
                        onClick={() => handleDeleteSubcategory(sub.id, sub.name)}
                      />
                    </div>
                  </li>
                ))}
                {selectedCategory.subcategories.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-gray-500">
                    Sin subcategorias todavia.
                  </li>
                ) : null}
              </ul>

              <form
                onSubmit={handleCreateSubcategory}
                className="flex gap-2 border-t border-gray-100 p-3"
              >
                <input
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                  placeholder="Nueva subcategoria"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold text-white"
                >
                  Agregar
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
