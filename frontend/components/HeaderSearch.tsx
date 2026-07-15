"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSearch } from "@/lib/search/SearchContext";

export default function HeaderSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const { query, setQuery } = useSearch();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(query ? `/?q=${encodeURIComponent(query)}` : "/");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm items-center gap-2"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar producto..."
        className="w-full rounded-full border border-pink-200 px-4 py-1.5 text-sm"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-pink-600 px-4 py-1.5 text-sm font-medium text-white"
      >
        Buscar
      </button>
    </form>
  );
}
