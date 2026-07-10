"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminSidebar({ role }: { role: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    if (!confirm("Estas seguro de cerrar la sesion?")) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const navItems = [
    { href: "/admin", label: "Productos" },
    { href: "/admin/categorias", label: "Categorias" },
    { href: "/admin/publicidad", label: "Publicidad" },
    ...(role === "admin"
      ? [{ href: "/admin/usuarios", label: "Usuarios" }]
      : []),
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        className="flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <nav className="relative z-10 flex h-full w-64 flex-col gap-1 bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menu"
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === item.href
                    ? "bg-pink-50 text-pink-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-auto pt-4">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-md border border-red-500 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Cerrar sesion
              </button>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
