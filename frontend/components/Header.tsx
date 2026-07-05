import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-pink-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-pink-600">
          Maquillaje CyS
        </Link>
        <nav className="text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-pink-600">
            Catalogo
          </Link>
        </nav>
      </div>
    </header>
  );
}
