"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import IconButton from "@/components/admin/IconButton";

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
    <IconButton
      variant="delete"
      label="Borrar producto"
      disabled={loading}
      onClick={handleDelete}
    />
  );
}
