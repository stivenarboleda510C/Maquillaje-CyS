"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Ad } from "@/lib/api";
import IconButton from "@/components/admin/IconButton";

export default function AdsManager({ ads }: { ads: Ad[] }) {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!imageFile) return;
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const path = `${Date.now()}-${imageFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from("ads")
      .upload(path, imageFile);

    if (uploadError) {
      setError("No se pudo subir la imagen: " + uploadError.message);
      setLoading(false);
      return;
    }

    const { data } = supabase.storage.from("ads").getPublicUrl(path);
    const nextOrder = ads.length
      ? Math.max(...ads.map((a) => a.sort_order)) + 1
      : 0;

    const { error: insertError } = await supabase.from("ads").insert({
      image_url: data.publicUrl,
      sort_order: nextOrder,
    });

    setLoading(false);
    if (insertError) {
      setError("No se pudo guardar el banner: " + insertError.message);
      return;
    }

    setImageFile(null);
    router.refresh();
  }

  async function handleMove(ad: Ad, direction: "up" | "down") {
    const sorted = [...ads].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex((a) => a.id === ad.id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;

    const other = sorted[swapIndex];
    const supabase = createClient();
    await Promise.all([
      supabase
        .from("ads")
        .update({ sort_order: other.sort_order })
        .eq("id", ad.id),
      supabase
        .from("ads")
        .update({ sort_order: ad.sort_order })
        .eq("id", other.id),
    ]);
    router.refresh();
  }

  async function handleDelete(id: number) {
    if (!confirm("Borrar este banner?")) return;
    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("ads")
      .delete()
      .eq("id", id);

    if (deleteError) {
      alert("No se pudo borrar el banner: " + deleteError.message);
      return;
    }
    router.refresh();
  }

  const sortedAds = [...ads].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleAdd}
        className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4"
      >
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Nuevo banner (imagen)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !imageFile}
          className="rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Subiendo..." : "Agregar banner"}
        </button>
        {error ? <p className="w-full text-sm text-red-600">{error}</p> : null}
      </form>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {sortedAds.map((ad, index) => (
          <div
            key={ad.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white"
          >
            <div className="relative aspect-video w-full bg-pink-50">
              <Image
                src={ad.image_url}
                alt="Banner"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-between gap-2 p-3">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(ad, "up")}
                  disabled={index === 0}
                  className="rounded-md border border-gray-300 px-2 py-1 text-xs disabled:opacity-40"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(ad, "down")}
                  disabled={index === sortedAds.length - 1}
                  className="rounded-md border border-gray-300 px-2 py-1 text-xs disabled:opacity-40"
                >
                  ↓
                </button>
              </div>
              <IconButton
                variant="delete"
                label="Eliminar banner"
                onClick={() => handleDelete(ad.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {sortedAds.length === 0 ? (
        <p className="text-gray-500">Todavia no hay banners.</p>
      ) : null}
    </div>
  );
}
