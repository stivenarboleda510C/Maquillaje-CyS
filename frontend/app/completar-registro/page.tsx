"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

function decodeEmailFromAccessToken(accessToken: string): string | null {
  try {
    const payload = accessToken.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(normalized));
    return json.email ?? null;
  } catch {
    return null;
  }
}

export default function CompleteSignupPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ready" | "invalid">(
    "loading"
  );
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) {
      setStatus("invalid");
      return;
    }

    setEmail(decodeEmailFromAccessToken(access_token));

    const supabase = createClient();
    // Forzamos explicitamente la sesion del link, para no quedar con la
    // sesion de quien ya estaba logueado en este navegador (ej. el admin
    // abriendo el link de invitacion de otra persona).
    supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
      setStatus(error ? "invalid" : "ready");
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

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
      setError("No se pudo guardar la contrasena: " + updateError.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col justify-center px-6 py-20">
      <Logo />
      <h1 className="mt-6 text-2xl font-bold text-gray-900">
        Bienvenido a Makeup Pinklu
      </h1>

      {status === "loading" ? (
        <p className="mt-4 text-sm text-gray-600">Verificando tu invitacion...</p>
      ) : null}

      {status === "invalid" ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Este link de invitacion no es valido o ya expiro. Pidele al
          administrador que te invite de nuevo.
        </p>
      ) : null}

      {status === "ready" ? (
        <>
          <p className="mt-1 text-sm text-gray-600">
            Elige tu contrasena para terminar de crear la cuenta de{" "}
            <span className="font-semibold">{email ?? "tu correo"}</span>.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Entrar al panel"}
            </button>
          </form>
        </>
      ) : null}
    </div>
  );
}
