"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { CategoryWithSubcategories, Product } from "@/lib/api";

const MAX_IMAGES = 6;

type GalleryImage = {
  key: string;
  url: string;
  file?: File;
};

export default function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: CategoryWithSubcategories[];
}) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
  const [images, setImages] = useState<GalleryImage[]>(
    (product?.images ?? []).map((url) => ({ key: url, url }))
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const initialCategory = categories.find((c) => c.name === product?.category);
  const [categoryId, setCategoryId] = useState(
    initialCategory ? String(initialCategory.id) : ""
  );
  const initialSubcategory = initialCategory?.subcategories.find(
    (s) => s.name === product?.subcategory
  );
  const [subcategoryId, setSubcategoryId] = useState(
    initialSubcategory ? String(initialSubcategory.id) : ""
  );

  const selectedCategory = categories.find((c) => String(c.id) === categoryId);

  function handleAddFiles(fileList: FileList | null) {
    if (!fileList) return;
    const room = MAX_IMAGES - images.length;
    const files = Array.from(fileList).slice(0, room);
    const newImages = files.map((file) => ({
      key: `${file.name}-${file.lastModified}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((current) => [...current, ...newImages]);
  }

  function handleRemoveImage(key: string) {
    setImages((current) => current.filter((img) => img.key !== key));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (images.length === 0) {
      setError("Sube al menos una foto del producto.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const finalUrls: string[] = [];
    for (const img of images) {
      if (img.file) {
        const path = `${Date.now()}-${img.file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, img.file);

        if (uploadError) {
          setError("No se pudo subir una imagen: " + uploadError.message);
          setLoading(false);
          return;
        }

        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(path);
        finalUrls.push(data.publicUrl);
      } else {
        finalUrls.push(img.url);
      }
    }

    const payload = {
      name,
      description: description || null,
      price: parseFloat(price),
      category_id: categoryId ? parseInt(categoryId, 10) : null,
      subcategory_id: subcategoryId ? parseInt(subcategoryId, 10) : null,
      stock: parseInt(stock, 10),
    };

    let productId = product?.id;

    if (productId) {
      const { error: updateError } = await supabase
        .from("products")
        .update(payload)
        .eq("id", productId);

      if (updateError) {
        setError("No se pudo guardar el producto: " + updateError.message);
        setLoading(false);
        return;
      }

      await supabase.from("product_images").delete().eq("product_id", productId);
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("products")
        .insert(payload)
        .select()
        .single();

      if (insertError || !inserted) {
        setError(
          "No se pudo guardar el producto: " +
            (insertError?.message ?? "error desconocido")
        );
        setLoading(false);
        return;
      }
      productId = inserted.id;
    }

    const { error: imagesError } = await supabase.from("product_images").insert(
      finalUrls.map((url, index) => ({
        product_id: productId,
        image_url: url,
        sort_order: index,
      }))
    );

    if (imagesError) {
      setError("No se pudieron guardar las fotos: " + imagesError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-lg flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6"
    >
      <div>
        <label className="text-sm font-medium text-gray-700">Nombre</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">
          Descripcion
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Precio</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Stock</label>
          <input
            required
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Categoria
          </label>
          <select
            required
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setSubcategoryId("");
            }}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Elige una categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            Subcategoria
          </label>
          <select
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            disabled={!selectedCategory}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
          >
            <option value="">Sin subcategoria</option>
            {selectedCategory?.subcategories.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">
          Fotos del producto ({images.length}/{MAX_IMAGES}) - minimo 1
        </label>

        {images.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {images.map((img) => (
              <div
                key={img.key}
                className="relative h-20 w-20 overflow-hidden rounded-md border border-gray-200 bg-pink-50"
              >
                <Image
                  src={img.url}
                  alt={name || "Producto"}
                  fill
                  unoptimized={Boolean(img.file)}
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(img.key)}
                  aria-label="Quitar foto"
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {images.length < MAX_IMAGES ? (
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              handleAddFiles(e.target.files);
              e.target.value = "";
            }}
            className="mt-2 w-full text-sm"
          />
        ) : (
          <p className="mt-2 text-xs text-gray-500">
            Ya tienes el maximo de {MAX_IMAGES} fotos.
          </p>
        )}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
