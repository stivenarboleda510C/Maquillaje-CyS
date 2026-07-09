import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type AdminUserSummary = {
  id: string;
  email: string | undefined;
  role: string;
  created_at: string;
};

export async function listUsers(): Promise<AdminUserSummary[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    throw new Error("No se pudieron cargar los usuarios: " + error.message);
  }

  return data.users
    .map((user) => ({
      id: user.id,
      email: user.email,
      role: (user.app_metadata?.role as string) ?? "empleado",
      created_at: user.created_at,
    }))
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export async function inviteUser(
  email: string,
  role: "admin" | "empleado",
  redirectTo: string
) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo,
  });

  if (error || !data.user) {
    throw new Error(
      "No se pudo invitar al usuario: " + (error?.message ?? "error desconocido")
    );
  }

  const { error: roleError } = await supabase.auth.admin.updateUserById(
    data.user.id,
    { app_metadata: { role } }
  );

  if (roleError) {
    throw new Error("No se pudo asignar el rol: " + roleError.message);
  }
}

export async function updateUserPassword(userId: string, password: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    password,
  });

  if (error) {
    throw new Error("No se pudo cambiar la contrasena: " + error.message);
  }
}

export async function deleteUser(userId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    throw new Error("No se pudo eliminar el usuario: " + error.message);
  }
}
