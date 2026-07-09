import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, NotAdminError } from "@/lib/admin/requireAdmin";
import { listUsers, inviteUser } from "@/lib/admin/users";

export async function GET() {
  try {
    await requireAdmin();
    const users = await listUsers();
    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof NotAdminError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const { email, role } = await request.json();

    if (!email || (role !== "admin" && role !== "empleado")) {
      return NextResponse.json({ error: "Datos invalidos" }, { status: 400 });
    }

    const origin = request.nextUrl.origin;
    await inviteUser(email, role, `${origin}/completar-registro`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof NotAdminError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
