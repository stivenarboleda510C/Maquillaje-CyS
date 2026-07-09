"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contrasenas no coinciden.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    setLoading(false);

    if (updateError) {
      setError("No se pudo cambiar la contrasena: " + updateError.message);
      return;
    }

    setSuccess(true);
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Cambiar contrasena</h1>
      <p className="mt-1 text-sm text-gray-600">
        Elige una nueva contrasena para tu cuenta de administrador.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex max-w-sm flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6"
      >
        <div>
          <label className="text-sm font-medium text-gray-700">
            Nueva contrasena
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            Confirmar contrasena
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? (
          <p className="text-sm text-green-600">
            Contrasena actualizada correctamente.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}
