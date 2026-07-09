import { redirect } from "next/navigation";
import { requireAdmin, NotAdminError } from "@/lib/admin/requireAdmin";
import { listUsers } from "@/lib/admin/users";
import CreateUserForm from "@/components/admin/CreateUserForm";
import UserRow from "@/components/admin/UserRow";

export default async function UsersPage() {
  let admin;
  try {
    admin = await requireAdmin();
  } catch (error) {
    if (error instanceof NotAdminError) {
      redirect("/admin");
    }
    throw error;
  }

  let users;
  try {
    users = await listUsers();
  } catch (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error instanceof Error ? error.message : "Error desconocido"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
      <p className="mt-1 text-sm text-gray-600">
        Invita nuevas cuentas de acceso al panel y gestiona las existentes.
      </p>

      <div className="mt-6">
        <CreateUserForm />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Creado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow key={user.id} user={user} isSelf={user.id === admin.id} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
