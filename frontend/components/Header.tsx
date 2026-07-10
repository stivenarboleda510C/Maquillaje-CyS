import Link from "next/link";
import Logo from "@/components/Logo";
import CartBadge from "@/components/CartBadge";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <header className="border-b border-pink-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-pink-600">
            Catalogo
          </Link>
          <CartBadge />
          {data.user ? (
            <Link
              href="/admin"
              className="rounded-full bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
            >
              Panel admin
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
