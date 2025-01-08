import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const data = await request.formData();
  const login = data.get("login") as string;
  const password = data.get("password") as string;

  if (
    login === process.env.NEXT_ADMIN_LOGIN &&
    password === process.env.NEXT_ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: "admin" }, process.env.NEXT_JWT_SECRET_KEY!);

    cookieStore.set("admin", token, {
      name: "admin",
      maxAge: 60 * 60 * 24 * 1,
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { success: false, error: "wrong login or password" },
    { status: 401 }
  );
}
