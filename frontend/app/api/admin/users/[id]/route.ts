import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, NotAdminError } from "@/lib/admin/requireAdmin";
import { updateUserPassword, deleteUser } from "@/lib/admin/users";

function handleError(error: unknown) {
  if (error instanceof NotAdminError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Error desconocido" },
    { status: 500 }
  );
}

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/users/[id]">
) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const { password } = await request.json();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "La contrasena debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    await updateUserPassword(id, password);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/admin/users/[id]">
) {
  try {
    const admin = await requireAdmin();
    const { id } = await ctx.params;

    if (id === admin.id) {
      return NextResponse.json(
        { error: "No puedes eliminar tu propia cuenta" },
        { status: 400 }
      );
    }

    await deleteUser(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
