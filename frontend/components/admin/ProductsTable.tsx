"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { EditIcon, iconButtonClass } from "@/components/admin/IconButton";
import { formatPrice } from "@/lib/formatPrice";
import type { Product } from "@/lib/api";

export default function ProductsTable({
  products: initialProducts,
}: {
  products: Product[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setProducts((current) => {
      const next = [...current];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  }

  async function handleDrop() {
    if (dragIndex === null) return;
    setDragIndex(null);
    setSaving(true);
    const supabase = createClient();
    await Promise.all(
      products.map((product, index) =>
        supabase
          .from("products")
          .update({ sort_order: index })
          .eq("id", product.id)
      )
    );
    setSaving(false);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Nuevo producto
        </Link>
      </div>

      <p className="mt-2 text-sm text-gray-500">
        Arrastra las filas por el icono para cambiar el orden en que se
        muestran en el catalogo publico.
        {saving ? " Guardando..." : ""}
      </p>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
            <tr>
              <th className="w-8 px-2 py-3"></th>
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={handleDrop}
                onDragEnd={() => setDragIndex(null)}
                className={`border-b border-gray-100 ${
                  dragIndex === index ? "opacity-50" : ""
                }`}
              >
                <td className="cursor-grab px-2 py-3 text-center text-gray-400 active:cursor-grabbing">
                  ⠿
                </td>
                <td className="px-4 py-3">
                  {product.images[0] ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-md bg-pink-50">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {product.category ?? "-"}
                  {product.subcategory ? ` > ${product.subcategory}` : ""}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3 text-gray-600">{product.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/productos/${product.id}/editar`}
                      aria-label="Editar producto"
                      className={iconButtonClass("edit")}
                    >
                      <EditIcon />
                    </Link>
                    <DeleteProductButton
                      productId={product.id}
                      productName={product.name}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 ? (
          <p className="px-4 py-6 text-center text-gray-500">
            Todavia no hay productos.
          </p>
        ) : null}
      </div>
    </div>
  );
}
