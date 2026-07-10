"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(role: string) {
  // Securely set HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set("auth_session", role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  
  redirect("/");
}
