import Link from "next/link";
import Logo from "@/components/Logo";
import CartBadge from "@/components/CartBadge";

export default function Header() {
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
        </nav>
      </div>
    </header>
  );
}
