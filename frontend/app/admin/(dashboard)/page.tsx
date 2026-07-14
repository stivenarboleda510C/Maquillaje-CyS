import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/api";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { EditIcon, iconButtonClass } from "@/components/admin/IconButton";

export default async function AdminProductsPage() {
  const products = await getProducts();

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

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-100">
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
                  ${product.price.toFixed(2)}
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
