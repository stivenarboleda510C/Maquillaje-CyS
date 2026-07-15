import { getProducts } from "@/lib/api";
import ProductsTable from "@/components/admin/ProductsTable";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return <ProductsTable products={products} />;
}
