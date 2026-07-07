"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId: number;
  productName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Borrar "${productName}"? Esta accion no se puede deshacer.`)) {
      return;
    }

    setLoading(true);
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", productId);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      {loading ? "Borrando..." : "Borrar"}
    </button>
  );
}
