import Link from "next/link";
import { getAds, getProducts } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/formatPrice";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const role = (data.user?.app_metadata?.role as string) ?? "empleado";

  const [products, ads] = await Promise.all([getProducts(), getAds()]);

  let totalRevenue = 0;
  let salesCount = 0;
  if (role === "admin") {
    const { data: sales } = await supabase
      .from("sales")
      .select("quantity, unit_price");
    if (sales) {
      salesCount = sales.length;
      totalRevenue = sales.reduce(
        (sum, s) => sum + s.quantity * s.unit_price,
        0
      );
    }
  }

  const cards: { label: string; value: string | number; href: string }[] = [
    {
      label: "Productos publicados",
      value: products.length,
      href: "/admin/productos",
    },
    {
      label: "Banners de publicidad",
      value: ads.length,
      href: "/admin/publicidad",
    },
    ...(role === "admin"
      ? [
          {
            label: "Dinero en ventas",
            value: formatPrice(totalRevenue),
            href: "/admin/dinero",
          },
          {
            label: "Cantidad de ventas",
            value: salesCount,
            href: "/admin/dinero",
          },
        ]
      : []),
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-600">
        Resumen general de tu tienda.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-md"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {card.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
