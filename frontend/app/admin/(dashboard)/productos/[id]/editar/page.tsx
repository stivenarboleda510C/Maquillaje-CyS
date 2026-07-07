import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Editar producto</h1>
      <div className="mt-6">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
