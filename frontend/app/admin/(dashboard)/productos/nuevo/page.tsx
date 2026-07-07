import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Nuevo producto</h1>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
