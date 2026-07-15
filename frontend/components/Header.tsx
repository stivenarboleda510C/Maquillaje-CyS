import Link from "next/link";
import Logo from "@/components/Logo";
import CartBadge from "@/components/CartBadge";
import HeaderSearch from "@/components/HeaderSearch";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <header className="border-b border-pink-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-4">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>
        <div className="order-3 w-full md:order-none md:flex md:flex-1 md:justify-center">
          <HeaderSearch />
        </div>
        <nav className="ml-auto flex shrink-0 items-center gap-6 text-sm font-medium text-gray-600">
          {!data.user ? <CartBadge /> : null}
          {data.user ? (
            <>
              <span className="text-gray-500">{data.user.email}</span>
              <Link
                href="/admin"
                className="rounded-full bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
              >
                Panel admin
              </Link>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
