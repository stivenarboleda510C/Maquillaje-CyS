import { redirect } from "next/navigation";
import { requireAdmin, NotAdminError } from "@/lib/admin/requireAdmin";
import { createClient } from "@/lib/supabase/server";
import { getProducts } from "@/lib/api";
import SalesManager from "@/components/admin/SalesManager";
import type { Sale } from "@/lib/admin/sales";

export default async function DineroPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof NotAdminError) {
      redirect("/admin");
    }
    throw error;
  }

  const supabase = await createClient();
  const [{ data: sales }, products] = await Promise.all([
    supabase.from("sales").select("*").order("sold_at", { ascending: false }),
    getProducts(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dinero</h1>
      <p className="mt-1 text-sm text-gray-600">
        Registra las ventas realizadas y lleva el control de tus ingresos.
      </p>

      <div className="mt-6">
        <SalesManager
          sales={(sales as Sale[]) ?? []}
          products={products.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
          }))}
        />
      </div>
    </div>
  );
}
