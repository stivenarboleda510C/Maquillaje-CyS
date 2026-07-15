"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/formatPrice";
import IconButton from "@/components/admin/IconButton";
import type { Sale } from "@/lib/admin/sales";

type ProductOption = { id: number; name: string; price: number };

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function SalesManager({
  sales: initialSales,
  products,
}: {
  sales: Sale[];
  products: ProductOption[];
}) {
  const [sales, setSales] = useState(initialSales);
  const [productId, setProductId] = useState<number | "">(
    products[0]?.id ?? ""
  );
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(products[0]?.price ?? 0);
  const [soldAt, setSoldAt] = useState(todayISO());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editUnitPrice, setEditUnitPrice] = useState(0);
  const [editSoldAt, setEditSoldAt] = useState("");

  function handleProductChange(id: number) {
    setProductId(id);
    const product = products.find((p) => p.id === id);
    if (product) setUnitPrice(product.price);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!productId) return;
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("sales")
      .insert({
        product_id: product.id,
        product_name: product.name,
        quantity,
        unit_price: unitPrice,
        sold_at: soldAt,
      })
      .select()
      .single();

    setLoading(false);
    if (insertError) {
      setError("No se pudo registrar la venta: " + insertError.message);
      return;
    }
    setSales((current) => [data as Sale, ...current]);
    setQuantity(1);
  }

  async function handleDelete(id: number) {
    if (!confirm("Borrar esta venta?")) return;
    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("sales")
      .delete()
      .eq("id", id);

    if (deleteError) {
      alert("No se pudo borrar la venta: " + deleteError.message);
      return;
    }
    setSales((current) => current.filter((s) => s.id !== id));
  }

  function startEdit(sale: Sale) {
    setEditingId(sale.id);
    setEditQuantity(sale.quantity);
    setEditUnitPrice(sale.unit_price);
    setEditSoldAt(sale.sold_at);
  }

  async function handleSaveEdit(id: number) {
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("sales")
      .update({
        quantity: editQuantity,
        unit_price: editUnitPrice,
        sold_at: editSoldAt,
      })
      .eq("id", id);

    if (updateError) {
      alert("No se pudo actualizar la venta: " + updateError.message);
      return;
    }
    setSales((current) =>
      current.map((s) =>
        s.id === id
          ? {
              ...s,
              quantity: editQuantity,
              unit_price: editUnitPrice,
              sold_at: editSoldAt,
            }
          : s
      )
    );
    setEditingId(null);
  }

  const sortedSales = useMemo(
    () => [...sales].sort((a, b) => (a.sold_at < b.sold_at ? 1 : -1)),
    [sales]
  );

  const totalRevenue = useMemo(
    () => sales.reduce((sum, s) => sum + s.quantity * s.unit_price, 0),
    [sales]
  );

  return (
    <div>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Total en ventas</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(totalRevenue)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Cantidad de ventas</p>
          <p className="text-2xl font-bold text-gray-900">{sales.length}</p>
        </div>
      </div>

      <form
        onSubmit={handleAdd}
        className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4"
      >
        <div className="min-w-[200px] flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Producto
          </label>
          <select
            value={productId}
            onChange={(e) => handleProductChange(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-24">
          <label className="block text-sm font-medium text-gray-700">
            Cantidad
          </label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700">
            Precio unitario
          </label>
          <input
            type="number"
            min={0}
            value={unitPrice}
            onChange={(e) => setUnitPrice(Math.max(0, Number(e.target.value)))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="w-40">
          <label className="block text-sm font-medium text-gray-700">
            Fecha
          </label>
          <input
            type="date"
            value={soldAt}
            onChange={(e) => setSoldAt(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !productId}
          className="rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Registrar venta"}
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Cantidad</th>
              <th className="px-4 py-3">Precio unitario</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {sortedSales.map((sale) => (
              <tr key={sale.id} className="border-b border-gray-100">
                <td className="px-4 py-3 text-gray-600">
                  {editingId === sale.id ? (
                    <input
                      type="date"
                      value={editSoldAt}
                      onChange={(e) => setEditSoldAt(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                    />
                  ) : (
                    sale.sold_at
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {sale.product_name}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {editingId === sale.id ? (
                    <input
                      type="number"
                      min={1}
                      value={editQuantity}
                      onChange={(e) =>
                        setEditQuantity(Math.max(1, Number(e.target.value)))
                      }
                      className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm"
                    />
                  ) : (
                    sale.quantity
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {editingId === sale.id ? (
                    <input
                      type="number"
                      min={0}
                      value={editUnitPrice}
                      onChange={(e) =>
                        setEditUnitPrice(Math.max(0, Number(e.target.value)))
                      }
                      className="w-28 rounded-md border border-gray-300 px-2 py-1 text-sm"
                    />
                  ) : (
                    formatPrice(sale.unit_price)
                  )}
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {formatPrice(sale.quantity * sale.unit_price)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {editingId === sale.id ? (
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(sale.id)}
                        className="text-xs font-medium text-pink-600 hover:underline"
                      >
                        Guardar
                      </button>
                    ) : (
                      <IconButton
                        variant="edit"
                        label="Editar venta"
                        onClick={() => startEdit(sale)}
                      />
                    )}
                    <IconButton
                      variant="delete"
                      label="Eliminar venta"
                      onClick={() => handleDelete(sale.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sales.length === 0 ? (
          <p className="px-4 py-6 text-center text-gray-500">
            Todavia no hay ventas registradas.
          </p>
        ) : null}
      </div>
    </div>
  );
}
