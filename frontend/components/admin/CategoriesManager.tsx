"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { CategoryWithSubcategories } from "@/lib/api";
import IconButton from "@/components/admin/IconButton";

async function uploadCategoryImage(file: File): Promise<string> {
  const supabase = createClient();
  const path = `${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("category-images")
    .upload(path, file);

  if (uploadError) {
    throw new Error("No se pudo subir la imagen: " + uploadError.message);
  }

  const { data } = supabase.storage.from("category-images").getPublicUrl(path);
  return data.publicUrl;
}

function CategoryThumbnail({
  category,
  size = 40,
}: {
  category: CategoryWithSubcategories;
  size?: number;
}) {
  if (category.image_url) {
    return (
      <div
        className="relative shrink-0 overflow-hidden rounded-full bg-pink-50"
        style={{ width: size, height: size }}
      >
        <Image src={category.image_url} alt={category.name} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #ec4899 0%, #2dd4bf 100%)",
      }}
    >
      {category.name.charAt(0).toUpperCase()}
    </div>
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
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<
    number | null
  >(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploadingImageId, setUploadingImageId] = useState<number | null>(
    null
  );

  const selectedCategory =
    categories.find((c) => c.id === selectedId) ?? null;

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setError(null);

    let imageUrl: string | null = null;
    if (newCategoryImage) {
      try {
        imageUrl = await uploadCategoryImage(newCategoryImage);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        return;
      }
    }

    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("categories")
      .insert({ name: newCategoryName.trim(), image_url: imageUrl });

    if (insertError) {
      setError("No se pudo crear la categoria: " + insertError.message);
      return;
    }
    setNewCategoryName("");
    setNewCategoryImage(null);
    router.refresh();
  }

  async function handleChangeCategoryImage(categoryId: number, file: File) {
    setUploadingImageId(categoryId);
    setError(null);
    try {
      const imageUrl = await uploadCategoryImage(file);
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("categories")
        .update({ image_url: imageUrl })
        .eq("id", categoryId);

      if (updateError) {
        setError("No se pudo actualizar la imagen: " + updateError.message);
        return;
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setUploadingImageId(null);
    }
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

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-bold text-gray-900">Categorias</h2>
          </div>

          <ul>
            {categories.map((category) => (
              <li
                key={category.id}
                onClick={() => setSelectedId(category.id)}
                className={`flex cursor-pointer items-center justify-between gap-3 border-b border-gray-50 px-5 py-3.5 ${
                  selectedId === category.id ? "bg-pink-50" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-1 items-center gap-3">
                  <label
                    onClick={(e) => e.stopPropagation()}
                    className="relative cursor-pointer"
                    title="Cambiar imagen"
                  >
                    <CategoryThumbnail category={category} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleChangeCategoryImage(category.id, file);
                      }}
                    />
                    {uploadingImageId === category.id ? (
                      <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-[10px] text-white">
                        ...
                      </span>
                    ) : null}
                  </label>

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
                </div>

                <div className="flex items-center gap-2">
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
            className="flex flex-wrap gap-2 border-t border-gray-100 p-4"
          >
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nueva categoria"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewCategoryImage(e.target.files?.[0] ?? null)}
              className="w-full text-xs text-gray-500 sm:w-auto"
            />
            <button
              type="submit"
              className="rounded-md bg-pink-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Agregar
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-bold text-gray-900">
              Subcategorias
              {selectedCategory ? ` de ${selectedCategory.name}` : ""}
            </h2>
          </div>

          {!selectedCategory ? (
            <p className="p-5 text-sm text-gray-500">
              Elige una categoria de la izquierda.
            </p>
          ) : (
            <>
              <ul>
                {selectedCategory.subcategories.map((sub) => (
                  <li
                    key={sub.id}
                    className="flex items-center justify-between border-b border-gray-50 px-5 py-3.5"
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

                    <div className="flex items-center gap-2">
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
                  <li className="px-5 py-4 text-sm text-gray-500">
                    Sin subcategorias todavia.
                  </li>
                ) : null}
              </ul>

              <form
                onSubmit={handleCreateSubcategory}
                className="flex gap-2 border-t border-gray-100 p-4"
              >
                <input
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                  placeholder="Nueva subcategoria"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-md bg-pink-600 px-4 py-2 text-sm font-semibold text-white"
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
