import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createSession,
  getAdminPassword,
  safeEqual,
  SESSION_DAYS,
} from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { password?: string };
  try {
    body = (await req.json()) as { password?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const expected = getAdminPassword();
  if (!expected) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Admin password is not configured. Set ADMIN_PASSWORD in environment variables.",
      },
      { status: 500 }
    );
  }

  const provided = (body.password ?? "").trim();
  if (!provided) {
    return NextResponse.json({ ok: false, error: "Password required" }, { status: 400 });
  }

  // Constant-time compare. Falls through to invalid even on length mismatch.
  if (!safeEqual(provided, expected)) {
    return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
  }

  const token = await createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return res;
}
