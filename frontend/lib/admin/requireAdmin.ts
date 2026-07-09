import "server-only";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export class NotAdminError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function requireAdmin(): Promise<User> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new NotAdminError("No autenticado", 401);
  }

  if (data.user.app_metadata?.role !== "admin") {
    throw new NotAdminError("No tienes permisos de administrador", 403);
  }

  return data.user;
}
