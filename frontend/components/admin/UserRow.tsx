"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminUserSummary } from "@/lib/admin/users";

export default function UserRow({
  user,
  isSelf,
}: {
  user: AdminUserSummary;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });
    const body = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(body.error ?? "No se pudo cambiar la contrasena.");
      return;
    }

    setChangingPassword(false);
    setNewPassword("");
  }

  async function handleDelete() {
    if (!confirm(`Eliminar la cuenta de ${user.email}? No se puede deshacer.`)) {
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "DELETE",
    });
    const body = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(body.error ?? "No se pudo eliminar el usuario.");
      return;
    }

    router.refresh();
  }

  return (
    <tr className="border-b border-gray-100 align-top">
      <td className="px-4 py-3 font-medium text-gray-900">
        {user.email}
        {isSelf ? <span className="ml-2 text-xs text-gray-400">(tu)</span> : null}
      </td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            user.role === "admin"
              ? "bg-pink-100 text-pink-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {user.role === "admin" ? "Admin" : "Empleado"}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-600">
        {new Date(user.created_at).toLocaleDateString("es-CO")}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setChangingPassword((v) => !v)}
              className="text-sm font-medium text-pink-600 hover:underline"
            >
              Cambiar contrasena
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSelf || loading}
              title={isSelf ? "No puedes eliminar tu propia cuenta" : undefined}
              className="text-sm font-medium text-red-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
            >
              Eliminar
            </button>
          </div>

          {changingPassword ? (
            <form
              onSubmit={handlePasswordSubmit}
              className="flex flex-col items-end gap-2"
            >
              <input
                type="password"
                required
                minLength={6}
                placeholder="Nueva contrasena"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-48 rounded-md border border-gray-300 px-2 py-1 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-pink-600 px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
              {error ? <p className="text-xs text-red-600">{error}</p> : null}
            </form>
          ) : null}
        </div>
      </td>
    </tr>
  );
}
